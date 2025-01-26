import os
import uuid
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from psycopg_pool import AsyncConnectionPool
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.graph import START, StateGraph, MessagesState
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


def call_model(state: MessagesState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}


workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_edge(START, "agent")

DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_url = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)
    pool = AsyncConnectionPool(
        conninfo=db_url, kwargs={"autocommit": True}, max_size=20
    )
    await pool.open()

    checkpointer = AsyncPostgresSaver(pool)
    await checkpointer.setup()

    app.state.graph = workflow.compile(checkpointer=checkpointer)
    try:
        yield
    finally:
        await pool.close()


app = FastAPI(lifespan=lifespan)

# ---- CORS-Middleware einrichten ----
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # oder ["*"] um alles zu erlauben
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------------


class CheckpointResponse(BaseModel):
    thread_id: str


class ChatRequest(BaseModel):
    thread_id: str
    message: str


class ChatResponse(BaseModel):
    answer: str


@app.get("/checkpoint_id", response_model=CheckpointResponse)
async def get_checkpoint_id():
    new_id = str(uuid.uuid4())
    return CheckpointResponse(thread_id=new_id)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Empty message.")

    user_msg = HumanMessage(content=request.message)

    output = await app.state.graph.ainvoke(
        {"messages": [user_msg]},
        config={"configurable": {"thread_id": request.thread_id}},
    )

    if not output["messages"]:
        raise HTTPException(status_code=500, detail="No AI response returned.")

    ai_message = output["messages"][-1]
    return ChatResponse(answer=ai_message.content)

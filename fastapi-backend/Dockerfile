FROM python:3.10-slim

# Systempakete inklusive libpq-dev installieren:
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./

COPY .env ./

# Hier entweder normal "psycopg" (was C-Extensions baut) ...
# oder direkt das "binary"-Paket "psycopg[binary]" in der requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

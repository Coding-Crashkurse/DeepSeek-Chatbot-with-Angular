import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseURL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getCheckpointId() {
    return this.http.get<{ thread_id: string }>(
      `${this.baseURL}/checkpoint_id`
    );
  }

  sendMessage(threadId: string, userMsg: string) {
    // Das Backend erwartet ein JSON mit { thread_id, message }
    // und liefert ein Objekt { answer: string } zurück
    return this.http.post<{ answer: string }>(`${this.baseURL}/chat`, {
      thread_id: threadId,
      message: userMsg,
    });
  }
}

import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

interface Message {
  role: string;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  chatOpen = false;
  userInput = '';
  messages: Message[] = [];
  sessionId: string | null = null;

  // Neue Variable für Ladezustand
  loading = false;

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.sessionId = null;
      this.messages = [];
      this.chatService.getCheckpointId().subscribe({
        next: (res) => {
          this.sessionId = res.thread_id;
        },
        error: (err) => {
          console.error('Fehler beim Laden der Checkpoint-ID:', err);
        },
      });
    }
  }

  sendMessage() {
    const input = this.userInput.trim();
    if (!input || !this.sessionId) {
      return;
    }

    // Zeigen: Wir sind noch nicht fertig
    this.loading = true;

    this.messages.push({ role: 'user', content: input });

    this.chatService.sendMessage(this.sessionId, input).subscribe({
      next: (response) => {
        this.loading = false;
        if (response?.answer) {
          this.messages.push({ role: 'assistant', content: response.answer });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Chat-Fehler:', err);
      },
    });

    this.userInput = '';
  }
}

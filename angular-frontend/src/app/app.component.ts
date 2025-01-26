import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

// Material-Module
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface Message {
  role: string;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  // Hier binden wir alle benötigten Imports ein:
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  chatOpen = false;
  userInput = '';
  messages: Message[] = [];
  sessionId: string | null = null;
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

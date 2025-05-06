import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-web-socket-element',
  standalone: true,
  template: `
    <div class="element-view">
      <h3>Chat</h3>
      <div style="max-height: 2rem; overflow-y: auto">
        <p *ngFor="let m of messages">{{ m }}</p>
      </div>
      <input class="add-border" [(ngModel)]="msg" />
      <button class="add-border" (click)="send()">Send</button>
    </div>
  `,
  imports: [FormsModule, NgForOf],
})
export class WebSocketElementComponent implements OnInit {
  msg = '';
  messages: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    this.socketService.switchRoom(gameId!);

    this.socketService.onMessage().subscribe((msg) => {
      this.messages.push(msg ?? '');
    });
  }

  send() {
    this.socketService.sendMessage(this.msg);
    this.msg = '';
  }
}

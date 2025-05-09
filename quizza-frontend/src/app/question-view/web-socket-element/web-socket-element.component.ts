import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { PlayerPhysicsDisplayComponent } from '../../player-physics-display/player-physics-display.component';

@Component({
  selector: 'app-web-socket-element',
  standalone: true,
  template: `
    <ng-container>
      <!--      <h3>Player</h3>-->
      <!--      <div style="max-height: 2rem; overflow-y: auto">-->
      <!--        <p *ngFor="let m of players">{{ m }}</p>-->
      <!--      </div>-->
      <!--      <h3>Chat</h3>-->
      <!--      <div style="max-height: 2rem; overflow-y: auto">-->
      <!--        <p *ngFor="let m of messages">{{ m }}</p>-->
      <!--      </div>-->
      <!--      <input class="add-border" [(ngModel)]="msg" />-->
      <!--      <button class="add-border" (click)="send()">Send</button>-->
    </ng-container>
  `,
  imports: [FormsModule, PlayerPhysicsDisplayComponent],
})
export class WebSocketElementComponent implements OnInit {
  msg = '';
  messages: string[] = [];
  players: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    this.socketService.switchRoom(gameId!);

    this.socketService.onMessage().subscribe((msg) => {
      this.messages.push(msg ?? '');
    });

    this.socketService.onPlayers().subscribe((players) => {
      this.players = players;
    });
  }

  send() {
    this.socketService.sendMessage(this.msg);
    this.msg = '';
  }
}

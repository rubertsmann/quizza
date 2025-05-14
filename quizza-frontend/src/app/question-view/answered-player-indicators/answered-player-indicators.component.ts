import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-answered-player-indicators',
  imports: [NgForOf],
  templateUrl: './answered-player-indicators.component.html',
  styleUrl: './answered-player-indicators.component.css',
})
export class AnsweredPlayerIndicatorsComponent implements OnInit {
  players: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.onPlayersAnswered().subscribe((players) => {
      this.players = players;
    });
  }
}

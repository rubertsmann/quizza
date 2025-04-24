import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '../../game-state.service';

@Component({
  selector: 'app-pre-game-lobby',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pre-game-lobby.component.html',
  styleUrl: './pre-game-lobby.component.css',
})
export class PreGameLobbyComponent {
  constructor(protected gameStateService: GameStateService) {}

  voteStart: null|boolean = null;

  vote(vote: boolean) {
    this.voteStart = vote;
    this.gameStateService.sendVote(vote);
  }
}

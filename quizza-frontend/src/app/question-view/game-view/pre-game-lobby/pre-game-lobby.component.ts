import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '../../game-state.service';

@Component({
  selector: 'pre-game-lobby',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pre-game-lobby.component.html',
  styleUrl: './pre-game-lobby.component.css'
})
export class PreGameLobbyComponent {
  constructor(
    protected gameStateService: GameStateService
  ) {
  }

  vote(vote: boolean) {
    this.gameStateService.sendVote(vote);
  }
}

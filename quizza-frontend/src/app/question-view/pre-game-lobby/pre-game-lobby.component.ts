import { Component } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { GeneralGameState } from '../../models/backendmodels-copy';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pre-game-lobby',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pre-game-lobby.component.html',
  styleUrl: './pre-game-lobby.component.css'
})
export class PreGameLobbyComponent {
  gameState$: Observable<GeneralGameState | null>;

  constructor(
   private gameStateService: GameStateService
  ) {
    this.gameState$ = gameStateService.gameState$;
  }

  vote(vote: boolean) {
    this.gameStateService.sendVote(vote);
  }
}

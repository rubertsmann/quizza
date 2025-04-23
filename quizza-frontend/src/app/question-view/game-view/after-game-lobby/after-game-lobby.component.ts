import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '../../game-state.service';
import { PointsBarComponent } from "./points-bar/points-bar.component";
import { EndGameState } from '../../../models/backendmodels-copy';

@Component({
  selector: 'app-after-game-lobby',
  imports: [PointsBarComponent, CommonModule],
  templateUrl: './after-game-lobby.component.html',
  styleUrl: './after-game-lobby.component.css'
})
export class AfterGameLobbyComponent {
  public displayAllAnswers = false;

  constructor(
    public gameStateService: GameStateService,
  ) {}

  toggleQuestions(): void {
    this.displayAllAnswers = !this.displayAllAnswers;
    console.log(this.displayAllAnswers);
  };

  getMaxPoints(endGameState: EndGameState[]): number {
    if (!endGameState || endGameState.length === 0) {
      return 0; // Return 0 if the array is empty or undefined
    }
    return Math.max(...endGameState.map((endgame) => endgame.points || 0));
  }

  trackByEndGame(index: number, endgame: EndGameState): string {
    return endgame.player.id;
  }

  showOverlay = false;

  openOverlay() {
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }
}

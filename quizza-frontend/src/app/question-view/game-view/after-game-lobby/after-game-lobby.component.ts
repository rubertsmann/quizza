import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '../../../services/game-state.service';
import { PointsBarComponent } from './points-bar/points-bar.component';
import { EndGameState } from '../../../models/backendmodels-copy';
import { SoundManagerService } from '../../../services/sound-manager.service';

@Component({
  selector: 'app-after-game-lobby',
  imports: [PointsBarComponent, CommonModule],
  templateUrl: './after-game-lobby.component.html',
  styleUrl: './after-game-lobby.component.css',
})
export class AfterGameLobbyComponent {
  constructor(
    public gameStateService: GameStateService,
    public soundManagerService: SoundManagerService,
  ) {
    this.soundManagerService.playMusic('end');
  }

  getMaxPoints(endGameState: EndGameState[]): number {
    if (!endGameState || endGameState.length === 0) {
      return 0;
    }
    return Math.max(...endGameState.map((endgame) => endgame.points || 0));
  }

  trackByEndGame(index: number, endgame: EndGameState): string {
    return endgame.player;
  }

  showOverlay = false;

  openOverlay() {
    this.showOverlay = true;
  }

  closeOverlay() {
    this.showOverlay = false;
  }
}

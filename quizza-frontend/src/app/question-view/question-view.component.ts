import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameViewComponent } from './game-view/game-view.component';
import { GameStateService } from '../services/game-state.service';
import { PlayerPhysicsDisplayComponent } from '../player-physics-display/player-physics-display.component';

@Component({
  selector: 'app-question-view',
  imports: [
    CommonModule,
    FormsModule,
    GameViewComponent,
    PlayerPhysicsDisplayComponent,
  ],
  standalone: true,

  styleUrl: './question-view.component.css',
  templateUrl: './question-view.component.html',
})
export class QuestionViewComponent {
  constructor(public gameStateService: GameStateService) {}
}

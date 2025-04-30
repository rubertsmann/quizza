import {
  animate,
  AnimationMetadata,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GameStateService } from '../../../services/game-state.service';
import { SoundManagerService } from '../../../services/sound-manager.service';
import { QuestionElementComponent } from './question-element/question-element.component';

const numberChangeIncrementAnimation: AnimationMetadata[] = [
  style({ transform: 'translateY(100%)', opacity: 0 }),
  animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
];

const numberChangeDecrementAnimation: AnimationMetadata[] = [
  style({ transform: 'translateY(-100%)', opacity: 0 }),
  animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
];

const questionChangeAnimation: AnimationMetadata = animate(
  '500ms ease-out',
  keyframes([
    style({
      transform: 'translateX(100%)',
      opacity: 0,
      offset: 0,
    }),
    style({
      transform: 'translateX(0)',
      opacity: 1,
      offset: 1,
    }),
  ]),
);

@Component({
  selector: 'app-main-game-lobby',
  imports: [CommonModule, FormsModule, QuestionElementComponent],
  animations: [
    trigger('numberChange', [
      transition(':increment', numberChangeIncrementAnimation),
      transition(':decrement', numberChangeDecrementAnimation),
    ]),
    trigger('questionChange', [
      transition('* => *', [questionChangeAnimation]),
    ]),
  ],
  standalone: true,
  templateUrl: './main-game-lobby.component.html',
  styleUrl: './main-game-lobby.component.css',
})
export class MainGameLobbyComponent {
  constructor(
    private soundManager: SoundManagerService,
    private route: ActivatedRoute,
    public gameStateService: GameStateService,
    public soundManagerService: SoundManagerService,
  ) {
    this.soundManagerService.playMusic('middle');

    this.route.queryParams.subscribe((params) => {
      this.gameStateService.gameId = params['gameId'];
    });
  }

  onCounterChange() {
    this.soundManager.playSound('beep');
  }
}

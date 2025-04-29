import {
  animate,
  AnimationMetadata,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Answer } from '../../../models/backendmodels-copy';
import { GameStateService } from '../../../services/game-state.service';
import { SoundManagerService } from '../../../services/sound-manager.service';

const numberChangeIncrementAnimation: AnimationMetadata[] = [
  style({ transform: 'translateY(100%)', opacity: 0 }),
  animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
];

const numberChangeDecrementAnimation: AnimationMetadata[] = [
  style({ transform: 'translateY(-100%)', opacity: 0 }),
  animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
];

const questionChangeAnimation: AnimationMetadata = animate(
  '500ms ease-out', // Keep the duration and easing
  keyframes([
    // Start off-screen to the right and invisible
    style({
      transform: 'translateX(100%)', // Start 100% of its own width to the right
      opacity: 0,
      offset: 0,
    }),
    // End at its natural position and fully visible
    style({
      transform: 'translateX(0)',     // End at the original horizontal position
      opacity: 1,
      offset: 1,
    }),
  ]),
);


@Component({
  selector: 'app-main-game-lobby',
  imports: [CommonModule, FormsModule],
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
  currentAnswerId = -1;

  constructor(
    private soundManager: SoundManagerService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public gameStateService: GameStateService,
    public soundManagerService: SoundManagerService,
  ) {
    this.soundManagerService.playMusic('middle');

    this.route.queryParams.subscribe((params) => {
      this.gameStateService.gameId = params['gameId'];
    });
  }

  protected onAnswerChange(answerId: number) {
    this.currentAnswerId = answerId;
    const url = `${this.gameStateService.apiUrl}/answer/${this.gameStateService.player?.id}/${this.gameStateService.gameId}/${answerId}`;

    this.http
      .get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return throwError(() => error);
        }),
      )
      .subscribe();
  }

  trackById(index: number, item: Answer) {
    return item.answerId;
  }

  onCounterChange() {
    this.soundManager.playSound('beep');
  }
}

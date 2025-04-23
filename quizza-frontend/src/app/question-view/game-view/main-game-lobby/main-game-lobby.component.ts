import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Answer } from '../../../models/backendmodels-copy';
import { GameStateService } from '../../game-state.service';

@Component({
  selector: 'app-main-game-lobby',
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('numberChange', [
      transition(':increment', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 }),
        ),
      ]),
      transition(':decrement', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 }),
        ),
      ]),
    ]),
    trigger('questionChange', [
      transition('* => *', [
        animate(
          '500ms ease-out',
          keyframes([
            style({
              transform: 'scale(0.5) rotate(-90deg)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'scale(1.1) rotate(10deg)',
              opacity: 0.8,
              offset: 0.7,
            }),
            style({
              transform: 'scale(1) rotate(0deg)',
              opacity: 1,
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),
  ],
  standalone: true,
  templateUrl: './main-game-lobby.component.html',
  styleUrl: './main-game-lobby.component.css',
})
export class MainGameLobbyComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public gameStateService: GameStateService,
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params['isDev']);
      // this.isDev = params['isDev'] === 'true';
      this.gameStateService.gameId = params['gameId'];
    });
  }

  protected onAnswerChange(answerId: number) {
    console.log(answerId);
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
}

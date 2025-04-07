import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {
  catchError,
  defer,
  interval,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import {
  Answer,
  GameState,
  Player
} from '../models/backendmodels-copy';

@Component({
  selector: 'app-question-view',
  imports: [RouterOutlet, CommonModule, FormsModule],
  standalone: true,
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
  template: `
    <router-outlet />

    <ng-container *ngIf="intialConnection$ | async as result; else loading">
      <div>
        <div class="element-header">
          <h1>Quizza</h1>
          <div *ngIf="this.player">
            PlayerName: {{ this.player.name }}
            <button (click)="logOut()">Logout</button>
          </div>
        </div>

        <div *ngIf="this.isDev" class="element-view">
          <h2>Server Connection Status</h2>
          <p>{{ result.message }}</p>
          <p>ServerTime: {{ result.serverTime }}</p>
        </div>

        <div *ngIf="!this.player" class="element-view">
          <h2>Player Login</h2>
          <input type="text" placeholder="Enter your name" #playerNameInput />
          <button (click)="sendLoginRequest(playerNameInput.value)">
            Send Request
          </button>

          <!-- //TODO - Get all Players from backend and when click set it to current user -->
          <div *ngIf="this.isDev">
            <div>Select Player - Click here instead of entering a player</div>
            <ul>
              <li>SomeNameFromBackend1</li>
              <li>SomeNameFromBackend2</li>
              <li>SomeNameFromBackend3</li>
              <li>SomeNameFromBackend4</li>
            </ul>
            <hr />
            <!-- <h3>Room Information</h3>
              <p *ngIf="responseMessage">{{ responseMessage | json }}</p> -->
          </div>
        </div>

        <div *ngIf="this.player" class="element-view">
          <!-- //TODO - Get all Players with "answeredId !== 0 => hasAnswered" and diplay little checkmark-->
          <div *ngIf="this.isDev">
            <!-- @TODO Replace PlayerName with room name -->
            <h2>
              <!-- Active Room -
              <div *ngIf="responseMessage">
                {{ responseMessage.playerName }}
              </div> -->
            </h2>
            <div>Player List</div>
            <ul>
              <li>SomeNameFromBackend1</li>
              <li>SomeNameFromBackend2</li>
              <li>SomeNameFromBackend3</li>
              <li>SomeNameFromBackend4</li>
            </ul>
          </div>

          <ng-container *ngIf="getGameState$ | async as gamestate">
            <div *ngIf="gamestate.currentQuestion.question; else notActive">
              <div
                [@questionChange]="gamestate.currentQuestion.question"
                class="question-container"
              >
                <div class="center">
                  <div class="counter gradient-background">
                    <div [@numberChange]="gamestate?.currentQuestionTimer">
                      {{ gamestate?.currentQuestionTimer }}
                    </div>
                  </div>
                </div>
                <h3 class="center">{{ gamestate.currentQuestion.question }}</h3>

                <div class="flex-column">
                  <div
                    class="icon-thing"
                    style="width: 100%"
                    *ngFor="
                      let answer of gamestate.currentQuestion.answers;
                      trackBy: trackById
                    "
                  >
                    <label>
                      <!-- //TODO - Replace it to make it actually be hilighted when selected -->
                      <!-- <input type="radio" class="radio-input" [value]="answer.answerId" name="answers" (change)="onAnswerChange($event)"> -->
                      <input
                        type="radio"
                        name="radioGroup"
                        [value]="answer.answerId"
                        #radioGroup="ngModel"
                        ngModel
                        required
                        (change)="onAnswerChange(radioGroup.value)"
                      />
                      {{ answer.answerText }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #notActive>
              <p>No Active Question</p>
            </ng-template>
          </ng-container>
        </div>
      </div>
    </ng-container>

    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>

    <ng-template #error let-error>
      <p>Error: {{ error }}</p>
    </ng-template>
  `,
  styleUrl: './question-view.component.css',
})
export class QuestionViewComponent implements OnInit, OnDestroy {
  player: Player | null = null;

  isDev = false;
  gameId: string | null = null;

  title = 'quizza-frontend';
  apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params['isDev']);
      this.isDev = params['isDev'] === 'true';
      this.gameId = params['gameId'];
    });
  }

  ngOnInit(): void {
    this.player = this.getPlayerFromLocalStorage();
    console.log('PlayerLog: ', this.player);
  }

  intialConnection$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getIsAlivePing())),
  );

  getGameState$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getGameState())),
  );

  getIsAlivePing(): Observable<{ message: string; serverTime: string }> {
    return this.http.get<{
      message: string;
      serverTime: string;
    }>(this.apiUrl);
  }

  savePlayerToLocalStorage(value: Player): void {
    localStorage.setItem('player', JSON.stringify(value));
  }

  getPlayerFromLocalStorage(): Player | null {
    const value = localStorage.getItem('player');
    if (!value) {
      return null;
    }
    return JSON.parse(value) as Player;
  }

  deletePlayerFromLocalStorage() {
    const value = localStorage.removeItem('player');
  }

  ngOnDestroy(): void { }

  trackById(index: number, item: Answer) {
    return item.answerId; // assuming each question has a unique id
  }

  getGameState(): Observable<GameState> {
    if (!this.player || !this.gameId) {
      return new Observable<GameState>();
    }

    const url = `${this.apiUrl}/gameState/${this.player?.id}/${this.gameId}`;
    return this.http.get<GameState>(url);
  }

  sendLoginRequest(playerName: string): void {
    const url = `${this.apiUrl}/login/${playerName}/${this.gameId}`;

    this.http.get<Player>(url).subscribe({
      next: (response) => {
        this.player = response;
        this.savePlayerToLocalStorage(response);
      },
      error: (error) => {
        console.error('Error from backend:', error);
        alert('An error occurred while sending the login request.');
      },
    });
  }

  logOut() {
    this.deletePlayerFromLocalStorage();
    this.player = null;
  }

  onAnswerChange(answerId: number) {
    console.log(answerId);
    const url = `${this.apiUrl}/answer/${this.player?.id}/${this.gameId}/${answerId}`;

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
}

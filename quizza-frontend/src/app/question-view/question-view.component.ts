import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AnswerId, GameState, Login } from '../models/backendmodels-copy';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, defer, interval, Observable, switchMap, throwError } from 'rxjs';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-question-view',
  imports: [RouterOutlet, CommonModule, FormsModule],
  standalone: true,
  animations: [
    trigger('numberChange', [
      transition(':increment', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':decrement', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('questionChange', [
      transition('* => *', [
        animate(
          '500ms ease-out',
          keyframes([
            style({ transform: 'scale(0.5) rotate(-90deg)', opacity: 0, offset: 0 }), 
            style({ transform: 'scale(1.1) rotate(10deg)', opacity: 0.8, offset: 0.7 }),
            style({ transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
  template: `
      <router-outlet />

      <ng-container *ngIf="intialConnection$ | async as result; else loading">
        <div>
          <div class="element-header"><h1>Header</h1></div>

          <div *ngIf="this.isDev" class="element-view">
            <h2>Server Connection Status</h2>
            <p>{{ result.message }}</p>
            <p>ServerTime: {{ result.serverTime }}</p>
          </div>

          <div class="element-view">
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
              <h3>Room Information</h3>
              <p *ngIf="responseMessage">{{ responseMessage | json }}</p>
            </div>
            


          </div>

          <div class="element-view">
            <!-- //TODO - Get all Players with "answeredId !== 0 => hasAnswered" and diplay little checkmark-->
            <div *ngIf="this.isDev">
              <!-- @TODO Replace PlayerName with room name -->
              <h2>
              Active Room -
              <div *ngIf="responseMessage">
                {{ responseMessage.playerName }}
              </div>
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
                <div [@questionChange]="gamestate.currentQuestion.question" class="question-container">
                <h3>{{ gamestate.currentQuestion.question }}</h3>
                <div class="center">
                  <div class="counter gradient-background">
                  <div  [@numberChange]="gamestate?.currentQuestionTimer">
                    {{ gamestate?.currentQuestionTimer }}
                  </div>
                  </div>
                </div>

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
  styleUrl: './question-view.component.css'
})
export class QuestionViewComponent implements OnInit, OnDestroy {
  responseMessage: Login = { playerName: '', playerToken: '' };

  playerName: string | null = null;
  isDev: boolean = false;
  room: string | null = null;
  title = 'quizza-frontend';
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      console.log(params['isDev']);
      this.isDev = params['isDev'] === 'true';
      this.room = params['room'];
    });
  }

  ngOnInit(): void {
    this.playerName = this.getPlayerNameFromLocalStorage();
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

  getGameState(): Observable<GameState> {
    return this.http.get<GameState>(`${this.apiUrl}/gamestate/${this.playerName}`);
  }

  sendLoginRequest(playerName: string): void {
    const loginUrl = `${this.apiUrl} / login`;
    const payload = { playerName, gameId: 'GET THIS FROM URL' };

    // Put this into the backend
    this.playerName = playerName;
    this.saveToLocalStorage('playerName', playerName);

    console.log('Sending login request to:', loginUrl, payload);
    this.http.post<Login>(loginUrl, payload).subscribe({
      next: (response) => {
        this.responseMessage = response;
        this.playerName = response.playerName;
        this.saveToLocalStorage('playerName', response.playerName);
      },
      error: (error) => {
        console.error('Error from backend:', error);
        alert('An error occurred while sending the login request.');
      },
    });
  }

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getPlayerNameFromLocalStorage(): string | null {
    return localStorage.getItem('playerName');
  }

  onAnswerChange(answerId: number) {
    console.log(answerId);
    const playerName = this.playerName;
    const url = `${this.apiUrl}/answer`
      ;
    const body = { playerName, answerId };

    this.http.post(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    // Remove the listener to avoid memory leaks
    // window.removeEventListener('storage', this.storageListener);
  }

  trackById(index: number, item: Omit<AnswerId, 'questionId'>) {
    return item.answerId; // assuming each question has a unique id
  }
}

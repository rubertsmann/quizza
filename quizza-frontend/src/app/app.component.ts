import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, defer, interval, Observable, switchMap, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  Answer,
  GameState,
  Login,
  Question,
} from './models/backendmodels-copy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  standalone: true,
  template: `
    <main class="main gradient-background">
      <router-outlet />

      <ng-container *ngIf="intialConnection$ | async as result; else loading">
        <div>
          <div class="element-header"><h1>Header</h1></div>

          <div class="element-view">
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

          <div class="element-view">
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

            <h2>Active Question</h2>
            <ng-container *ngIf="getGameState$ | async as gamestate">
              <div *ngIf="gamestate.currentQuestion.question; else notActive">
                <h3>{{ gamestate.currentQuestion.question }}</h3>

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
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  // private storageListener: (event: StorageEvent) => void;
  responseMessage: Login = { playerName: '', playerToken: '' };

  playerName: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.playerName = this.getPlayerNameFromLocalStorage();
    // // Define the listener
    // this.storageListener = (event: StorageEvent) => {
    //   if (event.storageArea === localStorage) {
    //     console.log('LocalStorage key changed:', event.key);
    //     console.log('Old value:', event.oldValue);
    //     console.log('New value:', event.newValue);
    //   }
    // };
    // Add the listener
    // window.addEventListener('storage', this.storageListener);
  }

  intialConnection$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getIsAlivePing())),
  );

  getGameState$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getGameState())),
  );

  title = 'quizza-frontend';

  private apiUrl = 'http://localhost:3000';

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

  trackById(index: number, item: Omit<Answer, 'questionId'>) {
    return item.answerId; // assuming each question has a unique id
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { defer, interval, Observable, switchMap } from 'rxjs';
import { GameState, Login } from './models/backendmodels-copy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  standalone: true,
  template: ` 
  <main class="main">
  <router-outlet />

  <ng-container *ngIf="intialConnection$ | async as result; else loading">
    <div>
      <h1>Quizza App</h1>

      <div class="element-view">
        <h2>Server Connection Status</h2>
        <p>{{ result.message }}</p>
        <p>ServerTime: {{ result.serverTime }}</p>  
      </div>
  
  
      <div class="element-view">
        <h2>Player Login</h2>
        <input type="text" placeholder="Enter your name" #playerNameInput />
        <button (click)="sendLoginRequest(playerNameInput.value)">Send Request</button>

        <div>Select Player - Click here instead of entering a player</div>
        <ul>
          <li>SomeNameFromBackend1</li>
          <li>SomeNameFromBackend2</li>
          <li>SomeNameFromBackend3</li>
          <li>SomeNameFromBackend4</li>
        </ul>

        <hr>
        <h3>Room Information</h3>
        <p *ngIf="responseMessage">{{ responseMessage | json }}</p>
      </div>
  
      <div class="element-view">
        <!-- @TODO Replace PlayerName with room name -->
        <h2>Active Room - <div *ngIf="responseMessage">{{responseMessage.playerName}}</div></h2>
        <div>Player List</div>
        <ul>
          <li>SomeNameFromBackend1</li>
          <li>SomeNameFromBackend2</li>
          <li>SomeNameFromBackend3</li>
          <li>SomeNameFromBackend4</li>
        </ul>

        <h2>Active Question</h2>
        <ng-container *ngIf="getGameState$ | async as gameState">
          <div *ngIf="gameState.currentQuestion.question; else notActive">
            <h3>{{gameState.currentQuestion.question}}</h3>
            <ul>
              <li *ngFor="let answer of gameState.currentQuestion.answers">
                <button (click)="sendAnswer(answer.answerId)">{{answer.answerText}}</button>
              </li>
            </ul>
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
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  // private storageListener: (event: StorageEvent) => void;
  responseMessage: Login = { playerName: "", playerToken: "" };


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
    interval(1000).pipe(
      switchMap(() => this.getIsAlivePing())
    )
  );

  getGameState$ = defer(() =>
    interval(1000).pipe(
      switchMap(() => this.getGameState())
    )
  );

  title = 'quizza-frontend';

  private apiUrl = 'http://localhost:3000';

  getIsAlivePing(): Observable<{ message: string, serverTime: string }> {
    return this.http.get<{
      message: string,
      serverTime: string
    }>(this.apiUrl);
  }

  getGameState(): Observable<GameState> {
    return this.http.get<GameState>(this.apiUrl + '/gamestate');
  }


  sendLoginRequest(playerName: string): void {
    const loginUrl = `${this.apiUrl} / login`;
    const payload = { playerName, gameId: "GET THIS FROM URL" };

    console.log('Sending login request to:', loginUrl, payload);
    this.http.post<Login>(loginUrl, payload).subscribe({
      next: (response) => {
        this.responseMessage = response;
        this.saveToLocalStorage('playerName', response.playerName);
      },
      error: (error) => {
        console.error('Error from backend:', error);
        alert('An error occurred while sending the login request.');
      }
    });
  }

  sendAnswer(arg0: number) {
    //throw new Error('Method not implemented.');
  }

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  ngOnDestroy(): void {
    // Remove the listener to avoid memory leaks
    // window.removeEventListener('storage', this.storageListener);
  }
}

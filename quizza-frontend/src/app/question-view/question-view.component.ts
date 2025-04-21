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
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  defer,
  first,
  interval,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import {
  Answer,
  Category,
  GameStatus,
  GeneralGameState,
  NewGame,
  Player
} from '../models/backendmodels-copy';
import { PreGameLobbyComponent } from "./pre-game-lobby/pre-game-lobby.component";
import { GameStateService } from './game-state.service';
import { GeneralGameStateComponent } from "./app-general-game-state/app-general-game-state.component";

@Component({
  selector: 'app-question-view',
  imports: [CommonModule, FormsModule, PreGameLobbyComponent, GeneralGameStateComponent],
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
  styleUrl: './question-view.component.css',
  templateUrl: './question-view.component.html',
})
export class QuestionViewComponent implements OnInit, OnDestroy {
  GameStatus = GameStatus;
  Category = Category;
  allCategories = Object.keys(Category);
  isDev = false;

  title = 'quizza-frontend';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public gameStateService: GameStateService,
  ) {

    this.route.queryParams.subscribe((params) => {
      console.log(params['isDev']);
      this.isDev = params['isDev'] === 'true';
      this.gameStateService.gameId = params['gameId'];
    });
  }

  ngOnInit(): void {
    this.gameStateService.player = this.getPlayerFromLocalStorage();
    console.log('PlayerLog: ', this.gameStateService.player);
  }

  intialConnection$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getIsAlivePing())),
  );

  getGameState$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getGameState())),
  );

  openNewLobby(gameId: string, maxRounds: string, maxRoundTime: string) {
    const isValid = /^[a-z]{1,10}$/.test(gameId);
    if (!isValid) {
      //Replace with a better indicator
      alert("GameId is invalid a-z, 1-10, single word")
    } else {
      //Add more input validation
      this.sendNewGame(gameId, parseInt(maxRounds), parseInt(maxRoundTime));
    }
  }

  sendNewGame(gameId: string, maxRounds: number, maxRoundTime: number): void {
    const url = `${this.gameStateService.apiUrl}/createGame`;

    this.http.post<NewGame>(url, {
      gameId,
      maxRounds,
      maxRoundTime
    }).subscribe({
      next: (response) => {
        this.router.navigate([], { queryParams: { gameId: response.gameId } })
      },
      error: (error) => {
        console.error('Error from backend:', error);
        alert('An error occurred while sending the new game request.');
      },
    });
  }

  getIsAlivePing(): Observable<{ message: string; serverTime: string }> {
    return this.http.get<{
      message: string;
      serverTime: string;
    }>(this.gameStateService.apiUrl);
  }

  savePlayerToLocalStorage(value: Player): void {
    localStorage.setItem('player' + this.gameStateService.gameId, JSON.stringify(value));
  }

  getPlayerFromLocalStorage(): Player | null {
    const value = localStorage.getItem('player' + this.gameStateService.gameId);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as Player;
  }

  deletePlayerFromLocalStorage() {
    const value = localStorage.removeItem('player' + this.gameStateService.gameId);
  }

  ngOnDestroy(): void { }

  trackById(index: number, item: Answer) {
    return item.answerId; // assuming each question has a unique id
  }

  getGameState(): Observable<GeneralGameState> {
    if (!this.gameStateService.player || !this.gameStateService.gameId) {
      return new Observable<GeneralGameState>();
    }

    const url = `${this.gameStateService.apiUrl}/gameState/${this.gameStateService.player?.id}/${this.gameStateService.gameId}`;
    return this.http.get<GeneralGameState>(url);
  }

  sendLoginRequest(playerName: string): void {
    const url = `${this.gameStateService.apiUrl}/login/${playerName}/${this.gameStateService.gameId}`;

    this.http.get<Player>(url).subscribe({
      next: (response) => {
        this.gameStateService.player = response;
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
    this.router.navigate([], {})
    this.gameStateService.gameId = null;
    this.gameStateService.player = null;
    this.gameStateService.unsetGameState();
  }

  onAnswerChange(answerId: number) {
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
}

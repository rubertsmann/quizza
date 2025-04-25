import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { defer, interval, Observable, switchMap } from 'rxjs';
import {
  GameStatus,
  GeneralGameState,
  NewGame,
  Player,
} from '../../models/backendmodels-copy';
import { GameStateService } from '../../services/game-state.service';
import { AfterGameLobbyComponent } from './after-game-lobby/after-game-lobby.component';
import { MainGameLobbyComponent } from './main-game-lobby/main-game-lobby.component';
import { PreGameLobbyComponent } from './pre-game-lobby/pre-game-lobby.component';
import { SoundManagerService } from '../../services/sound-manager.service';

@Component({
  selector: 'app-game-view',
  imports: [
    CommonModule,
    FormsModule,
    PreGameLobbyComponent,
    AfterGameLobbyComponent,
    MainGameLobbyComponent,
  ],
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
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.css',
})
export class GameViewComponent implements OnInit {
  GameStatus = GameStatus;
  isDev = false;
  randomGameId = this.getRandomString();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public gameStateService: GameStateService,
    public soundManagerService: SoundManagerService,
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

  getGameState$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.getGameState())),
  );

  openNewLobby(gameId: string, maxRounds: string, maxRoundTime: string) {
    const isValid = /^[a-z,A-Z]{1,10}$/.test(gameId);
    console.log(gameId);
    if (!isValid) {
      //Replace with a better indicator
      alert('GameId is invalid a-z, 1-10, single word');
    } else {
      //Add more input validation
      this.sendNewGame(gameId, parseInt(maxRounds), parseInt(maxRoundTime));
    }
  }

  sendNewGame(gameId: string, maxRounds: number, maxRoundTime: number): void {
    const url = `${this.gameStateService.apiUrl}/createGame`;

    this.http
      .post<NewGame>(url, {
        gameId,
        maxRounds,
        maxRoundTime,
      })
      .subscribe({
        next: (response) => {
          this.router.navigate([], {
            queryParams: { gameId: response.gameId },
          });
        },
        error: (error) => {
          console.error('Error from backend:', error);
          alert('An error occurred while sending the new game request.');
        },
      });
  }

  savePlayerToLocalStorage(value: Player): void {
    localStorage.setItem(
      'player' + this.gameStateService.gameId,
      JSON.stringify(value),
    );
  }

  getPlayerFromLocalStorage(): Player | null {
    const value = localStorage.getItem('player' + this.gameStateService.gameId);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as Player;
  }

  private deletePlayerFromLocalStorage() {
    localStorage.removeItem('player' + this.gameStateService.gameId);
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
    this.router.navigate([], {});
    this.gameStateService.gameId = null;
    this.gameStateService.player = null;
    this.gameStateService.unsetGameState();
  }

  getRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

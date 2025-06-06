import { Injectable } from '@angular/core';
import {
  EndGameAnswers,
  GameId,
  GameStatus,
  GeneralGameState,
  Player,
} from '../models/backendmodels-copy';
import { HttpClient } from '@angular/common/http';
import { defer, first, Observable, switchMap, takeWhile, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  constructor(private http: HttpClient) {}

  private _apiUrl = environment.apiUrl || `${window.location.origin}/api`;

  get apiUrl(): string {
    return this._apiUrl;
  }

  private _player: Player | null = null;

  get player(): Player | null {
    return this._player;
  }

  set player(player: Player | null) {
    this._player = player;
  }

  private _gameId: GameId | null = null;

  get gameId(): GameId | null {
    return this._gameId;
  }

  set gameId(gameId: GameId | null) {
    this._gameId = gameId;
  }

  public _gameState$: Observable<GeneralGameState> = defer(() =>
    timer(0, 1000).pipe(
      switchMap(() => this.requestGameState()),
      takeWhile(
        (gameState) => gameState?.gameStatus !== GameStatus.FINISHED,
        true,
      ),
    ),
  );

  get gameState$(): Observable<GeneralGameState> {
    return this._gameState$;
  }

  private set gameState$(gameState$: Observable<GeneralGameState>) {
    this._gameState$ = gameState$;
  }

  private _allAnswers$ = defer(() =>
    timer(0, 1000).pipe(
      switchMap(() => this.requestAllAnswers()),
      takeWhile((answers) => !answers || answers.length === 0, true),
    ),
  );

  get allAnswers$(): Observable<EndGameAnswers[]> {
    return this._allAnswers$;
  }

  private set allAnswers$(allAnswers$: Observable<EndGameAnswers[]>) {
    this._allAnswers$ = allAnswers$;
  }

  unsetGameState() {
    this.gameId = null;
    this.player = null;
  }

  public sendVote(vote: boolean) {
    const url = `${this.apiUrl}/vote/${this.player?.id}/${this.gameId}/${vote}`;

    this.http.get(url).pipe(first()).subscribe();
  }

  requestGameState(): Observable<GeneralGameState> {
    if (!this.player || !this.gameId) {
      return new Observable<GeneralGameState>();
    }

    const url = `${this.apiUrl}/gameState/${this.player?.id}/${this.gameId}`;
    return this.http.get<GeneralGameState>(url);
  }

  requestAllAnswers(): Observable<EndGameAnswers[]> {
    if (!this.player || !this.gameId) {
      return new Observable<EndGameAnswers[]>();
    }

    const url = `${this.apiUrl}/gamestate/${this.player?.id}/${this.gameId}/allanswers`;
    return this.http.get<EndGameAnswers[]>(url);
  }

  public postSelectedAnswer(answerPayload: string): void {
    if (!this.gameId || !this.player?.id) {
      console.error('Game ID or Player ID is missing for posting answer.');
      return;
    }

    this.http
      .get(
        `${this.apiUrl}/answer/${this.player.id}/${this.gameId}/${encodeURIComponent(answerPayload)}`,
      )
      .subscribe({
        next: () => {},
        error: (err) => console.error('Error posting answer', err),
      });
  }
}

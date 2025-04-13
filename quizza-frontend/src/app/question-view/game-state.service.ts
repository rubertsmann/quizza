import { Injectable } from '@angular/core';
import { GameId, GeneralGameState, Player } from '../models/backendmodels-copy';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, defer, first, interval, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private _apiUrl = 'http://localhost:3000/api';

  private _player: Player | null = null;
  private _gameId: GameId | null = null;

  private _gameState$ = defer(() =>
    interval(1000).pipe(switchMap(() => this.requestGameState())),
  );

  constructor(private http: HttpClient) { }

  get gameState$(): Observable<GeneralGameState> {
    return this._gameState$
  }

  private set gameState$(gameState$: Observable<GeneralGameState>) {
    this._gameState$ = gameState$;
  }

  get apiUrl(): string{
    return this._apiUrl;
  }

  get player(): Player | null{
    return this._player;
  }

  set player(player: Player | null) {
    this._player = player;
  }

  get gameId(): GameId | null{
    return this._gameId;
  }

  set gameId(gameId: GameId | null) {
    this._gameId = gameId;
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

}
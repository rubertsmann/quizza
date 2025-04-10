import { Injectable } from '@angular/core';
import { GameId, GeneralGameState, Player } from '../models/backendmodels-copy';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private _apiUrl = 'http://localhost:3000/api';

  private _player: Player | null = null;
  private _gameId: GameId | null = null;

  private gameStateSubject = new BehaviorSubject<GeneralGameState | null>(null);
  public gameState$: Observable<GeneralGameState | null> = this.gameStateSubject.asObservable();

  constructor(private http: HttpClient) { }

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


  setGameState(gameState: GeneralGameState) {
    this.gameStateSubject.next(gameState); // Update the BehaviorSubject
  }

  unsetGameState() {
    this.gameId = null;
    this.player = null;
    this.gameStateSubject.next(null); // Reset the game state
  }

  public sendVote(vote: boolean) {
    const url = `${this.apiUrl}/vote/${this.player?.id}/${this.gameId}/${vote}`;

    this.http.get(url).pipe(first()).subscribe();
  }

  fetchGameState(): void {
    if (!this.player || !this.gameId) {
      console.error('Player or Game ID is not set.');
      return;
    }

    const url = `${this.apiUrl}/gamestate/${this.player.id}/${this.gameId}`;
    this.http.get<GeneralGameState>(url).pipe(first()).subscribe({
      next: (gameState) => {
        this.setGameState(gameState); // Update the BehaviorSubject with the fetched game state
      },
      error: (error) => {
        console.error('Error fetching game state:', error);
      }
    });
  }
}
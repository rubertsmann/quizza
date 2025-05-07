import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameStateService } from './game-state.service'; // Ensure this path is correct
import { environment } from '../../environments/environment'; // For backend URL

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private messageSubject = new BehaviorSubject<string | null>(null);
  private currentGameId: string | null = null;
  private playersSubject = new BehaviorSubject<string[]>([]);

  constructor(private gameStateService: GameStateService) {
    const initialGameId = this.getGameIdFromUrl();
    if (initialGameId) {
      // Delay connection slightly if player ID might not be immediately available
      // This is a common pattern if GameStateService initializes asynchronously
      // For simplicity, assuming it's available or connection is retried/handled
      this.connect(initialGameId);
    }
  }

  private getGameIdFromUrl(): string | null {
    if (typeof window !== 'undefined') { // Guard for SSR or non-browser environments
      return new URLSearchParams(window.location.search).get('gameId');
    }
    return null;
  }

  private connect(gameId: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.currentGameId = gameId;
    const playerId = this.gameStateService.player?.id;

    if (!playerId) {
      console.warn('Player ID not available in GameStateService. Cannot connect socket.');
      // Optionally, you could retry or queue the connection once playerId is available.
      return;
    }

    // Use environment variable for socket URL
    //REPLACE WITH LOCAL URL
    this.socket = io(environment.socketUrl || window.location.origin, {
      query: { gameId, playerId },
      transports: ['websocket'] // Recommended for consistency
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('message', (data: string) => {
      this.messageSubject.next(data);
    });

    // Listen to 'updatePlayers' event from the backend
    this.socket.on('updatePlayers', (playerList: string[]) => {
      this.playersSubject.next(playerList);
    });
  }

  switchRoom(newGameId: string) {
    if (newGameId && newGameId !== this.currentGameId) { // Ensure newGameId is valid
      this.connect(newGameId);
    }
  }

  sendMessage(msg: string) {
    this.socket?.emit('message', msg);
  }

  onMessage(): Observable<string | null> {
    return this.messageSubject.asObservable();
  }

  onPlayers(): Observable<string[]> {
    return this.playersSubject.asObservable();
  }

  // Optional: Allow manual request for players if needed
  requestPlayerList() {
    if (this.socket?.connected) {
      this.socket.emit('requestPlayers');
    }
  }
}

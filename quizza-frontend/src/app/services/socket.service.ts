import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private messageSubject = new BehaviorSubject<string | null>(null);
  private currentGameId: string | null = null;

  constructor() {
    const initialGameId = this.getGameIdFromUrl();
    if (initialGameId) this.connect(initialGameId);
  }

  private getGameIdFromUrl(): string | null {
    return new URLSearchParams(window.location.search).get('gameId');
  }

  private connect(gameId: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.currentGameId = gameId;

    //TODO Replace with actual url
    this.socket = io('http://localhost:3000', {
      query: { gameId },
    });

    this.socket.on('message', (data: string) => {
      this.messageSubject.next(data);
    });
  }

  switchRoom(newGameId: string) {
    if (newGameId !== this.currentGameId) {
      this.connect(newGameId);
    }
  }

  sendMessage(msg: string) {
    this.socket?.emit('message', msg);
  }

  onMessage(): Observable<string | null> {
    return this.messageSubject.asObservable().pipe();
  }
}

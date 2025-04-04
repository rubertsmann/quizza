import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { defer, interval, Observable, switchMap } from 'rxjs';
import { GameState, Login } from './models/backendmodels-copy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
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
    return this.http.get<GameState>(this.apiUrl);
  }


  sendLoginRequest(playerName: string): void {
    const loginUrl = `${this.apiUrl}/login`;
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

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  } 

  ngOnDestroy(): void {
    // Remove the listener to avoid memory leaks
    // window.removeEventListener('storage', this.storageListener);
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { defer, interval, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private http: HttpClient) { }

  message$ = defer(() =>
    interval(1000).pipe(
      switchMap(() => this.getIsAlivePing())
    )
  );

  title = 'quizza-frontend';

  private apiUrl = 'http://localhost:3000';

  getIsAlivePing(): Observable<{ message: string }> {
    return this.http.get<{
      message: string
    }>(this.apiUrl);
  }

  getGameState(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(this.apiUrl);
  }

  sendRequest(): void {
    this.http.get<{ message: string }>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
        alert(`Response: ${response.message}`);
      },
      error: (error) => {
        console.error('Error from backend:', error);
        alert('An error occurred while sending the request.');
      }
    });
  }
}

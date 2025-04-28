import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { defer, interval, Observable, startWith, switchMap } from 'rxjs';
import { GameStateService } from '../services/game-state.service';
import { GameViewComponent } from './game-view/game-view.component';

@Component({
  selector: 'app-question-view',
  imports: [CommonModule, FormsModule, GameViewComponent],
  standalone: true,

  styleUrl: './question-view.component.css',
  templateUrl: './question-view.component.html',
})
export class QuestionViewComponent {
  initialConnection$ = defer(() =>
    interval(15000).pipe(
      startWith(0),
      switchMap(() => this.getIsAlivePing()),
    ),
  );

  constructor(
    private http: HttpClient,
    public gameStateService: GameStateService,
  ) {}

  getIsAlivePing(): Observable<{ message: string; serverTime: string }> {
    return this.http.get<{
      message: string;
      serverTime: string;
    }>(this.gameStateService.apiUrl);
  }
}

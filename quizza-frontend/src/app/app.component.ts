import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { catchError, defer, interval, Observable, switchMap, throwError } from 'rxjs';
import {
  AnswerId,
  GameState,
  Login
} from './models/backendmodels-copy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  standalone: true,
  template: `
    <main class="main gradient-background">
      <div  class="content">
        <router-outlet/>
      </div>
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {

}

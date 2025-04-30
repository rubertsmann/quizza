import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameViewComponent } from './game-view/game-view.component';

@Component({
  selector: 'app-question-view',
  imports: [CommonModule, FormsModule, GameViewComponent],
  standalone: true,

  styleUrl: './question-view.component.css',
  templateUrl: './question-view.component.html',
})
export class QuestionViewComponent {}

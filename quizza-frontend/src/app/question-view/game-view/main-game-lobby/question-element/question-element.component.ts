import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Answer, Question } from '../../../../models/backendmodels-copy';
import { GameStateService } from '../../../../services/game-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-element',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-element.component.html',
  styleUrl: './question-element.component.css',
})
export class QuestionElementComponent implements OnChanges {
  currentAnswerId = -1;

  @Input() question!: Question;

  constructor(private gameStateService: GameStateService) {}

  protected onAnswerChange(answerId: number) {
    this.currentAnswerId = answerId;
    this.gameStateService.postSelectedAnswer(answerId);
  }

  ngOnChanges(_change: SimpleChanges) {
    if (
      _change['question'] &&
      _change['question'].currentValue.id !==
        _change['question'].previousValue.id
    ) {
      this.currentAnswerId = -1;
      console.log('Question changed');
    }
  }

  trackById(index: number, item: Answer) {
    return item.answerId;
  }
}

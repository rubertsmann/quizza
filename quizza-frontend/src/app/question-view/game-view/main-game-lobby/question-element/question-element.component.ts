// question-element.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Answer,
  EnumQuestionTypes,
  EstimationDetails,
  MultipleChoiceDetails,
  Question,
} from '../../../../models/backendmodels-copy'; // Added EnumQuestionTypes
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
  @Input() question!: Question; // Type is now the full Question object

  // For Multiple Choice
  currentAnswerId = -1;

  // For Estimation
  estimationAnswer = '';

  public EnumQuestionTypes = EnumQuestionTypes; // To use in template

  constructor(private gameStateService: GameStateService) {}

  // To cast details in the template safely
  get multipleChoiceDetails(): MultipleChoiceDetails | null {
    if (
      this.question &&
      this.question.questionType === EnumQuestionTypes.MultipleChoice
    ) {
      return this.question.details as MultipleChoiceDetails;
    }
    return null;
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

  // For Multiple Choice
  onMcAnswerChange(answerId: number): void {
    this.currentAnswerId = answerId;
    this.gameStateService.postSelectedAnswer(answerId.toString());
  }

  // For Estimation
  onEstimationSubmit(): void {
    if (this.estimationAnswer.trim() === '') {
      return;
    }
    if (isNaN(parseFloat(this.estimationAnswer))) {
    }
    this.gameStateService.postSelectedAnswer(this.estimationAnswer);
  }

  trackById(index: number, item: Answer): number {
    return item.answerId;
  }

  // Type guard for template
  isMultipleChoiceDetails(details: any): details is MultipleChoiceDetails {
    return (
      this.question &&
      this.question.questionType === EnumQuestionTypes.MultipleChoice
    );
  }

  // Type guard for template (though not strictly needed if just accessing common 'questionText')
  isEstimationDetails(details: any): details is EstimationDetails {
    return (
      this.question &&
      this.question.questionType === EnumQuestionTypes.Estimation
    );
  }
}

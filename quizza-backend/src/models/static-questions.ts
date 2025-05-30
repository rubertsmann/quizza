// Example structure for static-questions.ts
import {
  Category,
  EnumQuestionTypes,
  EstimationDetails,
  MultipleChoiceDetails,
  Question,
} from './backendmodels'; // Adjust path as needed

export const questions: Question[] = [
  {
    id: 1,
    category: Category.HUMAN,
    questionType: EnumQuestionTypes.MultipleChoice,
    details: {
      questionText: 'What is the average human body temperature?',
      answers: [
        { answerId: 1, answerText: '36.5°C' },
        { answerId: 2, answerText: '37°C' },
        { answerId: 3, answerText: '37.5°C' },
        { answerId: 4, answerText: '38°C' },
        { answerId: 5, answerText: '36°C' },
      ],
      correctAnswerId: 2,
    } as MultipleChoiceDetails,
  },
  // ... more multiple choice questions
  {
    id: 101, // Make sure ID is unique
    category: Category.HISTORY,
    questionType: EnumQuestionTypes.Estimation,
    details: {
      questionText: 'In what year did the French Revolution begin?',
      correctAnswerValue: 1789,
      toleranceBelowPercent: 1, // Allows 1% below 1789
      toleranceAbovePercent: 1, // Allows 1% above 1789
    } as EstimationDetails,
  },
  {
    id: 102,
    category: Category.SPORT,
    questionType: EnumQuestionTypes.Estimation,
    details: {
      questionText:
        'Estimate the marathon distance in kilometers (to one decimal place).',
      correctAnswerValue: 42.2,
      toleranceBelowPercent: 5, // 5% tolerance
      toleranceAbovePercent: 5, // 5% tolerance
    } as EstimationDetails,
  },
];

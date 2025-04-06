export interface BackendmodelsCopy {}

export interface GameState {
  gameId: string;
  playerId: number;
  playerName: string;
  currentQuestion: Omit<Question, 'correctAnswer'>;
  currentAnswer: string;
}

export interface Question {
  id: number;
  question: string;
  answers: Omit<Answer, 'questionId'>[];
  selectedAnswerId: number;
}

export interface Answer {
  questionId: number;
  answerId: number;
  answerText: string;
}

export interface Login {
  playerName: string;
  playerToken: string;
}

export interface GameState {
  gameId: string,
  playerId: number,
  playerName: string,
  currentQuestion: Omit<Question, "correctAnswer">,
  currentQuestionTimer: number,
  currentAnswer: string
}

export interface Question {
  id: number,
  question: string,
  answers: Omit<AnswerId, "questionId">[],
  selectedAnswerId: number,
  correctAnswerId: number
}

export interface AnswerId {
  questionId: number,
  answerId: number
  answerText: string
}

export interface Login {
  playerName: string, playerToken: string
}

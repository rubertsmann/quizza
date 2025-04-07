interface GameState {
  gameId: string,
  playerId: number,
  playerName: string,
  currentQuestion: Omit<Question, "correctAnswer">,
  currentQuestionTimer: number,
  currentAnswer: string
}

interface Question {
  id: number,
  question: string,
  answers: Omit<AnswerId, "questionId">[],
  selectedAnswerId: number,
  correctAnswerId: number
}

interface AnswerId {
  questionId: number,
  answerId: number
  answerText: string
}

interface Login {
  playerName: string, playerToken: string
}

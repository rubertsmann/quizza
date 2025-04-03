interface GameState {
  gameId: string,
  playerId: number,
  playerName: string,
  currentQuestion: Omit<Question, "correctAnswer">,
  currentAnswer: string
}

interface Question {
  id: number,
  question: string,
  answers: Omit<AnswerId, "questionId">[],
  selectedAnswerId: number,
}

interface AnswerId {
  questionId: number,
  answerId: number
  answerText: string
}

interface Login {
   playerName: string, playerToken: string 
  }

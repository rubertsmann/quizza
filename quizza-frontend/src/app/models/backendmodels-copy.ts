export interface GameState {
  gameId: GameId;
  playerId: number;
  playerName: string;
  currentQuestion: Omit<Question, 'correctAnswer'>;
  currentQuestionTimer: number;
  currentAnswer: string;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
  correctAnswerId: number;
}

export interface Answer {
  questionId: QuestionId;
  answerId: AnswerId;
  answerText: string;
}

export interface Player {
  name: string;
  id: PlayerId;
}

export type GameId = string;
export type AnswerId = number;
export type QuestionId = string;
export type PlayerId = string;

export interface QuestionWithAnswer {
  id: QuestionId;
  answerId: AnswerId;
}

export interface PlayerGameState {
  player: Player;
  currentAnswerId: AnswerId;
  allAnswers: Map<QuestionId, QuestionWithAnswer>;
}

export interface GeneralGameState {
  gameId: GameId;
  roundTime: number;
  currentQuestionTimer: number;
  currentQuestion: Question;
  playerSpecificGameState: Map<PlayerId, PlayerGameState>;
}

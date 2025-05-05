export interface GameState {
  gameId: GameId;
  playerId: number;
  playerName: string;
  currentQuestion: Omit<Question, 'correctAnswer'>;
  currentQuestionTimer: number;
  currentAnswer: string;
}

export enum Category {
  HUMAN,
  SPORT,
  GROCERIES,
  SOCIALMEDIA,
  STARS,
  HISTORY,
  STORIES,
  SCHOOL,
  COMPUTER,
}

export interface NewGame {
  gameId: GameId;
  maxRounds: number;
  maxRoundTime: number;
  quickRoundActive: boolean;
}

export interface Question {
  id: QuestionId;
  category: Category;
  question: string;
  answers: Answer[];
  correctAnswerId: number;
}

export interface Answer {
  questionId?: QuestionId;
  answerId: AnswerId;
  answerText: string;
}

export interface Player {
  name: string;
  id: PlayerId;
}

export type GameId = string;
export type AnswerId = number;
export type QuestionId = number;
export type PlayerId = string;

export interface QuestionWithAnswer {
  id: QuestionId;
  answerId: AnswerId;
  answerText: string;
  originalQuestion: {
    text: string;
    answerText: Answer | undefined;
  };
  isCorrectAnswer: boolean;
  calculatedPoints: number;
  answeredInSeconds: number;
}

export interface PlayerGameState {
  remainingSeconds: number;
  player: Player;
  currentAnswerId: AnswerId;
  answerText: string;
  allAnswers: Map<QuestionId, QuestionWithAnswer>;
}

export interface EndGame {
  player: Player;
  currentAnswerId: AnswerId;
  allAnswers: Map<QuestionId, QuestionWithAnswer>;
}

export enum GameStatus {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  PRE_GAME = 'PRE_GAME',
  INIT = 'INIT',
}

export interface EndGameState {
  points: number;
  allAnswers: QuestionWithAnswer[];
  answeredInSeconds: number;
  player: string;
}

export interface PreGameState {
  howManyHaveVoted: number;
  playerNames: string[];
  playerVotes: Map<PlayerId, PlayerVote>;
}

export interface PreGameStateReduced {
  howManyHaveVoted: number;
  playerNames: string[];
  playerVotes: PlayerVote[];
}

export interface PlayerVote {
  voteStart: boolean;
  playerName: string;
}

export interface GeneralGameState {
  gameId: GameId;
  gameStatus: GameStatus;
  currentRound: number;
  maxRounds: number;
  roundTime: number;
  quickRoundActive: boolean;
  currentQuestionTimer: number;
  maxRoundTime: number;
  allQuestionIds: QuestionId[];
  currentQuestion?: Question;
  playerSpecificGameState: Map<PlayerId, PlayerGameState>;
  endGameState: EndGameState[];
  preGameState?: PreGameState;
}

export interface GeneralGameStateReduced {
  gameId: GameId;
  gameStatus: GameStatus;
  currentRound: number;
  maxRounds: number;
  roundTime: number;
  currentQuestionTimer: number;
  maxRoundTime: number;
  allQuestionIds: QuestionId[];
  currentQuestion?: Omit<Question, 'correctAnswerId'>;
  endGameState: EndGameState[];
  preGameState?: PreGameStateReduced;
}

export interface EndGameAnswers {
  questionText: string;
  questionAnswers: {
    playerName: string;
    answerText: string;
    points: number;
    answeredInSeconds: number;
  }[];
}

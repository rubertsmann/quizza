// backendmodels.ts

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

export enum EnumQuestionTypes {
  MultipleChoice = 'MultipleChoice',
  Estimation = 'Estimation',
}

export interface Answer {
  answerId: AnswerId; // Unique within a question
  answerText: string;
}

export interface MultipleChoiceDetails {
  questionText: string;
  answers: Answer[];
  correctAnswerId: number;
}

export interface EstimationDetails {
  questionText: string;
  correctAnswerValue: number;
  toleranceBelowPercent: number;
  toleranceAbovePercent: number;
}

export interface Question {
  id: QuestionId;
  category: Category;
  questionType: EnumQuestionTypes;
  details: MultipleChoiceDetails | EstimationDetails;
}

export interface GameState {
  gameId: GameId;
  playerId: number; // This seems like a client-specific model, not general game state
  playerName: string; // This seems like a client-specific model, not general game state
  currentQuestion: Omit<
    Question,
    'details.correctAnswerId' | 'details.correctAnswerValue'
  >; // Redaction handled in reduced state
  currentQuestionTimer: number;
  currentAnswer: string; // This seems like a client-specific model
}

export interface NewGame {
  gameId: GameId;
  maxRounds: number;
  maxRoundTime: number;
  quickRoundActive: boolean;
}

export interface Player {
  id: PlayerId;
  name: string;
}

export type GameId = string;
export type AnswerId = number; // For Multiple Choice
export type QuestionId = number;
export type PlayerId = string;

export interface QuestionWithAnswer {
  id: QuestionId;
  questionType: EnumQuestionTypes;
  originalQuestionDetails: Question['details']; // Storing original details for context

  submittedPayload: string; // Raw submitted payload (answerId for MC, estimate string for Estimation)
  displayedAnswer: string; // User-friendly display of the answer

  isCorrectOrWithinTolerance: boolean;
  calculatedPoints: number;
  answeredInSeconds: number;

  // Optional: For detailed results display in estimation
  correctNumericAnswer?: number;
  submittedNumericAnswer?: number;
  deviationPercent?: number;
}

export interface PlayerGameState {
  remainingSeconds: number;
  player: Player;
  currentSubmittedPayload?: string; // Stores answerId for MC, or estimate string for Estimation
  currentAnswerDisplayTest?: string; // User facing text for MC answer, or submitted estimation value
  allAnswers: Map<QuestionId, QuestionWithAnswer>;
}

export interface EndGame {
  // This seems unused, EndGameState is used
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
  answeredInSeconds: number; //This seems to be an aggregation, maybe average?
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
  allQuestionIds: QuestionId[]; // Stores IDs of questions already asked in this game
  currentQuestion?: Question;
  playerSpecificGameState: Map<PlayerId, PlayerGameState>;
  endGameState: EndGameState[];
  preGameState?: PreGameState;
}

// For frontend, redacting sensitive answer details
export interface MultipleChoiceDetailsReduced
  extends Omit<MultipleChoiceDetails, 'correctAnswerId'> {}

export interface EstimationDetailsReduced
  extends Omit<
    EstimationDetails,
    'correctAnswerValue' | 'toleranceBelowPercent' | 'toleranceAbovePercent'
  > {}

export interface QuestionReduced extends Omit<Question, 'details'> {
  details: MultipleChoiceDetailsReduced | EstimationDetailsReduced;
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
  currentQuestion?: QuestionReduced; // Use the reduced Question type
  endGameState: EndGameState[];
  preGameState?: PreGameStateReduced;
}

export interface EndGameAnswers {
  questionText: string; // Original question text
  questionType: EnumQuestionTypes;
  correctAnswerDisplay: string; // e.g. "Correct: Blue" or "Correct Value: 100"
  questionAnswers: {
    playerName: string;
    answerText: string; // Player's submitted answer display
    points: number;
    answeredInSeconds: number;
  }[];
}

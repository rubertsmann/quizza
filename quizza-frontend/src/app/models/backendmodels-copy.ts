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
  playerId: number;
  playerName: string;
  currentQuestion: Omit<
    Question,
    'details.correctAnswerId' | 'details.correctAnswerValue'
  >;
  currentQuestionTimer: number;
  currentAnswer: string;
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
export type AnswerId = number;
export type QuestionId = number;
export type PlayerId = string;

export interface QuestionWithAnswer {
  id: QuestionId;
  questionType: EnumQuestionTypes;
  originalQuestionDetails: Question['details'];

  submittedPayload: string;
  displayedAnswer: string;

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
  currentSubmittedPayload?: string;
  currentAnswerDisplayTest?: string;
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

export type MultipleChoiceDetailsReduced = Omit<
  MultipleChoiceDetails,
  'correctAnswerId'
>;

export type EstimationDetailsReduced = Omit<
  EstimationDetails,
  'correctAnswerValue' | 'toleranceBelowPercent' | 'toleranceAbovePercent'
>;

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
  currentQuestion?: QuestionReduced;
  endGameState: EndGameState[];
  preGameState?: PreGameStateReduced;
}

export interface EndGameAnswers {
  questionText: string;
  questionType: EnumQuestionTypes;
  correctAnswerDisplay: string;
  questionAnswers: {
    playerName: string;
    answerText: string;
    points: number;
    answeredInSeconds: number;
  }[];
}

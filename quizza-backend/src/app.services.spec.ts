import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import {
  GameStatus,
  GeneralGameState,
  PlayerGameState,
  PlayerId,
  QuestionId,
  QuestionWithAnswer,
} from './models/backendmodels';

describe('AppServices', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('Count all correct answers"', () => {
      const answers = new Map<QuestionId, QuestionWithAnswer>();

      answers.set(1, { id: 1, answerId: 1, isCorrectAnswer: true });
      answers.set(2, { id: 2, answerId: 2, isCorrectAnswer: false });
      answers.set(3, { id: 3, answerId: 3, isCorrectAnswer: true });
      answers.set(4, { id: 4, answerId: 4, isCorrectAnswer: true });
      answers.set(5, { id: 5, answerId: 5, isCorrectAnswer: true });

      const player = { name: 'TestPlayer', id: 'someid' };
      const playerSpecificGameState = new Map<PlayerId, PlayerGameState>();
      playerSpecificGameState.set('someid', {
        player: player,
        currentAnswerId: -1,
        allAnswers: answers,
      });

      const gameState: GeneralGameState = {
        gameId: 'testGameId',
        gameStatus: GameStatus.IN_PROGRESS,
        playerSpecificGameState: playerSpecificGameState,
        currentQuestion: {
          id: 1,
          question: 'What is the capital of France?',
          answers: [
            { answerId: 1, answerText: 'Berlin' },
            { answerId: 2, answerText: 'Madrid' },
            { answerId: 3, answerText: 'Paris' },
            { answerId: 4, answerText: 'Rome' },
          ],
          correctAnswerId: 3,
        },
        currentRound: 0,
        maxRounds: 0,
        roundTime: 0,
        currentQuestionTimer: 0,
        endGameState: [],
      };

      appService.endGameInProgress(gameState);

      const endpoints = gameState.endGameState[0].points;

      expect(endpoints).toEqual(4);
    });
  });
});

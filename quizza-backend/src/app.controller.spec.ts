import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameStatus, GeneralGameState } from './models/backendmodels';
import { questions } from './models/static-questions';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  it('should throw an error if no questions are available', () => {
    const gameState: GeneralGameState = {
      gameId: 'game1',
      gameStatus: GameStatus.IN_PROGRESS,
      currentRound: 1,
      maxRounds: 3,
      roundTime: 60,
      currentQuestionTimer: 60,
      maxRoundTime: 60,
      currentQuestion: questions[0],
      allQuestionIds: questions.map((q) => q.id), // All questions have been used
      playerSpecificGameState: new Map(),
      endGameState: [],
    };

    expect(() => appService.getRandomQuestion(gameState)).toThrowError(
      'No more questions available.',
    );
  });
});

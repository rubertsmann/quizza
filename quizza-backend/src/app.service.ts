import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  AnswerId,
  EndGameAnswers,
  GameId,
  GameStatus,
  GeneralGameState,
  GeneralGameStateReduced,
  NewGame,
  Player,
  PlayerGameState,
  PlayerId,
  PlayerVote,
  Question,
  QuestionId,
  QuestionWithAnswer,
} from './models/backendmodels';
import { questions } from './models/static-questions';

@Injectable()
export class AppService {
  onModuleInit() {
    this.startGameStateUpdateLoop();
  }

  startGameStateUpdateLoop() {
    setInterval(() => {
      this.updateGame();
    }, 1000);
  }

  globalGameState = new Map<GameId, GeneralGameState>();

  answerQuestionForPlayer(
    gameId: GameId,
    playerId: PlayerId,
    answerId: AnswerId,
  ) {
    const gameState = this.getGameStateOrFail(gameId);

    const playerGameState = this.getPlayerSpecificGameStateOrFail(
      gameState,
      playerId,
    );

    if (gameState.currentQuestion) {
      playerGameState.currentAnswerId = answerId;
      playerGameState.answerText =
        gameState.currentQuestion.answers.find((a) => a.answerId === answerId)
          ?.answerText || 'Answer Unknown';

      playerGameState.remainingSeconds = gameState.currentQuestionTimer;
      gameState?.playerSpecificGameState.set(playerId, playerGameState);
    }

    this.debugGameState(gameId);
  }

  voteStartPlayer(gameId: GameId, playerName: PlayerId, voteStart: boolean) {
    const gameState = this.globalGameState.get(gameId);
    const playerGameState = gameState?.playerSpecificGameState.get(playerName);
    const pregameState = gameState?.preGameState;

    if (gameState && playerGameState && pregameState) {
      pregameState.playerVotes.set(playerGameState.player.id, {
        playerName: playerName,
        voteStart,
      });
      gameState.preGameState!.playerVotes = pregameState.playerVotes;
    }

    this.debugGameState(gameId);
  }

  debugGameState(gameId: GameId) {
    // const test = this.globalGameState.get(gameId);
    // console.log('---START---');
    // console.log('SpielerCount' + test?.playerSpecificGameState.size);
    // test?.playerSpecificGameState.forEach((element) => {
    //   console.log(element.player.name);
    //   console.log(element);
    // });
    // console.log('---END---');
  }

  login(playerName: string, gameId: GameId): Player {
    const uuid = crypto.randomUUID();
    const player = { name: playerName, id: uuid };

    this.initializePlayerGameState(player, gameId);
    this.updatePreGamePlayerList(player, gameId);
    return player;
  }

  getGameStateOrFail(gameId: GameId): GeneralGameState {
    const gameState = this.globalGameState.get(gameId);

    if (gameState) {
      return gameState;
    }

    throw new Error('Game does not Exist');
  }

  setGameStateOrFail(state: GeneralGameState) {
    this.globalGameState.set(state.gameId, state);
  }

  getPlayerSpecificGameStateOrFail(
    gameState: GeneralGameState,
    playerId: PlayerId,
  ): PlayerGameState {
    if (!gameState.playerSpecificGameState.has(playerId)) {
      throw new Error('Player not part of the game.');
    }

    return gameState.playerSpecificGameState.get(playerId)!;
  }

  updatePreGamePlayerList(player: Player, gameId: GameId) {
    const gameState = this.getGameStateOrFail(gameId);
    const playerNames: string[] = [];

    gameState.playerSpecificGameState.forEach((playerGameState) => {
      playerNames.push(playerGameState.player.name);
    });

    if (gameState.preGameState) {
      gameState.preGameState.playerNames = playerNames;
    }
  }

  initializePlayerGameState(player: Player, gameId: GameId) {
    const gameState = this.getGameStateOrFail(gameId);
    const doesPlayerNameExist = !Array.from(
      gameState.playerSpecificGameState.values(),
    ).find((it) => it.player.name === player.name);

    if (!doesPlayerNameExist) {
      throw Error('Playername already taken.');
    }

    if (!gameState.playerSpecificGameState.has(player.id)) {
      gameState.playerSpecificGameState.set(player.id, {
        player: player,
        currentAnswerId: -1,
        answerText: '',
        allAnswers: new Map<QuestionId, QuestionWithAnswer>(),
        remainingSeconds: -1,
      });
    }
  }

  initializeGeneralGameState(newGame: NewGame): GeneralGameState {
    const playerGameState = new Map<PlayerId, PlayerGameState>();

    const gameState: GeneralGameState = {
      gameId: newGame.gameId,
      gameStatus: GameStatus.INIT,
      roundTime: newGame.maxRoundTime,
      quickRoundActive: newGame.quickRoundActive,
      currentRound: 1,
      maxRounds: newGame.maxRounds,
      currentQuestionTimer: newGame.maxRoundTime,
      allQuestionIds: [],
      playerSpecificGameState: playerGameState,
      endGameState: [],
      preGameState: {
        playerNames: [],
        howManyHaveVoted: 0,
        playerVotes: new Map<PlayerId, PlayerVote>(),
      },
      maxRoundTime: newGame.maxRoundTime,
    };

    this.setGameStateOrFail(gameState);
    this.updateGameStatus(gameState, GameStatus.PRE_GAME);

    return gameState;
  }

  getGeneralGameState(
    playerId: PlayerId,
    gameId: GameId,
  ): GeneralGameStateReduced {
    const gameState = this.getGameStateOrFail(gameId);

    const { currentQuestion, ...rest } = gameState;
    const reducedQuestion = currentQuestion
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (({ correctAnswerId, ...q }) => q)(currentQuestion)
      : undefined;

    return {
      ...rest,
      currentQuestion: reducedQuestion,
      preGameState: {
        howManyHaveVoted: gameState.preGameState!.howManyHaveVoted,
        playerNames: gameState.preGameState!.playerNames,
        playerVotes: Array.from(gameState.preGameState!.playerVotes.values()),
      },
    };
  }

  getRandomQuestion(gameState: GeneralGameState): Question {
    const availableQuestionIds = questions.map((q) => q.id);

    const remainingQuestionIds = availableQuestionIds.filter(
      (id) => !gameState.allQuestionIds.includes(id),
    );

    if (remainingQuestionIds.length === 0) {
      //End Game instantly
      throw new Error('No more questions available.');
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestionIds.length);
    const randomQuestionId = remainingQuestionIds[randomIndex];

    return questions.find((q) => q.id === randomQuestionId)!;
  }

  updateGame() {
    this.globalGameState.forEach((gameState, gameId) => {
      if (gameState.gameStatus === GameStatus.PRE_GAME) {
        this.updatePreGame(gameState);
      }

      if (gameState.gameStatus === GameStatus.IN_PROGRESS) {
        this.updateGameInProgress(gameState, gameId);
      }
    });
  }

  updatePreGame(gameState: GeneralGameState) {
    if (!gameState.preGameState) {
      throw new Error('Game state must be initialized');
    }

    let howManyVotedYes = 0;
    gameState.preGameState.playerVotes.forEach((playerGameState) => {
      if (playerGameState.voteStart) {
        howManyVotedYes++;
      } else {
        howManyVotedYes--;
      }
    });

    gameState.preGameState.howManyHaveVoted = howManyVotedYes;

    if (
      howManyVotedYes >= 1 &&
      gameState.playerSpecificGameState.size === howManyVotedYes
    ) {
      this.endPreGame(gameState);
    }
  }

  private endPreGame(gameState: GeneralGameState) {
    this.updateGameStatus(gameState, GameStatus.IN_PROGRESS);

    gameState.currentQuestion = this.getRandomQuestion(gameState);
  }

  updateGameInProgress(gameState: GeneralGameState, gameId: GameId) {
    gameState.currentQuestionTimer--;

    //TODO Probably change this logic according to the game mode.
    if (
      gameState.currentQuestionTimer <= 0 ||
      this.quickRoundEnded(gameState)
    ) {
      this.persistCurrentRound(gameState);

      if (gameState.currentRound == gameState.maxRounds) {
        this.endGameInProgress(gameState);
      } else {
        this.startNewRound(gameState);
      }

      this.debugGameState(gameId);
    }
  }

  persistCurrentRound(gameState: GeneralGameState) {
    if (gameState.currentQuestion === null) {
      throw Error('Game is not active');
    }

    gameState.playerSpecificGameState.forEach((playerGameState) => {
      const isCorrect =
        playerGameState.currentAnswerId ===
        gameState.currentQuestion!.correctAnswerId;

      const answeredQuestion: QuestionWithAnswer = {
        id: gameState.currentQuestion!.id,
        answerId: playerGameState.currentAnswerId,
        answerText: playerGameState.answerText,
        originalQuestion: {
          text: gameState.currentQuestion!.question,
          answerText: gameState.currentQuestion!.answers.find(
            (a) => a.answerId === gameState.currentQuestion!.correctAnswerId,
          ),
        },
        isCorrectAnswer: isCorrect,
        calculatedPoints: isCorrect
          ? this.calculatePoints(
              gameState.currentRound,
              gameState.maxRounds,
              gameState.quickRoundActive
                ? playerGameState.remainingSeconds
                : 10,
            )
          : 0,
        answeredInSeconds:
          gameState.maxRoundTime - playerGameState.remainingSeconds,
      };

      playerGameState.allAnswers.set(
        gameState.currentQuestion!.id,
        answeredQuestion,
      );
    });
  }

  calculatePoints(
    currentRound: number,
    maxRounds: number,
    basePoints: number,
  ): number {
    const roundRatio = currentRound / maxRounds;
    const logScale = Math.log2(1 + roundRatio);
    return Math.round(basePoints * logScale);
  }

  endGameInProgress(gameState: GeneralGameState) {
    this.updateGameStatus(gameState, GameStatus.FINISHED);

    this.evaluateCorrectPlayerAnswers(gameState);
  }

  updateGameStatus(gameState: GeneralGameState, gameStatus: GameStatus) {
    console.log(
      `gameStatus changed - GameId: ${gameState.gameId}, OldState: ${gameState.gameStatus}, NewState: ${gameStatus}`,
    );
    gameState.gameStatus = gameStatus;
  }

  private evaluateCorrectPlayerAnswers(gameState: GeneralGameState) {
    gameState.playerSpecificGameState.forEach((playerGameState) => {
      let correctAnswerCount = 0;
      playerGameState.allAnswers.forEach((questionWithAnswer) => {
        correctAnswerCount += questionWithAnswer.calculatedPoints;
      });

      gameState.endGameState.push({
        player: playerGameState.player.name,
        points: correctAnswerCount,
        answeredInSeconds:
          gameState.maxRoundTime - playerGameState.remainingSeconds,
        allAnswers: [...playerGameState.allAnswers.values()],
      });

      gameState.endGameState.sort((a, b) => a.points + b.points);
    });
  }

  startNewRound(gameState: GeneralGameState) {
    gameState.currentRound++;
    gameState.currentQuestionTimer = gameState.maxRoundTime;
    gameState.currentQuestion = this.getRandomQuestion(gameState);
    gameState.playerSpecificGameState.forEach((it) => {
      it.answerText = '';
      it.currentAnswerId = -1;
    });
  }

  getHello(): { message: string; serverTime: string } {
    return { message: 'Hello World! ', serverTime: new Date().toISOString() };
  }

  createNewGame(newGame: NewGame): NewGame {
    if (this.globalGameState.has(newGame.gameId)) {
      throw new Error('Game already exist.');
    }

    return this.initializeGeneralGameState(newGame);
  }

  getGeneralGameStateAllAnswers(
    playerId: string,
    gameId: string,
  ): EndGameAnswers[] {
    const gameState = this.getGameStateOrFail(gameId);

    const questionMap = new Map<
      string,
      {
        playerName: string;
        answerText: string;
        points: number;
        answeredInSeconds: number;
      }[]
    >();

    gameState.playerSpecificGameState.forEach((playerGameState) => {
      playerGameState.allAnswers.forEach((answer) => {
        const questionText = answer.originalQuestion.text;

        if (!questionMap.has(questionText)) {
          questionMap.set(questionText, []);
        }

        questionMap.get(questionText)?.push({
          playerName: playerGameState.player.name,
          answerText: answer.answerText || 'No answer provided',
          points: answer.calculatedPoints,
          answeredInSeconds: answer.answeredInSeconds,
        });
      });
    });

    return Array.from(questionMap.entries()).map(
      ([questionText, questionAnswers]) => ({
        questionText,
        questionAnswers,
      }),
    );
  }

  private quickRoundEnded(gameState: GeneralGameState): boolean {
    if (gameState?.quickRoundActive) {
      return Array.from(gameState?.playerSpecificGameState.values()).every(
        (player) => player.currentAnswerId !== -1,
      );
    } else {
      return false;
    }
  }

  getPlayerLogin(gameId: string, playerId: string): Player {
    const gameState = this.getGameStateOrFail(gameId);
    return gameState.playerSpecificGameState.get(playerId)!.player;
  }
}

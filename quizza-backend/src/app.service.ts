// app.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  EndGameAnswers,
  EnumQuestionTypes,
  EstimationDetails,
  EstimationDetailsReduced,
  GameId,
  GameStatus,
  GeneralGameState,
  GeneralGameStateReduced,
  MultipleChoiceDetails,
  MultipleChoiceDetailsReduced,
  NewGame,
  Player,
  PlayerGameState,
  PlayerId,
  PlayerVote,
  Question,
  QuestionId,
  QuestionReduced,
  QuestionWithAnswer,
} from './models/backendmodels';
import { questions } from './models/static-questions';
import { EventsGateway } from './events/events.gateway';

@Injectable()
export class AppService {
  globalGameState = new Map<GameId, GeneralGameState>();

  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private readonly eventsGateway: EventsGateway,
  ) {}

  onModuleInit() {
    this.startGameStateUpdateLoop();
  }

  startGameStateUpdateLoop() {
    setInterval(() => {
      this.updateGame();
    }, 1000);
  }

  answerQuestionForPlayer(gameId: GameId, playerId: PlayerId, answerPayload: string) {
    const gameState = this.getGameStateOrFail(gameId);
    const playerGameState = this.getPlayerSpecificGameStateOrFail(gameState, playerId);

    if (gameState.currentQuestion) {
      playerGameState.currentSubmittedPayload = answerPayload;
      playerGameState.remainingSeconds = gameState.currentQuestionTimer;

      if (gameState.currentQuestion.questionType === EnumQuestionTypes.MultipleChoice) {
        const mcDetails = gameState.currentQuestion.details as MultipleChoiceDetails;
        const answerId = parseInt(answerPayload, 10);
        playerGameState.currentAnswerDisplayTest =
          mcDetails.answers.find((a) => a.answerId === answerId)?.answerText || 'Answer Unknown';
      } else if (gameState.currentQuestion.questionType === EnumQuestionTypes.Estimation) {
        playerGameState.currentAnswerDisplayTest = answerPayload;
      }

      gameState.playerSpecificGameState.set(playerId, playerGameState);
      this.eventsGateway.broadcastAnsweredPlayers(gameId);
    }
    this.debugGameState(gameId);
  }

  voteStartPlayer(gameId: GameId, playerId: PlayerId, voteStart: boolean) {
    const gameState = this.globalGameState.get(gameId);
    const playerGameState = gameState?.playerSpecificGameState.get(playerId);
    const pregameState = gameState?.preGameState;

    if (gameState && playerGameState && pregameState) {
      pregameState.playerVotes.set(playerGameState.player.id, {
        playerName: playerGameState.player.name, // Ensure this uses player.name if playerId is UUID
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
    if (gameState) return gameState;
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
    gameState.playerSpecificGameState.forEach((pgs) => playerNames.push(pgs.player.name));
    if (gameState.preGameState) {
      gameState.preGameState.playerNames = playerNames;
    }
  }

  initializePlayerGameState(player: Player, gameId: GameId) {
    const gameState = this.getGameStateOrFail(gameId);
    const doesPlayerNameExist = !Array.from(gameState.playerSpecificGameState.values()).find(
      (it) => it.player.name === player.name,
    );

    if (!doesPlayerNameExist) {
      throw Error('Playername already taken.');
    }

    if (!gameState.playerSpecificGameState.has(player.id)) {
      gameState.playerSpecificGameState.set(player.id, {
        player: player,
        allAnswers: new Map<QuestionId, QuestionWithAnswer>(),
        remainingSeconds: -1,
        // currentSubmittedPayload and currentAnswerDisplayTest are set on answer
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
    playerId: PlayerId, // playerId is not used here, but kept for API consistency
    gameId: GameId,
  ): GeneralGameStateReduced {
    const gameState = this.getGameStateOrFail(gameId);

    let reducedQuestionData: QuestionReduced | undefined = undefined;
    if (gameState.currentQuestion) {
      const q = gameState.currentQuestion;
      const commonData = {
        id: q.id,
        category: q.category,
        questionType: q.questionType,
      };

      if (q.questionType === EnumQuestionTypes.MultipleChoice) {
        const details = q.details as MultipleChoiceDetails;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { correctAnswerId, ...safeDetails } = details;
        reducedQuestionData = {
          ...commonData,
          details: safeDetails as MultipleChoiceDetailsReduced,
        };
      } else if (q.questionType === EnumQuestionTypes.Estimation) {
        const details = q.details as EstimationDetails;

        const { correctAnswerValue, toleranceBelowPercent, toleranceAbovePercent, ...safeDetails } =
          details;
        reducedQuestionData = {
          ...commonData,
          details: safeDetails as EstimationDetailsReduced,
        };
      }
    }

    const { currentQuestion, playerSpecificGameState, ...restOfGameState } = gameState;

    return {
      ...restOfGameState,
      currentQuestion: reducedQuestionData,
      preGameState: gameState.preGameState
        ? {
            howManyHaveVoted: gameState.preGameState.howManyHaveVoted,
            playerNames: gameState.preGameState.playerNames,
            playerVotes: Array.from(gameState.preGameState.playerVotes.values()),
          }
        : undefined,
    };
  }

  getRandomQuestion(gameState: GeneralGameState): Question {
    const availableQuestions = questions.filter((q) => !gameState.allQuestionIds.includes(q.id));

    if (availableQuestions.length === 0) {
      throw new Error('No more questions available.');
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const randomQuestion = availableQuestions[randomIndex];
    gameState.allQuestionIds.push(randomQuestion.id); // Mark as used for this game
    return randomQuestion;
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
    gameState.preGameState.playerVotes.forEach((vote) => {
      if (vote.voteStart) howManyVotedYes++;
    });

    gameState.preGameState.howManyHaveVoted = howManyVotedYes;

    if (
      gameState.playerSpecificGameState.size > 0 && // Ensure there's at least one player
      gameState.playerSpecificGameState.size === howManyVotedYes
    ) {
      this.endPreGame(gameState);
    }
  }

  updateGameInProgress(gameState: GeneralGameState, gameId: GameId) {
    gameState.currentQuestionTimer--;

    if (gameState.currentQuestionTimer <= 0 || this.quickRoundEnded(gameState)) {
      this.persistCurrentRound(gameState);
      if (gameState.currentRound >= gameState.maxRounds) {
        // Use >= for safety
        this.endGameInProgress(gameState);
      } else {
        this.startNewRound(gameState);
      }
      this.debugGameState(gameId);
    }
  }

  persistCurrentRound(gameState: GeneralGameState) {
    if (!gameState.currentQuestion) {
      return;
    }

    const currentQ = gameState.currentQuestion;

    gameState.playerSpecificGameState.forEach((playerGameState) => {
      let answeredQuestion: QuestionWithAnswer | undefined = undefined;

      let isCorrectOrWithinTolerance = false;
      let points = 0;
      let displayedAnswer = playerGameState.currentAnswerDisplayTest || 'No answer';
      let submittedNumericVal: number | undefined;
      let correctNumericVal: number | undefined;
      let deviation: number | undefined;

      const submittedPayload = playerGameState.currentSubmittedPayload;

      switch (currentQ.questionType) {
        case EnumQuestionTypes.MultipleChoice: {
          const mcDetails = currentQ.details as MultipleChoiceDetails;
          const submittedAnswerId = submittedPayload ? parseInt(submittedPayload, 10) : -1;
          isCorrectOrWithinTolerance = submittedAnswerId === mcDetails.correctAnswerId;
          points = isCorrectOrWithinTolerance ? 100 : 0; // Base points for correctness
          displayedAnswer =
            mcDetails.answers.find((a) => a.answerId === submittedAnswerId)?.answerText ||
            'Invalid Answer';

          const finalPoints = this.calculatePoints(
            gameState.currentRound,
            gameState.maxRounds,
            gameState.quickRoundActive && playerGameState.remainingSeconds > 0
              ? playerGameState.remainingSeconds
              : points,
          );

          answeredQuestion = {
            id: currentQ.id,
            questionType: currentQ.questionType,
            originalQuestionDetails: currentQ.details,
            submittedPayload: playerGameState.currentSubmittedPayload || '',
            displayedAnswer: displayedAnswer,
            isCorrectOrWithinTolerance: isCorrectOrWithinTolerance,
            calculatedPoints: Math.round(finalPoints),
            answeredInSeconds: gameState.maxRoundTime - playerGameState.remainingSeconds,
            correctNumericAnswer: correctNumericVal,
            submittedNumericAnswer: submittedNumericVal,
            deviationPercent: deviation,
          };
          break;
        }
        case EnumQuestionTypes.Estimation: {
          const estDetails = currentQ.details as EstimationDetails;
          correctNumericVal = estDetails.correctAnswerValue;
          if (submittedPayload) {
            submittedNumericVal = parseFloat(submittedPayload);
            if (!isNaN(submittedNumericVal)) {
              displayedAnswer = submittedPayload;
              const lowerBound =
                estDetails.correctAnswerValue * (1 - estDetails.toleranceBelowPercent / 100);
              const upperBound =
                estDetails.correctAnswerValue * (1 + estDetails.toleranceAbovePercent / 100);

              if (submittedNumericVal >= lowerBound && submittedNumericVal <= upperBound) {
                isCorrectOrWithinTolerance = true;
                let proximityScore = 0;
                if (submittedNumericVal === estDetails.correctAnswerValue) {
                  proximityScore = 1;
                } else if (submittedNumericVal < estDetails.correctAnswerValue) {
                  // Avoid division by zero if correctAnswerValue is at the lower bound (unlikely with percent tolerance)
                  const range = estDetails.correctAnswerValue - lowerBound;
                  proximityScore =
                    range > 0
                      ? (submittedNumericVal - lowerBound) / range
                      : submittedNumericVal === lowerBound
                        ? 0
                        : 1;
                } else {
                  // submittedNumericVal > estDetails.correctAnswerValue
                  // Avoid division by zero if correctAnswerValue is at the upper bound
                  const range = upperBound - estDetails.correctAnswerValue;
                  proximityScore =
                    range > 0
                      ? (upperBound - submittedNumericVal) / range
                      : submittedNumericVal === upperBound
                        ? 0
                        : 1;
                }
                // Ensure proximityScore is between 0 and 1
                proximityScore = Math.max(0, Math.min(1, proximityScore));
                points = 100 * Math.pow(proximityScore, 2); // Max 100 points, exponential based on proximity (exponent 2)
                if (estDetails.correctAnswerValue !== 0) {
                  deviation =
                    (Math.abs(submittedNumericVal - estDetails.correctAnswerValue) /
                      estDetails.correctAnswerValue) *
                    100;
                } else {
                  deviation = submittedNumericVal === 0 ? 0 : Infinity;
                }
              }
            } else {
              displayedAnswer = 'Invalid number';
            }
          } else {
            displayedAnswer = 'No answer';
          }
          const finalPoints = this.calculatePoints(
            gameState.currentRound,
            gameState.maxRounds,
            gameState.quickRoundActive && playerGameState.remainingSeconds > 0
              ? playerGameState.remainingSeconds
              : points,
          );

          answeredQuestion = {
            id: currentQ.id,
            questionType: currentQ.questionType,
            originalQuestionDetails: currentQ.details,
            submittedPayload: playerGameState.currentSubmittedPayload || '',
            displayedAnswer: displayedAnswer,
            isCorrectOrWithinTolerance: isCorrectOrWithinTolerance,
            calculatedPoints: Math.round(finalPoints),
            answeredInSeconds: gameState.maxRoundTime - playerGameState.remainingSeconds,
            correctNumericAnswer: correctNumericVal,
            submittedNumericAnswer: submittedNumericVal,
            deviationPercent: deviation,
          };

          break;
        }
      }

      // const answeredQuestion: QuestionWithAnswer = {
      //   id: currentQ.id,
      //   questionType: currentQ.questionType,
      //   originalQuestionDetails: currentQ.details,
      //   submittedPayload: playerGameState.currentSubmittedPayload || '',
      //   displayedAnswer: displayedAnswer,
      //   isCorrectOrWithinTolerance: isCorrectOrWithinTolerance,
      //   calculatedPoints: Math.round(finalPoints),
      //   answeredInSeconds: gameState.maxRoundTime - playerGameState.remainingSeconds,
      //   correctNumericAnswer: correctNumericVal,
      //   submittedNumericAnswer: submittedNumericVal,
      //   deviationPercent: deviation,
      // };
      playerGameState.allAnswers.set(currentQ.id, answeredQuestion);
    });
  }

  calculatePoints(currentRound: number, maxRounds: number, basePoints: number): number {
    if (basePoints <= 0) return 0;
    const roundRatio = currentRound / maxRounds;
    const logScale = 1 + Math.log2(1 + roundRatio * 2);
    return basePoints * logScale;
  }

  endGameInProgress(gameState: GeneralGameState) {
    this.updateGameStatus(gameState, GameStatus.FINISHED);
    this.evaluatePlayerScores(gameState);
  }

  updateGameStatus(gameState: GeneralGameState, gameStatus: GameStatus) {
    console.log(
      `gameStatus changed - GameId: ${gameState.gameId}, OldState: ${gameState.gameStatus}, NewState: ${gameStatus}`,
    );
    gameState.gameStatus = gameStatus;
  }

  startNewRound(gameState: GeneralGameState) {
    gameState.currentRound++;
    gameState.currentQuestionTimer = gameState.maxRoundTime;
    gameState.currentQuestion = this.getRandomQuestion(gameState);
    gameState.playerSpecificGameState.forEach((it) => {
      it.currentSubmittedPayload = undefined;
      it.currentAnswerDisplayTest = undefined;
      it.remainingSeconds = gameState.maxRoundTime;
    });
    this.eventsGateway.broadcastAnsweredPlayers(gameState.gameId);
  }

  getHello(): { message: string; serverTime: string } {
    return { message: 'Hello World! ', serverTime: new Date().toISOString() };
  }

  createNewGame(newGame: NewGame): NewGame {
    if (this.globalGameState.has(newGame.gameId)) {
      throw new Error('Game already exist.');
    }
    this.initializeGeneralGameState(newGame);
    return newGame;
  }

  getGeneralGameStateAllAnswers(playerId: string, gameId: string): EndGameAnswers[] {
    const gameState = this.getGameStateOrFail(gameId);
    const allQuestionsAskedInGame = questions.filter((q) =>
      gameState.allQuestionIds.includes(q.id),
    );

    return allQuestionsAskedInGame.map((question) => {
      let correctAnswerDisplay = '';

      switch (question.questionType) {
        case EnumQuestionTypes.MultipleChoice: {
          const details = question.details as MultipleChoiceDetails;
          correctAnswerDisplay =
            details.answers.find((a) => a.answerId === details.correctAnswerId)?.answerText ||
            'N/A';
          break;
        }
        case EnumQuestionTypes.Estimation: {
          const details = question.details as EstimationDetails;
          correctAnswerDisplay = details.correctAnswerValue.toString();
          break;
        }
      }

      const questionAnswers: EndGameAnswers['questionAnswers'] = [];
      gameState.playerSpecificGameState.forEach((playerState) => {
        const playerAnswer = playerState.allAnswers.get(question.id);
        if (playerAnswer) {
          questionAnswers.push({
            playerName: playerState.player.name,
            answerText: playerAnswer.displayedAnswer,
            points: playerAnswer.calculatedPoints,
            answeredInSeconds: playerAnswer.answeredInSeconds,
          });
        } else {
          questionAnswers.push({
            // Player might not have answered if round timed out before they did
            playerName: playerState.player.name,
            answerText: 'No answer submitted',
            points: 0,
            answeredInSeconds: gameState.maxRoundTime,
          });
        }
      });

      return {
        questionText: question.details.questionText, // Common field
        questionType: question.questionType,
        correctAnswerDisplay,
        questionAnswers,
      };
    });
  }

  getPlayerLogin(gameId: string, playerId: string): Player {
    const gameState = this.getGameStateOrFail(gameId);
    return gameState.playerSpecificGameState.get(playerId)!.player;
  }

  getPlayersWhoAnswered(gameId: GameId): string[] {
    const gameState = this.getGameStateOrFail(gameId);
    if (!gameState.currentQuestion) return [];

    return Array.from(gameState.playerSpecificGameState.values())
      .filter((playerState) => !!playerState.currentSubmittedPayload) // Check if payload exists
      .map((playerState) => playerState.player.name);
  }

  private endPreGame(gameState: GeneralGameState) {
    this.updateGameStatus(gameState, GameStatus.IN_PROGRESS);
    gameState.currentQuestion = this.getRandomQuestion(gameState);
    gameState.allQuestionIds.push(gameState.currentQuestion.id); // Mark as used
    gameState.playerSpecificGameState.forEach(
      (pgs) => (pgs.remainingSeconds = gameState.maxRoundTime),
    );
  }

  private evaluatePlayerScores(gameState: GeneralGameState) {
    gameState.playerSpecificGameState.forEach((playerGameState) => {
      let totalPoints = 0;
      let totalAnsweredInSeconds = 0;
      const answersList: QuestionWithAnswer[] = [];

      playerGameState.allAnswers.forEach((questionWithAnswer) => {
        totalPoints += questionWithAnswer.calculatedPoints;
        totalAnsweredInSeconds += questionWithAnswer.answeredInSeconds;
        answersList.push(questionWithAnswer);
      });

      gameState.endGameState.push({
        player: playerGameState.player.name,
        points: totalPoints,
        answeredInSeconds: answersList.length > 0 ? totalAnsweredInSeconds / answersList.length : 0,
        allAnswers: answersList,
      });
    });
    gameState.endGameState.sort((a, b) => b.points - a.points); // Sort descending by points
  }

  private quickRoundEnded(gameState: GeneralGameState): boolean {
    if (gameState.quickRoundActive && gameState.playerSpecificGameState.size > 0) {
      return Array.from(gameState.playerSpecificGameState.values()).every(
        (player) => !!player.currentSubmittedPayload, // Check if a payload has been submitted
      );
    }
    return false;
  }
}

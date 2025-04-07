import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AnswerId, GameId, GeneralGameState, Player, PlayerGameState, PlayerId, Question, QuestionId, QuestionWithAnswer } from './models/backendmodels';
import { questions } from './models/static-questions';

@Injectable()
export class AppService {

  onModuleInit() {
    this.startGameStateUpdateLoop();
  }

  generalGameState = new Map<GameId, GeneralGameState>();

  answerQuestionForPlayer(gameId: GameId, playerName: PlayerId, answerId: AnswerId) {
    const gameState = this.generalGameState.get(gameId);
    const playerGameState = gameState?.playerSpecificGameState.get(playerName);

    if (gameState && playerGameState) {
      // TODO check if the answerId is valid for the current question
      playerGameState.currentAnswerId = answerId;

      gameState?.playerSpecificGameState.set(playerName, playerGameState);
      this.generalGameState.set(gameId, gameState);
    }


    
    this.debugGameState(gameId);
  }

  debugGameState(gameId: GameId) {
    const test = this.generalGameState.get(gameId)

    console.log("---START---");
    console.log("SpielerCount" + test?.playerSpecificGameState.size);
    test?.playerSpecificGameState.forEach(element => {
      console.log(element.player.name);
      console.log(element);
    });
    console.log("---END---");
  }


  login(playerName: string, gameId: GameId): Player {
    const uuid = crypto.randomUUID();
    const player = { name: playerName, id: uuid };

    if (!this.generalGameState.has(gameId)) {
      this.initializeGeneralGameState(player, gameId);
    } else {
      this.initializePlayerGameState(player, gameId);
    }

    return player;
  }

  initializePlayerGameState(player: Player, gameId: GameId) {
    console.log("initializePlayerGameState", player, gameId);
    const gameState = this.generalGameState.get(gameId);

    if (!gameState?.playerSpecificGameState.has(player.id)) {
      gameState?.playerSpecificGameState.set(player.id, {
        player: player,
        currentAnswerId: -1,
        allAnswers: new Map<QuestionId, QuestionWithAnswer>()
      });
    }
  }


  initializeGeneralGameState(player: Player, gameId: GameId) {
    const newGame = new Map<PlayerId, PlayerGameState>();
    newGame.set(player.id, {
      player: player,
      currentAnswerId: -1,
      allAnswers: new Map<QuestionId, QuestionWithAnswer>()
    });

    const gameState: GeneralGameState = {
      gameId: gameId,
      roundTime: 20,
      currentQuestionTimer: 20,
      currentQuestion: this.getRandomQuestion(),
      playerSpecificGameState: newGame
    };

    this.generalGameState.set(gameId, gameState);
  }

  getGeneralGameState(playerId: PlayerId, gameId: GameId): GeneralGameState {
    const gameState = this.generalGameState.get(gameId);

    // TODO Sanitize this output to never show the answers of the other teams, besides the request is Admin
    return this.generalGameState.get(gameId)!;
  }

  getRandomQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  startGameStateUpdateLoop() {
    setInterval(() => {
      this.updateGameStates();
    }, 1000); // Runs every 1000ms (1 second)
  }

  updateGameStates() {
    this.generalGameState.forEach((gameState, gameId) => {
      gameState.currentQuestionTimer--;

      if (gameState.currentQuestionTimer <= 0) {
        gameState.currentQuestionTimer = 20;

        gameState.currentQuestion = this.getRandomQuestion();
      }
    });
  }


  getHello(): { message: string, serverTime: string } {
    return { message: 'Hello World! ', serverTime: new Date().toISOString() };
  }
}

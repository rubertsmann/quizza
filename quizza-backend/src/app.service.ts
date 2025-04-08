import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AnswerId, EndGameState, GameId, GameState, GameStatus, GeneralGameState, Player, PlayerGameState, PlayerId, PlayerVote, PreGameState, Question, QuestionId, QuestionWithAnswer } from './models/backendmodels';
import { questions } from './models/static-questions';

@Injectable()
export class AppService {

  onModuleInit() {
    this.startGameStateUpdateLoop();
  }

  globalGameState = new Map<GameId, GeneralGameState>();

  answerQuestionForPlayer(gameId: GameId, playerName: PlayerId, answerId: AnswerId) {
    const gameState = this.globalGameState.get(gameId);
    const playerGameState = gameState?.playerSpecificGameState.get(playerName);

    if (gameState && playerGameState) {
      // TODO check if the answerId is valid for the current question
      playerGameState.currentAnswerId = answerId;

      gameState?.playerSpecificGameState.set(playerName, playerGameState);
      this.globalGameState.set(gameId, gameState);
    }
    
    this.debugGameState(gameId);
  }

  voteStartPlayer(gameId: GameId, playerName: PlayerId, voteStart: boolean) {
    const gameState = this.globalGameState.get(gameId);
    const playerGameState = gameState?.playerSpecificGameState.get(playerName);

    if (gameState && playerGameState) {
      gameState.preGameState.playerVotes.set(playerGameState.player.id, {playerName: playerName, voteStart})
      this.globalGameState.set(gameId, gameState);
    }

    
    
    this.debugGameState(gameId);
  }

  debugGameState(gameId: GameId) {
    const test = this.globalGameState.get(gameId)

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

    if (!this.globalGameState.has(gameId)) {
      this.initializeGeneralGameState(player, gameId);
    } else {
      this.initializePlayerGameState(player, gameId);
    }

    this.updatePreGamePlayerList(player, gameId)
    return player;
  }

  updatePreGamePlayerList(player: Player, gameId: GameId) {
    const gameState = this.globalGameState.get(gameId);

    if(gameState) {
      const playerNames: string[] = [];
      gameState?.playerSpecificGameState.forEach((playerGameState) => {
        playerNames.push(playerGameState.player.name);
      });
  
      gameState.preGameState.playerNames = playerNames;
    }
    
  }

  initializePlayerGameState(player: Player, gameId: GameId) {
    console.log("initializePlayerGameState", player, gameId);
    const gameState = this.globalGameState.get(gameId);

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
      gameStatus: GameStatus.PRE_GAME,
      roundTime: 20,
      currentRound: 1,
      maxRounds: 3,
      currentQuestionTimer: 20,
      currentQuestion: this.getRandomQuestion(),
      playerSpecificGameState: newGame,
      endGameState: [],
      preGameState: {
        playerNames: [],
        howManyHaveVoted: 0,
        playerVotes: new Map<PlayerId, PlayerVote>()
      }
    };

    this.globalGameState.set(gameId, gameState);
  }

  getGeneralGameState(playerId: PlayerId, gameId: GameId): GeneralGameState {
    const gameState = this.globalGameState.get(gameId);

    // TODO Sanitize this output to never show the answers of the other teams, besides the request is Admin
    return this.globalGameState.get(gameId)!;
  }

  getRandomQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  startGameStateUpdateLoop() {
    setInterval(() => {
      this.updateGame();
    }, 1000); // Runs every 1000ms (1 second)
  }

  updateGame() {
    this.globalGameState.forEach((gameState, gameId) => {
      if(gameState.gameStatus === GameStatus.PRE_GAME) {
        this.updatePreGame(gameState, gameId);
      }

      if(gameState.gameStatus === GameStatus.IN_PROGRESS) {
        this.updateGameInProgress(gameState, gameId);
      }
    });
  }

  updatePreGame(gameState: GeneralGameState, gameId: GameId) {
    let howManyVotedYes = 0;
    gameState.preGameState.playerVotes.forEach((playerGameState) => {  
      playerGameState.voteStart ? howManyVotedYes++ : howManyVotedYes--;
    });

    gameState.preGameState.howManyHaveVoted = howManyVotedYes;

    if(gameState.playerSpecificGameState.size === howManyVotedYes) {
      gameState.gameStatus = GameStatus.IN_PROGRESS;
    }
  }

  updateGameInProgress(gameState: GeneralGameState, gameId: GameId) {
    gameState.currentQuestionTimer--;

    //TODO Probably change this logic according to the game mode.
    if (gameState.currentQuestionTimer <= 0) {
      
      this.persistCurrentRound(gameState, gameId);
    
      if(gameState.currentRound == gameState.maxRounds) { 
        this.endGame(gameState);
      } else {
        this.startNewRound(gameState);
      }
      
      this.debugGameState(gameId);
    }
  }
  
  persistCurrentRound(gameState: GeneralGameState, gameId: GameId) {
    this.globalGameState.get(gameId)?.playerSpecificGameState.forEach((playerGameState) => {
      const answeredQuestion: QuestionWithAnswer = {
        id: gameState.currentQuestion.id,
        answerId: playerGameState.currentAnswerId,
        isCorrectAnswer: playerGameState.currentAnswerId === gameState.currentQuestion.correctAnswerId
      }

      playerGameState.allAnswers.set(gameState.currentQuestion.id, answeredQuestion);
    });
  }

  endGame(gameState: GeneralGameState) { 
    console.log("Game finished!");
    gameState.gameStatus = GameStatus.FINISHED;

    gameState.playerSpecificGameState.forEach((playerGameState) => {
      let correctAnswerCount = 0;
      //TODO fix this count
      playerGameState.allAnswers.forEach((questionWithAnswer) => {
        questionWithAnswer.isCorrectAnswer ? correctAnswerCount++ : null;
      });

      gameState.endGameState.push({
        player: playerGameState.player,
        points: correctAnswerCount,
      });
    });
  }

  startNewRound(gameState: GeneralGameState) {
    gameState.currentRound++;  
    gameState.currentQuestionTimer = 20;
    gameState.currentQuestion = this.getRandomQuestion();
  }

  getHello(): { message: string, serverTime: string } {
    return { message: 'Hello World! ', serverTime: new Date().toISOString() };
  }
}

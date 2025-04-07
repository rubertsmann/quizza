import { Injectable } from '@nestjs/common';
import { questions } from './models/static-questions';

@Injectable()
export class AppService {

  onModuleInit() {
    this.startGameStateUpdateLoop();
  }


  playerSpecificGameState = new Map<string, GameState>();

  answerQuestionForPlayer(playerName: string, answerId: string) {
    const gameState = this.playerSpecificGameState.get(playerName);
    if (!gameState) return;

    gameState.currentQuestion.selectedAnswerId = parseInt(answerId);
    gameState.currentAnswer = answerId;

    this.playerSpecificGameState.set(playerName, gameState);

    console.log(this.playerSpecificGameState.get(playerName));
  }

  login(playerName: string, gameId: string): Login {
    // TODO - implement login logic
    return { playerName: playerName, playerToken: gameId + "-token" };
  }

  getHello(): { message: string, serverTime: string } {
    return { message: 'Hello World! ', serverTime: new Date().toISOString() };
  }

  //Replace with actual game state
  getGameState(playerName: string): GameState {

    // get from store by playerToken a player can only be in a single game;

    if (!this.playerSpecificGameState.has(playerName)) {
      this.playerSpecificGameState.set(playerName, this.createGameState());
    }

    return this.playerSpecificGameState.get(playerName)!;
  }

  createGameState(): GameState {
    return {
      gameId: "1234",
      playerId: 1,
      playerName: "John Doe",
      currentQuestion: this.getRandomQuestion(),
      currentQuestionTimer: 20,
      currentAnswer: ""
    }
  }

  getRandomQuestion(): Omit<Question, "correctAnswer"> {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  startGameStateUpdateLoop() {
    setInterval(() => {
      this.updateGameStates();
    }, 1000); // Runs every 1000ms (1 second)
  }

  updateGameStates() {
    this.playerSpecificGameState.forEach((gameState, playerName) => {
      // Example: Update the current question to a random one
      if(gameState.currentQuestionTimer <= 0) {
      gameState.currentQuestionTimer = 20;
      gameState.currentQuestion = this.getRandomQuestion();
      } else {
        gameState.currentQuestionTimer--;
      }

      this.playerSpecificGameState.set(playerName, gameState);

      console.log(`Updated game state for player: ${playerName}`);
    });
  }
}

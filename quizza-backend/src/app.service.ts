import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

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
      currentQuestion: {
        id: 1,
        question: "What is the capital of France?",
        answers: [
          { answerId: 1, answerText: "Paris" },
          { answerId: 2, answerText: "London" },
          { answerId: 3, answerText: "Berlin" },
          { answerId: 4, answerText: "Madrid" }
        ],
        selectedAnswerId: 0
      },
      currentAnswer: ""
    }
  }
}

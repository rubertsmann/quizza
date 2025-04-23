import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameStatus } from '../../models/backendmodels-copy';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-general-game-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-state-container">
      <h2>General Game State</h2>
      <ng-container
        *ngIf="
          this.gameStateService.gameState$ | async as gameState;
          else loading
        "
      >
        <div class="section">
          <h3>Core Info</h3>
          <p><strong>Game ID:</strong> {{ gameState.gameId }}</p>
          <p><strong>Status:</strong> {{ gameState.gameStatus }}</p>
          <p>
            <strong>Round:</strong> {{ gameState.currentRound }} /
            {{ gameState.maxRounds }}
          </p>
          <p>
            <strong>Round Time Limit:</strong> {{ gameState.maxRoundTime }}s
          </p>
          <p>
            <strong>Current Round Time Remaining:</strong>
            {{ gameState.roundTime }}s
          </p>
        </div>

        <!-- Current Question -->
        <div class="section" *ngIf="gameState.currentQuestion">
          <h3>Current Question (ID: {{ gameState.currentQuestion.id }})</h3>
          <p>
            <strong>Category:</strong> {{ gameState.currentQuestion.category }}
          </p>
          <p>
            <strong>Question:</strong> {{ gameState.currentQuestion.question }}
          </p>
          <p><strong>Timer:</strong> {{ gameState.currentQuestionTimer }}s</p>
          <h4>Answers:</h4>
          <ul class="scrollable-list small-list">
            <li *ngFor="let answer of gameState.currentQuestion.answers">
              ({{ answer.answerId }}) {{ answer.answerText }}
            </li>
          </ul>
        </div>
        <div class="section" *ngIf="!gameState.currentQuestion">
          <p>Waiting for next question...</p>
        </div>

        <!-- Pre Game State -->
        <div class="section" *ngIf="gameState.preGameState">
          <h3>Pre-Game Lobby</h3>
          <p>
            <strong>Votes to Start:</strong>
            {{ gameState.preGameState.howManyHaveVoted }}
          </p>
          <h4>Players in Lobby:</h4>
          <ul class="scrollable-list small-list">
            <li *ngFor="let name of gameState.preGameState.playerNames">
              {{ name }}
            </li>
          </ul>
          <h4>Player Votes (Vote Start?):</h4>
          <ul class="scrollable-list small-list">
            <!-- Use keyvalue pipe to iterate over the map -->
            <li
              *ngFor="
                let voteEntry of gameState.preGameState.playerVotes | keyvalue
              "
            >
              {{ voteEntry.value.playerName }} (ID: {{ voteEntry.key }}):
              {{ voteEntry.value.voteStart }}
            </li>
          </ul>
        </div>

        <!-- Player Specific States -->
        <div class="section" *ngIf="gameState.playerSpecificGameState.size > 0">
          <h3>Player States</h3>
          <div class="scrollable-list player-state-list">
            <!-- Use keyvalue pipe to iterate over the map -->
            <div
              *ngFor="
                let playerEntry of gameState.playerSpecificGameState | keyvalue
              "
              class="player-state-item"
            >
              <h4>
                {{ playerEntry.value.player.name }} (ID: {{ playerEntry.key }})
              </h4>
              <p>
                <strong>Current Answer ID:</strong>
                {{ playerEntry.value.currentAnswerId }}
              </p>
              <h5>All Answers:</h5>
              <ul
                *ngIf="
                  playerEntry.value.allAnswers.size > 0;
                  else noAnswersPlayer
                "
              >
                <!-- Iterate over inner map -->
                <li
                  *ngFor="
                    let answerEntry of playerEntry.value.allAnswers | keyvalue
                  "
                >
                  Q{{ answerEntry.key }}: A{{ answerEntry.value.answerId }} ({{
                    answerEntry.value.isCorrectAnswer ? 'Correct' : 'Incorrect'
                  }}, {{ answerEntry.value.calculatedPoints }} pts) - Q:
                  {{ answerEntry.value.originalQuestion.text }} -> A:
                  {{
                    answerEntry.value.originalQuestion.answerText?.answerText ??
                      'N/A'
                  }}
                </li>
              </ul>
              <ng-template #noAnswersPlayer
                ><p>No answers recorded yet.</p></ng-template
              >
            </div>
          </div>
        </div>

        <!-- End Game State -->
        <div
          class="section"
          *ngIf="gameState.endGameState && gameState.endGameState.length > 0"
        >
          <h3>Final Results</h3>
          <ul class="scrollable-list end-game-list">
            <li
              *ngFor="let endState of gameState.endGameState"
              class="end-state-item"
            >
              <h4>{{ endState.player.name }} (ID: {{ endState.player.id }})</h4>
              <p><strong>Total Points:</strong> {{ endState.points }}</p>
              <h5>Answers:</h5>
              <ul *ngIf="endState.allAnswers.length > 0; else noAnswersEnd">
                <!-- Iterate over inner map -->
                <li *ngFor="let answerEntry of endState.allAnswers">
                  Q{{ answerEntry }}: A{{ answerEntry.answerId }} ({{
                    answerEntry.isCorrectAnswer ? 'Correct' : 'Incorrect'
                  }}, {{ answerEntry.calculatedPoints }} pts) - Q:
                  {{ answerEntry.originalQuestion.text }} -> A:
                  {{
                    answerEntry.originalQuestion.answerText?.answerText ?? 'N/A'
                  }}
                </li>
              </ul>
              <ng-template #noAnswersEnd
                ><p>No answers recorded.</p></ng-template
              >
            </li>
          </ul>
        </div>
      </ng-container>

      <!-- Loading indicator -->
      <ng-template #loading>
        <p class="loading-message">Waiting for game state data...</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: sans-serif;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      .game-state-container {
        max-width: 800px;
        margin: auto;
      }

      h2,
      h3,
      h4,
      h5 {
        margin-bottom: 0.5em;
      }
      h2 {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }

      .section {
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      p {
        margin: 0.3em 0;
        line-height: 1.4;
      }

      .scrollable-list {
        list-style: none;
        padding: 0;
        margin: 10px 0;
        max-height: 200px;
        overflow-y: auto;
        border-radius: 3px;
        padding: 10px;
      }

      /* Smaller height for less critical lists */
      .small-list {
        max-height: 120px;
      }

      .scrollable-list li,
      .player-state-item,
      .end-state-item {
        padding: 8px;
        border-bottom: 1px solid #eee;
      }

      .scrollable-list li:last-child,
      .player-state-item:last-child,
      .end-state-item:last-child {
        border-bottom: none;
      }

      .player-state-item,
      .end-state-item {
        margin-bottom: 10px;
        border-radius: 3px;
      }

      .player-state-item h4,
      .end-state-item h4 {
        margin-top: 0;
        color: #0056b3; /* Highlight player names */
      }

      .player-state-item ul,
      .end-state-item ul {
        list-style-type: disc;
        margin-left: 20px;
        padding-left: 0;
        font-size: 0.9em;
      }

      .loading-message {
        text-align: center;
        padding: 20px;
        color: #777;
        font-style: italic;
      }

      /* Make enum display nicer */
      p strong + code {
        background-color: #eef;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralGameStateComponent {
  GameStatus = GameStatus;

  constructor(public gameStateService: GameStateService) {}
}

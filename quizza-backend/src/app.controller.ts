import { Body, Controller, Get, Param, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Answer, AnswerId, GameId, GeneralGameState, PlayerId } from './models/backendmodels';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): { message: string, serverTime: string } {
    return this.appService.getHello();
  }

  @Get('/gamestate/:playerId/:gameId')
  getGameState(@Param('playerId') playerId: PlayerId, @Param('gameId') gameId: string): GeneralGameState {
    return this.appService.getGeneralGameState(playerId, gameId);
  }

  @Get("/login/:playerName/:gameId")
  postLogin(@Param('playerName') playerName: string, @Param('gameId') gameId: string) {
    return this.appService.login(playerName, gameId);
  }

  @Get("/answer/:playerId/:gameId/:answerId")
  postAnswer(@Param('playerId') playerId: PlayerId, @Param('gameId') gameId: GameId, @Param('answerId') answerId: string) {
    return this.appService.answerQuestionForPlayer(gameId, playerId, parseInt(answerId));
  }

  @Get("/vote/:playerId/:gameId/:vote")
  postVote(@Param('playerId') playerId: PlayerId, @Param('gameId') gameId: GameId, @Param('vote') vote: string) {
    return this.appService.voteStartPlayer(gameId, playerId, vote === "true" ? true : false);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GeneralGameState } from './models/backendmodels';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): { message: string, serverTime: string } {
    return this.appService.getHello();
  }

  @Get('/gamestate/:playerName/:gameId')
  getGameState(@Param('playerName') playerName: string, @Param('gameId') gameId: string): GeneralGameState {
    return this.appService.getGeneralGameState(playerName, gameId);
  }

  @Get("/login/:playerName/:gameId")
  postLogin(@Param('playerName') playerName: string, @Param('gameId') gameId: string) {
    return this.appService.login(playerName, gameId);
  }

  @Get("/answer/:playerId/:gameId/:answerId")
  postAnswer(@Param('playerId') playerId: string, @Param('gameId') gameId: string, @Param('answerId') answerId: number) {
    {
      return this.appService.answerQuestionForPlayer(gameId, playerId, answerId);
    }
  }
}

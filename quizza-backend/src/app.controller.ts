import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): { message: string, serverTime: string } {
    return this.appService.getHello();
  }

  @Get('/gamestate/:playerName')
  getGameState(@Param('playerName') playerName: string): GameState {
    return this.appService.getGameState(playerName);
  }

  @Post("/login")
  postLogin(@Body() body: { playerName: string, gameId: string }) {
    console.log("POST /login", body.playerName, body.gameId);
    return this.appService.login(body.playerName, body.gameId);
  }

  @Post("/answer")
  postAnswer(@Body() body: { playerName: string, answerId: string }) {
    console.log("POST /answer", body.playerName, body.answerId);
    return this.appService.answerQuestionForPlayer(body.playerName, body.answerId);
  }
}

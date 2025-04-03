import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string, serverTime: string } {
    return this.appService.getHello();
  }

  @Get("/gamestate")
  getGameState(playerToken: string) {
    return this.appService.getHello();
  }

  @Post("/login")
  postLogin(@Body() body: { playerName: string, gameId: string}) {
    console.log("POST /login", body.playerName, body.gameId);
    return this.appService.login(body.playerName, body.gameId);
  }
}
 
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from '../app.service';
import { Player } from '../models/backendmodels'; // Assuming AppService provides player details

interface ExtendedSocket extends Socket {
  data: {
    gameId?: string;
    player?: Player;
  };
}

@WebSocketGateway({
  cors: { origin: '*' }, // Configure this properly for production
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private playersPerGame: Map<string, Set<Player>> = new Map();

  constructor(private readonly appService: AppService) {}

  handleConnection(client: ExtendedSocket) {
    const gameId = client.handshake.query['gameId'] as string;
    const playerId = client.handshake.query['playerId'] as string;

    if (!gameId || !playerId) {
      client.disconnect();
      return;
    }

    // Assuming getPlayerLogin returns an object like { id: string, name: string }
    // or undefined/throws if not found.
    let player: Player;
    try {
      player = this.appService.getPlayerLogin(gameId, playerId);
      if (!player || !player.name) {
        console.error(
          `Player not found or name missing for gameId: ${gameId}, playerId: ${playerId}`,
        );
        client.disconnect();
        return;
      }
    } catch (error) {
      console.error(`Error fetching player: ${error}`);
      client.disconnect();
      return;
    }

    client.data.gameId = gameId;
    client.data.player = {
      id: player.id,
      name: player.name,
    };
    client.join(gameId);

    console.log(
      `User ${player.name} (ID: ${playerId}) joined game ${gameId} (${client.id})`,
    );

    if (!this.playersPerGame.has(gameId)) {
      this.playersPerGame.set(gameId, new Set());
    }
    this.playersPerGame.get(gameId)!.add(player);

    this.broadcastPlayers(gameId);
  }

  handleDisconnect(client: ExtendedSocket) {
    const { gameId, player } = client.data;
    if (!gameId || !player?.name) return;

    const playersInGame = this.playersPerGame.get(gameId);
    if (playersInGame) {
      let playerToRemove: Player | undefined;
      for (const p of playersInGame) {
        if (p.id === player?.id) {
          playerToRemove = p;
          break;
        }
      }

      if (!playerToRemove) return;

      playersInGame.delete(playerToRemove);

      this.broadcastPlayers(gameId);
    }

    this.removeGameIfEmpty(gameId);
  }

  private removeGameIfEmpty(gameId: string) {
    if (this.playersPerGame.get(gameId)?.size === 0) {
      this.playersPerGame.delete(gameId);
      console.log(`Game room ${gameId} is now empty and removed.`);
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() msg: string,
  ) {
    const { gameId, player } = client.data;
    if (!gameId || !player?.name) return;

    const message = `${player?.name}: ${msg}`;
    this.server.to(gameId).emit('message', message);
  }

  private broadcastPlayers(gameId: string) {
    const playersInGame = this.playersPerGame.get(gameId);

    if (playersInGame) {
      const playerNames = Array.from(playersInGame).map((p) => p.name);

      this.server.to(gameId).emit('updatePlayers', playerNames);
    }
  }

  // Example: If clients need to manually request the player list (optional)
  @SubscribeMessage('requestPlayers')
  handlePlayerListRequest(@ConnectedSocket() client: ExtendedSocket) {
    const { gameId } = client.data;
    if (!gameId) return;

    const playersInGame = this.playersPerGame.get(gameId) || new Set();
    const playerNames = Array.from(playersInGame).map((p) => p.name);
    client.emit('updatePlayers', playerNames); // Send only to requester
  }
}

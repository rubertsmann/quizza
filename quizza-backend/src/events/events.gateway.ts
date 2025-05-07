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
import { AppService } from '../app.service'; // Assuming AppService provides player details

interface Player {
  id: string;
  name: string;
}

interface ExtendedSocket extends Socket {
  data: {
    gameId?: string;
    playerId?: string; // Store playerId for easier lookup on disconnect
    username?: string;
  };
}

@WebSocketGateway({
  cors: { origin: '*' }, // Configure this properly for production
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store players: gameId -> Set of Player objects
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
    client.data.playerId = playerId; // Store playerId
    client.data.username = player.name;

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
    const { gameId, playerId, username } = client.data;

    if (gameId && playerId) {
      const playersInGame = this.playersPerGame.get(gameId);
      if (playersInGame) {
        let playerToRemove: Player | undefined;
        for (const p of playersInGame) {
          if (p.id === playerId) {
            playerToRemove = p;
            break;
          }
        }

        if (playerToRemove) {
          playersInGame.delete(playerToRemove);
          console.log(
            `User ${playerToRemove.name} (ID: ${playerToRemove.id}) disconnected from game ${gameId}`,
          );
          if (playersInGame.size === 0) {
            this.playersPerGame.delete(gameId);
            console.log(`Game room ${gameId} is now empty and removed.`);
          }
          this.broadcastPlayers(gameId);
        }
      }
    } else {
      console.log(
        `User (details unknown, socketId: ${client.id}) disconnected without full game/player data.`,
      );
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() msg: string,
  ) {
    const { gameId, username } = client.data;
    if (!gameId || !username) return;

    const message = `${username}: ${msg}`;
    this.server.to(gameId).emit('message', message);
  }

  private broadcastPlayers(gameId: string) {
    const playersInGame = this.playersPerGame.get(gameId) || new Set();
    const playerNames = Array.from(playersInGame).map((p) => p.name);
    this.server.to(gameId).emit('updatePlayers', playerNames); // Changed event name
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

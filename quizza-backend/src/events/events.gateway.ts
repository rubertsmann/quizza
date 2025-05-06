import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const gameId = client.handshake.query['gameId'];
    if (typeof gameId === 'string') {
      console.log(`Client ${client.id} joined game ${gameId}`);
    } else {
      console.warn('Missing gameId on connection');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ): void {
    const rooms = Array.from(client.rooms).filter((r) => r !== client.id);
    const gameRoom = rooms[0];
    if (gameRoom) {
      this.server.to(gameRoom).emit('message', message);
    }
  }
}

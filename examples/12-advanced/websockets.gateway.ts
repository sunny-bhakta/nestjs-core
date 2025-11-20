/**
 * Advanced: WebSockets Gateway
 * 
 * WebSockets enable real-time bidirectional communication.
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Welcome to the chat!' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // Broadcast to all clients
    this.server.emit('message', {
      id: client.id,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.join(data.room);
    client.to(data.room).emit('user-joined', { userId: client.id });
  }

  @SubscribeMessage('room-message')
  handleRoomMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Send to all clients in the room except sender
    client.to(data.room).emit('room-message', {
      userId: client.id,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.room);
    client.to(data.room).emit('user-left', { userId: client.id });
  }
}


/**
 * Advanced: Microservices
 * 
 * NestJS supports building microservices with various transport layers.
 */

import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport, MessagePattern, EventPattern } from '@nestjs/microservices';

// TCP Microservice Client
@Controller('microservices')
export class MicroservicesController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8877,
      },
    });
  }

  // Request-Response pattern
  @Get('users')
  async getUsers() {
    return this.client.send('get_users', {}).toPromise();
  }

  // Event pattern (fire and forget)
  @Post('events')
  async emitEvent(@Body() data: any) {
    this.client.emit('user_created', data);
    return { message: 'Event emitted' };
  }
}

// Microservice Message Handlers
export class UsersMicroservice {
  // Handle message pattern
  @MessagePattern('get_users')
  handleGetUsers() {
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
    ];
  }

  // Handle event pattern
  @EventPattern('user_created')
  handleUserCreated(data: any) {
    console.log('User created event received:', data);
  }
}


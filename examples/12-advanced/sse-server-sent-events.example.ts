/**
 * Server-Sent Events (SSE): Complete Example
 * 
 * Examples of SSE for real-time event streaming.
 */

import { Controller, Get, Post, Res, Param, Body, Sse, MessageEvent, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

// ============================================================================
// Basic SSE Endpoint
// ============================================================================

@Controller('sse')
export class SSEController {
  @Get('stream')
  stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send data every second
    const interval = setInterval(() => {
      const data = {
        timestamp: new Date().toISOString(),
        message: 'Hello from SSE',
        data: Math.random(),
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1000);

    // Clean up on client disconnect
    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}

// ============================================================================
// SSE with @Sse Decorator
// ============================================================================

@Controller('sse')
export class SSEDecoratorController {
  @Sse('events')
  sendEvents(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_) => ({
        data: {
          timestamp: new Date().toISOString(),
          message: 'Event from SSE',
          value: Math.random(),
        },
      })),
    );
  }

  @Sse('notifications')
  sendNotifications(): Observable<MessageEvent> {
    return interval(2000).pipe(
      map((_) => ({
        data: {
          type: 'notification',
          message: 'You have a new notification',
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}

// ============================================================================
// SSE with Event Emitter
// ============================================================================

@Injectable()
export class SSEService {
  private clients: Map<string, Response> = new Map();

  addClient(id: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.clients.set(id, res);

    res.on('close', () => {
      this.clients.delete(id);
    });
  }

  sendToClient(id: string, data: any) {
    const client = this.clients.get(id);
    if (client) {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  broadcast(data: any) {
    this.clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}

@Controller('sse')
export class SSEEventController {
  constructor(
    private readonly sseService: SSEService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Listen to application events and broadcast via SSE
    this.eventEmitter.on('user.created', (data) => {
      this.sseService.broadcast({
        type: 'user.created',
        data,
      });
    });

    this.eventEmitter.on('order.updated', (data) => {
      this.sseService.broadcast({
        type: 'order.updated',
        data,
      });
    });
  }

  @Get('connect/:clientId')
  connect(@Param('clientId') clientId: string, @Res() res: Response) {
    this.sseService.addClient(clientId, res);
  }

  @Get('send/:clientId')
  send(@Param('clientId') clientId: string, @Body() data: any) {
    this.sseService.sendToClient(clientId, data);
    return { message: 'Message sent' };
  }
}

// ============================================================================
// SSE with Custom Events
// ============================================================================

@Controller('sse')
export class SSECustomEventsController {
  @Sse('custom')
  customEvents(): Observable<MessageEvent> {
    return new Observable((observer) => {
      // Send initial connection message
      observer.next({
        data: {
          type: 'connected',
          message: 'Connected to SSE stream',
          timestamp: new Date().toISOString(),
        },
      });

      // Send periodic updates
      const interval = setInterval(() => {
        observer.next({
          data: {
            type: 'update',
            message: 'Periodic update',
            timestamp: new Date().toISOString(),
            value: Math.random(),
          },
        });
      }, 1000);

      // Cleanup on unsubscribe
      return () => {
        clearInterval(interval);
      };
    });
  }

  @Sse('progress')
  progressStream(): Observable<MessageEvent> {
    return new Observable((observer) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 10;

        observer.next({
          data: {
            type: 'progress',
            progress,
            message: `Progress: ${progress}%`,
          },
        });

        if (progress >= 100) {
          observer.next({
            data: {
              type: 'complete',
              message: 'Process completed',
            },
          });
          clearInterval(interval);
          observer.complete();
        }
      }, 500);
    });
  }
}

// ============================================================================
// SSE with Error Handling
// ============================================================================

@Controller('sse')
export class SSEErrorController {
  @Sse('error-handling')
  errorHandling(): Observable<MessageEvent> {
    return new Observable((observer) => {
      let count = 0;

      const interval = setInterval(() => {
        count++;

        if (count === 5) {
          // Simulate error
          observer.error({
            type: 'error',
            message: 'An error occurred',
            timestamp: new Date().toISOString(),
          });
          clearInterval(interval);
          return;
        }

        observer.next({
          data: {
            type: 'data',
            count,
            timestamp: new Date().toISOString(),
          },
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    });
  }
}

// ============================================================================
// Module Setup
// ============================================================================

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // For event-driven SSE
  ],
  controllers: [
    SSEController,
    SSEDecoratorController,
    SSEEventController,
    SSECustomEventsController,
    SSEErrorController,
  ],
  providers: [SSEService],
})
export class SSEModule {}

// ============================================================================
// Client-side Example (HTML/JavaScript)
// ============================================================================

/*
<!DOCTYPE html>
<html>
<head>
  <title>SSE Example</title>
</head>
<body>
  <div id="messages"></div>

  <script>
    const eventSource = new EventSource('http://localhost:3000/sse/events');

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const messagesDiv = document.getElementById('messages');
      messagesDiv.innerHTML += '<p>' + JSON.stringify(data) + '</p>';
    };

    eventSource.onerror = function(error) {
      console.error('SSE error:', error);
    };
  </script>
</body>
</html>
*/


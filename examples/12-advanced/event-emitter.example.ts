/**
 * Event Emitter: Complete Example
 * 
 * Examples of using EventEmitter2 for event-driven architecture.
 */

import { Injectable, Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';

// ============================================================================
// Event Classes
// ============================================================================

export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
  ) {}
}

export class OrderPlacedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly total: number,
  ) {}
}

export class ProductUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly changes: any,
  ) {}
}

// ============================================================================
// Event Handlers
// ============================================================================

@Injectable()
export class UserCreatedHandler {
  @OnEvent('user.created')
  handleUserCreated(event: UserCreatedEvent) {
    console.log('User created:', event);
    // Send welcome email, create default settings, etc.
  }
}

@Injectable()
export class OrderPlacedHandler {
  @OnEvent('order.placed')
  handleOrderPlaced(event: OrderPlacedEvent) {
    console.log('Order placed:', event);
    // Update inventory, send confirmation email, etc.
  }

  @OnEvent('order.placed')
  async sendConfirmationEmail(event: OrderPlacedEvent) {
    // Send email asynchronously
    console.log('Sending confirmation email for order:', event.orderId);
  }
}

@Injectable()
export class ProductUpdatedHandler {
  @OnEvent('product.updated')
  handleProductUpdated(event: ProductUpdatedEvent) {
    console.log('Product updated:', event);
    // Invalidate cache, notify subscribers, etc.
  }
}

// ============================================================================
// Event Publisher Service
// ============================================================================

@Injectable()
export class EventPublisherService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Emit event synchronously
   */
  emitUserCreated(userId: string, email: string, name: string) {
    this.eventEmitter.emit('user.created', new UserCreatedEvent(userId, email, name));
  }

  /**
   * Emit event asynchronously
   */
  async emitAsync(eventName: string, event: any) {
    return this.eventEmitter.emitAsync(eventName, event);
  }

  /**
   * Emit event and wait for all handlers
   */
  async emitAndWait(eventName: string, event: any) {
    await this.eventEmitter.emitAsync(eventName, event);
  }
}

// ============================================================================
// Usage in Services
// ============================================================================

@Injectable()
export class UserService {
  constructor(private eventEmitter: EventEmitter2) {}

  async createUser(userData: { name: string; email: string; password: string }) {
    // Create user logic
    const user = {
      id: '1',
      ...userData,
    };

    // Emit event
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id, user.email, user.name));

    return user;
  }
}

@Injectable()
export class OrderService {
  constructor(private eventEmitter: EventEmitter2) {}

  async placeOrder(orderData: { userId: string; items: any[] }) {
    // Create order logic
    const order = {
      id: '1',
      userId: orderData.userId,
      total: 100,
    };

    // Emit event asynchronously
    await this.eventEmitter.emitAsync('order.placed', new OrderPlacedEvent(order.id, order.userId, order.total));

    return order;
  }
}

// ============================================================================
// Wildcard Event Handlers
// ============================================================================

@Injectable()
export class GlobalEventHandler {
  @OnEvent('*') // Listen to all events
  handleAllEvents(event: any) {
    console.log('Event received:', event);
  }

  @OnEvent('user.*') // Listen to all user events
  handleUserEvents(event: any) {
    console.log('User event:', event);
  }
}

// ============================================================================
// Module Setup
// ============================================================================

import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Global event emitter configuration
      wildcard: true, // Enable wildcard events
      delimiter: '.', // Event name delimiter
      maxListeners: 10, // Maximum number of listeners
      verboseMemoryLeak: true, // Log memory leaks
      ignoreErrors: false, // Don't ignore errors
    }),
  ],
  providers: [
    UserCreatedHandler,
    OrderPlacedHandler,
    ProductUpdatedHandler,
    EventPublisherService,
    UserService,
    OrderService,
    GlobalEventHandler,
  ],
  exports: [EventPublisherService, UserService, OrderService],
})
export class EventEmitterExampleModule {}


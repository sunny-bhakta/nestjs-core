/**
 * GraphQL: Subscriptions
 * 
 * Examples of GraphQL subscriptions for real-time updates.
 */

import { Resolver, Subscription, Mutation, Args, Query } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Injectable } from '@nestjs/common';

// ============================================================================
// PubSub Service
// ============================================================================

@Injectable()
export class PubSubService extends PubSub {}

// ============================================================================
// GraphQL Types
// ============================================================================

import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  author: string;

  @Field()
  timestamp: Date;
}

@InputType()
export class CreateMessageInput {
  @Field()
  content: string;

  @Field()
  author: string;
}

// ============================================================================
// Message Resolver with Subscriptions
// ============================================================================

@Resolver(() => Message)
export class MessageResolver {
  constructor(private pubSub: PubSubService) {}

  @Query(() => [Message])
  messages() {
    return [];
  }

  @Mutation(() => Message)
  async createMessage(@Args('input') input: CreateMessageInput): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      content: input.content,
      author: input.author,
      timestamp: new Date(),
    };

    // Publish event for subscription
    await this.pubSub.publish('messageCreated', { messageCreated: message });

    return message;
  }

  @Subscription(() => Message, {
    name: 'messageCreated',
  })
  messageCreated() {
    return this.pubSub.asyncIterator('messageCreated');
  }
}

// ============================================================================
// User Online Status Subscription
// ============================================================================

@ObjectType()
export class UserStatus {
  @Field(() => ID)
  userId: string;

  @Field()
  status: string; // 'online' | 'offline'

  @Field()
  timestamp: Date;
}

@Resolver(() => UserStatus)
export class UserStatusResolver {
  constructor(private pubSub: PubSubService) {}

  @Mutation(() => UserStatus)
  async updateUserStatus(
    @Args('userId') userId: string,
    @Args('status') status: string,
  ): Promise<UserStatus> {
    const userStatus: UserStatus = {
      userId,
      status,
      timestamp: new Date(),
    };

    await this.pubSub.publish('userStatusUpdated', { userStatusUpdated: userStatus });

    return userStatus;
  }

  @Subscription(() => UserStatus, {
    name: 'userStatusUpdated',
    filter: (payload, variables) => {
      // Filter by userId if provided
      return !variables.userId || payload.userStatusUpdated.userId === variables.userId;
    },
  })
  userStatusUpdated(@Args('userId', { nullable: true }) userId?: string) {
    return this.pubSub.asyncIterator('userStatusUpdated');
  }
}

// ============================================================================
// Order Updates Subscription
// ============================================================================

@ObjectType()
export class OrderUpdate {
  @Field(() => ID)
  orderId: string;

  @Field()
  status: string;

  @Field()
  timestamp: Date;
}

@Resolver(() => OrderUpdate)
export class OrderResolver {
  constructor(private pubSub: PubSubService) {}

  @Mutation(() => OrderUpdate)
  async updateOrderStatus(
    @Args('orderId') orderId: string,
    @Args('status') status: string,
  ): Promise<OrderUpdate> {
    const update: OrderUpdate = {
      orderId,
      status,
      timestamp: new Date(),
    };

    await this.pubSub.publish(`order.${orderId}`, { orderUpdated: update });

    return update;
  }

  @Subscription(() => OrderUpdate, {
    name: 'orderUpdated',
  })
  orderUpdated(@Args('orderId') orderId: string) {
    return this.pubSub.asyncIterator(`order.${orderId}`);
  }
}


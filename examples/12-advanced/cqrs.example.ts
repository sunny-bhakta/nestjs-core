/**
 * Advanced: CQRS (Command Query Responsibility Segregation)
 * 
 * CQRS separates read and write operations for better scalability.
 */

import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { Controller, Get, Post, Body } from '@nestjs/common';

// Commands (Write operations)
export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

// Queries (Read operations)
export class GetUserQuery {
  constructor(public readonly id: string) {}
}

export class GetAllUsersQuery {}

// Events
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}

// Command Handlers
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private eventBus: EventBus) {}

  async execute(command: CreateUserCommand) {
    // Create user logic
    const userId = '1';
    
    // Emit event
    this.eventBus.publish(new UserCreatedEvent(userId, command.email));
    
    return { id: userId, ...command };
  }
}

// Query Handlers
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  async execute(query: GetUserQuery) {
    // Get user logic
    return { id: query.id, name: 'John Doe', email: 'john@example.com' };
  }
}

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  async execute() {
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
    ];
  }
}

// Event Handlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent) {
    console.log(`User created: ${event.userId} - ${event.email}`);
    // Send welcome email, etc.
  }
}

// Controller using CQRS
@Controller('cqrs')
export class CqrsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('users')
  async createUser(@Body() createUserDto: { name: string; email: string }) {
    return this.commandBus.execute(
      new CreateUserCommand(createUserDto.name, createUserDto.email),
    );
  }

  @Get('users')
  async getAllUsers() {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Get('users/:id')
  async getUser(@Body('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }
}


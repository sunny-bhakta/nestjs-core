/**
 * Advanced: GraphQL Resolver
 * 
 * GraphQL provides a query language for APIs and a runtime for executing queries.
 */

import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { User } from './graphql-types/user.type';
import { CreateUserInput } from './graphql-types/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  // Query - Get all users
  @Query(() => [User], { name: 'users' })
  findAll() {
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
  }

  // Query - Get user by ID
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return { id, name: 'John Doe', email: 'john@example.com' };
  }

  // Mutation - Create user
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return {
      id: '1',
      ...createUserInput,
    };
  }

  // Mutation - Update user
  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: CreateUserInput,
  ) {
    return {
      id,
      ...updateUserInput,
    };
  }

  // Mutation - Delete user
  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return true;
  }

  // Query with context
  @Query(() => User, { name: 'me' })
  getCurrentUser(@Context() context: any) {
    return context.user;
  }
}


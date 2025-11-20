/**
 * Core Concept: Feature Module
 * 
 * Feature modules organize related functionality.
 * They encapsulate controllers, providers, and can import/export other modules.
 */

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // Export to make available to other modules
})
export class UsersModule {}


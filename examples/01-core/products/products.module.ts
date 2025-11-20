/**
 * Core Concept: Feature Module - Products
 * 
 * This is a feature module example demonstrating how to organize
 * a complete feature with its own module, controller, and service.
 * Similar to the UsersModule, this shows the feature-based architecture pattern.
 */

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Export to make available to other modules
})
export class ProductsModule {}


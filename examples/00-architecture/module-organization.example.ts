/**
 * Architecture: Module Organization
 * 
 * Examples of different module organization patterns:
 * - Feature-based Architecture
 * - Layered Architecture
 * - Module Re-exporting
 */

import { Module } from '@nestjs/common';

// ============================================================================
// Feature-based Architecture
// ============================================================================

// Each feature has its own module with all related components
@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}

// Root module imports all feature modules
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}

// ============================================================================
// Layered Architecture
// ============================================================================

// Data Access Layer
@Module({
  providers: [UsersRepository, ProductsRepository, OrdersRepository],
  exports: [UsersRepository, ProductsRepository, OrdersRepository],
})
export class DataAccessModule {}

// Business Logic Layer
@Module({
  imports: [DataAccessModule],
  providers: [UsersService, ProductsService, OrdersService],
  exports: [UsersService, ProductsService, OrdersService],
})
export class BusinessLogicModule {}

// Presentation Layer
@Module({
  imports: [BusinessLogicModule],
  controllers: [UsersController, ProductsController, OrdersController],
})
export class PresentationModule {}

// ============================================================================
// Module Re-exporting
// ============================================================================

// Shared module with common services
@Module({
  providers: [LoggerService, ConfigService, CacheService],
  exports: [LoggerService, ConfigService, CacheService],
})
export class SharedModule {}

// Feature module that re-exports shared services
@Module({
  imports: [SharedModule],
  providers: [UsersService],
  exports: [
    UsersService,
    // Re-export shared services so importing modules don't need to import SharedModule
    LoggerService,
    ConfigService,
    CacheService,
  ],
})
export class UsersModuleWithReExport {}

// Module that imports UsersModule gets access to both UsersService and shared services
@Module({
  imports: [UsersModuleWithReExport],
  // Can use LoggerService, ConfigService, CacheService without importing SharedModule
})
export class AnotherModule {}

// ============================================================================
// Hybrid Architecture (Feature + Layers)
// ============================================================================

// Feature module with internal layers
@Module({
  imports: [
    // Data layer
    UsersDataModule,
    // Business layer
    UsersBusinessModule,
  ],
  controllers: [UsersController], // Presentation layer
})
export class UsersFeatureModule {}

// Placeholder classes for compilation
import { Controller } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Controller('users')
class UsersController {}

@Controller('products')
class ProductsController {}

@Controller('orders')
class OrdersController {}

@Injectable()
class UsersService {}

@Injectable()
class ProductsService {}

@Injectable()
class OrdersService {}

@Injectable()
class UsersRepository {}

@Injectable()
class ProductsRepository {}

@Injectable()
class OrdersRepository {}

@Injectable()
class LoggerService {}

@Injectable()
class ConfigService {}

@Injectable()
class CacheService {}

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
})
class UsersDataModule {}

@Module({
  imports: [UsersDataModule],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersBusinessModule {}


/**
 * Dynamic Modules: Usage Examples
 * 
 * This file demonstrates how to use all the dynamic module patterns
 * in your application modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './complete-dynamic-module.example';
import { DatabaseUsageController } from './usage.controller';

// ============================================================================
// Example 1: Using forRoot() - Synchronous configuration
// ============================================================================
@Module({
  imports: [
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class AppModuleWithForRoot {}

// ============================================================================
// Example 2: Using forRootAsync() - Asynchronous configuration
// ============================================================================
@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule first
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'mydb'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class AppModuleWithForRootAsync {}

// ============================================================================
// Example 3: Using forFeature() - Feature-specific configuration
// ============================================================================
@Module({
  imports: [
    // Root module must be imported first (or be global)
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
    }),
    // Feature module with specific options
    DatabaseModule.forFeature({
      schema: 'users',
      tablePrefix: 'usr',
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class UsersModuleWithForFeature {}

// ============================================================================
// Example 4: Using forFeatureAsync() - Async feature configuration
// ============================================================================
@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forFeatureAsync({
      useFactory: (configService: ConfigService) => ({
        schema: configService.get<string>('USERS_SCHEMA', 'users'),
        tablePrefix: 'usr',
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class UsersModuleWithForFeatureAsync {}

// ============================================================================
// Example 5: Using register() - Simple registration
// ============================================================================
@Module({
  imports: [
    DatabaseModule.register({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class AppModuleWithRegister {}

// ============================================================================
// Example 6: Using registerAsync() - Simple async registration
// ============================================================================
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DatabaseUsageController],
})
export class AppModuleWithRegisterAsync {}

// ============================================================================
// Example 7: Multiple feature modules with different configurations
// ============================================================================
@Module({
  imports: [
    // Root configuration (global)
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    // Users feature
    DatabaseModule.forFeature({
      schema: 'users',
      tablePrefix: 'usr',
    }),
    // Products feature
    DatabaseModule.forFeature({
      schema: 'products',
      tablePrefix: 'prod',
    }),
    // Orders feature
    DatabaseModule.forFeature({
      schema: 'orders',
      tablePrefix: 'ord',
    }),
  ],
})
export class MultiFeatureModule {}


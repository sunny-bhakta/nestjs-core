/**
 * Core Concept: Custom Providers
 * 
 * Custom providers allow you to create providers with custom logic:
 * - Value Providers: Provide a simple value
 * - Factory Providers: Create providers using factory functions
 * - Class Providers: Use a class as a token
 * - Async Providers: Create providers asynchronously
 */

import { Module, Injectable, Inject } from '@nestjs/common';

// Value Provider
const CONFIG_VALUE = {
  apiKey: 'my-api-key',
  apiUrl: 'https://api.example.com',
};

// Factory Provider
const createDatabaseConnection = () => {
  return {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    connect: () => console.log('Connected to database'),
  };
};

// Async Factory Provider
const createAsyncConfig = async () => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    apiKey: 'async-api-key',
    apiUrl: 'https://async-api.example.com',
  };
};

@Injectable()
export class ServiceWithCustomProviders {
  constructor(
    @Inject('CONFIG') private readonly config: any,
    @Inject('DATABASE') private readonly database: any,
    @Inject('ASYNC_CONFIG') private readonly asyncConfig: any,
  ) {}

  getConfig() {
    return this.config;
  }

  getDatabase() {
    return this.database;
  }

  getAsyncConfig() {
    return this.asyncConfig;
  }
}

@Module({
  providers: [
    // Value Provider
    {
      provide: 'CONFIG',
      useValue: CONFIG_VALUE,
    },
    // Factory Provider
    {
      provide: 'DATABASE',
      useFactory: createDatabaseConnection,
    },
    // Async Factory Provider
    {
      provide: 'ASYNC_CONFIG',
      useFactory: createAsyncConfig,
    },
    // Factory with dependencies
    {
      provide: 'COMPLEX_SERVICE',
      useFactory: (config: any, database: any) => {
        return {
          config,
          database,
          initialized: true,
        };
      },
      inject: ['CONFIG', 'DATABASE'],
    },
    ServiceWithCustomProviders,
  ],
  exports: [ServiceWithCustomProviders],
})
export class CustomProvidersModule {}


/**
 * Dynamic Modules: Complete Example
 * 
 * This example demonstrates all dynamic module patterns:
 * - forRoot() - Synchronous root configuration
 * - forRootAsync() - Asynchronous root configuration
 * - forFeature() - Synchronous feature configuration
 * - forFeatureAsync() - Asynchronous feature configuration
 * - register() - Simple registration pattern
 */

import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// ============================================================================
// Configuration Interfaces
// ============================================================================

export interface DatabaseModuleOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface DatabaseModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
  inject?: any[];
  imports?: any[];
}

export interface DatabaseFeatureOptions {
  schema?: string;
  tablePrefix?: string;
}

export interface DatabaseFeatureAsyncOptions {
  useFactory: (...args: any[]) => Promise<DatabaseFeatureOptions> | DatabaseFeatureOptions;
  inject?: any[];
}

// ============================================================================
// Service that uses the configuration
// ============================================================================

import { Injectable, Inject, Optional } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_OPTIONS')
    private readonly options: DatabaseModuleOptions,
    @Optional()
    @Inject('DATABASE_FEATURE_OPTIONS')
    private readonly featureOptions?: DatabaseFeatureOptions,
  ) {}

  getConnectionString(): string {
    const { host, port, username, password, database } = this.options;
    const schema = this.featureOptions?.schema || 'public';
    return `postgresql://${username}:${password}@${host}:${port}/${database}?schema=${schema}`;
  }

  getTableName(table: string): string {
    const prefix = this.featureOptions?.tablePrefix || '';
    return prefix ? `${prefix}_${table}` : table;
  }

  connect(): Promise<void> {
    console.log(`Connecting to database: ${this.getConnectionString()}`);
    // Actual connection logic here
    return Promise.resolve();
  }
}

// ============================================================================
// Main Dynamic Module
// ============================================================================

@Module({})
export class DatabaseModule {
  
  // ========================================================================
  // Pattern 1: forRoot() - Synchronous root configuration
  // ========================================================================
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true, // Make it global so it can be used without importing
    };
  }

  // ========================================================================
  // Pattern 2: forRootAsync() - Asynchronous root configuration
  // ========================================================================
  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true,
    };
  }

  // ========================================================================
  // Pattern 3: forFeature() - Synchronous feature configuration
  // ========================================================================
  static forFeature(options: DatabaseFeatureOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_FEATURE_OPTIONS',
          useValue: options,
        },
        // Re-export DatabaseService with feature options
        {
          provide: DatabaseService,
          useFactory: (
            rootOptions: DatabaseModuleOptions,
            featureOptions: DatabaseFeatureOptions,
          ) => {
            const service = new DatabaseService(rootOptions, featureOptions);
            return service;
          },
          inject: ['DATABASE_OPTIONS', 'DATABASE_FEATURE_OPTIONS'],
        },
      ],
      exports: [DatabaseService],
    };
  }

  // ========================================================================
  // Pattern 4: forFeatureAsync() - Asynchronous feature configuration
  // ========================================================================
  static forFeatureAsync(options: DatabaseFeatureAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_FEATURE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: DatabaseService,
          useFactory: (
            rootOptions: DatabaseModuleOptions,
            featureOptions: DatabaseFeatureOptions,
          ) => {
            const service = new DatabaseService(rootOptions, featureOptions);
            return service;
          },
          inject: ['DATABASE_OPTIONS', 'DATABASE_FEATURE_OPTIONS'],
        },
      ],
      exports: [DatabaseService],
    };
  }

  // ========================================================================
  // Pattern 5: register() - Simple registration pattern
  // ========================================================================
  static register(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }

  // ========================================================================
  // Pattern 6: registerAsync() - Simple async registration
  // ========================================================================
  static registerAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}


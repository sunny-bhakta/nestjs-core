/**
 * Dynamic Module: Cache Module Example
 * 
 * A practical example of a cache module using all dynamic module patterns.
 */

import { DynamicModule, Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface CacheModuleOptions {
  ttl?: number; // Time to live in seconds
  max?: number; // Maximum number of items
  store?: string; // Store type: 'memory' | 'redis'
  host?: string; // Redis host (if using Redis)
  port?: number; // Redis port (if using Redis)
}

export interface CacheModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<CacheModuleOptions> | CacheModuleOptions;
  inject?: any[];
  imports?: any[];
}

@Module({})
export class CustomCacheModule {
  
  /**
   * forRoot() - Synchronous root configuration
   * Use this when you have static configuration values
   */
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    const { ttl = 60, max = 100, store = 'memory' } = options;

    return {
      module: CustomCacheModule,
      imports: [
        NestCacheModule.register({
          ttl: ttl * 1000, // Convert to milliseconds
          max,
          store,
        }),
      ],
      exports: [NestCacheModule],
      global: true,
    };
  }

  /**
   * forRootAsync() - Asynchronous root configuration
   * Use this when you need to load configuration from ConfigService or other async sources
   */
  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: CustomCacheModule,
      imports: [
        ...(options.imports || []),
        NestCacheModule.registerAsync({
          imports: options.imports || [],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              ttl: (config.ttl || 60) * 1000,
              max: config.max || 100,
              store: config.store || 'memory',
              host: config.host,
              port: config.port,
            };
          },
          inject: options.inject || [],
        }),
      ],
      exports: [NestCacheModule],
      global: true,
    };
  }

  /**
   * forFeature() - Feature-specific cache configuration
   * Use this when different features need different cache settings
   */
  static forFeature(options: CacheModuleOptions = {}): DynamicModule {
    const { ttl = 300, max = 50 } = options;

    return {
      module: CustomCacheModule,
      imports: [
        NestCacheModule.register({
          ttl: ttl * 1000,
          max,
        }),
      ],
      exports: [NestCacheModule],
    };
  }

  /**
   * forFeatureAsync() - Async feature-specific configuration
   */
  static forFeatureAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: CustomCacheModule,
      imports: [
        ...(options.imports || []),
        NestCacheModule.registerAsync({
          imports: options.imports || [],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              ttl: (config.ttl || 300) * 1000,
              max: config.max || 50,
              store: config.store || 'memory',
            };
          },
          inject: options.inject || [],
        }),
      ],
      exports: [NestCacheModule],
    };
  }

  /**
   * register() - Simple registration (non-global)
   * Use this for module-scoped cache
   */
  static register(options: CacheModuleOptions = {}): DynamicModule {
    return this.forRoot(options);
  }

  /**
   * registerAsync() - Simple async registration
   */
  static registerAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return this.forRootAsync(options);
  }
}

// Usage Example:
@Module({
  imports: [
    ConfigModule.forRoot(),
    // Using forRootAsync
    CustomCacheModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('CACHE_TTL', 60),
        max: configService.get<number>('CACHE_MAX', 100),
        store: configService.get<string>('CACHE_STORE', 'memory'),
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheUsageModule {}


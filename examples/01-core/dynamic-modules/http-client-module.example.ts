/**
 * Dynamic Module: HTTP Client Module Example
 * 
 * Example of creating a reusable HTTP client module with dynamic configuration.
 */

import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';

export interface HttpClientModuleOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export interface HttpClientModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<HttpClientModuleOptions> | HttpClientModuleOptions;
  inject?: any[];
  imports?: any[];
}

@Module({})
export class HttpClientModule {
  
  /**
   * forRoot() - Configure HTTP client with static options
   */
  static forRoot(options: HttpClientModuleOptions = {}): DynamicModule {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: options.baseURL,
      timeout: options.timeout || 5000,
      headers: options.headers || {},
      withCredentials: options.withCredentials || false,
    };

    return {
      module: HttpClientModule,
      imports: [
        HttpModule.register(axiosConfig),
      ],
      exports: [HttpModule],
      global: true,
    };
  }

  /**
   * forRootAsync() - Configure HTTP client with async options
   */
  static forRootAsync(options: HttpClientModuleAsyncOptions): DynamicModule {
    return {
      module: HttpClientModule,
      imports: [
        ...(options.imports || []),
        HttpModule.registerAsync({
          imports: options.imports || [],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              baseURL: config.baseURL,
              timeout: config.timeout || 5000,
              headers: config.headers || {},
              withCredentials: config.withCredentials || false,
            };
          },
          inject: options.inject || [],
        }),
      ],
      exports: [HttpModule],
      global: true,
    };
  }

  /**
   * forFeature() - Feature-specific HTTP client configuration
   * Useful when different features need different API endpoints
   */
  static forFeature(options: HttpClientModuleOptions = {}): DynamicModule {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: options.baseURL,
      timeout: options.timeout || 5000,
      headers: options.headers || {},
    };

    return {
      module: HttpClientModule,
      imports: [
        HttpModule.register(axiosConfig),
      ],
      exports: [HttpModule],
    };
  }

  /**
   * forFeatureAsync() - Async feature-specific configuration
   */
  static forFeatureAsync(options: HttpClientModuleAsyncOptions): DynamicModule {
    return {
      module: HttpClientModule,
      imports: [
        ...(options.imports || []),
        HttpModule.registerAsync({
          imports: options.imports || [],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              baseURL: config.baseURL,
              timeout: config.timeout || 5000,
              headers: config.headers || {},
            };
          },
          inject: options.inject || [],
        }),
      ],
      exports: [HttpModule],
    };
  }

  /**
   * register() - Simple registration
   */
  static register(options: HttpClientModuleOptions = {}): DynamicModule {
    return this.forRoot(options);
  }

  /**
   * registerAsync() - Simple async registration
   */
  static registerAsync(options: HttpClientModuleAsyncOptions): DynamicModule {
    return this.forRootAsync(options);
  }
}

// Usage Examples:

// Example 1: Using forRoot
@Module({
  imports: [
    HttpClientModule.forRoot({
      baseURL: 'https://api.example.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
})
export class AppModuleWithHttpClient {}

// Example 2: Using forRootAsync
@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpClientModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('API_BASE_URL'),
        timeout: configService.get<number>('API_TIMEOUT', 5000),
        headers: {
          'Authorization': `Bearer ${configService.get<string>('API_KEY')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModuleWithHttpClientAsync {}

// Example 3: Using forFeature for different APIs
@Module({
  imports: [
    // Main API
    HttpClientModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('MAIN_API_URL'),
      }),
      inject: [ConfigService],
    }),
    // Payment API (feature-specific)
    HttpClientModule.forFeature({
      baseURL: 'https://payment-api.example.com',
      headers: {
        'X-API-Version': 'v2',
      },
    }),
  ],
})
export class MultiApiModule {}


/**
 * Core Concept: Dynamic Module
 * 
 * Dynamic modules allow you to configure modules at runtime.
 * They return a module definition with providers that can be customized.
 */

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

export interface DynamicModuleOptions {
  apiKey: string;
  apiUrl: string;
}

@Module({})
export class DynamicModule {
  static forRoot(options: DynamicModuleOptions): DynamicModule {
    return {
      module: DynamicModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<DynamicModuleOptions> | DynamicModuleOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: DynamicModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}


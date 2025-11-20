/**
 * Dynamic Module: Logger Module Example
 * 
 * Example of a logger module with different log levels and transports.
 */

import { DynamicModule, Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export interface LoggerModuleOptions {
  level?: LogLevel;
  format?: 'json' | 'text';
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  enableRemote?: boolean;
  remoteUrl?: string;
}

export interface LoggerModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
  imports?: any[];
}

import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor(
    @Inject('LOGGER_OPTIONS')
    private readonly options: LoggerModuleOptions,
  ) {}

  log(message: string, context?: string) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog('info', message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.writeLog('error', message, context, trace);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog('warn', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog('debug', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      this.writeLog('verbose', message, context);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.VERBOSE];
    const currentLevelIndex = levels.indexOf(this.options.level || LogLevel.INFO);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private writeLog(level: string, message: string, context?: string, trace?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
    };

    if (this.options.enableConsole) {
      const formatted = this.options.format === 'json'
        ? JSON.stringify(logEntry)
        : `[${logEntry.timestamp}] [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`;
      console.log(formatted);
    }

    if (this.options.enableFile && this.options.filePath) {
      // File writing logic here
    }

    if (this.options.enableRemote && this.options.remoteUrl) {
      // Remote logging logic here
    }
  }
}

@Module({})
export class LoggerModule {
  
  /**
   * forRoot() - Configure logger with static options
   */
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    const defaultOptions: LoggerModuleOptions = {
      level: LogLevel.INFO,
      format: 'text',
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      ...options,
    };

    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: defaultOptions,
        },
        LoggerService,
      ],
      exports: [LoggerService],
      global: true,
    };
  }

  /**
   * forRootAsync() - Configure logger with async options
   */
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        LoggerService,
      ],
      exports: [LoggerService],
      global: true,
    };
  }

  /**
   * forFeature() - Feature-specific logger configuration
   * Useful when different features need different log levels
   */
  static forFeature(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: {
            level: LogLevel.DEBUG, // More verbose for features
            format: 'json',
            enableConsole: true,
            ...options,
          },
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  /**
   * forFeatureAsync() - Async feature-specific configuration
   */
  static forFeatureAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  /**
   * register() - Simple registration
   */
  static register(options: LoggerModuleOptions = {}): DynamicModule {
    return this.forRoot(options);
  }

  /**
   * registerAsync() - Simple async registration
   */
  static registerAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return this.forRootAsync(options);
  }
}

// Usage Examples:

// Example 1: Using forRoot
@Module({
  imports: [
    LoggerModule.forRoot({
      level: LogLevel.INFO,
      format: 'json',
      enableConsole: true,
      enableFile: true,
      filePath: './logs/app.log',
    }),
  ],
})
export class AppModuleWithLogger {}

// Example 2: Using forRootAsync
@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        level: configService.get<LogLevel>('LOG_LEVEL', LogLevel.INFO),
        format: configService.get<'json' | 'text'>('LOG_FORMAT', 'text'),
        enableConsole: configService.get<boolean>('LOG_CONSOLE', true),
        enableFile: configService.get<boolean>('LOG_FILE', false),
        filePath: configService.get<string>('LOG_FILE_PATH', './logs/app.log'),
        enableRemote: configService.get<boolean>('LOG_REMOTE', false),
        remoteUrl: configService.get<string>('LOG_REMOTE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModuleWithLoggerAsync {}

// Example 3: Using forFeature for specific modules
@Module({
  imports: [
    LoggerModule.forFeature({
      level: LogLevel.DEBUG, // More verbose logging for this feature
      format: 'json',
    }),
  ],
})
export class DebugFeatureModule {}


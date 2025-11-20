/**
 * Logging: Complete Example
 * 
 * Comprehensive logging examples using NestJS Logger and custom loggers.
 */

import { Injectable, Logger, LoggerService, Scope } from '@nestjs/common';
import { Module } from '@nestjs/common';

// ============================================================================
// Basic Logger Usage
// ============================================================================

@Injectable()
export class BasicLoggerService {
  private readonly logger = new Logger(BasicLoggerService.name);

  doSomething() {
    this.logger.log('Doing something...');
    this.logger.error('Error occurred', 'ErrorStack');
    this.logger.warn('Warning message');
    this.logger.debug('Debug information');
    this.logger.verbose('Verbose information');
  }
}

// ============================================================================
// Custom Logger Service
// ============================================================================

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.log(`[${new Date().toISOString()}] [LOG] [${ctx}] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    const ctx = context || this.context || 'Application';
    console.error(`[${new Date().toISOString()}] [ERROR] [${ctx}] ${message}`, trace);
  }

  warn(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.warn(`[${new Date().toISOString()}] [WARN] [${ctx}] ${message}`);
  }

  debug(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.debug(`[${new Date().toISOString()}] [DEBUG] [${ctx}] ${message}`);
  }

  verbose(message: any, context?: string) {
    const ctx = context || this.context || 'Application';
    console.log(`[${new Date().toISOString()}] [VERBOSE] [${ctx}] ${message}`);
  }
}

// ============================================================================
// File Logger Service
// ============================================================================

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService implements LoggerService {
  private logDir = path.join(process.cwd(), 'logs');
  private logFile = path.join(this.logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

  constructor() {
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(level: string, message: any, context?: string, trace?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: context || 'Application',
      message,
      trace,
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logFile, logLine);
  }

  log(message: any, context?: string) {
    this.writeLog('LOG', message, context);
    console.log(`[LOG] [${context || 'Application'}] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog('ERROR', message, context, trace);
    console.error(`[ERROR] [${context || 'Application'}] ${message}`, trace);
  }

  warn(message: any, context?: string) {
    this.writeLog('WARN', message, context);
    console.warn(`[WARN] [${context || 'Application'}] ${message}`);
  }

  debug(message: any, context?: string) {
    this.writeLog('DEBUG', message, context);
    console.debug(`[DEBUG] [${context || 'Application'}] ${message}`);
  }

  verbose(message: any, context?: string) {
    this.writeLog('VERBOSE', message, context);
    console.log(`[VERBOSE] [${context || 'Application'}] ${message}`);
  }
}

// ============================================================================
// Structured Logger Service
// ============================================================================

@Injectable()
export class StructuredLoggerService implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private formatLog(level: string, message: any, context?: string, metadata?: any) {
    return {
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context || 'Application',
      message,
      ...metadata,
    };
  }

  log(message: any, context?: string, metadata?: any) {
    const logEntry = this.formatLog('LOG', message, context, metadata);
    console.log(JSON.stringify(logEntry));
  }

  error(message: any, trace?: string, context?: string, metadata?: any) {
    const logEntry = this.formatLog('ERROR', message, context, { ...metadata, trace });
    console.error(JSON.stringify(logEntry));
  }

  warn(message: any, context?: string, metadata?: any) {
    const logEntry = this.formatLog('WARN', message, context, metadata);
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: any, context?: string, metadata?: any) {
    const logEntry = this.formatLog('DEBUG', message, context, metadata);
    console.debug(JSON.stringify(logEntry));
  }

  verbose(message: any, context?: string, metadata?: any) {
    const logEntry = this.formatLog('VERBOSE', message, context, metadata);
    console.log(JSON.stringify(logEntry));
  }
}

// ============================================================================
// Usage in Services
// ============================================================================

@Injectable()
export class LoggingExampleService {
  private readonly logger = new Logger(LoggingExampleService.name);

  constructor(
    private readonly customLogger: CustomLoggerService,
    private readonly structuredLogger: StructuredLoggerService,
  ) {
    this.customLogger.setContext('LoggingExampleService');
    this.structuredLogger.setContext('LoggingExampleService');
  }

  exampleMethod() {
    // Built-in logger
    this.logger.log('Using built-in logger');
    this.logger.error('Error with built-in logger', 'Stack trace');

    // Custom logger
    this.customLogger.log('Using custom logger');
    this.customLogger.error('Error with custom logger', 'Stack trace');

    // Structured logger
    this.structuredLogger.log('User action', { userId: '123', action: 'login' });
    this.structuredLogger.error('Database error', 'Stack trace', undefined, {
      query: 'SELECT * FROM users',
      duration: 150,
    });
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  providers: [
    BasicLoggerService,
    CustomLoggerService,
    FileLoggerService,
    StructuredLoggerService,
    LoggingExampleService,
  ],
  exports: [
    CustomLoggerService,
    FileLoggerService,
    StructuredLoggerService,
  ],
})
export class LoggingModule {}


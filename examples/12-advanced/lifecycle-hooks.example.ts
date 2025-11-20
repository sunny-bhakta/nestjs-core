/**
 * Lifecycle Hooks
 * 
 * Lifecycle hooks allow you to run code at specific points in the application lifecycle.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class LifecycleService implements OnModuleInit, OnModuleDestroy, OnApplicationBootstrap, OnApplicationShutdown {
  
  // Called after module initialization
  onModuleInit() {
    console.log('Module initialized');
    // Initialize database connections, start services, etc.
  }

  // Called before module destruction
  onModuleDestroy() {
    console.log('Module destroyed');
    // Cleanup resources
  }

  // Called after application bootstrap
  onApplicationBootstrap() {
    console.log('Application bootstrapped');
    // Application-wide initialization
  }

  // Called before application shutdown
  onApplicationShutdown(signal?: string) {
    console.log(`Application shutting down with signal: ${signal}`);
    // Graceful shutdown logic
  }
}


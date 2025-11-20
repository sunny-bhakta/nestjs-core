/**
 * Service Locator Pattern: Advanced Examples
 * 
 * Advanced use cases and patterns for Service Locator.
 */

import { Injectable, ModuleRef, OnModuleInit } from '@nestjs/core';
import { Module } from '@nestjs/common';

// ============================================================================
// Plugin System using Service Locator
// ============================================================================

export interface Plugin {
  name: string;
  execute(data: any): Promise<any>;
}

@Injectable()
export class PluginService implements Plugin {
  name = 'PluginService';

  async execute(data: any): Promise<any> {
    return { processed: true, data };
  }
}

@Injectable()
export class AnotherPluginService implements Plugin {
  name = 'AnotherPluginService';

  async execute(data: any): Promise<any> {
    return { processed: true, plugin: 'another', data };
  }
}

@Injectable()
export class PluginManager {
  private plugins: Plugin[] = [];

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Register plugin by class
   */
  registerPlugin(pluginClass: new (...args: any[]) => Plugin) {
    const plugin = this.moduleRef.get(pluginClass, { strict: false });
    this.plugins.push(plugin);
  }

  /**
   * Execute all plugins
   */
  async executeAll(data: any): Promise<any[]> {
    return Promise.all(
      this.plugins.map(plugin => plugin.execute(data)),
    );
  }

  /**
   * Execute plugin by name
   */
  async executePlugin(name: string, data: any): Promise<any> {
    const plugin = this.plugins.find(p => p.name === name);
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    return plugin.execute(data);
  }
}

// ============================================================================
// Strategy Pattern with Service Locator
// ============================================================================

export interface PaymentStrategy {
  processPayment(amount: number): Promise<{ success: boolean; transactionId: string }>;
}

@Injectable()
export class CreditCardStrategy implements PaymentStrategy {
  async processPayment(amount: number) {
    // Simulate credit card processing
    return {
      success: true,
      transactionId: `CC-${Date.now()}`,
    };
  }
}

@Injectable()
export class PayPalStrategy implements PaymentStrategy {
  async processPayment(amount: number) {
    // Simulate PayPal processing
    return {
      success: true,
      transactionId: `PP-${Date.now()}`,
    };
  }
}

@Injectable()
export class CryptoStrategy implements PaymentStrategy {
  async processPayment(amount: number) {
    // Simulate crypto processing
    return {
      success: true,
      transactionId: `CRYPTO-${Date.now()}`,
    };
  }
}

@Injectable()
export class PaymentService {
  private strategyMap = new Map<string, new (...args: any[]) => PaymentStrategy>([
    ['credit-card', CreditCardStrategy],
    ['paypal', PayPalStrategy],
    ['crypto', CryptoStrategy],
  ]);

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Process payment using selected strategy
   */
  async processPayment(method: string, amount: number) {
    const strategyClass = this.strategyMap.get(method);
    if (!strategyClass) {
      throw new Error(`Payment method ${method} not supported`);
    }

    const strategy = this.moduleRef.get(strategyClass, { strict: false });
    return strategy.processPayment(amount);
  }
}

// ============================================================================
// Repository Pattern with Service Locator
// ============================================================================

export interface Repository<T> {
  findAll(): T[];
  findOne(id: string): T | undefined;
  create(entity: Partial<T>): T;
  update(id: string, entity: Partial<T>): T;
  delete(id: string): boolean;
}

@Injectable()
export class UserRepository implements Repository<any> {
  private data: any[] = [];

  findAll() {
    return this.data;
  }

  findOne(id: string) {
    return this.data.find(item => item.id === id);
  }

  create(entity: any) {
    const newEntity = { id: Date.now().toString(), ...entity };
    this.data.push(newEntity);
    return newEntity;
  }

  update(id: string, entity: any) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Entity not found');
    }
    this.data[index] = { ...this.data[index], ...entity };
    return this.data[index];
  }

  delete(id: string) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    this.data.splice(index, 1);
    return true;
  }
}

@Injectable()
export class RepositoryManager {
  private repositories = new Map<string, Repository<any>>();

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Get repository by name
   */
  getRepository<T>(name: string): Repository<T> {
    if (!this.repositories.has(name)) {
      // Create repository instance
      const repository = this.moduleRef.get(UserRepository, { strict: false });
      this.repositories.set(name, repository);
    }
    return this.repositories.get(name) as Repository<T>;
  }

  /**
   * Register repository
   */
  registerRepository(name: string, repository: Repository<any>) {
    this.repositories.set(name, repository);
  }
}

// ============================================================================
// Event Handler Registry with Service Locator
// ============================================================================

export interface EventHandler {
  handle(event: any): Promise<void>;
}

@Injectable()
export class UserCreatedHandler implements EventHandler {
  async handle(event: any) {
    console.log('User created:', event);
  }
}

@Injectable()
export class OrderPlacedHandler implements EventHandler {
  async handle(event: any) {
    console.log('Order placed:', event);
  }
}

@Injectable()
export class EventDispatcher {
  private handlers = new Map<string, EventHandler[]>();

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Register event handler
   */
  registerHandler(eventType: string, handlerClass: new (...args: any[]) => EventHandler) {
    const handler = this.moduleRef.get(handlerClass, { strict: false });
    
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    
    this.handlers.get(eventType)!.push(handler);
  }

  /**
   * Dispatch event to all registered handlers
   */
  async dispatch(eventType: string, event: any) {
    const handlers = this.handlers.get(eventType) || [];
    await Promise.all(handlers.map(handler => handler.handle(event)));
  }
}

// ============================================================================
// Service Locator with Initialization
// ============================================================================

@Injectable()
export class InitializedServiceLocator implements OnModuleInit {
  private initializedServices = new Map<string, any>();

  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    // Initialize services on module startup
    this.initializedServices.set('user', this.moduleRef.get(UserRepository, { strict: false }));
    this.initializedServices.set('plugin', this.moduleRef.get(PluginService, { strict: false }));
  }

  /**
   * Get pre-initialized service
   */
  getInitializedService<T>(name: string): T {
    const service = this.initializedServices.get(name);
    if (!service) {
      throw new Error(`Service ${name} not initialized`);
    }
    return service as T;
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  providers: [
    // Plugins
    PluginService,
    AnotherPluginService,
    PluginManager,
    
    // Payment Strategies
    CreditCardStrategy,
    PayPalStrategy,
    CryptoStrategy,
    PaymentService,
    
    // Repositories
    UserRepository,
    RepositoryManager,
    
    // Event Handlers
    UserCreatedHandler,
    OrderPlacedHandler,
    EventDispatcher,
    
    // Advanced Service Locator
    InitializedServiceLocator,
  ],
  exports: [
    PluginManager,
    PaymentService,
    RepositoryManager,
    EventDispatcher,
    InitializedServiceLocator,
  ],
})
export class ServiceLocatorAdvancedModule {}


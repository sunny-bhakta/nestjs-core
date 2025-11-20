/**
 * Service Locator Pattern: Complete Example
 * 
 * The Service Locator pattern provides a way to obtain service instances
 * without explicit dependency injection. In NestJS, this is achieved using ModuleRef.
 */

import { Injectable, ModuleRef } from '@nestjs/core';
import { Module } from '@nestjs/common';

// ============================================================================
// Services to be located
// ============================================================================

@Injectable()
export class UserService {
  private users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }
}

@Injectable()
export class ProductService {
  private products = [
    { id: '1', name: 'Product 1', price: 100 },
    { id: '2', name: 'Product 2', price: 200 },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find(product => product.id === id);
  }
}

@Injectable()
export class OrderService {
  private orders = [
    { id: '1', userId: '1', productId: '1', total: 100 },
    { id: '2', userId: '2', productId: '2', total: 200 },
  ];

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    return this.orders.find(order => order.id === id);
  }
}

// ============================================================================
// Basic Service Locator
// ============================================================================

@Injectable()
export class ServiceLocator {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Get service by class token
   */
  getService<T>(serviceClass: new (...args: any[]) => T): T {
    return this.moduleRef.get(serviceClass, { strict: false });
  }

  /**
   * Get service by string token
   */
  getServiceByToken<T>(token: string): T {
    return this.moduleRef.get<T>(token, { strict: false });
  }

  /**
   * Get service by symbol token
   */
  getServiceBySymbol<T>(token: symbol): T {
    return this.moduleRef.get<T>(token, { strict: false });
  }

  /**
   * Get service or null if not found
   */
  getServiceOptional<T>(serviceClass: new (...args: any[]) => T): T | null {
    try {
      return this.moduleRef.get(serviceClass, { strict: false });
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Advanced Service Locator with Caching
// ============================================================================

@Injectable()
export class CachedServiceLocator {
  private cache = new Map<string | symbol | Function, any>();

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Get service with caching
   */
  getService<T>(serviceClass: new (...args: any[]) => T): T {
    if (this.cache.has(serviceClass)) {
      return this.cache.get(serviceClass);
    }

    const service = this.moduleRef.get(serviceClass, { strict: false });
    this.cache.set(serviceClass, service);
    return service;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Remove specific service from cache
   */
  removeFromCache(serviceClass: new (...args: any[]) => any) {
    this.cache.delete(serviceClass);
  }
}

// ============================================================================
// Service Locator with Dynamic Resolution
// ============================================================================

export enum ServiceType {
  USER = 'user',
  PRODUCT = 'product',
  ORDER = 'order',
}

@Injectable()
export class DynamicServiceLocator {
  private serviceMap = new Map<ServiceType, new (...args: any[]) => any>([
    [ServiceType.USER, UserService],
    [ServiceType.PRODUCT, ProductService],
    [ServiceType.ORDER, OrderService],
  ]);

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Get service by type string
   */
  getServiceByType<T>(type: ServiceType): T {
    const serviceClass = this.serviceMap.get(type);
    if (!serviceClass) {
      throw new Error(`Service type ${type} not found`);
    }
    return this.moduleRef.get(serviceClass, { strict: false }) as T;
  }

  /**
   * Register a new service type
   */
  registerServiceType(type: ServiceType, serviceClass: new (...args: any[]) => any) {
    this.serviceMap.set(type, serviceClass);
  }
}

// ============================================================================
// Service Locator with Factory Pattern
// ============================================================================

@Injectable()
export class FactoryServiceLocator {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Create service instance using factory
   */
  createService<T>(
    serviceClass: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    // For services that need constructor arguments
    return new serviceClass(...args);
  }

  /**
   * Get or create service
   */
  getOrCreateService<T>(
    serviceClass: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    try {
      return this.moduleRef.get(serviceClass, { strict: false });
    } catch {
      return this.createService(serviceClass, ...args);
    }
  }
}

// ============================================================================
// Service Locator with Scope Support
// ============================================================================

@Injectable()
export class ScopedServiceLocator {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Get service with REQUEST scope
   */
  getRequestScopedService<T>(serviceClass: new (...args: any[]) => T): T {
    return this.moduleRef.get(serviceClass, { strict: false });
  }

  /**
   * Resolve service (creates new instance for REQUEST scope)
   */
  async resolveService<T>(serviceClass: new (...args: any[]) => T): Promise<T> {
    return this.moduleRef.resolve(serviceClass);
  }

  /**
   * Get service by token with scope
   */
  async resolveServiceByToken<T>(token: string | symbol): Promise<T> {
    return this.moduleRef.resolve<T>(token);
  }
}

// ============================================================================
// Practical Usage Examples
// ============================================================================

@Injectable()
export class BusinessService {
  constructor(private serviceLocator: ServiceLocator) {}

  /**
   * Use service locator to get services dynamically
   */
  processUserData(userId: string) {
    const userService = this.serviceLocator.getService(UserService);
    const user = userService.findOne(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
      processed: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Use multiple services
   */
  processOrder(orderId: string) {
    const userService = this.serviceLocator.getService(UserService);
    const productService = this.serviceLocator.getService(ProductService);
    const orderService = this.serviceLocator.getService(OrderService);

    const order = orderService.findOne(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const user = userService.findOne(order.userId);
    const product = productService.findOne(order.productId);

    return {
      order,
      user,
      product,
      total: order.total,
    };
  }
}

// ============================================================================
// Service Locator with Conditional Logic
// ============================================================================

@Injectable()
export class ConditionalServiceLocator {
  constructor(
    private moduleRef: ModuleRef,
    private serviceLocator: ServiceLocator,
  ) {}

  /**
   * Get service based on condition
   */
  getServiceByCondition<T>(
    condition: boolean,
    trueService: new (...args: any[]) => T,
    falseService: new (...args: any[]) => T,
  ): T {
    return condition
      ? this.serviceLocator.getService(trueService)
      : this.serviceLocator.getService(falseService);
  }

  /**
   * Get service based on environment
   */
  getServiceByEnvironment<T>(
    devService: new (...args: any[]) => T,
    prodService: new (...args: any[]) => T,
  ): T {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return this.getServiceByCondition(isDevelopment, devService, prodService);
  }
}

// ============================================================================
// Service Locator with Lazy Loading
// ============================================================================

@Injectable()
export class LazyServiceLocator {
  private lazyServices = new Map<string, () => any>();

  constructor(private moduleRef: ModuleRef) {
    // Register lazy service factories
    this.lazyServices.set('user', () => this.moduleRef.get(UserService, { strict: false }));
    this.lazyServices.set('product', () => this.moduleRef.get(ProductService, { strict: false }));
    this.lazyServices.set('order', () => this.moduleRef.get(OrderService, { strict: false }));
  }

  /**
   * Get service lazily (only when accessed)
   */
  getLazyService<T>(name: string): T {
    const factory = this.lazyServices.get(name);
    if (!factory) {
      throw new Error(`Lazy service ${name} not found`);
    }
    return factory() as T;
  }

  /**
   * Register lazy service
   */
  registerLazyService(name: string, factory: () => any) {
    this.lazyServices.set(name, factory);
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  providers: [
    // Services
    UserService,
    ProductService,
    OrderService,
    
    // Service Locators
    ServiceLocator,
    CachedServiceLocator,
    DynamicServiceLocator,
    FactoryServiceLocator,
    ScopedServiceLocator,
    ConditionalServiceLocator,
    LazyServiceLocator,
    
    // Business Services
    BusinessService,
  ],
  exports: [
    ServiceLocator,
    CachedServiceLocator,
    DynamicServiceLocator,
    FactoryServiceLocator,
    ScopedServiceLocator,
    ConditionalServiceLocator,
    LazyServiceLocator,
    BusinessService,
  ],
})
export class ServiceLocatorModule {}


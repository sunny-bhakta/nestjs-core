/**
 * Service Locator Pattern: Controller Examples
 * 
 * Demonstrates how to use Service Locator pattern in controllers.
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ServiceLocator,
  CachedServiceLocator,
  DynamicServiceLocator,
  ServiceType,
  BusinessService,
  LazyServiceLocator,
} from './service-locator.example';
import { UserService, ProductService, OrderService } from './service-locator.example';

@Controller('service-locator')
export class ServiceLocatorController {
  constructor(
    private readonly serviceLocator: ServiceLocator,
    private readonly cachedServiceLocator: CachedServiceLocator,
    private readonly dynamicServiceLocator: DynamicServiceLocator,
    private readonly businessService: BusinessService,
    private readonly lazyServiceLocator: LazyServiceLocator,
  ) {}

  /**
   * Example 1: Basic service location
   */
  @Get('users')
  getUsers() {
    const userService = this.serviceLocator.getService(UserService);
    return userService.findAll();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    const userService = this.serviceLocator.getService(UserService);
    return userService.findOne(id);
  }

  /**
   * Example 2: Using cached service locator
   */
  @Get('products')
  getProducts() {
    const productService = this.cachedServiceLocator.getService(ProductService);
    return productService.findAll();
  }

  /**
   * Example 3: Using dynamic service locator
   */
  @Get('dynamic/:type')
  getByType(@Param('type') type: ServiceType) {
    try {
      const service = this.dynamicServiceLocator.getServiceByType(type);
      if (type === ServiceType.USER) {
        return (service as UserService).findAll();
      } else if (type === ServiceType.PRODUCT) {
        return (service as ProductService).findAll();
      } else if (type === ServiceType.ORDER) {
        return (service as OrderService).findAll();
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Example 4: Using business service that uses service locator
   */
  @Get('business/user/:id')
  processUser(@Param('id') id: string) {
    return this.businessService.processUserData(id);
  }

  @Get('business/order/:id')
  processOrder(@Param('id') id: string) {
    return this.businessService.processOrder(id);
  }

  /**
   * Example 5: Using lazy service locator
   */
  @Get('lazy/:service')
  getLazyService(@Param('service') service: string) {
    try {
      const serviceInstance = this.lazyServiceLocator.getLazyService(service);
      if (service === 'user') {
        return (serviceInstance as UserService).findAll();
      } else if (service === 'product') {
        return (serviceInstance as ProductService).findAll();
      } else if (service === 'order') {
        return (serviceInstance as OrderService).findAll();
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Example 6: Optional service (won't throw if not found)
   */
  @Get('optional/:service')
  getOptionalService(@Param('service') service: string) {
    try {
      let serviceInstance;
      if (service === 'user') {
        serviceInstance = this.serviceLocator.getServiceOptional(UserService);
      } else if (service === 'product') {
        serviceInstance = this.serviceLocator.getServiceOptional(ProductService);
      }

      if (!serviceInstance) {
        return { message: 'Service not available' };
      }

      return serviceInstance.findAll();
    } catch (error) {
      return { error: error.message };
    }
  }
}


# Service Locator Pattern

## Overview

The Service Locator pattern is a design pattern that provides a centralized registry for obtaining service instances. Instead of using dependency injection directly, services are located through a service locator object.

In NestJS, the Service Locator pattern is implemented using `ModuleRef`, which provides methods to dynamically retrieve service instances from the dependency injection container.

## When to Use

### ✅ Good Use Cases

1. **Dynamic Service Resolution**
   - When you need to resolve services based on runtime conditions
   - When service selection depends on configuration or user input

2. **Plugin Systems**
   - When building extensible systems with pluggable components
   - When services need to be registered and discovered dynamically

3. **Strategy Pattern**
   - When implementing strategy pattern with multiple implementations
   - When strategy selection is determined at runtime

4. **Conditional Service Loading**
   - When services are optional and may not always be available
   - When you need to fallback to alternative implementations

5. **Lazy Loading**
   - When services should only be instantiated when needed
   - When you want to defer service initialization

### ❌ When NOT to Use

1. **Standard Dependency Injection**
   - Prefer constructor injection for most cases
   - Service Locator can hide dependencies and make testing harder

2. **Simple Service Dependencies**
   - If dependencies are known at compile time, use DI
   - Service Locator adds complexity without benefit

3. **Tight Coupling Concerns**
   - Service Locator can create hidden dependencies
   - Makes it harder to understand service relationships

## Basic Implementation

### Using ModuleRef

```typescript
import { Injectable, ModuleRef } from '@nestjs/core';

@Injectable()
export class ServiceLocator {
  constructor(private moduleRef: ModuleRef) {}

  getService<T>(serviceClass: new (...args: any[]) => T): T {
    return this.moduleRef.get(serviceClass, { strict: false });
  }
}
```

### Usage

```typescript
@Injectable()
export class MyService {
  constructor(private serviceLocator: ServiceLocator) {}

  doSomething() {
    const userService = this.serviceLocator.getService(UserService);
    return userService.findAll();
  }
}
```

## Patterns

### 1. Basic Service Locator

Simple service retrieval by class token.

**Use Case:** When you need to get services dynamically but know the type at compile time.

```typescript
const userService = serviceLocator.getService(UserService);
```

### 2. Cached Service Locator

Caches service instances to avoid repeated lookups.

**Use Case:** When service lookup is expensive or you want to ensure singleton behavior.

```typescript
const cachedService = cachedServiceLocator.getService(UserService);
```

### 3. Dynamic Service Locator

Resolves services based on runtime values (strings, enums, etc.).

**Use Case:** When service selection depends on user input or configuration.

```typescript
const service = dynamicServiceLocator.getServiceByType(ServiceType.USER);
```

### 4. Factory Service Locator

Creates new instances or retrieves existing ones.

**Use Case:** When you need to create services with constructor arguments.

```typescript
const service = factoryServiceLocator.createService(MyService, arg1, arg2);
```

### 5. Scoped Service Locator

Handles request-scoped services correctly.

**Use Case:** When working with request-scoped services.

```typescript
const service = await scopedServiceLocator.resolveService(RequestScopedService);
```

### 6. Lazy Service Locator

Only instantiates services when accessed.

**Use Case:** When services are expensive to create and may not always be needed.

```typescript
const service = lazyServiceLocator.getLazyService('user');
```

## Advanced Patterns

### Plugin System

Register and execute plugins dynamically:

```typescript
pluginManager.registerPlugin(PluginService);
await pluginManager.executeAll(data);
```

### Strategy Pattern

Select payment strategy at runtime:

```typescript
await paymentService.processPayment('credit-card', 100);
await paymentService.processPayment('paypal', 100);
```

### Repository Pattern

Manage repositories dynamically:

```typescript
const repository = repositoryManager.getRepository<User>('user');
```

### Event Dispatcher

Register and dispatch events:

```typescript
eventDispatcher.registerHandler('user.created', UserCreatedHandler);
await eventDispatcher.dispatch('user.created', eventData);
```

## Comparison: Service Locator vs Dependency Injection

| Aspect | Dependency Injection | Service Locator |
|--------|---------------------|-----------------|
| **Dependencies** | Explicit in constructor | Hidden, discovered at runtime |
| **Testability** | Easy to mock | Requires mocking locator |
| **Compile-time Safety** | Type-safe | Runtime resolution |
| **Flexibility** | Static | Dynamic |
| **Complexity** | Lower | Higher |
| **Use Case** | Standard cases | Dynamic/Plugin systems |

## Best Practices

### 1. Use Sparingly

Prefer dependency injection for standard cases. Only use Service Locator when you need dynamic resolution.

### 2. Type Safety

Always use TypeScript generics to maintain type safety:

```typescript
getService<UserService>(UserService) // ✅ Type-safe
getService('UserService') // ❌ Not type-safe
```

### 3. Error Handling

Always handle cases where services might not be found:

```typescript
try {
  const service = serviceLocator.getService(OptionalService);
} catch (error) {
  // Handle missing service
}
```

### 4. Caching

Consider caching for frequently accessed services:

```typescript
// Cache service instances
private cache = new Map();
```

### 5. Documentation

Document which services are available and when they're used:

```typescript
/**
 * Available services:
 * - UserService: User management
 * - ProductService: Product catalog
 * - OrderService: Order processing
 */
```

## Testing

### Mocking Service Locator

```typescript
const mockServiceLocator = {
  getService: jest.fn().mockReturnValue(mockUserService),
};

const service = new MyService(mockServiceLocator);
```

### Testing with Real Services

```typescript
const module = await Test.createTestingModule({
  providers: [ServiceLocator, UserService, MyService],
}).compile();

const serviceLocator = module.get(ServiceLocator);
const myService = module.get(MyService);
```

## Common Pitfalls

### 1. Hidden Dependencies

Service Locator hides dependencies, making code harder to understand.

**Solution:** Document dependencies clearly and prefer DI when possible.

### 2. Runtime Errors

Services might not be available at runtime.

**Solution:** Use optional service retrieval and handle errors gracefully.

### 3. Testing Complexity

Mocking Service Locator can be complex.

**Solution:** Use dependency injection for testable code, Service Locator only when necessary.

### 4. Performance

Repeated service lookups can impact performance.

**Solution:** Cache service instances when appropriate.

## Examples

See the following files for complete examples:

- [Basic Service Locator](./service-locator.example.ts)
- [Service Locator Controller](./service-locator.controller.ts)
- [Advanced Patterns](./service-locator-advanced.example.ts)

## References

- [NestJS ModuleRef Documentation](https://docs.nestjs.com/fundamentals/module-ref)
- [Service Locator Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)
- [Dependency Injection vs Service Locator](https://martinfowler.com/articles/injection.html)


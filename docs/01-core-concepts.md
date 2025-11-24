# Core Concepts

This document covers the fundamental building blocks of NestJS applications.

## Table of Contents

1. [Modules](#modules)
2. [Controllers](#controllers)
3. [Providers & Services](#providers--services)
4. [Dependency Injection](#dependency-injection)
5. [Service Locator Pattern](#service-locator-pattern)

---

## Modules

Modules are the basic building blocks of a NestJS application. They organize related functionality and define how components interact.

### What is a Module?

A module is a class annotated with the `@Module()` decorator. It provides metadata that NestJS uses to organize the application structure.

### Types of Modules

#### 1. Root Module
The root module is the entry point of your application. Every NestJS application has exactly one root module.

**Example:** [app.module.ts](../examples/01-core/app.module.ts)

```typescript
@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### 2. Feature Modules
Feature modules organize code by domain/feature. Each feature has its own module containing related controllers, services, and providers.

**Examples:**
- [Users Module](../examples/01-core/users/users.module.ts)
- [Products Module](../examples/01-core/products/products.module.ts)

#### 3. Shared Modules
Shared modules export providers that can be used by multiple feature modules.

**Example:** [Shared Module](../examples/01-core/shared/shared.module.ts)

#### 4. Global Modules
Global modules are available throughout the application without needing to import them in every module.

**Example:** [Global Module](../examples/01-core/shared/shared.module.ts)

#### 5. Dynamic Modules
Dynamic modules allow you to configure modules at runtime with custom providers.

**Examples:**
- [Basic Dynamic Module](../examples/01-core/dynamic/dynamic.module.ts)
- [Complete Dynamic Module Patterns](../examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)

### Module Metadata

- `imports`: List of modules to import
- `controllers`: Controllers that belong to this module
- `providers`: Providers that belong to this module
- `exports`: Providers to export for use in other modules

### Best Practices

1. **Feature-based Organization**: Organize modules by feature/domain
2. **Single Responsibility**: Each module should have a clear, single purpose
3. **Explicit Exports**: Only export what other modules need
4. **Avoid Circular Dependencies**: Be careful with module imports

---

## Controllers

Controllers handle incoming HTTP requests and return responses to the client.

### What is a Controller?

A controller is a class decorated with `@Controller()` that defines routes and request handlers.

**Example:** [App Controller](../examples/01-core/app.controller.ts)

### HTTP Method Decorators

- `@Get()` - Handle GET requests
- `@Post()` - Handle POST requests
- `@Put()` - Handle PUT requests
- `@Patch()` - Handle PATCH requests
- `@Delete()` - Handle DELETE requests
- `@All()` - Handle all HTTP methods

### Route Parameters

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return { id };
}
```

### Query Parameters

```typescript
@Get()
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  return { page, limit };
}
```

### Request Body

```typescript
@Post()
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

### Status Codes and Headers

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
@Header('Cache-Control', 'no-cache')
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

### Best Practices

1. **Thin Controllers**: Keep business logic in services
2. **Use DTOs**: Validate and type request/response data
3. **Proper Status Codes**: Return appropriate HTTP status codes
4. **Error Handling**: Use exception filters for error handling

---

## Providers & Services

Providers are classes that can be injected as dependencies. Services are a common type of provider that contain business logic.

### What is a Provider?

A provider is a class annotated with `@Injectable()` that can be injected into other classes.

### Types of Providers

#### 1. Services
Services contain business logic and are the most common type of provider.

**Example:** [App Service](../examples/01-core/app.service.ts)

#### 2. Repositories
Repositories handle data access logic.

**Example:** [Users Repository](../examples/01-core/users/users.repository.ts)

#### 3. Factories
Factories create instances of objects.

**Example:** [Factories](../examples/01-core/providers/factories-and-helpers.example.ts)

#### 4. Helpers
Helper services provide utility functions.

**Example:** [Helpers](../examples/01-core/providers/factories-and-helpers.example.ts)

### Service Patterns

- **Singleton Pattern**: Default scope - one instance shared across app
- **Factory Pattern**: Create objects with custom logic
- **Repository Pattern**: Abstract data access layer
- **Service Layer Pattern**: Business logic separation

### Best Practices

1. **Single Responsibility**: Each service should have one clear purpose
2. **Dependency Injection**: Use constructor injection
3. **Interface Abstraction**: Use interfaces for better testability
4. **Error Handling**: Handle errors appropriately

---

## Dependency Injection

Dependency Injection (DI) is a design pattern where dependencies are provided to a class rather than created by it.

### Injection Methods

#### 1. Constructor Injection (Recommended)
The most common and recommended way to inject dependencies.

**Example:** [Constructor Injection](../examples/01-core/dependency-injection/constructor-injection.example.ts)

```typescript
@Injectable()
export class ServiceB {
  constructor(private readonly serviceA: ServiceA) {}
}
```

#### 2. Property Injection
Less common, used for optional dependencies.

**Example:** [Property Injection](../examples/01-core/dependency-injection/property-injection.example.ts)

```typescript
@Injectable()
export class Service {
  @Inject(OptionalService)
  private readonly optionalService: OptionalService;
}
```

#### 3. Optional Dependencies
Dependencies that may not always be available.

**Example:** [Optional Dependencies](../examples/01-core/dependency-injection/optional-dependencies.example.ts)

```typescript
constructor(@Optional() private readonly optionalService?: OptionalService) {}
```

### Provider Scopes

- **DEFAULT (Singleton)**: Single instance shared across application
- **REQUEST**: New instance per request
- **TRANSIENT**: New instance every time injected

**Example:** [Provider Scopes](../examples/01-core/dependency-injection/scopes.example.ts)

### Custom Providers

- **Value Providers**: Provide simple values
- **Factory Providers**: Create providers using factory functions
- **Class Providers**: Use a class as a token
- **Async Providers**: Create providers asynchronously

**Example:** [Custom Providers](../examples/01-core/dependency-injection/custom-providers.example.ts)

### Best Practices

1. **Constructor Injection**: Prefer constructor injection
2. **Explicit Dependencies**: Keep dependencies clear and explicit
3. **Interface Abstraction**: Use interfaces for better testability
4. **Avoid Circular Dependencies**: Design modules to avoid circular imports

---

## Service Locator Pattern

The Service Locator pattern provides a way to obtain service instances dynamically using `ModuleRef`.

### When to Use

- Dynamic service resolution
- Plugin systems
- Strategy pattern implementations
- Conditional service loading
- Lazy loading

### When NOT to Use

- Standard dependency injection cases
- Simple service dependencies
- When dependencies are known at compile time

### Patterns

1. **Basic Service Locator**: Simple service retrieval
2. **Cached Service Locator**: Service caching for performance
3. **Dynamic Service Locator**: Runtime service resolution
4. **Factory Service Locator**: Service creation with arguments
5. **Scoped Service Locator**: Request-scoped service handling
6. **Lazy Service Locator**: Deferred service loading

**Examples:**
- [Complete Service Locator](../examples/01-core/service-locator/service-locator.example.ts)
- [Advanced Patterns](../examples/01-core/service-locator/service-locator-advanced.example.ts)
- [Documentation](../examples/01-core/service-locator/README.md)

### Best Practices

1. **Use Sparingly**: Prefer dependency injection for standard cases
2. **Type Safety**: Always use TypeScript generics
3. **Error Handling**: Handle cases where services might not be found
4. **Caching**: Consider caching for frequently accessed services

---

## Resources

- [NestJS Modules Documentation](https://docs.nestjs.com/modules)
- [NestJS Controllers Documentation](https://docs.nestjs.com/controllers)
- [NestJS Providers Documentation](https://docs.nestjs.com/providers)
- [NestJS Dependency Injection](https://docs.nestjs.com/fundamentals/custom-providers)


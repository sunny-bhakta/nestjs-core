# NestJS Core Concepts

This document lists all the core concepts and features of NestJS framework with comprehensive code examples.

## 📚 Code Examples

All code examples are located in the `examples/` directory, organized by concept:

## 📖 Documentation

Comprehensive documentation for all concepts is available in the `docs/` directory:

- **[Core Concepts Documentation](./docs/01-core-concepts.md)** - Modules, Controllers, Services, DI
- **[Decorators Documentation](./docs/02-decorators.md)** - All decorator types
- **[Middleware Documentation](./docs/03-middleware.md)** - Middleware patterns
- **[Pipes Documentation](./docs/04-pipes.md)** - Validation and transformation
- **[Guards Documentation](./docs/05-guards.md)** - Authentication and authorization
- **[Interceptors Documentation](./docs/06-interceptors.md)** - Request/response transformation
- **[Exception Filters Documentation](./docs/07-exception-filters.md)** - Error handling
- **[Validation Documentation](./docs/08-validation.md)** - DTOs and validation
- **[Configuration Documentation](./docs/09-configuration.md)** - Config management
- **[Database Documentation](./docs/10-database.md)** - ORM integration
- **[Authentication Documentation](./docs/11-authentication-authorization.md)** - Security
- **[Advanced Features Documentation](./docs/12-advanced-features.md)** - WebSockets, GraphQL, etc.
- **[Documentation Index](./docs/README.md)** - Complete documentation guide

## 📚 Code Examples

All code examples are located in the `examples/` directory, organized by concept:

- **[00-architecture/](./examples/00-architecture/)** - Application architecture (main.ts, module organization)
- **[01-core/](./examples/01-core/)** - Core concepts (Modules, Controllers, Services, Dependency Injection)
- **[02-decorators/](./examples/02-decorators/)** - All decorator types and custom decorators
- **[03-middleware/](./examples/03-middleware/)** - Middleware examples (functional, class-based)
- **[04-pipes/](./examples/04-pipes/)** - Built-in and custom pipes
- **[05-guards/](./examples/05-guards/)** - Authentication and authorization guards
- **[06-interceptors/](./examples/06-interceptors/)** - Logging, transformation, caching interceptors
- **[07-exceptions/](./examples/07-exceptions/)** - Exception filters and error handling
- **[08-validation/](./examples/08-validation/)** - DTOs and validation with class-validator
- **[09-configuration/](./examples/09-configuration/)** - Configuration management
- **[10-database/](./examples/10-database/)** - TypeORM integration examples
- **[11-auth/](./examples/11-auth/)** - JWT authentication and authorization
- **[12-advanced/](./examples/12-advanced/)** - WebSockets, GraphQL, Microservices, CQRS, File Upload, Caching, Scheduling
- **[13-devops/](./examples/13-devops/)** - CI/CD pipelines, Docker, Kubernetes configurations

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Architecture](#architecture)
3. [Decorators](#decorators)
4. [Dependency Injection](#dependency-injection)
5. [Modules](#modules)
6. [Controllers](#controllers)
7. [Providers & Services](#providers--services)
8. [Middleware](#middleware)
9. [Exception Filters](#exception-filters)
10. [Pipes](#pipes)
11. [Guards](#guards)
12. [Interceptors](#interceptors)
13. [Custom Decorators](#custom-decorators)
14. [Lifecycle Hooks](#lifecycle-hooks)
15. [Configuration](#configuration)
16. [Database Integration](#database-integration)
17. [Authentication & Authorization](#authentication--authorization)
18. [Validation](#validation)
19. [Testing](#testing)
20. [Advanced Features](#advanced-features)

---

## Core Concepts

### 1. **Modules** (`@Module`)
- Root Module - [Example](./examples/01-core/app.module.ts)
- Feature Modules - [Example](./examples/01-core/users/users.module.ts), [Products Example](./examples/01-core/products/products.module.ts)
- Shared Modules - [Example](./examples/01-core/shared/shared.module.ts)
- Global Modules (`@Global()`) - [Example](./examples/01-core/shared/shared.module.ts)
- Dynamic Modules - [Example](./examples/01-core/dynamic/dynamic.module.ts)
- Module Re-exporting - [Example](./examples/00-architecture/module-organization.example.ts)

**Code Examples:**
- [Root Module](./examples/01-core/app.module.ts)
- [Feature Module - Users](./examples/01-core/users/users.module.ts)
- [Feature Module - Products](./examples/01-core/products/products.module.ts)
- [Shared/Global Module](./examples/01-core/shared/shared.module.ts)
- [Basic Dynamic Module](./examples/01-core/dynamic/dynamic.module.ts)
- **[Complete Dynamic Module Patterns](./examples/01-core/dynamic-modules/)** - All patterns (forRoot, forRootAsync, forFeature, forFeatureAsync, register, registerAsync)
  - [Complete Implementation](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
  - [Usage Examples](./examples/01-core/dynamic-modules/usage-examples.module.ts)
  - [Cache Module Example](./examples/01-core/dynamic-modules/cache-module.example.ts)
  - [HTTP Client Module Example](./examples/01-core/dynamic-modules/http-client-module.example.ts)
  - [Logger Module Example](./examples/01-core/dynamic-modules/logger-module.example.ts)
  - [Dynamic Modules Guide](./examples/01-core/dynamic-modules/README.md)

### 2. **Controllers** (`@Controller`)
- Route Handlers - [Example](./examples/01-core/app.controller.ts)
- Request Object
- Response Object
- Route Parameters
- Query Parameters
- Request Body
- Route Wildcards
- Status Codes
- Headers

**Code Examples:**
- [Complete Controller Example](./examples/01-core/app.controller.ts)
- [Feature Controller](./examples/01-core/users/users.controller.ts)

### 3. **Providers** (`@Injectable`)
- Services - [Example](./examples/01-core/app.service.ts)
- Repositories - [Example](./examples/01-core/users/users.repository.ts)
- Factories - [Example](./examples/01-core/providers/factories-and-helpers.example.ts)
- Helpers - [Example](./examples/01-core/providers/factories-and-helpers.example.ts)
- Custom Providers - [Example](./examples/01-core/dependency-injection/custom-providers.example.ts)
- Optional Providers - [Example](./examples/01-core/dependency-injection/optional-dependencies.example.ts)
- Property-based Injection - [Example](./examples/01-core/dependency-injection/property-injection.example.ts)

**Code Examples:**
- [Service](./examples/01-core/app.service.ts)
- [Repository Pattern](./examples/01-core/users/users.repository.ts)
- [Factories and Helpers](./examples/01-core/providers/factories-and-helpers.example.ts)
- [Custom Providers](./examples/01-core/dependency-injection/custom-providers.example.ts)
- [Optional Dependencies](./examples/01-core/dependency-injection/optional-dependencies.example.ts)

### 4. **Dependency Injection (DI)**
- Constructor Injection - [Example](./examples/01-core/dependency-injection/constructor-injection.example.ts)
- Property Injection - [Example](./examples/01-core/dependency-injection/property-injection.example.ts)
- Optional Dependencies - [Example](./examples/01-core/dependency-injection/optional-dependencies.example.ts)
- Custom Providers - [Example](./examples/01-core/dependency-injection/custom-providers.example.ts)
- Scope (Singleton, Request, Transient) - [Example](./examples/01-core/dependency-injection/scopes.example.ts)

**Code Examples:**
- [Constructor Injection](./examples/01-core/dependency-injection/constructor-injection.example.ts)
- [Property Injection](./examples/01-core/dependency-injection/property-injection.example.ts)
- [Optional Dependencies](./examples/01-core/dependency-injection/optional-dependencies.example.ts)
- [Provider Scopes](./examples/01-core/dependency-injection/scopes.example.ts)
- [Custom Providers](./examples/01-core/dependency-injection/custom-providers.example.ts)

### 5. **Service Locator Pattern**
- Basic Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Cached Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Dynamic Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Factory Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Scoped Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Lazy Service Locator - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- Plugin System - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- Strategy Pattern - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)

**Code Examples:**
- [Complete Service Locator Example](./examples/01-core/service-locator/service-locator.example.ts)
- [Service Locator Controller](./examples/01-core/service-locator/service-locator.controller.ts)
- [Advanced Patterns](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- [Service Locator Documentation](./examples/01-core/service-locator/README.md)

---

## Architecture

**Code Examples:**
- [Main Entry Point](./examples/00-architecture/main.ts)
- [Module Organization](./examples/00-architecture/module-organization.example.ts)

### **Application Structure**
- Main Entry Point (`main.ts`) - [Example](./examples/00-architecture/main.ts)
- App Module (`app.module.ts`) - [Example](./examples/01-core/app.module.ts)
- Module Organization - [Example](./examples/00-architecture/module-organization.example.ts)
- Feature-based Architecture - [Example](./examples/00-architecture/module-organization.example.ts)
- Layered Architecture - [Example](./examples/00-architecture/module-organization.example.ts)
- Module Re-exporting - [Example](./examples/00-architecture/module-organization.example.ts)

### **Request Lifecycle**
1. Middleware
2. Guards
3. Interceptors (before)
4. Pipes
5. Controller Handler
6. Service
7. Interceptors (after)
8. Exception Filters
9. Response

---

## Decorators

**Code Examples:**
- [Parameter Decorators](./examples/02-decorators/parameter-decorators.example.ts)
- [Method Decorators](./examples/02-decorators/method-decorators.example.ts)
- [Custom Decorators](./examples/02-decorators/custom-decorators.example.ts)

### **Class Decorators**
- `@Module()` - Define a module
- `@Controller()` - Define a controller
- `@Injectable()` - Define a provider
- `@Global()` - Make module global
- `@Catch()` - Exception filter

### **Method Decorators**
- `@Get()` - HTTP GET handler - [Example](./examples/02-decorators/method-decorators.example.ts)
- `@Post()` - HTTP POST handler
- `@Put()` - HTTP PUT handler
- `@Patch()` - HTTP PATCH handler
- `@Delete()` - HTTP DELETE handler
- `@All()` - All HTTP methods handler
- `@UseGuards()` - Apply guards
- `@UseInterceptors()` - Apply interceptors
- `@UsePipes()` - Apply pipes
- `@UseFilters()` - Apply exception filters
- `@SetMetadata()` - Set custom metadata
- `@Headers()` - Extract headers
- `@Ip()` - Extract IP address
- `@Session()` - Extract session
- `@HostParam()` - Extract host parameter
- `@Req()` / `@Request()` - Request object
- `@Res()` / `@Response()` - Response object
- `@Next()` - Next function
- `@Body()` - Request body
- `@Query()` - Query parameters
- `@Param()` - Route parameters
- `@HttpCode()` - Set status code
- `@Header()` - Set response header
- `@Redirect()` - Redirect response
- `@Render()` - Render template

### **Parameter Decorators**
- `@Body()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Query()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Param()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Headers()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Ip()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Session()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@HostParam()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Req()` / `@Request()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Res()` / `@Response()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)
- `@Next()` - [Example](./examples/02-decorators/parameter-decorators.example.ts)

### **Property Decorators**
- `@Inject()` - Inject dependency
- `@Optional()` - Optional dependency
- `@InjectRepository()` - Inject repository (TypeORM)
- `@InjectModel()` - Inject model (Mongoose)

### **Custom Decorators**
- [Custom Parameter Decorators](./examples/02-decorators/custom-decorators.example.ts)
- [Custom Metadata Decorators](./examples/02-decorators/custom-decorators.example.ts)

---

## Dependency Injection

### **Scopes**
- **DEFAULT** (Singleton) - Single instance shared across app
- **REQUEST** - New instance per request
- **TRANSIENT** - New instance every time injected

### **Custom Providers**
- Value Providers
- Factory Providers
- Class Providers
- Async Providers
- Existing Providers

### **Injection Tokens**
- String Tokens
- Symbol Tokens
- Class Tokens

---

## Service Locator Pattern

### **Overview**
The Service Locator pattern provides a way to obtain service instances dynamically using `ModuleRef`. It's useful for plugin systems, strategy patterns, and dynamic service resolution.

### **Basic Patterns**
- **Basic Service Locator** - Simple service retrieval - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- **Cached Service Locator** - Service caching - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- **Dynamic Service Locator** - Runtime service resolution - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- **Factory Service Locator** - Service creation - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- **Scoped Service Locator** - Request-scoped services - [Example](./examples/01-core/service-locator/service-locator.example.ts)
- **Lazy Service Locator** - Lazy service loading - [Example](./examples/01-core/service-locator/service-locator.example.ts)

### **Advanced Patterns**
- **Plugin System** - Dynamic plugin registration - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- **Strategy Pattern** - Runtime strategy selection - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- **Repository Pattern** - Dynamic repository management - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- **Event Dispatcher** - Event handler registration - [Example](./examples/01-core/service-locator/service-locator-advanced.example.ts)

### **When to Use**
- ✅ Dynamic service resolution
- ✅ Plugin systems
- ✅ Strategy pattern implementations
- ✅ Conditional service loading
- ✅ Lazy loading

### **When NOT to Use**
- ❌ Standard dependency injection cases
- ❌ Simple service dependencies
- ❌ When dependencies are known at compile time

**Code Examples:**
- [Complete Service Locator Example](./examples/01-core/service-locator/service-locator.example.ts)
- [Service Locator Controller](./examples/01-core/service-locator/service-locator.controller.ts)
- [Advanced Patterns](./examples/01-core/service-locator/service-locator-advanced.example.ts)
- [Complete Documentation](./examples/01-core/service-locator/README.md)

---

## Modules

### **Module Types**
- Root Module
- Feature Modules
- Shared Modules
- Global Modules
- Dynamic Modules - [Complete Examples](./examples/01-core/dynamic-modules/)
- Module Re-exporting - [Example](./examples/00-architecture/module-organization.example.ts)

### **Dynamic Module Patterns**
- `forRoot()` - Synchronous root configuration - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- `forRootAsync()` - Asynchronous root configuration - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- `forFeature()` - Synchronous feature configuration - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- `forFeatureAsync()` - Asynchronous feature configuration - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- `register()` - Simple registration pattern - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- `registerAsync()` - Simple async registration - [Example](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)

**Practical Examples:**
- [Database Module](./examples/01-core/dynamic-modules/complete-dynamic-module.example.ts)
- [Cache Module](./examples/01-core/dynamic-modules/cache-module.example.ts)
- [HTTP Client Module](./examples/01-core/dynamic-modules/http-client-module.example.ts)
- [Logger Module](./examples/01-core/dynamic-modules/logger-module.example.ts)
- [Usage Examples](./examples/01-core/dynamic-modules/usage-examples.module.ts)
- [Complete Guide](./examples/01-core/dynamic-modules/README.md)

### **Module Metadata**
- `imports` - Import other modules
- `controllers` - Controllers in module
- `providers` - Providers in module
- `exports` - Export providers
- `global` - Make module global

---

## Controllers

### **Route Handling**
- Route Paths
- Route Parameters
- Query Parameters
- Request Body
- Response Handling
- Status Codes
- Headers
- Redirects

### **HTTP Methods**
- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS
- HEAD
- ALL

### **Route Patterns**
- Static Routes
- Parameter Routes (`:id`)
- Wildcard Routes (`*`)
- Route Prefixes

---

## Providers & Services

### **Service Types**
- Business Logic Services
- Data Access Services
- Utility Services
- Factory Services
- Helper Services

### **Service Patterns**
- Singleton Pattern
- Factory Pattern
- Repository Pattern
- Service Layer Pattern

---

## Middleware

**Code Examples:**
- [Middleware Examples](./examples/03-middleware/logger.middleware.ts)
- [Middleware Configuration](./examples/03-middleware/middleware.module.ts)
- [Middleware Controller](./examples/03-middleware/middleware.controller.ts)

### **Types**
- Functional Middleware - [Example](./examples/03-middleware/logger.middleware.ts)
- Class-based Middleware - [Example](./examples/03-middleware/logger.middleware.ts)
- Global Middleware - [Example](./examples/03-middleware/middleware.module.ts)
- Route-specific Middleware - [Example](./examples/03-middleware/middleware.module.ts)

### **Built-in Middleware**
- CORS - [Example](./examples/03-middleware/built-in-middleware.example.ts)
- Helmet - [Example](./examples/03-middleware/built-in-middleware.example.ts)
- Compression - [Example](./examples/03-middleware/built-in-middleware.example.ts)
- Body Parser
- Cookie Parser - [Example](./examples/03-middleware/built-in-middleware.example.ts)

### **Custom Middleware**
- Request Logging - [Example](./examples/03-middleware/logger.middleware.ts)
- Authentication - [Example](./examples/03-middleware/logger.middleware.ts)
- Request Transformation - [Example](./examples/03-middleware/logger.middleware.ts)
- Response Transformation

---

## Exception Filters

**Code Examples:**
- [Exception Filters](./examples/07-exceptions/exception-filters.ts)
- [Exception Usage](./examples/07-exceptions/exceptions.controller.ts)

### **Built-in Exceptions**
- `BadRequestException` - [Example](./examples/07-exceptions/exceptions.controller.ts)
- `UnauthorizedException` - [Example](./examples/07-exceptions/exceptions.controller.ts)
- `NotFoundException` - [Example](./examples/07-exceptions/exceptions.controller.ts)
- `ForbiddenException` - [Example](./examples/07-exceptions/exceptions.controller.ts)
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException` - [Example](./examples/07-exceptions/exceptions.controller.ts)
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`

### **Custom Exception Filters**
- Global Exception Filters - [Example](./examples/07-exceptions/exception-filters.ts)
- Controller-level Filters - [Example](./examples/07-exceptions/exceptions.controller.ts)
- Method-level Filters - [Example](./examples/07-exceptions/exceptions.controller.ts)
- Exception Transformation - [Example](./examples/07-exceptions/exception-filters.ts)
- Error Logging - [Example](./examples/07-exceptions/exception-filters.ts)

---

## Pipes

**Code Examples:**
- [Custom Pipes](./examples/04-pipes/validation.pipe.ts)
- [Pipe Usage](./examples/04-pipes/pipes.controller.ts)

### **Built-in Pipes**
- `ValidationPipe` - DTO validation - [Example](./examples/04-pipes/pipes.controller.ts)
- `ParseIntPipe` - Parse to integer - [Example](./examples/04-pipes/pipes.controller.ts)
- `ParseFloatPipe` - Parse to float - [Example](./examples/04-pipes/additional-builtin-pipes.example.ts)
- `ParseBoolPipe` - Parse to boolean - [Example](./examples/04-pipes/pipes.controller.ts)
- `ParseArrayPipe` - Parse to array - [Example](./examples/04-pipes/pipes.controller.ts)
- `ParseUUIDPipe` - Parse to UUID - [Example](./examples/04-pipes/additional-builtin-pipes.example.ts)
- `ParseEnumPipe` - Parse to enum - [Example](./examples/04-pipes/pipes.controller.ts)
- `DefaultValuePipe` - Default value - [Example](./examples/04-pipes/pipes.controller.ts)

### **Custom Pipes**
- Transformation Pipes - [Example](./examples/04-pipes/validation.pipe.ts)
- Validation Pipes - [Example](./examples/04-pipes/validation.pipe.ts)
- Async Pipes - [Example](./examples/04-pipes/async-pipes.example.ts)
- Parameter Pipes - [Example](./examples/04-pipes/validation.pipe.ts)

### **Pipe Usage**
- Global Pipes
- Controller-level Pipes - [Example](./examples/04-pipes/pipes.controller.ts)
- Method-level Pipes - [Example](./examples/04-pipes/pipes.controller.ts)
- Parameter-level Pipes - [Example](./examples/04-pipes/pipes.controller.ts)

---

## Guards

**Code Examples:**
- [Guards Implementation](./examples/05-guards/auth.guard.ts)
- [Guards Usage](./examples/05-guards/guards.controller.ts)

### **Built-in Guards**
- Authentication Guards
- Authorization Guards
- Role-based Guards - [Example](./examples/05-guards/auth.guard.ts)
- Permission-based Guards - [Example](./examples/05-guards/auth.guard.ts)

### **Custom Guards**
- JWT Guards - [Example](./examples/11-auth/jwt.strategy.ts)
- API Key Guards - [Example](./examples/05-guards/auth.guard.ts)
- Session Guards
- Custom Logic Guards - [Example](./examples/05-guards/auth.guard.ts)

### **Guard Execution**
- Global Guards
- Controller-level Guards - [Example](./examples/05-guards/guards.controller.ts)
- Method-level Guards - [Example](./examples/05-guards/guards.controller.ts)
- Execution Order

---

## Interceptors

**Code Examples:**
- [Interceptor Examples](./examples/06-interceptors/logging.interceptor.ts)
- [Interceptor Usage](./examples/06-interceptors/interceptors.controller.ts)

### **Use Cases**
- Logging - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Transform Response - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Cache Response - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Timeout Handling - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Error Handling - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Performance Monitoring - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Request/Response Transformation - [Example](./examples/06-interceptors/logging.interceptor.ts)

### **Interceptor Types**
- Before Interceptors
- After Interceptors
- Error Interceptors - [Example](./examples/06-interceptors/logging.interceptor.ts)
- Async Interceptors

### **Interceptor Execution**
- Global Interceptors
- Controller-level Interceptors
- Method-level Interceptors - [Example](./examples/06-interceptors/interceptors.controller.ts)
- Execution Order

---

## Custom Decorators

**Code Examples:**
- [Custom Decorators](./examples/02-decorators/custom-decorators.example.ts)

### **Parameter Decorators**
- Custom Parameter Extraction - [Example](./examples/02-decorators/custom-decorators.example.ts)
- Metadata Decorators - [Example](./examples/02-decorators/custom-decorators.example.ts)
- User Decorators - [Example](./examples/02-decorators/custom-decorators.example.ts)
- Role Decorators - [Example](./examples/02-decorators/custom-decorators.example.ts)

### **Method Decorators**
- Custom Route Decorators
- Metadata Decorators - [Example](./examples/02-decorators/custom-decorators.example.ts)
- Permission Decorators

### **Class Decorators**
- Custom Module Decorators
- Metadata Decorators

### **Property Decorators**
- Custom Injection Decorators
- Validation Decorators

---

## Lifecycle Hooks

**Code Examples:**
- [Lifecycle Hooks](./examples/12-advanced/lifecycle-hooks.example.ts)

### **Module Lifecycle**
- `onModuleInit()` - Called after module initialization - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onModuleDestroy()` - Called before module destruction - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onApplicationBootstrap()` - Called after application bootstrap - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onApplicationShutdown()` - Called before application shutdown - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)

### **Provider Lifecycle**
- `onModuleInit()` - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onModuleDestroy()` - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onApplicationBootstrap()` - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)
- `onApplicationShutdown()` - [Example](./examples/12-advanced/lifecycle-hooks.example.ts)

---

## Configuration

**Code Examples:**
- [Configuration Module](./examples/09-configuration/config.module.ts)
- [Configuration Service](./examples/09-configuration/config.service.ts)
- [Configuration Usage](./examples/09-configuration/config.controller.ts)

### **Configuration Module**
- Environment Variables - [Example](./examples/09-configuration/config.module.ts)
- Configuration Files - [Example](./examples/09-configuration/config.module.ts)
- Config Validation - [Example](./examples/09-configuration/config.module.ts)
- Config Schema - [Example](./examples/09-configuration/config.module.ts)
- Dynamic Configuration - [Example](./examples/09-configuration/config.module.ts)

### **Configuration Sources**
- `.env` files - [Example](./examples/09-configuration/config.module.ts)
- Environment Variables - [Example](./examples/09-configuration/config.service.ts)
- Configuration Files (JSON, YAML)
- Runtime Configuration - [Example](./examples/09-configuration/config.service.ts)

---

## Database Integration

**Code Examples:**
- [TypeORM Integration](./examples/10-database/typeorm.example.ts)
- [TypeORM Entities](./examples/10-database/entities/user.entity.ts)
- [TypeORM Service](./examples/10-database/users.service.ts)

### **TypeORM**
- Entities - [Example](./examples/10-database/entities/user.entity.ts)
- Repositories - [Example](./examples/10-database/users.service.ts)
- Entity Relations - [Example](./examples/10-database/entities/user.entity.ts)
- Migrations
- Transactions - [Example](./examples/10-database/users.service.ts)
- Query Builder - [Example](./examples/10-database/users.service.ts)

### **Mongoose**
- Schemas - [Example](./examples/10-database/mongoose.example.ts)
- Models - [Example](./examples/10-database/mongoose.example.ts)
- Document Methods - [Example](./examples/10-database/mongoose.example.ts)
- Queries - [Example](./examples/10-database/mongoose.example.ts)
- Middleware
- Plugins

**Code Examples:**
- [Complete Mongoose Example](./examples/10-database/mongoose.example.ts)

### **Prisma**
- Prisma Client - [Example](./examples/10-database/prisma.example.ts)
- Prisma Migrate
- Prisma Studio
- Relations - [Example](./examples/10-database/prisma.example.ts)
- Transactions - [Example](./examples/10-database/prisma.example.ts)

**Code Examples:**
- [Complete Prisma Example](./examples/10-database/prisma.example.ts)

### **Sequelize**
- Models - [Example](./examples/10-database/sequelize.example.ts)
- Associations - [Example](./examples/10-database/sequelize.example.ts)
- Migrations
- Transactions
- Query Interface

**Code Examples:**
- [Complete Sequelize Example](./examples/10-database/sequelize.example.ts)

---

## Authentication & Authorization

**Code Examples:**
- [JWT Strategy](./examples/11-auth/jwt.strategy.ts)
- [Auth Service](./examples/11-auth/auth.service.ts)
- [Auth Module](./examples/11-auth/auth.module.ts)
- [Auth Controller](./examples/11-auth/auth.controller.ts)
- [Guards](./examples/05-guards/auth.guard.ts)

### **Authentication**
- JWT Authentication - [Example](./examples/11-auth/jwt.strategy.ts)
- Passport Integration - [Example](./examples/11-auth/auth.module.ts)
- Local Strategy - [Example](./examples/11-auth/local-strategy.example.ts)
- OAuth Strategies
- API Key Authentication - [Example](./examples/05-guards/auth.guard.ts)
- Session-based Authentication

### **Authorization**
- Role-based Access Control (RBAC) - [Example](./examples/05-guards/auth.guard.ts)
- Permission-based Access Control - [Example](./examples/05-guards/auth.guard.ts)
- Custom Authorization Logic - [Example](./examples/05-guards/auth.guard.ts)
- Guards for Authorization - [Example](./examples/05-guards/guards.controller.ts)

### **Security**
- Password Hashing (bcrypt) - [Example](./examples/11-auth/auth.service.ts)
- Token Management - [Example](./examples/11-auth/auth.service.ts)
- Session Management
- CSRF Protection
- Rate Limiting

---

## Validation

**Code Examples:**
- [DTOs with Validation](./examples/08-validation/create-user.dto.ts)
- [Validation Controller](./examples/08-validation/validation.controller.ts)

### **Class Validator**
- Validation Decorators - [Example](./examples/08-validation/create-user.dto.ts)
- Custom Validators - [Example](./examples/08-validation/create-user.dto.ts)
- Validation Groups - [Example](./examples/08-validation/validation-groups.example.ts)
- Conditional Validation - [Example](./examples/08-validation/validation-groups.example.ts)
- Async Validation - [Example](./examples/08-validation/validation-groups.example.ts)

### **Validation Decorators**
- `@IsString()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsNumber()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsEmail()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsOptional()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsNotEmpty()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@Min()`, `@Max()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@Length()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@Matches()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsArray()` - [Example](./examples/08-validation/create-user.dto.ts)
- `@IsObject()`
- `@ValidateNested()` - [Example](./examples/08-validation/create-user.dto.ts)
- Custom Validators - [Example](./examples/08-validation/create-user.dto.ts)

### **DTOs (Data Transfer Objects)**
- Request DTOs - [Example](./examples/08-validation/create-user.dto.ts)
- Response DTOs - [Example](./examples/08-validation/response-dtos.example.ts)
- Validation DTOs - [Example](./examples/08-validation/create-user.dto.ts)
- Transformation DTOs - [Example](./examples/08-validation/response-dtos.example.ts)

---

## Testing

### **Unit Testing**
- Service Testing
- Controller Testing
- Provider Testing
- Mocking Dependencies
- Test Utilities

### **Integration Testing**
- E2E Testing
- Module Testing
- Database Testing
- API Testing

### **Testing Utilities**
- `@nestjs/testing`
- Test Module
- Override Providers
- Mock Factories

**Note:** Testing examples would require a complete test setup. The concepts are covered in the NestJS official documentation.

---

## Advanced Features

**Code Examples:**
- [WebSockets](./examples/12-advanced/websockets.gateway.ts)
- [GraphQL](./examples/12-advanced/graphql.resolver.ts)
- [Microservices](./examples/12-advanced/microservices.controller.ts)
- [CQRS](./examples/12-advanced/cqrs.example.ts)
- [File Upload](./examples/12-advanced/file-upload.controller.ts)
- [Caching](./examples/12-advanced/caching.example.ts)
- [Task Scheduling](./examples/12-advanced/scheduling.example.ts)

### **WebSockets**
- Gateways - [Example](./examples/12-advanced/websockets.gateway.ts)
- WebSocket Adapters
- Socket.IO Integration - [Example](./examples/12-advanced/websockets.gateway.ts)
- Real-time Communication - [Example](./examples/12-advanced/websockets.gateway.ts)

### **GraphQL**
- GraphQL Module
- Resolvers - [Example](./examples/12-advanced/graphql.resolver.ts)
- Queries - [Example](./examples/12-advanced/graphql.resolver.ts)
- Mutations - [Example](./examples/12-advanced/graphql.resolver.ts)
- Subscriptions - [Example](./examples/12-advanced/graphql-subscriptions.example.ts)
- Schema Definition - [Example](./examples/12-advanced/graphql-types/user.type.ts)

### **Microservices**
- Microservice Transport - [Example](./examples/12-advanced/microservices.controller.ts)
- Message Patterns - [Example](./examples/12-advanced/microservices.controller.ts)
- Event Patterns - [Example](./examples/12-advanced/microservices.controller.ts)
- Client Proxy - [Example](./examples/12-advanced/microservices.controller.ts)
- Hybrid Applications

### **CQRS**
- Commands - [Example](./examples/12-advanced/cqrs.example.ts)
- Queries - [Example](./examples/12-advanced/cqrs.example.ts)
- Events - [Example](./examples/12-advanced/cqrs.example.ts)
- Event Handlers - [Example](./examples/12-advanced/cqrs.example.ts)
- Sagas

### **Event Emitter**
- Event Publishing - [Example](./examples/12-advanced/event-emitter.example.ts)
- Event Listening - [Example](./examples/12-advanced/event-emitter.example.ts)
- Async Events - [Example](./examples/12-advanced/event-emitter.example.ts)
- Event Patterns - [Example](./examples/12-advanced/event-emitter.example.ts)

**Code Examples:**
- [Complete Event Emitter Example](./examples/12-advanced/event-emitter.example.ts)

### **File Upload**
- File Interceptor - [Example](./examples/12-advanced/file-upload.controller.ts)
- File Upload - [Example](./examples/12-advanced/file-upload.controller.ts)
- File Validation - [Example](./examples/12-advanced/file-upload.controller.ts)
- File Storage - [Example](./examples/12-advanced/file-upload.controller.ts)

### **Caching**
- Cache Manager - [Example](./examples/12-advanced/caching.example.ts)
- Cache Interceptor - [Example](./examples/12-advanced/caching.example.ts)
- Cache Keys - [Example](./examples/12-advanced/caching.example.ts)
- Cache TTL - [Example](./examples/12-advanced/caching.example.ts)
- Redis Integration

### **Task Scheduling**
- Cron Jobs - [Example](./examples/12-advanced/scheduling.example.ts)
- Interval Jobs - [Example](./examples/12-advanced/scheduling.example.ts)
- Timeout Jobs - [Example](./examples/12-advanced/scheduling.example.ts)
- Task Scheduling - [Example](./examples/12-advanced/scheduling.example.ts)

### **HTTP Module**
- HTTP Client - [Example](./examples/12-advanced/http-module.example.ts)
- Axios Integration - [Example](./examples/12-advanced/http-module.example.ts)
- Request Configuration - [Example](./examples/12-advanced/http-module.example.ts)
- Response Handling - [Example](./examples/12-advanced/http-module.example.ts)

**Code Examples:**
- [Complete HTTP Module Example](./examples/12-advanced/http-module.example.ts)
- [HTTP Module Controller](./examples/12-advanced/http-module.controller.ts)

### **Logging**
- Logger Service - [Example](./examples/12-advanced/logging.example.ts)
- Custom Loggers - [Example](./examples/12-advanced/logging.example.ts)
- Log Levels - [Example](./examples/12-advanced/logging.example.ts)
- Log Formatting - [Example](./examples/12-advanced/logging.example.ts)

**Code Examples:**
- [Complete Logging Example](./examples/12-advanced/logging.example.ts)
- [Basic Logger](./examples/01-core/shared/logger.service.ts)
- [Custom Logger Service](./examples/12-advanced/logging.example.ts)
- [File Logger](./examples/12-advanced/logging.example.ts)
- [Structured Logger](./examples/12-advanced/logging.example.ts)

### **Serialization**
- Class Serializer - [Example](./examples/12-advanced/serialization.example.ts)
- Exclude Properties - [Example](./examples/12-advanced/serialization.example.ts)
- Transform Properties - [Example](./examples/12-advanced/serialization.example.ts)
- Serialization Groups - [Example](./examples/12-advanced/serialization.example.ts)

**Code Examples:**
- [Complete Serialization Example](./examples/12-advanced/serialization.example.ts)

### **Versioning**
- URI Versioning - [Example](./examples/12-advanced/versioning.example.ts)
- Header Versioning - [Example](./examples/12-advanced/versioning.example.ts)
- Media Type Versioning - [Example](./examples/12-advanced/versioning.example.ts)
- Version Controllers - [Example](./examples/12-advanced/versioning.example.ts)

**Code Examples:**
- [Complete Versioning Example](./examples/12-advanced/versioning.example.ts)

### **Compression**
- Compression Middleware - [Example](./examples/12-advanced/compression.example.ts)
- Response Compression - [Example](./examples/12-advanced/compression.example.ts)
- Compression Options - [Example](./examples/12-advanced/compression.example.ts)

**Code Examples:**
- [Complete Compression Example](./examples/12-advanced/compression.example.ts)

### **Rate Limiting**
- Rate Limiter - [Example](./examples/12-advanced/rate-limiting.example.ts)
- Throttler Guard - [Example](./examples/12-advanced/rate-limiting.example.ts)
- Rate Limit Configuration - [Example](./examples/12-advanced/rate-limiting.example.ts)

**Code Examples:**
- [Complete Rate Limiting Example](./examples/12-advanced/rate-limiting.example.ts)

### **Health Checks**
- Health Check Module - [Example](./examples/12-advanced/health-checks.example.ts)
- Health Indicators - [Example](./examples/12-advanced/health-checks.example.ts)
- Custom Health Checks - [Example](./examples/12-advanced/health-checks.example.ts)

**Code Examples:**
- [Complete Health Checks Example](./examples/12-advanced/health-checks.example.ts)
- Database Health Check
- HTTP Health Check
- Memory Health Check
- Disk Health Check
- Comprehensive Health Check

### **Documentation**
- Swagger/OpenAPI - [Example](./examples/12-advanced/documentation-swagger.example.ts)
- API Documentation - [Example](./examples/12-advanced/documentation-swagger.example.ts)
- Schema Generation - [Example](./examples/12-advanced/documentation-swagger.example.ts)
- Decorators for Documentation - [Example](./examples/12-advanced/documentation-swagger.example.ts)

**Code Examples:**
- [Complete Swagger/OpenAPI Example](./examples/12-advanced/documentation-swagger.example.ts)

### **Internationalization (i18n)**
- i18n Module - [Example](./examples/12-advanced/i18n.example.ts)
- Translation Files - [Example](./examples/12-advanced/i18n.example.ts)
- Language Detection - [Example](./examples/12-advanced/i18n.example.ts)
- Translation Service - [Example](./examples/12-advanced/i18n.example.ts)

**Code Examples:**
- [Complete i18n Example](./examples/12-advanced/i18n.example.ts)

### **Server-Sent Events (SSE)**
- SSE Endpoints - [Example](./examples/12-advanced/sse-server-sent-events.example.ts)
- Event Streaming - [Example](./examples/12-advanced/sse-server-sent-events.example.ts)
- Real-time Updates - [Example](./examples/12-advanced/sse-server-sent-events.example.ts)

**Code Examples:**
- [Complete SSE Example](./examples/12-advanced/sse-server-sent-events.example.ts)

### **Streaming**
- Response Streaming - [Example](./examples/12-advanced/streaming.example.ts)
- File Streaming - [Example](./examples/12-advanced/streaming.example.ts)
- Data Streaming - [Example](./examples/12-advanced/streaming.example.ts)

**Code Examples:**
- [Complete Streaming Example](./examples/12-advanced/streaming.example.ts)
- File Streaming
- Data Streaming
- Large Dataset Streaming
- Video Streaming
- Real-time Streaming

---

## Best Practices

1. **Module Organization**
   - Feature-based modules
   - Shared modules for common functionality
   - Avoid circular dependencies

2. **Dependency Injection**
   - Use constructor injection
   - Keep dependencies explicit
   - Use interfaces for abstraction

3. **Error Handling**
   - Use exception filters
   - Provide meaningful error messages
   - Log errors appropriately

4. **Validation**
   - Validate all inputs
   - Use DTOs for data transfer
   - Validate at the boundary

5. **Security**
   - Authenticate all protected routes
   - Authorize based on roles/permissions
   - Sanitize inputs
   - Use HTTPS in production

6. **Performance**
   - Use caching where appropriate
   - Optimize database queries
   - Use compression
   - Monitor performance

7. **Testing**
   - Write unit tests
   - Write integration tests
   - Maintain high test coverage
   - Test edge cases

8. **Code Quality**
   - Follow SOLID principles
   - Use TypeScript strictly
   - Document complex logic
   - Keep functions small and focused

---

## Interview Preparation

Comprehensive interview questions covering all NestJS concepts:

- **[120+ Interview Questions](./docs/14-interview-questions.md)** - Questions organized by topic and difficulty
  - Core Concepts (Modules, Controllers, Services, DI)
  - Decorators, Middleware, Pipes, Guards, Interceptors
  - Exception Filters, Validation, Database Integration
  - Authentication & Authorization
  - Advanced Features (WebSockets, GraphQL, Microservices)
  - Architecture & Best Practices
  - Performance & Optimization
  - Testing
  - Scenario-based Questions

Each question includes detailed answers and code examples.

---

## Resources

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [NestJS GitHub Repository](https://github.com/nestjs/nest)
- [NestJS Examples](https://github.com/nestjs/nest/tree/master/sample)
- [NestJS Best Practices](https://github.com/nestjs/awesome-nestjs)
- [Interview Questions Guide](./docs/14-interview-questions.md)

---

## License

This project is for educational purposes.


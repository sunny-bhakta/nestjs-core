# NestJS Code Examples

This directory contains comprehensive code examples for all NestJS concepts. Each example is well-documented and demonstrates best practices.

## 📁 Directory Structure

### 00-architecture/
Application architecture and structure examples.

- **main.ts** - Main entry point with bootstrap configuration
- **module-organization.example.ts** - Feature-based and layered architecture patterns

### 01-core/
Core NestJS concepts including modules, controllers, services, and dependency injection.

- **app.module.ts** - Root module example
- **app.controller.ts** - Complete controller with all HTTP methods
- **app.service.ts** - Service example with business logic
- **users/** - Feature module example (UsersModule, UsersController, UsersService, UsersRepository)
- **products/** - Feature module example (ProductsModule, ProductsController, ProductsService)
- **shared/** - Shared/global module example
- **dynamic/** - Dynamic module configuration
- **dependency-injection/** - DI patterns (constructor, property, scopes, custom providers, optional dependencies)
- **providers/** - Factory and helper services
- **service-locator/** - Service Locator pattern examples
  - **service-locator.example.ts** - Complete Service Locator implementation
  - **service-locator.controller.ts** - Controller examples
  - **service-locator-advanced.example.ts** - Advanced patterns (plugins, strategies, repositories)
  - **README.md** - Complete documentation

### 02-decorators/
All types of decorators used in NestJS.

- **parameter-decorators.example.ts** - All parameter decorators (@Body, @Query, @Param, etc.)
- **method-decorators.example.ts** - HTTP method decorators and route configuration
- **custom-decorators.example.ts** - Creating custom decorators

### 03-middleware/
Middleware implementation examples.

- **logger.middleware.ts** - Functional and class-based middleware
- **middleware.module.ts** - Middleware configuration
- **middleware.controller.ts** - Using middleware in controllers
- **built-in-middleware.example.ts** - CORS, Helmet, Compression, Cookie Parser

### 04-pipes/
Built-in and custom pipes for validation and transformation.

- **validation.pipe.ts** - Custom validation and transformation pipes
- **pipes.controller.ts** - Using pipes at different levels
- **async-pipes.example.ts** - Asynchronous pipes
- **additional-builtin-pipes.example.ts** - ParseFloatPipe, ParseUUIDPipe

### 05-guards/
Authentication and authorization guards.

- **auth.guard.ts** - JWT, API key, role-based, and permission guards
- **guards.controller.ts** - Applying guards to routes

### 06-interceptors/
Interceptors for logging, transformation, caching, and more.

- **logging.interceptor.ts** - Logging, transformation, caching, timeout, error handling interceptors
- **interceptors.controller.ts** - Using interceptors

### 07-exceptions/
Exception handling and custom exception filters.

- **exception-filters.ts** - Custom exception filters
- **exceptions.controller.ts** - Throwing and handling exceptions

### 08-validation/
DTOs and validation using class-validator.

- **create-user.dto.ts** - Comprehensive DTO examples with validation decorators
- **validation.controller.ts** - Using validation in controllers
- **validation-groups.example.ts** - Validation groups, conditional validation, async validation
- **response-dtos.example.ts** - Response DTOs and transformation DTOs

### 09-configuration/
Configuration management with @nestjs/config.

- **config.module.ts** - Configuration module setup
- **config.service.ts** - Accessing configuration values
- **config.controller.ts** - Using configuration in controllers

### 10-database/
Database integration examples.

- **typeorm.example.ts** - TypeORM module configuration
- **entities/** - Entity definitions with relations
- **users.service.ts** - Repository usage examples
- **mongoose.example.ts** - Mongoose integration
- **prisma.example.ts** - Prisma integration
- **sequelize.example.ts** - Sequelize integration

### 11-auth/
JWT authentication and authorization.

- **jwt.strategy.ts** - Passport JWT strategy
- **auth.service.ts** - Authentication service with password hashing
- **auth.module.ts** - Auth module configuration
- **auth.controller.ts** - Login, register, and protected routes
- **public.decorator.ts** - Custom decorator for public routes
- **local-strategy.example.ts** - Local Strategy authentication

### 12-advanced/
Advanced NestJS features.

- **websockets.gateway.ts** - WebSocket gateway with Socket.IO
- **graphql.resolver.ts** - GraphQL resolvers (queries, mutations)
- **graphql-types/** - GraphQL type definitions
- **graphql-subscriptions.example.ts** - GraphQL subscriptions
- **event-emitter.example.ts** - Event-driven architecture
- **microservices.controller.ts** - Microservices communication
- **cqrs.example.ts** - CQRS pattern implementation
- **file-upload.controller.ts** - File upload handling
- **caching.example.ts** - Caching implementation
- **scheduling.example.ts** - Task scheduling (cron, interval, timeout)
- **lifecycle-hooks.example.ts** - Application lifecycle hooks

## 🚀 Quick Start

1. **Core Concepts**: Start with `01-core/` to understand modules, controllers, and services
2. **Request Pipeline**: Learn about middleware, guards, pipes, and interceptors
3. **Data Validation**: Check `08-validation/` for DTO examples
4. **Authentication**: See `11-auth/` for JWT implementation
5. **Advanced Features**: Explore `12-advanced/` for WebSockets, GraphQL, etc.

## 📝 Usage

Each example file includes:
- Detailed comments explaining the concept
- Best practices
- Real-world usage patterns
- TypeScript type safety

## 🔗 Related Documentation

- [NestJS Official Docs](https://docs.nestjs.com/)
- [Main README](../README.md) - Complete concept list with links to examples

## 💡 Tips

- Read the comments in each file for detailed explanations
- Examples are production-ready patterns
- All examples use TypeScript for type safety
- Follow the directory structure for organizing your own projects


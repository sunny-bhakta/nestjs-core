# NestJS Interview Questions

Comprehensive interview questions covering all NestJS concepts, organized by topic and difficulty level.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Modules](#modules)
3. [Controllers](#controllers)
4. [Providers & Services](#providers--services)
5. [Dependency Injection](#dependency-injection)
6. [Decorators](#decorators)
7. [Middleware](#middleware)
8. [Pipes](#pipes)
9. [Guards](#guards)
10. [Interceptors](#interceptors)
11. [Exception Filters](#exception-filters)
12. [Validation](#validation)
13. [Database Integration](#database-integration)
14. [Authentication & Authorization](#authentication--authorization)
15. [Advanced Features](#advanced-features)
16. [Architecture & Best Practices](#architecture--best-practices)
17. [Performance & Optimization](#performance--optimization)
18. [Testing](#testing)

---

## Core Concepts

### Beginner Questions

**Q1: What is NestJS?**
- **Answer**: NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript and is built on top of Express.js (or Fastify). It follows architectural patterns inspired by Angular, such as dependency injection, modules, and decorators.

**Q2: What are the main building blocks of a NestJS application?**
- **Answer**: The main building blocks are:
  - **Modules**: Organize code into features
  - **Controllers**: Handle HTTP requests
  - **Providers/Services**: Contain business logic
  - **Middleware**: Process requests before they reach route handlers
  - **Guards**: Determine if requests should be handled
  - **Interceptors**: Transform requests/responses
  - **Pipes**: Transform and validate data
  - **Exception Filters**: Handle exceptions

**Q3: What is the difference between NestJS and Express.js?**
- **Answer**: 
  - NestJS is built on top of Express.js (or Fastify) but provides a higher-level abstraction
  - NestJS uses TypeScript by default with strong typing
  - NestJS has built-in dependency injection
  - NestJS follows a modular architecture with decorators
  - NestJS provides more structure and conventions
  - Express.js is more flexible but requires more manual setup

**Q4: What is a module in NestJS?**
- **Answer**: A module is a class annotated with `@Module()` decorator that organizes related functionality. It defines:
  - `imports`: Other modules to import
  - `controllers`: Controllers in this module
  - `providers`: Services/providers in this module
  - `exports`: Providers to export for other modules

**Q5: What is a controller?**
- **Answer**: A controller is a class decorated with `@Controller()` that handles incoming HTTP requests and returns responses. It uses method decorators like `@Get()`, `@Post()`, `@Put()`, `@Delete()` to define routes.

### Intermediate Questions

**Q6: Explain the request lifecycle in NestJS.**
- **Answer**: The request lifecycle follows this order:
  1. Middleware (global, then route-specific)
  2. Guards (global, then route-specific)
  3. Interceptors (before - global, then route-specific)
  4. Pipes (global, then route-specific)
  5. Controller handler
  6. Service method
  7. Interceptors (after - route-specific, then global)
  8. Exception Filters (route-specific, then global)
  9. Response sent to client

**Q7: What is dependency injection in NestJS?**
- **Answer**: Dependency Injection is a design pattern where dependencies are provided to a class rather than created by it. NestJS uses constructor injection by default. The framework's dependency injection container manages the creation and lifecycle of dependencies.

**Q8: What are the different provider scopes in NestJS?**
- **Answer**: 
  - **DEFAULT (Singleton)**: Single instance shared across the entire application
  - **REQUEST**: New instance created for each incoming request
  - **TRANSIENT**: New instance every time it's injected

**Q9: What is the difference between a service and a provider?**
- **Answer**: 
  - **Provider** is a general term for any class that can be injected as a dependency
  - **Service** is a specific type of provider that typically contains business logic
  - All services are providers, but not all providers are services (e.g., repositories, factories, helpers)

**Q10: How do you create a global module?**
- **Answer**: Use the `@Global()` decorator on the module class:
```typescript
@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class SharedModule {}
```

### Advanced Questions

**Q11: Explain dynamic modules in NestJS.**
- **Answer**: Dynamic modules allow you to configure modules at runtime. They use static methods like `forRoot()`, `forRootAsync()`, `forFeature()`, etc., to return a module definition with custom providers. This is useful for creating reusable, configurable modules.

**Q12: What is the Service Locator pattern and when would you use it?**
- **Answer**: The Service Locator pattern uses `ModuleRef` to dynamically retrieve services at runtime. Use it for:
  - Plugin systems
  - Strategy pattern implementations
  - Dynamic service resolution
  - Conditional service loading
  - Avoid it for standard dependency injection cases

**Q13: How do you handle circular dependencies in NestJS?**
- **Answer**: 
  - Use `forwardRef()` in module imports
  - Use `@Inject(forwardRef(() => Service))` in constructors
  - Better: Refactor to avoid circular dependencies by extracting shared code to a common module

---

## Modules

### Beginner Questions

**Q14: What is the root module?**
- **Answer**: The root module is the entry point of a NestJS application. It's typically named `AppModule` and is the only module that must exist. It imports all feature modules.

**Q15: What is a feature module?**
- **Answer**: A feature module organizes code by domain/feature. For example, a `UsersModule` would contain all user-related controllers, services, and providers.

**Q16: What is a shared module?**
- **Answer**: A shared module exports providers that can be used by multiple feature modules. It's a way to share common functionality across the application.

### Intermediate Questions

**Q17: How do you re-export modules?**
- **Answer**: Re-export by including the module in both `imports` and `exports`:
```typescript
@Module({
  imports: [SharedModule],
  exports: [SharedModule], // Re-export
})
export class FeatureModule {}
```

**Q18: Explain the difference between `forRoot()` and `forFeature()` in dynamic modules.**
- **Answer**: 
  - `forRoot()`: Configures the module at the root/global level, typically used once
  - `forFeature()`: Configures the module for a specific feature, can be used multiple times with different configurations

**Q19: When would you use `forRootAsync()` instead of `forRoot()`?**
- **Answer**: Use `forRootAsync()` when you need to load configuration asynchronously, such as from `ConfigService`, environment variables, or external services. It allows dependency injection in the factory function.

---

## Controllers

### Beginner Questions

**Q20: How do you extract route parameters in NestJS?**
- **Answer**: Use the `@Param()` decorator:
```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  return { id };
}
```

**Q21: How do you extract query parameters?**
- **Answer**: Use the `@Query()` decorator:
```typescript
@Get()
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  return { page, limit };
}
```

**Q22: How do you extract the request body?**
- **Answer**: Use the `@Body()` decorator:
```typescript
@Post()
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

### Intermediate Questions

**Q23: How do you set custom HTTP status codes?**
- **Answer**: Use the `@HttpCode()` decorator:
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

**Q24: How do you set response headers?**
- **Answer**: Use the `@Header()` decorator:
```typescript
@Get()
@Header('Cache-Control', 'no-cache')
findAll() {
  return [];
}
```

**Q25: What is the difference between `@Req()` and `@Request()`?**
- **Answer**: They are aliases - both provide access to the Express request object. `@Request()` is the full name, `@Req()` is a shorthand.

---

## Providers & Services

### Beginner Questions

**Q26: What is the `@Injectable()` decorator used for?**
- **Answer**: The `@Injectable()` decorator marks a class as a provider that can be injected into other classes. It tells NestJS that this class can be managed by the dependency injection container.

**Q27: How do you inject a service into a controller?**
- **Answer**: Use constructor injection:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
```

**Q28: What is the Repository pattern?**
- **Answer**: The Repository pattern abstracts data access logic. It provides a collection-like interface for accessing domain objects, separating business logic from data access.

### Intermediate Questions

**Q29: How do you create a factory service?**
- **Answer**: Create a service with factory methods:
```typescript
@Injectable()
export class UserFactory {
  create(userData: Partial<User>): User {
    return { id: this.generateId(), ...userData };
  }
}
```

**Q30: What is the difference between a helper service and a regular service?**
- **Answer**: 
  - **Regular Service**: Contains business logic specific to a domain
  - **Helper Service**: Provides utility functions that can be used across multiple domains (e.g., string manipulation, date formatting)

---

## Dependency Injection

### Beginner Questions

**Q31: What are the three types of dependency injection in NestJS?**
- **Answer**: 
  1. **Constructor Injection** (most common)
  2. **Property Injection** (less common)
   - Optional dependencies

**Q32: How do you make a dependency optional?**
- **Answer**: Use the `@Optional()` decorator:
```typescript
constructor(@Optional() private readonly optionalService?: OptionalService) {}
```

**Q33: What is an injection token?**
- **Answer**: An injection token is used to identify a provider. It can be:
  - A class (most common)
  - A string
  - A symbol

### Intermediate Questions

**Q34: How do you create a custom provider?**
- **Answer**: Use provider objects in the module:
```typescript
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: { apiKey: 'key' },
    },
    {
      provide: 'DATABASE',
      useFactory: () => ({ host: 'localhost' }),
    },
  ],
})
export class AppModule {}
```

**Q35: What is the difference between `useValue`, `useFactory`, and `useClass`?**
- **Answer**: 
  - `useValue`: Provides a simple value
  - `useFactory`: Uses a factory function to create the provider
  - `useClass`: Uses a class as the provider (default behavior)

**Q36: How do you inject a provider using a string token?**
- **Answer**: Use `@Inject()` with the token:
```typescript
constructor(@Inject('CONFIG') private readonly config: any) {}
```

### Advanced Questions

**Q37: How do you handle circular dependencies?**
- **Answer**: Use `forwardRef()`:
```typescript
@Module({
  imports: [forwardRef(() => ModuleB)],
})
export class ModuleA {}

@Module({
  imports: [forwardRef(() => ModuleA)],
})
export class ModuleB {}
```

**Q38: Explain provider scopes and when to use each.**
- **Answer**: 
  - **DEFAULT**: Use for stateless services, most common
  - **REQUEST**: Use when you need request-specific data (e.g., user context)
  - **TRANSIENT**: Use when you need a new instance every time (rare)

---

## Decorators

### Beginner Questions

**Q39: What is a decorator in TypeScript/NestJS?**
- **Answer**: A decorator is a special kind of declaration that can be attached to classes, methods, properties, or parameters. It provides metadata and can modify the behavior of the target.

**Q40: Name the main HTTP method decorators.**
- **Answer**: `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`, `@All()`

**Q41: What parameter decorators are available for extracting request data?**
- **Answer**: `@Body()`, `@Query()`, `@Param()`, `@Headers()`, `@Req()`, `@Res()`, `@Ip()`, `@Session()`, `@HostParam()`

### Intermediate Questions

**Q42: How do you create a custom parameter decorator?**
- **Answer**: Use `createParamDecorator()`:
```typescript
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
```

**Q43: How do you create a custom metadata decorator?**
- **Answer**: Use `SetMetadata()`:
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

**Q44: What is the difference between `@Req()` and `@Request()`?**
- **Answer**: They are aliases - both provide the same Express request object. `@Request()` is the full name, `@Req()` is a shorthand.

---

## Middleware

### Beginner Questions

**Q45: What is middleware in NestJS?**
- **Answer**: Middleware functions have access to the request and response objects and the next middleware function. They execute before guards, interceptors, and route handlers.

**Q46: What is the difference between functional and class-based middleware?**
- **Answer**: 
  - **Functional**: Simple functions that receive req, res, next
  - **Class-based**: Classes implementing `NestMiddleware` interface with a `use()` method

**Q47: How do you apply middleware globally?**
- **Answer**: In the module's `configure()` method:
```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### Intermediate Questions

**Q48: How do you exclude specific routes from middleware?**
- **Answer**: Use `.exclude()`:
```typescript
consumer
  .apply(AuthMiddleware)
  .exclude('public/*', 'auth/login')
  .forRoutes('*');
```

**Q49: What are some common use cases for middleware?**
- **Answer**: 
  - Request logging
  - Authentication
  - CORS handling
  - Request transformation
  - Rate limiting
  - Compression

---

## Pipes

### Beginner Questions

**Q50: What are pipes used for?**
- **Answer**: Pipes have two main uses:
  1. **Transformation**: Transform input data to desired form
  2. **Validation**: Validate input data and throw exceptions if invalid

**Q51: Name some built-in pipes.**
- **Answer**: `ValidationPipe`, `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseArrayPipe`, `ParseUUIDPipe`, `ParseEnumPipe`, `DefaultValuePipe`

**Q52: How do you apply a pipe globally?**
- **Answer**: In `main.ts`:
```typescript
app.useGlobalPipes(new ValidationPipe());
```

### Intermediate Questions

**Q53: How do you create a custom pipe?**
- **Answer**: Implement the `PipeTransform` interface:
```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}
```

**Q54: What is the execution order of pipes?**
- **Answer**: 
  1. Global pipes
  2. Controller-level pipes
  3. Method-level pipes
  4. Parameter-level pipes

**Q55: How do you create an async pipe?**
- **Answer**: Make the `transform` method async:
```typescript
async transform(value: any, metadata: ArgumentMetadata) {
  const isValid = await this.validateAsync(value);
  return value;
}
```

---

## Guards

### Beginner Questions

**Q56: What are guards used for?**
- **Answer**: Guards determine whether a request should be handled by the route handler. They're used for authentication and authorization.

**Q57: When do guards execute in the request lifecycle?**
- **Answer**: Guards execute after middleware but before interceptors and pipes.

**Q58: What does a guard return?**
- **Answer**: 
  - `true`: Request proceeds
  - `false`: Request is denied (throws `ForbiddenException`)
  - `Promise<boolean>` or `Observable<boolean>`: Async evaluation

### Intermediate Questions

**Q59: How do you create a custom guard?**
- **Answer**: Implement the `CanActivate` interface:
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
}
```

**Q60: How do you implement role-based authorization?**
- **Answer**: Use a guard with metadata:
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // Check if user has required roles
    return true;
  }
}
```

**Q61: What is the difference between authentication and authorization?**
- **Answer**: 
  - **Authentication**: Verifies who the user is (login)
  - **Authorization**: Determines what the user can do (permissions)

---

## Interceptors

### Beginner Questions

**Q62: What are interceptors used for?**
- **Answer**: Interceptors can:
  - Bind extra logic before/after method execution
  - Transform the result returned from a function
  - Transform the exception thrown from a function
  - Extend basic function behavior

**Q63: When do interceptors execute?**
- **Answer**: Interceptors execute after guards but before pipes. They can run both before and after the route handler.

**Q64: What is the difference between interceptors and middleware?**
- **Answer**: 
  - **Middleware**: Runs before guards, has access to raw request/response
  - **Interceptors**: Runs after guards, can transform request/response, has access to route handler context

### Intermediate Questions

**Q65: How do you create a logging interceptor?**
- **Answer**: 
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Request took ${Date.now() - now}ms`)),
    );
  }
}
```

**Q66: How do you transform responses with interceptors?**
- **Answer**: Use the `map` operator:
```typescript
return next.handle().pipe(
  map(data => ({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  })),
);
```

**Q67: How do you implement caching with interceptors?**
- **Answer**: Check cache before calling handler, store result after:
```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  const cached = this.cache.get(cacheKey);
  if (cached) return of(cached);
  
  return next.handle().pipe(
    tap(data => this.cache.set(cacheKey, data)),
  );
}
```

---

## Exception Filters

### Beginner Questions

**Q68: What are exception filters?**
- **Answer**: Exception filters catch and handle exceptions thrown by route handlers, pipes, guards, and interceptors.

**Q69: Name some built-in HTTP exceptions.**
- **Answer**: `BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ForbiddenException`, `ConflictException`, `InternalServerErrorException`, etc.

**Q70: How do you create a custom exception?**
- **Answer**: Extend `HttpException`:
```typescript
export class BusinessException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
```

### Intermediate Questions

**Q71: How do you create a global exception filter?**
- **Answer**: In `main.ts`:
```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

**Q72: How do you create a custom exception filter?**
- **Answer**: Implement `ExceptionFilter`:
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handle exception
  }
}
```

**Q73: What is the difference between `@Catch()` and `@Catch(HttpException)`?**
- **Answer**: 
  - `@Catch()`: Catches all exceptions
  - `@Catch(HttpException)`: Only catches `HttpException` and its subclasses

---

## Validation

### Beginner Questions

**Q74: What is a DTO?**
- **Answer**: DTO (Data Transfer Object) is an object that defines how data will be sent over the network. It's used for validation and type safety.

**Q75: How do you validate a DTO?**
- **Answer**: Use `ValidationPipe` with decorators from `class-validator`:
```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
```

**Q76: What validation decorators are commonly used?**
- **Answer**: `@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, `@MinLength()`, `@MaxLength()`, `@IsNumber()`, `@Min()`, `@Max()`, `@IsOptional()`, `@Matches()`

### Intermediate Questions

**Q77: How do you create a custom validator?**
- **Answer**: Use `registerDecorator()`:
```typescript
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          // Validation logic
        },
      },
    });
  };
}
```

**Q78: What are validation groups?**
- **Answer**: Validation groups allow you to apply different validation rules in different scenarios (e.g., create vs update):
```typescript
@IsString({ groups: ['create', 'update'] })
@IsNotEmpty({ groups: ['create'] })
name: string;
```

**Q79: How do you perform async validation?**
- **Answer**: Use `@ValidatorConstraint({ async: true })`:
```typescript
@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(email: string): Promise<boolean> {
    // Check database
    return !exists;
  }
}
```

---

## Database Integration

### Beginner Questions

**Q80: What ORMs does NestJS support?**
- **Answer**: TypeORM, Mongoose, Prisma, Sequelize

**Q81: How do you inject a TypeORM repository?**
- **Answer**: Use `@InjectRepository()`:
```typescript
constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
) {}
```

**Q82: What is the difference between TypeORM and Mongoose?**
- **Answer**: 
  - **TypeORM**: Works with SQL databases (PostgreSQL, MySQL, etc.), uses entities
  - **Mongoose**: Works with MongoDB, uses schemas and documents

### Intermediate Questions

**Q83: How do you handle database transactions in TypeORM?**
- **Answer**: Use the transaction manager:
```typescript
await this.userRepository.manager.transaction(async (transactionalEntityManager) => {
  // Transaction logic
});
```

**Q84: How do you define relationships in TypeORM?**
- **Answer**: Use relationship decorators:
```typescript
@OneToMany(() => Product, product => product.user)
products: Product[];

@ManyToOne(() => User, user => user.products)
user: User;
```

**Q85: What is the difference between Active Record and Data Mapper patterns in TypeORM?**
- **Answer**: 
  - **Active Record**: Entity contains both data and methods
  - **Data Mapper**: Entities are pure data, repositories handle operations

---

## Authentication & Authorization

### Beginner Questions

**Q86: What is JWT?**
- **Answer**: JWT (JSON Web Token) is a compact, URL-safe token format used for authentication. It contains claims about the user and is signed to prevent tampering.

**Q87: How do you implement JWT authentication in NestJS?**
- **Answer**: Use `@nestjs/passport` with `passport-jwt`:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

**Q88: What is the difference between authentication and authorization?**
- **Answer**: 
  - **Authentication**: Verifies who the user is
  - **Authorization**: Determines what the user can do

### Intermediate Questions

**Q89: How do you hash passwords in NestJS?**
- **Answer**: Use bcrypt:
```typescript
import * as bcrypt from 'bcrypt';

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
```

**Q90: How do you implement role-based access control (RBAC)?**
- **Answer**: Use guards with metadata:
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Get('admin')
adminRoute() {}
```

**Q91: What is the Local Strategy in Passport?**
- **Answer**: Local Strategy authenticates users using username and password. It's used for login forms.

---

## Advanced Features

### Beginner Questions

**Q92: What are WebSockets used for?**
- **Answer**: WebSockets enable real-time bidirectional communication between client and server, useful for chat applications, live updates, etc.

**Q93: What is GraphQL?**
- **Answer**: GraphQL is a query language for APIs that allows clients to request exactly the data they need. It provides a single endpoint for all operations.

**Q94: What is CQRS?**
- **Answer**: CQRS (Command Query Responsibility Segregation) separates read and write operations, using different models for commands and queries.

### Intermediate Questions

**Q95: How do you implement WebSockets in NestJS?**
- **Answer**: Use `@WebSocketGateway()`:
```typescript
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    this.server.emit('message', data);
  }
}
```

**Q96: How do you handle file uploads?**
- **Answer**: Use `FileInterceptor()`:
```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

**Q97: How do you implement caching?**
- **Answer**: Use `@nestjs/cache-manager`:
```typescript
@Get()
@UseInterceptors(CacheInterceptor)
@CacheTTL(60)
findAll() {
  return [];
}
```

### Advanced Questions

**Q98: How do you implement microservices in NestJS?**
- **Answer**: Use `@nestjs/microservices`:
```typescript
@MessagePattern('get_users')
handleGetUsers() {
  return [];
}
```

**Q99: What is the difference between CQRS and regular CRUD?**
- **Answer**: 
  - **CRUD**: Same model for read and write
  - **CQRS**: Separate models for commands (write) and queries (read), allowing optimization of each

**Q100: How do you implement API versioning?**
- **Answer**: Enable versioning in `main.ts`:
```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

---

## Architecture & Best Practices

### Beginner Questions

**Q101: What is the recommended folder structure for a NestJS application?**
- **Answer**: Feature-based structure:
```
src/
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
  products/
    products.module.ts
    products.controller.ts
    products.service.ts
```

**Q102: What are some NestJS best practices?**
- **Answer**: 
  - Use feature-based modules
  - Keep controllers thin
  - Put business logic in services
  - Use DTOs for validation
  - Handle errors with exception filters
  - Use dependency injection
  - Write tests

**Q103: How do you organize large applications?**
- **Answer**: 
  - Feature-based modules
  - Shared modules for common functionality
  - Layered architecture (presentation, business, data)
  - Use dynamic modules for configuration

### Intermediate Questions

**Q104: What is the difference between feature-based and layered architecture?**
- **Answer**: 
  - **Feature-based**: Organize by domain/feature (users, products)
  - **Layered**: Organize by technical layers (controllers, services, repositories)

**Q105: How do you handle environment-specific configuration?**
- **Answer**: Use `@nestjs/config`:
```typescript
ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});
```

**Q106: What is the Repository pattern and when to use it?**
- **Answer**: Repository pattern abstracts data access. Use it to:
  - Separate business logic from data access
  - Make code more testable
  - Switch between different data sources

---

## Performance & Optimization

### Intermediate Questions

**Q107: How do you optimize NestJS application performance?**
- **Answer**: 
  - Use caching
  - Optimize database queries
  - Enable compression
  - Use connection pooling
  - Implement pagination
  - Use CDN for static assets
  - Monitor performance

**Q108: How do you implement pagination?**
- **Answer**: Use query parameters:
```typescript
@Get()
findAll(@Query('page') page: number, @Query('limit') limit: number) {
  const skip = (page - 1) * limit;
  return this.repository.find({ skip, take: limit });
}
```

**Q109: How do you handle large file uploads?**
- **Answer**: 
  - Use streaming
  - Set appropriate limits
  - Process in chunks
  - Use cloud storage (S3, etc.)

---

## Testing

### Beginner Questions

**Q110: How do you test a service in NestJS?**
- **Answer**: Use `@nestjs/testing`:
```typescript
const module = await Test.createTestingModule({
  providers: [UsersService],
}).compile();

const service = module.get(UsersService);
```

**Q111: How do you mock dependencies in tests?**
- **Answer**: Use `overrideProvider()`:
```typescript
const module = await Test.createTestingModule({
  providers: [UsersService],
})
.overrideProvider(UsersRepository)
.useValue(mockRepository)
.compile();
```

**Q112: What is the difference between unit tests and E2E tests?**
- **Answer**: 
  - **Unit Tests**: Test individual components in isolation
  - **E2E Tests**: Test complete user flows end-to-end

### Intermediate Questions

**Q113: How do you write E2E tests?**
- **Answer**: Use `Test.createTestingModule()` with `INestApplication`:
```typescript
const module = await Test.createTestingModule({
  imports: [AppModule],
}).compile();

const app = module.createNestApplication();
await app.init();

const response = await request(app.getHttpServer())
  .get('/users')
  .expect(200);
```

**Q114: How do you test guards?**
- **Answer**: Mock the execution context:
```typescript
const guard = new AuthGuard();
const context = createMockExecutionContext();
const canActivate = await guard.canActivate(context);
expect(canActivate).toBe(true);
```

---

## Scenario-Based Questions

**Q115: How would you implement a rate-limiting feature?**
- **Answer**: Use `@nestjs/throttler`:
```typescript
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per 60 seconds
@Get()
findAll() {
  return [];
}
```

**Q116: How would you implement health checks?**
- **Answer**: Use `@nestjs/terminus`:
```typescript
@Get('health')
@HealthCheck()
check() {
  return this.health.check([
    () => this.db.isHealthy('database'),
  ]);
}
```

**Q117: How would you implement API documentation?**
- **Answer**: Use `@nestjs/swagger`:
```typescript
const config = new DocumentBuilder()
  .setTitle('My API')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Q118: How would you handle internationalization (i18n)?**
- **Answer**: Use `nestjs-i18n`:
```typescript
@Get('hello')
hello(@I18nLang() lang: string) {
  return this.i18n.translate('common.HELLO', { lang });
}
```

**Q119: How would you implement real-time updates?**
- **Answer**: Use WebSockets or Server-Sent Events:
```typescript
@Sse('events')
sendEvents(): Observable<MessageEvent> {
  return interval(1000).pipe(
    map(() => ({ data: { timestamp: new Date() } })),
  );
}
```

**Q120: How would you optimize database queries?**
- **Answer**: 
  - Use indexes
  - Implement pagination
  - Use query builder for complex queries
  - Avoid N+1 queries
  - Use eager/lazy loading appropriately
  - Implement caching

---

## Tips for Interview Preparation

1. **Understand the Request Lifecycle**: Know the exact order of execution
2. **Practice Code Examples**: Be able to write code on the spot
3. **Know When to Use What**: Understand when to use guards vs middleware vs interceptors
4. **Architecture Patterns**: Understand different architectural patterns
5. **Best Practices**: Know common best practices and anti-patterns
6. **Real-world Scenarios**: Be prepared for scenario-based questions

---

## Resources

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Code Examples](../examples/)
- [Documentation](./)


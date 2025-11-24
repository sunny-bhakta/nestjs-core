# Middleware

Middleware functions have access to the request and response objects, and the next middleware function in the application's request-response cycle.

## Table of Contents

1. [What is Middleware?](#what-is-middleware)
2. [Types of Middleware](#types-of-middleware)
3. [Built-in Middleware](#built-in-middleware)
4. [Custom Middleware](#custom-middleware)
5. [Middleware Configuration](#middleware-configuration)

---

## What is Middleware?

Middleware functions can:
- Execute code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware function

### Request Lifecycle Position

Middleware runs **before** guards, interceptors, and route handlers.

```
Request → Middleware → Guards → Interceptors → Pipes → Controller → Response
```

---

## Types of Middleware

### 1. Functional Middleware

Simple functions that receive request, response, and next.

**Example:** [Functional Middleware](../examples/03-middleware/logger.middleware.ts)

```typescript
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
```

### 2. Class-based Middleware

Classes that implement the `NestMiddleware` interface.

**Example:** [Class-based Middleware](../examples/03-middleware/logger.middleware.ts)

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

### 3. Global Middleware

Middleware applied to all routes.

**Example:** [Middleware Configuration](../examples/03-middleware/middleware.module.ts)

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

### 4. Route-specific Middleware

Middleware applied to specific routes or controllers.

```typescript
consumer
  .apply(AuthMiddleware)
  .forRoutes('protected/*');
```

---

## Built-in Middleware

### CORS (Cross-Origin Resource Sharing)

Enable CORS for your application.

**Example:** [Built-in Middleware](../examples/03-middleware/built-in-middleware.example.ts)

```typescript
app.enableCors({
  origin: 'https://example.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### Helmet

Set security-related HTTP headers.

```typescript
app.use(helmet());
```

### Compression

Compress response bodies.

```typescript
app.use(compression());
```

### Cookie Parser

Parse Cookie header and populate `req.cookies`.

```typescript
app.use(cookieParser());
```

---

## Custom Middleware

### Request Logging

Log all incoming requests.

**Example:** [Logger Middleware](../examples/03-middleware/logger.middleware.ts)

### Authentication

Verify authentication tokens.

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Validate token
    next();
  }
}
```

### Request Transformation

Add custom properties to request.

```typescript
@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['requestId'] = Math.random().toString(36).substring(7);
    req['timestamp'] = new Date().toISOString();
    next();
  }
}
```

---

## Middleware Configuration

### Applying Middleware

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply to all routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');

    // Apply to specific routes
    consumer
      .apply(AuthMiddleware)
      .forRoutes('protected/*');

    // Apply to specific controller
    consumer
      .apply(TransformRequestMiddleware)
      .forRoutes(UsersController);

    // Apply multiple middleware
    consumer
      .apply(LoggerMiddleware, TransformRequestMiddleware)
      .forRoutes('api/*');

    // Exclude specific routes
    consumer
      .apply(AuthMiddleware)
      .exclude('public/*', 'auth/login')
      .forRoutes('*');
  }
}
```

**Example:** [Middleware Configuration](../examples/03-middleware/middleware.module.ts)

---

## Best Practices

1. **Order Matters**: Middleware executes in the order it's applied
2. **Call next()**: Always call `next()` unless ending the request
3. **Error Handling**: Handle errors appropriately
4. **Performance**: Keep middleware lightweight
5. **Reusability**: Create reusable middleware functions

---

## Common Use Cases

1. **Logging**: Log all requests
2. **Authentication**: Verify user authentication
3. **Request ID**: Add unique request IDs
4. **Rate Limiting**: Limit request rates
5. **CORS**: Handle cross-origin requests
6. **Security Headers**: Set security headers
7. **Compression**: Compress responses

---

## Resources

- [NestJS Middleware Documentation](https://docs.nestjs.com/middleware)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)


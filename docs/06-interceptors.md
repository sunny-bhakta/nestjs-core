# Interceptors

Interceptors have a set of useful capabilities inspired by Aspect-Oriented Programming (AOP). They make it possible to:
- Bind extra logic before/after method execution
- Transform the result returned from a function
- Transform the exception thrown from a function
- Extend the basic function behavior
- Completely override a function depending on specific conditions

## Table of Contents

1. [What are Interceptors?](#what-are-interceptors)
2. [Interceptor Execution](#interceptor-execution)
3. [Use Cases](#use-cases)
4. [Interceptor Types](#interceptor-types)
5. [Common Patterns](#common-patterns)

---

## What are Interceptors?

Interceptors run **after** guards but **before** pipes and route handlers.

### Request Lifecycle Position

```
Request → Middleware → Guards → Interceptors (before) → Pipes → Controller → Interceptors (after) → Response
```

### Interceptor Interface

```typescript
export interface NestInterceptor<T = any, R = any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<R> | Promise<Observable<R>>;
}
```

---

## Interceptor Execution

### Execution Order

1. Global interceptors
2. Controller-level interceptors
3. Method-level interceptors

### Applying Interceptors

```typescript
// Global interceptor
app.useGlobalInterceptors(new LoggingInterceptor());

// Controller-level interceptor
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {}

// Method-level interceptor
@Get()
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
findAll() {
  return [];
}
```

**Example:** [Interceptor Usage](../examples/06-interceptors/interceptors.controller.ts)

---

## Use Cases

### 1. Logging

Log requests and responses.

**Example:** [Logging Interceptor](../examples/06-interceptors/logging.interceptor.ts)

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
      }),
    );
  }
}
```

### 2. Transform Response

Transform response data.

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

### 3. Cache Response

Cache responses for performance.

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; timestamp: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `${request.method}:${request.url}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 60000) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }),
    );
  }
}
```

### 4. Timeout Handling

Handle request timeouts.

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err.name === 'TimeoutError') {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
```

### 5. Error Handling

Handle errors globally.

```typescript
@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }),
    );
  }
}
```

### 6. Performance Monitoring

Monitor request performance.

```typescript
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        if (duration > 1000) {
          console.warn(`Slow request: ${request.url} took ${duration}ms`);
        }
      }),
    );
  }
}
```

**Example:** [Logging Interceptor](../examples/06-interceptors/logging.interceptor.ts)

---

## Interceptor Types

### Before Interceptors

Execute logic before the route handler.

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  // Logic before handler
  console.log('Before handler');
  return next.handle();
}
```

### After Interceptors

Execute logic after the route handler.

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
    tap(() => {
      // Logic after handler
      console.log('After handler');
    }),
  );
}
```

### Error Interceptors

Handle errors from route handlers.

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(
    catchError(error => {
      // Handle error
      return throwError(() => error);
    }),
  );
}
```

### Async Interceptors

Handle asynchronous operations.

```typescript
async intercept(
  context: ExecutionContext,
  next: CallHandler,
): Promise<Observable<any>> {
  // Async logic
  await this.someAsyncOperation();
  return next.handle();
}
```

---

## Common Patterns

### Request/Response Transformation

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Transform request
    request.requestId = Math.random().toString(36).substring(7);

    return next.handle().pipe(
      map(data => ({
        // Transform response
        success: true,
        data,
      })),
    );
  }
}
```

### Multiple Interceptors

```typescript
@Get()
@UseInterceptors(
  LoggingInterceptor,
  TransformInterceptor,
  PerformanceInterceptor,
)
findAll() {
  return [];
}
```

---

## Best Practices

1. **Single Responsibility**: Each interceptor should do one thing
2. **RxJS Operators**: Use RxJS operators for transformations
3. **Error Handling**: Handle errors appropriately
4. **Performance**: Keep interceptors lightweight
5. **Reusability**: Create reusable interceptor classes

---

## Resources

- [NestJS Interceptors Documentation](https://docs.nestjs.com/interceptors)
- [RxJS Documentation](https://rxjs.dev/)


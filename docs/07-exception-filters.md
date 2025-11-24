# Exception Filters

Exception filters catch and handle exceptions thrown by route handlers, pipes, guards, and interceptors.

## Table of Contents

1. [What are Exception Filters?](#what-are-exception-filters)
2. [Built-in Exceptions](#built-in-exceptions)
3. [Custom Exception Filters](#custom-exception-filters)
4. [Exception Filter Levels](#exception-filter-levels)
5. [Best Practices](#best-practices)

---

## What are Exception Filters?

Exception filters run **after** the route handler and interceptors, allowing you to catch and handle exceptions globally or at specific levels.

### Request Lifecycle Position

```
Request → ... → Controller → Interceptors (after) → Exception Filters → Response
```

### Exception Filter Interface

```typescript
export interface ExceptionFilter<T = any> {
  catch(exception: T, host: ArgumentsHost): any;
}
```

---

## Built-in Exceptions

NestJS provides a set of standard HTTP exceptions.

### Client Error Exceptions (4xx)

- `BadRequestException` (400) - Bad request
- `UnauthorizedException` (401) - Unauthorized
- `ForbiddenException` (403) - Forbidden
- `NotFoundException` (404) - Not found
- `NotAcceptableException` (406) - Not acceptable
- `ConflictException` (409) - Conflict
- `GoneException` (410) - Gone
- `PayloadTooLargeException` (413) - Payload too large
- `UnsupportedMediaTypeException` (415) - Unsupported media type
- `UnprocessableEntityException` (422) - Unprocessable entity

### Server Error Exceptions (5xx)

- `InternalServerErrorException` (500) - Internal server error
- `NotImplementedException` (501) - Not implemented
- `BadGatewayException` (502) - Bad gateway
- `ServiceUnavailableException` (503) - Service unavailable
- `GatewayTimeoutException` (504) - Gateway timeout

### Other Exceptions

- `RequestTimeoutException` (408) - Request timeout
- `HttpVersionNotSupportedException` (505) - HTTP version not supported

**Example:** [Exception Usage](../examples/07-exceptions/exceptions.controller.ts)

---

## Custom Exception Filters

### Basic Exception Filter

**Example:** [Exception Filters](../examples/07-exceptions/exception-filters.ts)

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### HTTP Exception Filter

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### Validation Exception Filter

```typescript
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const message = Array.isArray(exceptionResponse)
      ? exceptionResponse
      : [exceptionResponse];

    response.status(status).json({
      statusCode: status,
      message: 'Validation failed',
      errors: message,
    });
  }
}
```

### Custom Business Exception

```typescript
export class BusinessException extends HttpException {
  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: 'Business Logic Error',
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Exception Filter Levels

### Global Exception Filter

Apply filter globally to all routes.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
```

### Controller-level Filter

Apply filter to all routes in a controller.

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}
```

### Method-level Filter

Apply filter to specific routes.

```typescript
@Get(':id')
@UseFilters(NotFoundExceptionFilter)
findOne(@Param('id') id: string) {
  if (!id) {
    throw new NotFoundException('User not found');
  }
  return { id };
}
```

**Example:** [Exception Usage](../examples/07-exceptions/exceptions.controller.ts)

---

## Best Practices

1. **Global Filter**: Use global filter for common error handling
2. **Specific Filters**: Use specific filters for custom error handling
3. **Error Logging**: Log errors appropriately
4. **Error Messages**: Provide meaningful error messages
5. **Status Codes**: Use appropriate HTTP status codes
6. **Error Format**: Maintain consistent error response format

---

## Common Use Cases

1. **Global Error Handling**: Catch all unhandled exceptions
2. **Validation Errors**: Format validation error responses
3. **Business Logic Errors**: Handle business-specific exceptions
4. **Error Logging**: Log errors to external services
5. **Error Transformation**: Transform errors to user-friendly messages

---

## Resources

- [NestJS Exception Filters Documentation](https://docs.nestjs.com/exception-filters)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)


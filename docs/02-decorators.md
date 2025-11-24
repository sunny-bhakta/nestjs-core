# Decorators

Decorators are a TypeScript feature that allows you to add metadata and modify classes, methods, properties, and parameters at design time.

## Table of Contents

1. [Class Decorators](#class-decorators)
2. [Method Decorators](#method-decorators)
3. [Parameter Decorators](#parameter-decorators)
4. [Property Decorators](#property-decorators)
5. [Custom Decorators](#custom-decorators)

---

## Class Decorators

Class decorators are applied to class declarations.

### `@Module()`
Defines a module in NestJS.

```typescript
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
```

### `@Controller()`
Defines a controller class.

```typescript
@Controller('users')
export class UsersController {}
```

### `@Injectable()`
Marks a class as a provider that can be injected.

```typescript
@Injectable()
export class UsersService {}
```

### `@Global()`
Makes a module available globally.

```typescript
@Global()
@Module({})
export class SharedModule {}
```

### `@Catch()`
Defines an exception filter.

```typescript
@Catch(HttpException)
export class HttpExceptionFilter {}
```

---

## Method Decorators

Method decorators are applied to methods within classes.

### HTTP Method Decorators

- `@Get(path?)` - Handle GET requests
- `@Post(path?)` - Handle POST requests
- `@Put(path?)` - Handle PUT requests
- `@Patch(path?)` - Handle PATCH requests
- `@Delete(path?)` - Handle DELETE requests
- `@All(path?)` - Handle all HTTP methods

**Example:** [Method Decorators](../examples/02-decorators/method-decorators.example.ts)

### Route Configuration Decorators

- `@HttpCode(statusCode)` - Set HTTP status code
- `@Header(name, value)` - Set response header
- `@Redirect(url, statusCode?)` - Redirect response
- `@Render(template)` - Render template

### Middleware Decorators

- `@UseGuards(...guards)` - Apply guards
- `@UseInterceptors(...interceptors)` - Apply interceptors
- `@UsePipes(...pipes)` - Apply pipes
- `@UseFilters(...filters)` - Apply exception filters

### Metadata Decorators

- `@SetMetadata(key, value)` - Set custom metadata

**Example:** [Method Decorators](../examples/02-decorators/method-decorators.example.ts)

---

## Parameter Decorators

Parameter decorators extract data from the request object.

### Request Data Decorators

- `@Body()` - Extract request body
- `@Body('property')` - Extract specific property from body
- `@Query()` - Extract query parameters
- `@Query('param')` - Extract specific query parameter
- `@Param()` - Extract route parameters
- `@Param('id')` - Extract specific route parameter
- `@Headers()` - Extract headers
- `@Headers('header')` - Extract specific header

### Request Object Decorators

- `@Req()` / `@Request()` - Access full request object
- `@Res()` / `@Response()` - Access response object
- `@Next()` - Access next function

### Special Decorators

- `@Ip()` - Extract client IP address
- `@Session()` - Extract session data
- `@HostParam('param')` - Extract host parameter

**Example:** [Parameter Decorators](../examples/02-decorators/parameter-decorators.example.ts)

---

## Property Decorators

Property decorators are applied to class properties.

### Injection Decorators

- `@Inject(token)` - Inject dependency by token
- `@Optional()` - Mark dependency as optional
- `@InjectRepository(entity)` - Inject TypeORM repository
- `@InjectModel(model)` - Inject Mongoose model

---

## Custom Decorators

You can create custom decorators for extracting data, setting metadata, or parameter extraction.

### Creating Parameter Decorators

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

### Creating Metadata Decorators

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('isPublic', true);
```

**Example:** [Custom Decorators](../examples/02-decorators/custom-decorators.example.ts)

### Use Cases

1. **User Extraction**: Extract current user from request
2. **Role-based Metadata**: Set roles for authorization
3. **Public Routes**: Mark routes as public
4. **Custom Parameters**: Extract custom data from request

---

## Best Practices

1. **Use Built-in Decorators**: Prefer built-in decorators when possible
2. **Type Safety**: Always type your decorators
3. **Documentation**: Document custom decorators
4. **Reusability**: Create reusable custom decorators

---

## Resources

- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)


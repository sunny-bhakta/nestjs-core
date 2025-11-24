# Guards

Guards determine whether a request should be handled by the route handler. They run **after** middleware but **before** interceptors and pipes.

## Table of Contents

1. [What are Guards?](#what-are-guards)
2. [Guard Execution](#guard-execution)
3. [Built-in Guards](#built-in-guards)
4. [Custom Guards](#custom-guards)
5. [Guard Patterns](#guard-patterns)

---

## What are Guards?

Guards have a single responsibility: determine if a request should be handled by the route handler based on certain conditions (permissions, roles, ACLs, etc.).

### Request Lifecycle Position

```
Request → Middleware → Guards → Interceptors → Pipes → Controller → Response
```

### Guard Return Values

- `true`: Request proceeds
- `false`: Request is denied (throws `ForbiddenException`)
- `Promise<boolean>`: Async guard evaluation
- `Observable<boolean>`: Observable-based guard evaluation

---

## Guard Execution

### Execution Order

1. Global guards
2. Controller-level guards
3. Method-level guards

### Applying Guards

```typescript
// Global guard
app.useGlobalGuards(new AuthGuard());

// Controller-level guard
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {}

// Method-level guard
@Get('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
adminRoute() {
  return { message: 'Admin only' };
}
```

**Example:** [Guards Usage](../examples/05-guards/guards.controller.ts)

---

## Built-in Guards

NestJS doesn't provide many built-in guards, but common patterns include:

### Authentication Guards
Verify that the user is authenticated.

### Authorization Guards
Verify that the user has permission to access the resource.

---

## Custom Guards

### Authentication Guard

**Example:** [Auth Guard](../examples/05-guards/auth.guard.ts)

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    // Validate token
    return this.validateToken(token);
  }
}
```

### Role-based Guard

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
```

### API Key Guard

```typescript
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
```

### Permission-based Guard

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredPermissions.every(permission =>
      user.permissions.includes(permission),
    );
  }
}
```

**Example:** [Auth Guard](../examples/05-guards/auth.guard.ts)

---

## Guard Patterns

### JWT Guard

Uses Passport JWT strategy for authentication.

**Example:** [JWT Strategy](../examples/11-auth/jwt.strategy.ts)

### Public Route Guard

Allows certain routes to bypass authentication.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // Check authentication
    return this.checkAuth(context);
  }
}
```

### Combined Guards

Use multiple guards together.

```typescript
@Get('secure')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
secureRoute() {
  return { message: 'Secure route' };
}
```

---

## Best Practices

1. **Single Responsibility**: Each guard should check one thing
2. **Early Returns**: Return early if guard fails
3. **Clear Error Messages**: Provide meaningful error messages
4. **Reusability**: Create reusable guard classes
5. **Performance**: Keep guards lightweight

---

## Common Use Cases

1. **Authentication**: Verify user is logged in
2. **Authorization**: Check user permissions
3. **Role-based Access**: Restrict by user roles
4. **API Key Validation**: Validate API keys
5. **Rate Limiting**: Limit request rates
6. **IP Whitelisting**: Restrict by IP address

---

## Resources

- [NestJS Guards Documentation](https://docs.nestjs.com/guards)
- [Passport Strategies](https://docs.nestjs.com/security/authentication)


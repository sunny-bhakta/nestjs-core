# Authentication & Authorization

Authentication verifies who a user is, while authorization determines what they can do.

## Table of Contents

1. [Authentication](#authentication)
2. [Authorization](#authorization)
3. [JWT Authentication](#jwt-authentication)
4. [Local Strategy](#local-strategy)
5. [Guards](#guards)
6. [Security Best Practices](#security-best-practices)

---

## Authentication

Authentication is the process of verifying a user's identity.

### JWT Authentication

JSON Web Tokens (JWT) are a popular method for authentication.

**Example:** [JWT Strategy](../examples/11-auth/jwt.strategy.ts)

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

### Local Strategy

Username/password authentication.

**Example:** [Local Strategy](../examples/11-auth/local-strategy.example.ts)

```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

### Password Hashing

Always hash passwords before storing.

**Example:** [Auth Service](../examples/11-auth/auth.service.ts)

```typescript
async hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## Authorization

Authorization determines what authenticated users can do.

### Role-based Access Control (RBAC)

**Example:** [Roles Guard](../examples/05-guards/auth.guard.ts)

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

### Permission-based Access Control

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    const user = context.switchToHttp().getRequest().user;
    return requiredPermissions.every(permission =>
      user.permissions.includes(permission),
    );
  }
}
```

---

## Guards

Guards protect routes and enforce authentication/authorization.

### Using Guards

```typescript
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  adminRoute() {
    return { message: 'Admin only' };
  }
}
```

**Example:** [Guards Usage](../examples/05-guards/guards.controller.ts)

---

## Security Best Practices

1. **Hash Passwords**: Always hash passwords with bcrypt
2. **Use HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Set appropriate token expiration times
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **Input Validation**: Validate all inputs
6. **SQL Injection**: Use parameterized queries
7. **XSS Protection**: Sanitize user inputs
8. **CSRF Protection**: Implement CSRF protection

---

## Resources

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [NestJS Authorization](https://docs.nestjs.com/guards)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)


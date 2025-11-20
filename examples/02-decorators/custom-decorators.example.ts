/**
 * Decorators: Custom Decorators
 * 
 * Create custom decorators for extracting data, setting metadata, or parameter extraction.
 */

import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// Custom Parameter Decorator - Extract user from request
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// Usage:
// @Get('profile')
// getProfile(@User() user: any) {
//   return user;
// }
// 
// @Get('email')
// getEmail(@User('email') email: string) {
//   return { email };
// }

// Custom Parameter Decorator - Extract IP address
export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress;
  },
);

// Custom Metadata Decorator - Roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage:
// @Get('admin')
// @Roles('admin', 'superadmin')
// adminRoute() {
//   return { message: 'Admin only' };
// }

// Custom Metadata Decorator - Public route (skip authentication)
export const Public = () => SetMetadata('isPublic', true);

// Usage:
// @Get('public')
// @Public()
// publicRoute() {
//   return { message: 'Public route' };
// }

// Custom Parameter Decorator - Extract current user ID
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

// Custom Parameter Decorator - Extract query with defaults
export const QueryWithDefaults = createParamDecorator(
  (defaults: Record<string, any>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return { ...defaults, ...request.query };
  },
);

// Usage example controller:
import { Controller, Get, Post } from '@nestjs/common';

@Controller('custom-decorators')
export class CustomDecoratorsController {
  
  @Get('user')
  getUser(@User() user: any) {
    return user;
  }

  @Get('user-email')
  getUserEmail(@User('email') email: string) {
    return { email };
  }

  @Get('ip')
  getIp(@ClientIp() ip: string) {
    return { ip };
  }

  @Get('admin')
  @Roles('admin')
  adminRoute() {
    return { message: 'Admin route' };
  }

  @Get('public')
  @Public()
  publicRoute() {
    return { message: 'Public route' };
  }

  @Get('current-user-id')
  getCurrentUserId(@CurrentUserId() userId: string) {
    return { userId };
  }

  @Get('query-defaults')
  getQueryWithDefaults(@QueryWithDefaults({ page: 1, limit: 10 }) query: any) {
    return query;
  }
}


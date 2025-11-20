import { Controller, Get, Post, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard, RolesGuard, ApiKeyGuard, Public, Roles } from './auth.guard';

@Controller('guards')
@UseGuards(AuthGuard) // Apply guard to all routes in controller
export class GuardsController {
  
  // Public route (bypasses AuthGuard)
  @Get('public')
  @Public()
  publicRoute() {
    return { message: 'This is a public route' };
  }

  // Protected route (requires authentication)
  @Get('protected')
  protectedRoute() {
    return { message: 'This is a protected route' };
  }

  // Route with role requirement
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  adminRoute() {
    return { message: 'Admin only route' };
  }

  // Route with multiple roles
  @Get('moderator')
  @UseGuards(RolesGuard)
  @Roles('admin', 'moderator')
  moderatorRoute() {
    return { message: 'Moderator or admin route' };
  }

  // Route with API key guard
  @Get('api-key')
  @UseGuards(ApiKeyGuard)
  apiKeyRoute() {
    return { message: 'API key protected route' };
  }

  // Multiple guards (executed in order)
  @Post('secure')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  secureRoute() {
    return { message: 'Secure route with multiple guards' };
  }
}


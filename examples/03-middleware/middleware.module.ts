/**
 * Middleware: Module Configuration
 * 
 * Middleware is configured in modules using the configure() method.
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware, AuthMiddleware, TransformRequestMiddleware } from './logger.middleware';
import { MiddlewareController } from './middleware.controller';

@Module({
  controllers: [MiddlewareController],
})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware to all routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');

    // Apply middleware to specific routes
    consumer
      .apply(AuthMiddleware)
      .forRoutes('protected/*');

    // Apply middleware to specific controller
    consumer
      .apply(TransformRequestMiddleware)
      .forRoutes(MiddlewareController);

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


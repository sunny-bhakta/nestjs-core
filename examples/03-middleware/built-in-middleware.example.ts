/**
 * Middleware: Built-in Middleware
 * 
 * Examples of using built-in NestJS and Express middleware.
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

// ============================================================================
// CORS Middleware
// ============================================================================

@Module({
  controllers: [],
})
export class CorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: process.env.CORS_ORIGIN || '*',
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true,
        }),
      )
      .forRoutes('*');
  }
}

// ============================================================================
// Helmet Middleware (Security Headers)
// ============================================================================

@Module({
  controllers: [],
})
export class HelmetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
            },
          },
        }),
      )
      .forRoutes('*');
  }
}

// ============================================================================
// Compression Middleware
// ============================================================================

@Module({
  controllers: [],
})
export class CompressionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        compression({
          level: 6,
          threshold: 1024,
        }),
      )
      .forRoutes('*');
  }
}

// ============================================================================
// Cookie Parser Middleware
// ============================================================================

@Module({
  controllers: [],
})
export class CookieParserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*');
  }
}

// ============================================================================
// Combined Middleware
// ============================================================================

@Controller('middleware')
export class MiddlewareController {
  @Get('test')
  test() {
    return { message: 'Middleware applied' };
  }
}

@Module({
  controllers: [MiddlewareController],
})
export class CombinedMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        helmet(),
        cors(),
        compression(),
        cookieParser(),
      )
      .forRoutes('*');
  }
}

// ============================================================================
// Usage in main.ts
// ============================================================================

/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply built-in middleware globally
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
*/


/**
 * Compression: Complete Example
 * 
 * Examples of using compression middleware in NestJS.
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import * as compression from 'compression';

// ============================================================================
// Basic Compression Setup
// ============================================================================

@Controller('compression')
export class CompressionController {
  @Get('large-response')
  getLargeResponse() {
    // This response will be compressed
    return {
      data: Array(1000).fill(0).map((_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: 'This is a large response that will be compressed',
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })),
    };
  }

  @Get('small-response')
  getSmallResponse() {
    // Small responses may not be compressed (depends on threshold)
    return {
      message: 'Small response',
    };
  }
}

// ============================================================================
// Module with Compression
// ============================================================================

@Module({
  controllers: [CompressionController],
})
export class CompressionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Basic compression
    consumer
      .apply(compression())
      .forRoutes('*');

    // Compression with options
    consumer
      .apply(
        compression({
          filter: (req, res) => {
            // Only compress if client accepts compression
            if (req.headers['x-no-compression']) {
              return false;
            }
            return compression.filter(req, res);
          },
          level: 6, // Compression level (0-9)
          threshold: 1024, // Only compress responses larger than 1KB
        }),
      )
      .forRoutes('*');
  }
}

// ============================================================================
// Advanced Compression Configuration
// ============================================================================

export function createCompressionMiddleware() {
  return compression({
    // Compression level (0 = no compression, 9 = maximum compression)
    level: 6,

    // Only compress responses larger than this threshold (in bytes)
    threshold: 1024,

    // Filter function to determine if response should be compressed
    filter: (req, res) => {
      // Don't compress if client doesn't accept compression
      if (!req.headers['accept-encoding']) {
        return false;
      }

      // Don't compress if client explicitly requests no compression
      if (req.headers['x-no-compression']) {
        return false;
      }

      // Use default filter
      return compression.filter(req, res);
    },

    // Custom compression strategy
    strategy: compression.compressionStrategies.gzip,
  });
}

// ============================================================================
// Conditional Compression
// ============================================================================

export function createConditionalCompression() {
  return compression({
    filter: (req, res) => {
      // Only compress JSON and text responses
      const contentType = res.getHeader('content-type');
      if (typeof contentType === 'string') {
        return (
          contentType.includes('application/json') ||
          contentType.includes('text/')
        );
      }
      return false;
    },
    threshold: 512, // Lower threshold for JSON/text
  });
}

// ============================================================================
// Usage in main.ts
// ============================================================================

/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable compression globally
  app.use(compression({
    level: 6,
    threshold: 1024,
  }));

  await app.listen(3000);
}
bootstrap();
*/


/**
 * Rate Limiting: Complete Example
 * 
 * Examples of rate limiting using @nestjs/throttler.
 */

import { Injectable, Controller, Get, UseGuards } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

// ============================================================================
// Basic Rate Limiting
// ============================================================================

@Controller('rate-limit')
@UseGuards(ThrottlerGuard) // Apply to all routes in controller
export class RateLimitController {
  @Get('basic')
  basic() {
    return {
      message: 'This endpoint is rate limited',
      timestamp: new Date().toISOString(),
    };
  }

  // Custom rate limit for specific route
  @Throttle(5, 60) // 5 requests per 60 seconds
  @Get('custom')
  custom() {
    return {
      message: 'This endpoint has custom rate limit (5 req/min)',
      timestamp: new Date().toISOString(),
    };
  }

  // Higher rate limit
  @Throttle(100, 60) // 100 requests per 60 seconds
  @Get('high-limit')
  highLimit() {
    return {
      message: 'This endpoint has higher rate limit (100 req/min)',
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Route-specific Rate Limiting
// ============================================================================

@Controller('api')
export class ApiController {
  // No rate limit on this route
  @Get('public')
  public() {
    return { message: 'Public endpoint, no rate limit' };
  }

  // Default rate limit
  @UseGuards(ThrottlerGuard)
  @Get('protected')
  protected() {
    return { message: 'Protected endpoint with default rate limit' };
  }

  // Custom rate limit
  @UseGuards(ThrottlerGuard)
  @Throttle(10, 60)
  @Get('limited')
  limited() {
    return { message: 'Limited endpoint (10 req/min)' };
  }
}

// ============================================================================
// Custom Throttler Storage
// ============================================================================

import { ThrottlerStorage } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerStorage implements ThrottlerStorage {
  private storage: Map<string, { count: number; resetTime: number }> = new Map();

  async getRecord(key: string): Promise<number[]> {
    const record = this.storage.get(key);
    if (!record) {
      return [0, Date.now() + 60000]; // [count, resetTime]
    }

    if (Date.now() > record.resetTime) {
      this.storage.delete(key);
      return [0, Date.now() + 60000];
    }

    return [record.count, record.resetTime];
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const record = this.storage.get(key);
    if (record) {
      record.count++;
    } else {
      this.storage.set(key, {
        count: 1,
        resetTime: Date.now() + ttl * 1000,
      });
    }
  }
}

// ============================================================================
// Custom Throttler Guard
// ============================================================================

import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // Use IP address and user ID for tracking
    const userId = req.user?.id || 'anonymous';
    const ip = req.ip || req.connection.remoteAddress;
    return `${ip}-${userId}`;
  }

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    response.status(429).json({
      statusCode: 429,
      message: 'Too Many Requests',
      retryAfter: await this.getThrottlerLimit(context),
    });
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  imports: [
    // Basic throttler configuration
    ThrottlerModule.forRoot({
      ttl: 60, // Time window in seconds
      limit: 10, // Maximum number of requests per window
    }),

    // Advanced configuration
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: 3, // 3 requests per second
        },
        {
          name: 'medium',
          ttl: 10000, // 10 seconds
          limit: 20, // 20 requests per 10 seconds
        },
        {
          name: 'long',
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute
        },
      ],
      storage: new CustomThrottlerStorage(), // Custom storage
    }),
  ],
  controllers: [RateLimitController, ApiController],
  providers: [CustomThrottlerGuard],
})
export class RateLimitingModule {}

// ============================================================================
// Usage with Different Strategies
// ============================================================================

@Controller('strategies')
export class StrategiesController {
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60) // 5 requests per minute
  @Get('per-minute')
  perMinute() {
    return { message: '5 requests per minute' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(10, 1) // 10 requests per second
  @Get('per-second')
  perSecond() {
    return { message: '10 requests per second' };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(1000, 3600) // 1000 requests per hour
  @Get('per-hour')
  perHour() {
    return { message: '1000 requests per hour' };
  }
}


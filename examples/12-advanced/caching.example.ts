/**
 * Advanced: Caching
 * 
 * Implement caching to improve performance.
 */

import { Controller, Get, UseInterceptors, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/common';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('cache')
export class CacheController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Use cache interceptor
  @Get('auto-cache')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // Cache for 60 seconds
  autoCache() {
    return {
      message: 'This response is cached',
      timestamp: new Date().toISOString(),
    };
  }

  // Manual cache management
  @Get('manual')
  async manualCache() {
    const cacheKey = 'manual-cache-key';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return { ...cached, fromCache: true };
    }

    const data = {
      message: 'Fresh data',
      timestamp: new Date().toISOString(),
    };

    await this.cacheManager.set(cacheKey, data, 60); // Cache for 60 seconds
    return { ...data, fromCache: false };
  }

  // Clear cache
  @Get('clear')
  async clearCache() {
    await this.cacheManager.reset();
    return { message: 'Cache cleared' };
  }
}


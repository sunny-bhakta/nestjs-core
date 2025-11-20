import { Controller, Get, Post, UseInterceptors, Body } from '@nestjs/common';
import {
  LoggingInterceptor,
  TransformInterceptor,
  CacheInterceptor,
  PerformanceInterceptor,
} from './logging.interceptor';

@Controller('interceptors')
export class InterceptorsController {
  
  // Apply interceptor to specific route
  @Get('logged')
  @UseInterceptors(LoggingInterceptor)
  loggedRoute() {
    return { message: 'This request is logged' };
  }

  // Apply transformation interceptor
  @Get('transformed')
  @UseInterceptors(TransformInterceptor)
  transformedRoute() {
    return { message: 'This response is transformed' };
  }

  // Apply cache interceptor
  @Get('cached')
  @UseInterceptors(CacheInterceptor)
  cachedRoute() {
    return {
      message: 'This response is cached',
      data: Math.random(), // Will be cached
    };
  }

  // Apply performance interceptor
  @Get('performance')
  @UseInterceptors(PerformanceInterceptor)
  performanceRoute() {
    return { message: 'Performance monitored' };
  }

  // Multiple interceptors (executed in order)
  @Post('multiple')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor, PerformanceInterceptor)
  multipleInterceptors(@Body() body: any) {
    return { received: body };
  }
}


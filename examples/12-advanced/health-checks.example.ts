/**
 * Health Checks: Complete Example
 * 
 * Examples of health checks using @nestjs/terminus.
 */

import { Module, Controller, Get, Injectable } from '@nestjs/common';
import { TerminusModule, TerminusOptionsService, HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { HttpModule, HttpService } from '@nestjs/axios';

// ============================================================================
// Basic Health Check
// ============================================================================

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Basic health check
      () => ({ status: 'up', info: { app: { status: 'up' } }, error: {} }),
    ]);
  }
}

// ============================================================================
// Database Health Check
// ============================================================================

import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async isHealthy(key: string) {
    try {
      await this.connection.query('SELECT 1');
      return {
        [key]: {
          status: 'up',
          message: 'Database is healthy',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: 'Database is unhealthy',
          error: error.message,
        },
      };
    }
  }
}

@Controller('health')
export class DatabaseHealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
  ) {}

  @Get('db')
  @HealthCheck()
  checkDb() {
    return this.health.check([
      () => this.db.isHealthy('database'),
    ]);
  }
}

// ============================================================================
// HTTP Health Check
// ============================================================================

@Injectable()
export class HttpHealthIndicator {
  constructor(private http: HttpService) {}

  async isHealthy(key: string, url: string) {
    try {
      const response = await this.http.axiosRef.get(url);
      return {
        [key]: {
          status: 'up',
          statusCode: response.status,
          message: 'HTTP service is healthy',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: 'HTTP service is unhealthy',
          error: error.message,
        },
      };
    }
  }
}

@Controller('health')
export class HttpHealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get('http')
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      () => this.http.isHealthy('api', 'https://api.example.com/health'),
    ]);
  }
}

// ============================================================================
// Memory Health Check
// ============================================================================

@Injectable()
export class MemoryHealthIndicator {
  async isHealthy(key: string, threshold: number = 150 * 1024 * 1024) {
    const used = process.memoryUsage().heapUsed;
    const status = used < threshold ? 'up' : 'down';

    return {
      [key]: {
        status,
        heapUsed: `${Math.round(used / 1024 / 1024)}MB`,
        threshold: `${Math.round(threshold / 1024 / 1024)}MB`,
        message: status === 'up' ? 'Memory usage is healthy' : 'Memory usage is high',
      },
    };
  }
}

@Controller('health')
export class MemoryHealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.isHealthy('memory', 150 * 1024 * 1024), // 150MB threshold
    ]);
  }
}

// ============================================================================
// Disk Health Check
// ============================================================================

import * as diskusage from 'diskusage';

@Injectable()
export class DiskHealthIndicator {
  async isHealthy(key: string, path: string = '/', thresholdPercent: number = 90) {
    try {
      const stats = diskusage.checkSync(path);
      const usedPercent = (stats.used / stats.total) * 100;
      const status = usedPercent < thresholdPercent ? 'up' : 'down';

      return {
        [key]: {
          status,
          total: `${Math.round(stats.total / 1024 / 1024 / 1024)}GB`,
          free: `${Math.round(stats.free / 1024 / 1024 / 1024)}GB`,
          used: `${Math.round(stats.used / 1024 / 1024 / 1024)}GB`,
          usedPercent: `${Math.round(usedPercent)}%`,
          threshold: `${thresholdPercent}%`,
          message: status === 'up' ? 'Disk usage is healthy' : 'Disk usage is high',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: 'Unable to check disk usage',
          error: error.message,
        },
      };
    }
  }
}

// ============================================================================
// Comprehensive Health Check
// ============================================================================

@Controller('health')
export class ComprehensiveHealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('check')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.http.isHealthy('api', 'https://api.example.com/health'),
      () => this.memory.isHealthy('memory'),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    // Readiness check - can the app accept traffic?
    return this.health.check([
      () => this.db.isHealthy('database'),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    // Liveness check - is the app running?
    return this.health.check([
      () => ({ app: { status: 'up' } }),
    ]);
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  imports: [
    TerminusModule,
    HttpModule.register({}), // For HTTP health checks
  ],
  controllers: [
    HealthController,
    DatabaseHealthController,
    HttpHealthController,
    MemoryHealthController,
    ComprehensiveHealthController,
  ],
  providers: [
    DatabaseHealthIndicator,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    DiskHealthIndicator,
  ],
})
export class HealthChecksModule {}

// Note: For disk health check, install: npm install diskusage
// For TypeORM health check, ensure TypeOrmModule is imported


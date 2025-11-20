/**
 * Dependency Injection: Optional Dependencies
 * 
 * Examples of using optional dependencies with @Optional() decorator.
 */

import { Injectable, Optional, Inject } from '@nestjs/common';

// ============================================================================
// Optional Service
// ============================================================================

@Injectable()
export class OptionalService {
  getData() {
    return 'Optional service data';
  }
}

// ============================================================================
// Service with Optional Dependency
// ============================================================================

@Injectable()
export class MainService {
  constructor(
    @Optional() private readonly optionalService?: OptionalService,
  ) {}

  doSomething() {
    if (this.optionalService) {
      return this.optionalService.getData();
    }
    return 'Optional service not available';
  }
}

// ============================================================================
// Optional with Default Value
// ============================================================================

@Injectable()
export class ServiceWithDefault {
  constructor(
    @Optional()
    @Inject('OPTIONAL_CONFIG')
    private readonly config?: { apiKey: string },
  ) {}

  getApiKey(): string {
    return this.config?.apiKey || 'default-api-key';
  }
}

// ============================================================================
// Multiple Optional Dependencies
// ============================================================================

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Injectable()
export class CacheService {
  get(key: string) {
    return null;
  }
}

@Injectable()
export class ServiceWithMultipleOptional {
  constructor(
    @Optional() private readonly logger?: LoggerService,
    @Optional() private readonly cache?: CacheService,
  ) {}

  processData(data: any) {
    // Use logger if available
    if (this.logger) {
      this.logger.log('Processing data');
    }

    // Use cache if available
    if (this.cache) {
      const cached = this.cache.get('data');
      if (cached) {
        return cached;
      }
    }

    return { processed: data };
  }
}

// ============================================================================
// Optional with Injection Token
// ============================================================================

export const FEATURE_FLAG_TOKEN = 'FEATURE_FLAG';

@Injectable()
export class FeatureService {
  constructor(
    @Optional()
    @Inject(FEATURE_FLAG_TOKEN)
    private readonly featureFlag?: boolean,
  ) {}

  isFeatureEnabled(): boolean {
    return this.featureFlag ?? false;
  }

  executeFeature() {
    if (this.isFeatureEnabled()) {
      return 'Feature executed';
    }
    return 'Feature disabled';
  }
}

// ============================================================================
// Conditional Service Usage
// ============================================================================

@Injectable()
export class DevelopmentService {
  getData() {
    return 'Development data';
  }
}

@Injectable()
export class ProductionService {
  getData() {
    return 'Production data';
  }
}

@Injectable()
export class ConditionalService {
  constructor(
    @Optional() private readonly devService?: DevelopmentService,
    @Optional() private readonly prodService?: ProductionService,
  ) {}

  getData() {
    if (process.env.NODE_ENV === 'development' && this.devService) {
      return this.devService.getData();
    }
    
    if (process.env.NODE_ENV === 'production' && this.prodService) {
      return this.prodService.getData();
    }

    return 'Default data';
  }
}

// ============================================================================
// Module Setup
// ============================================================================

import { Module } from '@nestjs/common';

@Module({
  providers: [
    // Optional services - may or may not be provided
    // OptionalService, // Commented out to show optional behavior
    
    // Main services
    MainService,
    ServiceWithDefault,
    ServiceWithMultipleOptional,
    FeatureService,
    ConditionalService,
    
    // Conditional services
    // DevelopmentService, // Only in dev
    // ProductionService, // Only in prod
  ],
  exports: [
    MainService,
    ServiceWithDefault,
    ServiceWithMultipleOptional,
    FeatureService,
    ConditionalService,
  ],
})
export class OptionalDependenciesModule {}


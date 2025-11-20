/**
 * Core Concept: Dependency Injection - Property Injection
 * 
 * Property injection uses @Inject() decorator on class properties.
 * Less common than constructor injection.
 */

import { Injectable, Inject, Optional } from '@nestjs/common';

@Injectable()
export class OptionalService {
  getData() {
    return 'Optional data';
  }
}

@Injectable()
export class MainService {
  @Inject(OptionalService)
  private readonly optionalService: OptionalService;

  @Optional()
  @Inject('OPTIONAL_TOKEN')
  private readonly optionalValue?: string;

  getData() {
    return {
      service: this.optionalService?.getData(),
      value: this.optionalValue || 'Not provided',
    };
  }
}


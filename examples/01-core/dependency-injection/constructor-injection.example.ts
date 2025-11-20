/**
 * Core Concept: Dependency Injection - Constructor Injection
 * 
 * The most common way to inject dependencies is through constructor parameters.
 */

import { Injectable } from '@nestjs/common';

// Service A
@Injectable()
export class ServiceA {
  getData() {
    return 'Data from Service A';
  }
}

// Service B depends on Service A
@Injectable()
export class ServiceB {
  constructor(private readonly serviceA: ServiceA) {}

  getCombinedData() {
    return `${this.serviceA.getData()} + Data from Service B`;
  }
}

// Controller depends on Service B
import { Controller, Get } from '@nestjs/common';

@Controller('example')
export class ExampleController {
  constructor(private readonly serviceB: ServiceB) {}

  @Get()
  getData() {
    return this.serviceB.getCombinedData();
  }
}


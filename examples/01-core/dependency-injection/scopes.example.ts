/**
 * Core Concept: Dependency Injection - Scopes
 * 
 * Provider scopes determine the lifecycle of provider instances.
 * - DEFAULT (Singleton): Single instance shared across the application
 * - REQUEST: New instance per request
 * - TRANSIENT: New instance every time it's injected
 */

import { Injectable, Scope } from '@nestjs/common';

// Singleton scope (default)
@Injectable({ scope: Scope.DEFAULT })
export class SingletonService {
  private instanceId = Math.random().toString(36).substring(7);

  getInstanceId() {
    return this.instanceId;
  }
}

// Request scope - new instance per request
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private instanceId = Math.random().toString(36).substring(7);
  private requestId: string;

  setRequestId(id: string) {
    this.requestId = id;
  }

  getInstanceId() {
    return this.instanceId;
  }

  getRequestId() {
    return this.requestId;
  }
}

// Transient scope - new instance every time
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private instanceId = Math.random().toString(36).substring(7);

  getInstanceId() {
    return this.instanceId;
  }
}


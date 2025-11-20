/**
 * Pipes: Async Pipes
 * 
 * Examples of asynchronous pipes for validation and transformation.
 */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

// ============================================================================
// Async Validation Pipe
// ============================================================================

@Injectable()
export class AsyncValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Simulate async validation (e.g., database check)
    const isValid = await this.validateAsync(value);
    
    if (!isValid) {
      throw new BadRequestException('Validation failed');
    }
    
    return value;
  }

  private async validateAsync(value: any): Promise<boolean> {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value && typeof value === 'string' && value.length > 0);
      }, 100);
    });
  }
}

// ============================================================================
// Async Database Validation Pipe
// ============================================================================

@Injectable()
export class UniqueEmailPipe implements PipeTransform {
  constructor(private userService: any) {} // Inject user service

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && metadata.data === 'email') {
      const exists = await this.userService.findByEmail(value);
      if (exists) {
        throw new BadRequestException('Email already exists');
      }
    }
    return value;
  }
}

// ============================================================================
// Async Transformation Pipe
// ============================================================================

@Injectable()
export class AsyncTransformPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Transform value asynchronously
    return this.transformAsync(value);
  }

  private async transformAsync(value: any): Promise<any> {
    // Simulate async transformation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof value === 'string') {
          resolve(value.trim().toLowerCase());
        } else {
          resolve(value);
        }
      }, 50);
    });
  }
}

// ============================================================================
// Observable-based Pipe
// ============================================================================

@Injectable()
export class ObservablePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Observable<any> {
    // Return Observable for reactive transformation
    return new Observable((observer) => {
      // Simulate async operation
      setTimeout(() => {
        observer.next(value?.toUpperCase());
        observer.complete();
      }, 100);
    });
  }
}


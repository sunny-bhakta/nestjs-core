/**
 * Pipes: Validation Pipe
 * 
 * ValidationPipe transforms and validates incoming data.
 * It uses class-validator and class-transformer.
 */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

// Custom Validation Pipe
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Validation failed: "${value}" is not an integer`);
    }
    return val;
  }
}

// Custom Transformation Pipe
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      const trimmed = {};
      for (const key in value) {
        if (typeof value[key] === 'string') {
          trimmed[key] = value[key].trim();
        } else {
          trimmed[key] = value[key];
        }
      }
      return trimmed;
    }
    return value;
  }
}

// Custom Parse Array Pipe
@Injectable()
export class ParseArrayPipe implements PipeTransform<string, string[]> {
  transform(value: string, metadata: ArgumentMetadata): string[] {
    if (!value) {
      return [];
    }
    return value.split(',').map(item => item.trim());
  }
}


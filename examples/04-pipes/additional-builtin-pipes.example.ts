/**
 * Pipes: Additional Built-in Pipes
 * 
 * Examples of ParseFloatPipe and ParseUUIDPipe.
 */

import { Controller, Get, Param, Query, UsePipes, ParseFloatPipe, ParseUUIDPipe } from '@nestjs/common';

@Controller('pipes')
export class AdditionalPipesController {
  
  // ParseFloatPipe - Parse to float
  @Get('float/:value')
  getFloat(@Param('value', ParseFloatPipe) value: number) {
    return {
      value,
      type: typeof value,
      isFloat: Number.isFinite(value) && !Number.isInteger(value),
    };
  }

  // ParseFloatPipe with query parameter
  @Get('price')
  getPrice(@Query('amount', ParseFloatPipe) amount: number) {
    return {
      amount,
      formatted: `$${amount.toFixed(2)}`,
    };
  }

  // ParseUUIDPipe - Parse to UUID
  @Get('uuid/:id')
  getUuid(@Param('id', ParseUUIDPipe) id: string) {
    return {
      id,
      isValid: this.isValidUUID(id),
    };
  }

  // ParseUUIDPipe with version
  @Get('uuid-v4/:id')
  getUuidV4(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return {
      id,
      version: '4',
    };
  }

  // ParseUUIDPipe with optional
  @Get('uuid-optional/:id?')
  getUuidOptional(@Param('id', new ParseUUIDPipe({ optional: true })) id?: string) {
    return {
      id: id || 'not provided',
    };
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}


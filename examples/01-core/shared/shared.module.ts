/**
 * Core Concept: Shared Module
 * 
 * Shared modules export providers that can be used by multiple feature modules.
 * Use @Global() to make a module available globally without importing.
 */

import { Module, Global } from '@nestjs/common';
import { CommonService } from './common.service';
import { LoggerService } from './logger.service';

@Global() // Makes this module available globally
@Module({
  providers: [CommonService, LoggerService],
  exports: [CommonService, LoggerService],
})
export class SharedModule {}


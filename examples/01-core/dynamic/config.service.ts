import { Injectable, Inject } from '@nestjs/common';
import { DynamicModuleOptions } from './dynamic.module';

@Injectable()
export class ConfigService {
  constructor(
    @Inject('CONFIG_OPTIONS') private readonly options: DynamicModuleOptions,
  ) {}

  getApiKey(): string {
    return this.options.apiKey;
  }

  getApiUrl(): string {
    return this.options.apiUrl;
  }
}


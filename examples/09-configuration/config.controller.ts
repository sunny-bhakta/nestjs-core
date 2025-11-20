import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  // Direct access to ConfigService
  @Get()
  getConfig() {
    return {
      port: this.configService.get<number>('PORT'),
      nodeEnv: this.configService.get<string>('NODE_ENV'),
      databaseHost: this.configService.get<string>('DATABASE_HOST'),
    };
  }

  // Using custom config service
  @Get('app')
  getAppConfig() {
    return {
      port: this.appConfigService.getPort(),
      database: this.appConfigService.getDatabaseConfig(),
      jwt: {
        secret: this.appConfigService.getJwtSecret(),
        expiresIn: this.appConfigService.getJwtExpiresIn(),
      },
      environment: this.appConfigService.getNodeEnv(),
      isDevelopment: this.appConfigService.isDevelopment(),
      isProduction: this.appConfigService.isProduction(),
    };
  }
}


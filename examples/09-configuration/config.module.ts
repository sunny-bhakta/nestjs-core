/**
 * Configuration: Environment Variables and Config Management
 * 
 * NestJS provides @nestjs/config for managing application configuration.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

// Configuration schema validation
import * as Joi from 'joi';

@Module({
  imports: [
    // Basic configuration
    ConfigModule.forRoot({
      isGlobal: true, // Make config available globally
      envFilePath: '.env', // Path to .env file
      ignoreEnvFile: false, // Don't ignore .env file
    }),

    // Configuration with validation
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Async configuration
    ConfigModule.forRootAsync({
      useFactory: () => ({
        port: parseInt(process.env.PORT, 10) || 3000,
        database: {
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        },
      }),
      inject: [],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}


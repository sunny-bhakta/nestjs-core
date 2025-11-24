# Configuration

Configuration management is essential for building applications that work in different environments. NestJS provides `@nestjs/config` for managing configuration.

## Table of Contents

1. [What is Configuration?](#what-is-configuration)
2. [Configuration Module](#configuration-module)
3. [Configuration Sources](#configuration-sources)
4. [Config Service](#config-service)
5. [Configuration Validation](#configuration-validation)
6. [Best Practices](#best-practices)

---

## What is Configuration?

Configuration allows you to:
- Store environment-specific settings
- Manage secrets and API keys
- Configure database connections
- Set feature flags
- Control application behavior

---

## Configuration Module

The `ConfigModule` provides a way to load and access configuration values.

### Basic Setup

**Example:** [Configuration Module](../examples/09-configuration/config.module.ts)

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
ConfigModule.forRootAsync({
  useFactory: () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
  }),
  inject: [],
})
```

---

## Configuration Sources

### Environment Variables

Load from `.env` files or system environment variables.

```typescript
ConfigModule.forRoot({
  envFilePath: '.env',
  ignoreEnvFile: false,
})
```

### Configuration Files

Load from JSON or YAML files.

```typescript
ConfigModule.forRoot({
  load: [() => require('./config.json')],
})
```

### Runtime Configuration

Set configuration at runtime.

```typescript
ConfigModule.forRoot({
  load: [
    () => ({
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    }),
  ],
})
```

**Example:** [Configuration Service](../examples/09-configuration/config.service.ts)

---

## Config Service

The `ConfigService` provides access to configuration values.

### Basic Usage

```typescript
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }
}
```

### Type-safe Configuration

```typescript
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    return {
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT', 5432),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
    };
  }
}
```

**Example:** [Configuration Service](../examples/09-configuration/config.service.ts)

---

## Configuration Validation

Validate configuration using Joi or class-validator.

**Example:** [Configuration Module](../examples/09-configuration/config.module.ts)

```typescript
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(5432),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
})
```

---

## Best Practices

1. **Environment Files**: Use `.env` files for local development
2. **Validation**: Always validate configuration
3. **Type Safety**: Use TypeScript types for configuration
4. **Secrets Management**: Never commit secrets to version control
5. **Default Values**: Provide sensible defaults
6. **Configuration Service**: Create a typed configuration service

---

## Common Configuration Patterns

### Database Configuration

```typescript
getDatabaseConfig() {
  return {
    host: this.configService.get<string>('DB_HOST'),
    port: this.configService.get<number>('DB_PORT', 5432),
    username: this.configService.get<string>('DB_USER'),
    password: this.configService.get<string>('DB_PASSWORD'),
    database: this.configService.get<string>('DB_NAME'),
  };
}
```

### API Configuration

```typescript
getApiConfig() {
  return {
    baseURL: this.configService.get<string>('API_BASE_URL'),
    timeout: this.configService.get<number>('API_TIMEOUT', 5000),
    apiKey: this.configService.get<string>('API_KEY'),
  };
}
```

---

## Resources

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Joi Validation](https://joi.dev/)


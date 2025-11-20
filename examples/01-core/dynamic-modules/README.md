# Dynamic Modules - Complete Guide

This directory contains comprehensive examples of all dynamic module patterns in NestJS.

## Patterns Explained

### 1. `forRoot()` - Synchronous Root Configuration
Use this pattern when you have static configuration values that don't need to be loaded asynchronously.

**When to use:**
- Static configuration values
- Simple setup
- Development/testing environments

**Example:**
```typescript
DatabaseModule.forRoot({
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'mydb',
})
```

### 2. `forRootAsync()` - Asynchronous Root Configuration
Use this pattern when you need to load configuration from environment variables, config files, or other async sources.

**When to use:**
- Configuration from ConfigService
- Environment variables
- External configuration files
- Production environments

**Example:**
```typescript
DatabaseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    // ...
  }),
  inject: [ConfigService],
})
```

### 3. `forFeature()` - Synchronous Feature Configuration
Use this pattern when different features need different configurations but share the same root setup.

**When to use:**
- Feature-specific settings
- Different schemas/prefixes per feature
- Module-scoped configuration

**Example:**
```typescript
// Root configuration (global)
DatabaseModule.forRoot({ /* ... */ })

// Feature-specific configuration
DatabaseModule.forFeature({
  schema: 'users',
  tablePrefix: 'usr',
})
```

### 4. `forFeatureAsync()` - Asynchronous Feature Configuration
Same as `forFeature()` but with async configuration loading.

**When to use:**
- Feature configuration from ConfigService
- Dynamic feature settings
- Environment-based feature configuration

**Example:**
```typescript
DatabaseModule.forFeatureAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    schema: configService.get<string>('USERS_SCHEMA'),
    tablePrefix: 'usr',
  }),
  inject: [ConfigService],
})
```

### 5. `register()` - Simple Registration
A simpler pattern for non-global modules. Similar to `forRoot()` but not global.

**When to use:**
- Module-scoped configuration
- Simple setup without global scope
- Alternative to `forRoot()` when you don't need global access

**Example:**
```typescript
HttpClientModule.register({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})
```

### 6. `registerAsync()` - Simple Async Registration
Async version of `register()`.

**Example:**
```typescript
HttpClientModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    baseURL: configService.get<string>('API_URL'),
  }),
  inject: [ConfigService],
})
```

## File Structure

- **complete-dynamic-module.example.ts** - Complete implementation showing all patterns
- **usage-examples.module.ts** - Usage examples for all patterns
- **cache-module.example.ts** - Practical cache module example
- **http-client-module.example.ts** - HTTP client module example
- **logger-module.example.ts** - Logger module example
- **usage.controller.ts** - Controller using the dynamic modules

## Key Concepts

### Global vs Non-Global
- `forRoot()` and `forRootAsync()` typically make modules **global** (can be used without importing)
- `forFeature()` and `register()` are **non-global** (must be imported in each module)

### Configuration Hierarchy
1. **Root Configuration** (`forRoot`/`forRootAsync`) - Applied globally
2. **Feature Configuration** (`forFeature`/`forFeatureAsync`) - Applied per feature/module

### Provider Injection
- Use `@Inject('TOKEN_NAME')` to inject configuration
- Use `useFactory` for complex initialization
- Use `inject` array to specify dependencies

## Best Practices

1. **Use `forRootAsync()` in production** - Load configuration from environment variables
2. **Make root modules global** - Set `global: true` for shared services
3. **Use feature modules for customization** - Different features may need different settings
4. **Validate configuration** - Add validation in `useFactory` functions
5. **Provide defaults** - Always provide sensible default values
6. **Type safety** - Use TypeScript interfaces for options

## Common Use Cases

1. **Database Modules** - Different databases, schemas, or connection pools
2. **HTTP Clients** - Different API endpoints or configurations
3. **Cache Modules** - Different cache strategies per feature
4. **Logger Modules** - Different log levels or transports
5. **Third-party Integrations** - Different API keys or endpoints

## Example Workflow

```typescript
// 1. Create root module (global)
@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        host: config.get('DB_HOST'),
        // ...
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}

// 2. Use in feature modules
@Module({
  imports: [
    DatabaseModule.forFeature({
      schema: 'users',
    }),
  ],
})
export class UsersModule {}
```


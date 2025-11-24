# Advanced Features

This document covers advanced NestJS features for building complex applications.

## Table of Contents

1. [WebSockets](#websockets)
2. [GraphQL](#graphql)
3. [Microservices](#microservices)
4. [CQRS](#cqrs)
5. [Event Emitter](#event-emitter)
6. [File Upload](#file-upload)
7. [Caching](#caching)
8. [Task Scheduling](#task-scheduling)
9. [HTTP Module](#http-module)
10. [Logging](#logging)
11. [Serialization](#serialization)
12. [Versioning](#versioning)
13. [Compression](#compression)
14. [Rate Limiting](#rate-limiting)
15. [Health Checks](#health-checks)
16. [Documentation (Swagger)](#documentation-swagger)
17. [Internationalization (i18n)](#internationalization-i18n)
18. [Server-Sent Events (SSE)](#server-sent-events-sse)
19. [Streaming](#streaming)

---

## WebSockets

WebSockets enable real-time bidirectional communication.

**Example:** [WebSockets Gateway](../examples/12-advanced/websockets.gateway.ts)

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    this.server.emit('message', data);
  }
}
```

---

## GraphQL

GraphQL provides a query language for APIs.

**Example:** [GraphQL Resolver](../examples/12-advanced/graphql.resolver.ts)

```typescript
@Resolver(() => User)
export class UsersResolver {
  @Query(() => [User])
  findAll() {
    return [];
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return { id: '1', ...input };
  }
}
```

### Subscriptions

**Example:** [GraphQL Subscriptions](../examples/12-advanced/graphql-subscriptions.example.ts)

```typescript
@Subscription(() => Message)
messageCreated() {
  return this.pubSub.asyncIterator('messageCreated');
}
```

---

## Microservices

NestJS supports building microservices with various transport layers.

**Example:** [Microservices](../examples/12-advanced/microservices.controller.ts)

```typescript
@MessagePattern('get_users')
handleGetUsers() {
  return [];
}

@EventPattern('user_created')
handleUserCreated(data: any) {
  console.log('User created:', data);
}
```

---

## CQRS

Command Query Responsibility Segregation separates read and write operations.

**Example:** [CQRS](../examples/12-advanced/cqrs.example.ts)

```typescript
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand) {
    // Create user logic
  }
}
```

---

## Event Emitter

Event-driven architecture using EventEmitter2.

**Example:** [Event Emitter](../examples/12-advanced/event-emitter.example.ts)

```typescript
@Injectable()
export class UserService {
  constructor(private eventEmitter: EventEmitter2) {}

  async createUser(userData: any) {
    const user = await this.create(userData);
    this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id, user.email));
    return user;
  }
}

@Injectable()
export class UserCreatedHandler {
  @OnEvent('user.created')
  handleUserCreated(event: UserCreatedEvent) {
    console.log('User created:', event);
  }
}
```

---

## File Upload

Handle file uploads using multer.

**Example:** [File Upload](../examples/12-advanced/file-upload.controller.ts)

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    filename: file.filename,
    size: file.size,
  };
}
```

---

## Caching

Implement caching to improve performance.

**Example:** [Caching](../examples/12-advanced/caching.example.ts)

```typescript
@Get()
@UseInterceptors(CacheInterceptor)
@CacheTTL(60)
findAll() {
  return [];
}
```

---

## Task Scheduling

Schedule tasks to run at specific intervals.

**Example:** [Task Scheduling](../examples/12-advanced/scheduling.example.ts)

```typescript
@Injectable()
export class TaskSchedulingService {
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    console.log('Task executed every minute');
  }

  @Interval(10000)
  handleInterval() {
    console.log('Task executed every 10 seconds');
  }
}
```

---

## HTTP Module

Make HTTP requests using Axios.

**Example:** [HTTP Module](../examples/12-advanced/http-module.example.ts)

```typescript
@Injectable()
export class HttpModuleService {
  constructor(private readonly httpService: HttpService) {}

  async getData(url: string) {
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}
```

---

## Logging

Logging is essential for debugging and monitoring.

**Example:** [Logging](../examples/12-advanced/logging.example.ts)

```typescript
@Injectable()
export class CustomLoggerService implements LoggerService {
  log(message: any, context?: string) {
    console.log(`[LOG] [${context}] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    console.error(`[ERROR] [${context}] ${message}`, trace);
  }
}
```

---

## Serialization

Control how data is serialized in responses.

**Example:** [Serialization](../examples/12-advanced/serialization.example.ts)

```typescript
export class User {
  @Expose()
  id: string;

  @Exclude()
  password: string;

  @Transform(({ value }) => value?.toUpperCase())
  role: string;
}
```

---

## Versioning

API versioning allows you to maintain multiple versions of your API.

**Example:** [Versioning](../examples/12-advanced/versioning.example.ts)

```typescript
@Controller({ path: 'users', version: '1' })
export class UsersV1Controller {}

@Controller({ path: 'users', version: '2' })
export class UsersV2Controller {}
```

---

## Compression

Compress responses to reduce bandwidth.

**Example:** [Compression](../examples/12-advanced/compression.example.ts)

```typescript
app.use(compression({
  level: 6,
  threshold: 1024,
}));
```

---

## Rate Limiting

Limit the number of requests from a single IP.

**Example:** [Rate Limiting](../examples/12-advanced/rate-limiting.example.ts)

```typescript
@Controller('api')
@UseGuards(ThrottlerGuard)
export class ApiController {
  @Throttle(10, 60) // 10 requests per 60 seconds
  @Get()
  findAll() {
    return [];
  }
}
```

---

## Health Checks

Monitor application health.

**Example:** [Health Checks](../examples/12-advanced/health-checks.example.ts)

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.isHealthy('database'),
    ]);
  }
}
```

---

## Documentation (Swagger)

Generate API documentation automatically.

**Example:** [Swagger Documentation](../examples/12-advanced/documentation-swagger.example.ts)

```typescript
const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

## Internationalization (i18n)

Support multiple languages.

**Example:** [i18n](../examples/12-advanced/i18n.example.ts)

```typescript
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get('hello')
  hello(@I18nLang() lang: string) {
    return {
      message: this.i18n.translate('common.HELLO', { lang }),
    };
  }
}
```

---

## Server-Sent Events (SSE)

Stream events to clients in real-time.

**Example:** [SSE](../examples/12-advanced/sse-server-sent-events.example.ts)

```typescript
@Sse('events')
sendEvents(): Observable<MessageEvent> {
  return interval(1000).pipe(
    map((_) => ({
      data: { timestamp: new Date().toISOString() },
    })),
  );
}
```

---

## Streaming

Stream large files or data.

**Example:** [Streaming](../examples/12-advanced/streaming.example.ts)

```typescript
@Get('file')
getFile(@Res({ passthrough: true }) res: Response) {
  const file = createReadStream(join(process.cwd(), 'package.json'));
  res.set({
    'Content-Type': 'application/json',
    'Content-Disposition': 'attachment; filename="package.json"',
  });
  return new StreamableFile(file);
}
```

---

## Resources

- [NestJS Advanced Topics](https://docs.nestjs.com/)
- [WebSockets](https://docs.nestjs.com/websockets/gateways)
- [GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Microservices](https://docs.nestjs.com/microservices/basics)


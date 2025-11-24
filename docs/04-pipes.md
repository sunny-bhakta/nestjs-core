# Pipes

Pipes are classes that implement the `PipeTransform` interface. They have two main use cases:
1. **Transformation**: Transform input data to the desired form
2. **Validation**: Evaluate input data and throw exceptions if invalid

## Table of Contents

1. [What are Pipes?](#what-are-pipes)
2. [Built-in Pipes](#built-in-pipes)
3. [Custom Pipes](#custom-pipes)
4. [Pipe Usage](#pipe-usage)
5. [Async Pipes](#async-pipes)

---

## What are Pipes?

Pipes run **after** guards but **before** the route handler receives the request.

### Request Lifecycle Position

```
Request → Middleware → Guards → Pipes → Controller → Response
```

### Pipe Execution Order

1. Global pipes
2. Controller-level pipes
3. Method-level pipes
4. Parameter-level pipes

---

## Built-in Pipes

NestJS provides several built-in pipes out of the box.

### `ValidationPipe`
Validates DTOs using class-validator.

```typescript
@Post()
@UsePipes(new ValidationPipe())
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

### `ParseIntPipe`
Converts string to integer.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id };
}
```

### `ParseFloatPipe`
Converts string to float.

**Example:** [Additional Built-in Pipes](../examples/04-pipes/additional-builtin-pipes.example.ts)

```typescript
@Get('price/:value')
getPrice(@Param('value', ParseFloatPipe) value: number) {
  return { value };
}
```

### `ParseBoolPipe`
Converts string to boolean.

```typescript
@Get('active/:isActive')
findByActive(@Param('isActive', ParseBoolPipe) isActive: boolean) {
  return { isActive };
}
```

### `ParseArrayPipe`
Converts string to array.

```typescript
@Get('tags')
findByTags(@Query('tags', ParseArrayPipe) tags: string[]) {
  return { tags };
}
```

### `ParseUUIDPipe`
Validates and parses UUID.

**Example:** [Additional Built-in Pipes](../examples/04-pipes/additional-builtin-pipes.example.ts)

```typescript
@Get('uuid/:id')
getUuid(@Param('id', ParseUUIDPipe) id: string) {
  return { id };
}
```

### `ParseEnumPipe`
Validates and parses enum values.

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Get('role/:role')
findByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
  return { role };
}
```

### `DefaultValuePipe`
Provides default value if parameter is missing.

```typescript
@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return { page, limit };
}
```

**Examples:**
- [Pipe Usage](../examples/04-pipes/pipes.controller.ts)
- [Additional Built-in Pipes](../examples/04-pipes/additional-builtin-pipes.example.ts)

---

## Custom Pipes

### Transformation Pipes

Transform input data to desired form.

**Example:** [Validation Pipe](../examples/04-pipes/validation.pipe.ts)

```typescript
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}
```

### Validation Pipes

Validate input data and throw exceptions if invalid.

```typescript
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
}
```

### Parameter Pipes

Pipes applied to specific parameters.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id };
}
```

---

## Pipe Usage

### Global Pipes

Apply pipes globally to all routes.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

### Controller-level Pipes

Apply pipes to all routes in a controller.

```typescript
@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {}
```

### Method-level Pipes

Apply pipes to specific routes.

```typescript
@Post()
@UsePipes(ValidationPipe)
create(@Body() createDto: CreateDto) {
  return createDto;
}
```

### Parameter-level Pipes

Apply pipes to specific parameters.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return { id };
}
```

**Example:** [Pipe Usage](../examples/04-pipes/pipes.controller.ts)

---

## Async Pipes

Pipes can be asynchronous for database validation or async transformations.

**Example:** [Async Pipes](../examples/04-pipes/async-pipes.example.ts)

```typescript
@Injectable()
export class AsyncValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const isValid = await this.validateAsync(value);
    if (!isValid) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private async validateAsync(value: any): Promise<boolean> {
    // Async validation logic
    return true;
  }
}
```

### Use Cases

1. **Database Validation**: Check if email exists in database
2. **External API Calls**: Validate against external services
3. **Async Transformations**: Transform data asynchronously

---

## Best Practices

1. **Use Built-in Pipes**: Prefer built-in pipes when possible
2. **Type Safety**: Always type your pipes
3. **Error Messages**: Provide meaningful error messages
4. **Performance**: Keep pipes lightweight
5. **Reusability**: Create reusable pipe classes

---

## Common Use Cases

1. **Input Validation**: Validate request data
2. **Type Conversion**: Convert string to number, boolean, etc.
3. **Data Transformation**: Transform request data
4. **Default Values**: Provide default values
5. **Sanitization**: Sanitize input data

---

## Resources

- [NestJS Pipes Documentation](https://docs.nestjs.com/pipes)
- [Class Validator](https://github.com/typestack/class-validator)
- [Class Transformer](https://github.com/typestack/class-transformer)


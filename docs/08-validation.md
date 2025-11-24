# Validation

Validation ensures that incoming data meets the requirements before it's processed. NestJS uses `class-validator` and `class-transformer` for validation.

## Table of Contents

1. [What is Validation?](#what-is-validation)
2. [Validation Pipe](#validation-pipe)
3. [Validation Decorators](#validation-decorators)
4. [DTOs](#dtos)
5. [Validation Groups](#validation-groups)
6. [Custom Validators](#custom-validators)
7. [Async Validation](#async-validation)

---

## What is Validation?

Validation checks that incoming request data is valid before it reaches your route handlers. This prevents invalid data from causing errors in your business logic.

### Validation Flow

```
Request → ValidationPipe → DTO Validation → Controller (if valid) or Error Response
```

---

## Validation Pipe

The `ValidationPipe` automatically validates DTOs using decorators from `class-validator`.

### Global Validation Pipe

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );
  await app.listen(3000);
}
```

### Validation Pipe Options

- `whitelist`: Remove properties without decorators
- `forbidNonWhitelisted`: Throw error for non-whitelisted properties
- `transform`: Transform payloads to DTO instances
- `disableErrorMessages`: Disable error messages
- `skipMissingProperties`: Skip validation for missing properties
- `skipNullProperties`: Skip validation for null properties
- `skipUndefinedProperties`: Skip validation for undefined properties

---

## Validation Decorators

### String Validation

- `@IsString()` - Must be a string
- `@IsNotEmpty()` - Must not be empty
- `@Length(min, max?)` - String length
- `@MinLength(min)` - Minimum length
- `@MaxLength(max)` - Maximum length
- `@Matches(pattern)` - Match regex pattern

### Number Validation

- `@IsNumber()` - Must be a number
- `@IsInt()` - Must be an integer
- `@IsFloat()` - Must be a float
- `@Min(min)` - Minimum value
- `@Max(max)` - Maximum value
- `@IsPositive()` - Must be positive
- `@IsNegative()` - Must be negative

### Email and URL Validation

- `@IsEmail()` - Must be a valid email
- `@IsUrl()` - Must be a valid URL

### Array Validation

- `@IsArray()` - Must be an array
- `@ArrayMinSize(min)` - Minimum array size
- `@ArrayMaxSize(max)` - Maximum array size
- `@ArrayNotEmpty()` - Array must not be empty

### Object Validation

- `@IsObject()` - Must be an object
- `@ValidateNested()` - Validate nested objects
- `@IsInstance()` - Must be instance of class

### Optional Validation

- `@IsOptional()` - Field is optional
- `@IsDefined()` - Field must be defined

### Type Validation

- `@IsBoolean()` - Must be boolean
- `@IsDate()` - Must be a date
- `@IsEnum()` - Must be enum value
- `@IsUUID()` - Must be UUID

**Example:** [DTOs with Validation](../examples/08-validation/create-user.dto.ts)

---

## DTOs

Data Transfer Objects (DTOs) define the structure and validation rules for incoming data.

### Request DTOs

DTOs for incoming request data.

**Example:** [Create User DTO](../examples/08-validation/create-user.dto.ts)

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

### Response DTOs

DTOs for outgoing response data.

**Example:** [Response DTOs](../examples/08-validation/response-dtos.example.ts)

```typescript
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}
```

### Transformation DTOs

DTOs that transform data during serialization.

**Example:** [Response DTOs](../examples/08-validation/response-dtos.example.ts)

---

## Validation Groups

Validation groups allow you to apply different validation rules in different scenarios.

**Example:** [Validation Groups](../examples/08-validation/validation-groups.example.ts)

```typescript
export class CreateUserDto {
  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  name: string;

  @IsEmail({}, { groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  email: string;

  @IsString({ groups: ['create'] })
  @MinLength(8, { groups: ['create'] })
  password: string;
}

// Usage
@Post('create')
@UsePipes(new ValidationPipe({ groups: ['create'] }))
create(@Body() createUserDto: CreateUserDto) {
  return createUserDto;
}
```

---

## Custom Validators

Create custom validation decorators for specific validation logic.

**Example:** [Custom Validators](../examples/08-validation/create-user.dto.ts)

```typescript
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value)
          );
        },
        defaultMessage() {
          return 'Password must be at least 8 characters and contain uppercase, lowercase, and number';
        },
      },
    });
  };
}
```

---

## Async Validation

Perform asynchronous validation, such as checking if a value exists in a database.

**Example:** [Async Validation](../examples/08-validation/validation-groups.example.ts)

```typescript
@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(email: string): Promise<boolean> {
    // Check database
    const exists = await this.userService.findByEmail(email);
    return !exists;
  }
}
```

---

## Best Practices

1. **Validate All Inputs**: Validate all incoming data
2. **Use DTOs**: Always use DTOs for request/response data
3. **Meaningful Messages**: Provide clear validation error messages
4. **Custom Validators**: Create reusable custom validators
5. **Validation Groups**: Use groups for different scenarios
6. **Async Validation**: Use async validation for database checks

---

## Resources

- [NestJS Validation Documentation](https://docs.nestjs.com/techniques/validation)
- [Class Validator](https://github.com/typestack/class-validator)
- [Class Transformer](https://github.com/typestack/class-transformer)


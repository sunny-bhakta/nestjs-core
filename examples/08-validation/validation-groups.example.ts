/**
 * Validation: Validation Groups
 * 
 * Examples of validation groups and conditional validation.
 */

import { IsString, IsEmail, IsOptional, ValidateIf, IsNotEmpty, MinLength } from 'class-validator';
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

// ============================================================================
// Validation Groups
// ============================================================================

export class CreateUserDto {
  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  name: string;

  @IsEmail({}, { groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  email: string;

  @IsString({ groups: ['create'] })
  @MinLength(8, { groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  password: string;

  @IsOptional({ groups: ['update'] })
  phone?: string;
}

// ============================================================================
// Conditional Validation
// ============================================================================

export class ConditionalUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Only validate password if email is provided
  @ValidateIf(o => o.email)
  @IsString()
  @MinLength(8)
  password: string;

  // Only validate phone if role is 'admin'
  @ValidateIf(o => o.role === 'admin')
  @IsString()
  @IsNotEmpty()
  phone: string;

  role: string;
}

// ============================================================================
// Async Validation
// ============================================================================

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    // Simulate async database check
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real scenario, check database
        resolve(email !== 'existing@example.com');
      }, 100);
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email already exists';
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}

export class AsyncValidationDto {
  @IsEmail()
  @IsUniqueEmail()
  email: string;
}

// ============================================================================
// Controller with Validation Groups
// ============================================================================

@Controller('validation-groups')
export class ValidationGroupsController {
  @Post('create')
  @UsePipes(new ValidationPipe({ groups: ['create'] }))
  create(@Body() createUserDto: CreateUserDto) {
    return { message: 'User created', user: createUserDto };
  }

  @Post('update')
  @UsePipes(new ValidationPipe({ groups: ['update'] }))
  update(@Body() updateUserDto: CreateUserDto) {
    return { message: 'User updated', user: updateUserDto };
  }

  @Post('conditional')
  @UsePipes(new ValidationPipe())
  conditional(@Body() conditionalDto: ConditionalUserDto) {
    return { message: 'Validated conditionally', user: conditionalDto };
  }

  @Post('async')
  @UsePipes(new ValidationPipe())
  asyncValidation(@Body() asyncDto: AsyncValidationDto) {
    return { message: 'Async validation passed', user: asyncDto };
  }
}


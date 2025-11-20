/**
 * Validation: Response DTOs and Transformation DTOs
 * 
 * Examples of response DTOs and data transformation DTOs.
 */

import { Exclude, Expose, Transform } from 'class-transformer';
import { Controller, Get, Post, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

// ============================================================================
// Response DTOs
// ============================================================================

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Exclude()
  password: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;
}

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => `$${value.toFixed(2)}`)
  price: number;

  @Expose()
  stock: number;

  @Expose()
  @Transform(({ value }) => value ? 'In Stock' : 'Out of Stock')
  inStock: boolean;
}

// ============================================================================
// Transformation DTOs
// ============================================================================

export class UserTransformationDto {
  @Transform(({ value }) => value?.toUpperCase())
  name: string;

  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @Transform(({ value }) => {
    if (!value) return null;
    return {
      full: value,
      first: value.split(' ')[0],
      last: value.split(' ').slice(1).join(' '),
    };
  })
  fullName: string;
}

// ============================================================================
// Paginated Response DTO
// ============================================================================

export class PaginatedResponseDto<T> {
  @Expose()
  data: T[];

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  total: number;

  @Expose()
  @Transform(({ value }) => Math.ceil(value))
  totalPages: number;
}

// ============================================================================
// Controller Usage
// ============================================================================

@Controller('response-dtos')
@UseInterceptors(ClassSerializerInterceptor)
export class ResponseDtosController {
  @Get('user')
  getUser(): UserResponseDto {
    const user = new UserResponseDto();
    user.id = '1';
    user.name = 'John Doe';
    user.email = 'john@example.com';
    user.role = 'user';
    user.password = 'secret';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user; // password will be excluded
  }

  @Get('users')
  getUsers(): PaginatedResponseDto<UserResponseDto> {
    const response = new PaginatedResponseDto<UserResponseDto>();
    response.data = [];
    response.page = 1;
    response.limit = 10;
    response.total = 0;
    response.totalPages = 0;
    return response;
  }
}


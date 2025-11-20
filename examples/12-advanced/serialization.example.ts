/**
 * Serialization: Complete Example
 * 
 * Examples of using class-transformer for serialization and data transformation.
 */

import { Exclude, Expose, Transform, Type, SerializeOptions } from 'class-transformer';
import { Controller, Get, Post, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

// ============================================================================
// Basic Serialization
// ============================================================================

export class User {
  id: string;
  email: string;

  @Exclude() // Exclude from serialization
  password: string;

  firstName: string;
  lastName: string;

  @Expose() // Explicitly expose
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Transform(({ value }) => value?.toUpperCase()) // Transform value
  role: string;

  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

// ============================================================================
// Nested Serialization
// ============================================================================

export class Address {
  @Expose()
  street: string;

  @Expose()
  city: string;

  @Expose()
  zipCode: string;

  @Exclude()
  country: string; // Excluded
}

export class UserWithAddress {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Type(() => Address) // Specify nested type
  @Expose()
  address: Address;
}

// ============================================================================
// Conditional Serialization
// ============================================================================

export class UserWithGroups {
  @Expose({ groups: ['admin', 'user'] })
  id: string;

  @Expose({ groups: ['admin', 'user'] })
  email: string;

  @Expose({ groups: ['admin'] }) // Only for admin
  password: string;

  @Expose({ groups: ['admin', 'user'] })
  firstName: string;

  @Expose({ groups: ['admin'] }) // Only for admin
  salary: number;
}

// ============================================================================
// Custom Transformers
// ============================================================================

export class Product {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Transform(({ value }) => `$${value.toFixed(2)}`) // Format as currency
  @Expose()
  price: number;

  @Transform(({ value }) => value ? 'In Stock' : 'Out of Stock')
  @Expose()
  inStock: boolean;

  @Transform(({ value }) => {
    if (!value) return null;
    return {
      url: value.url,
      alt: value.alt,
    };
  })
  @Expose()
  image: { url: string; alt: string; metadata?: any };
}

// ============================================================================
// Serialization with DTOs
// ============================================================================

export class CreateUserDto {
  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  role: string;

  @Transform(({ value }) => value.toISOString())
  @Expose()
  createdAt: Date;
}

// ============================================================================
// Controller with Serialization
// ============================================================================

@Controller('serialization')
@UseInterceptors(ClassSerializerInterceptor) // Apply to all routes
export class SerializationController {
  
  @Get('user')
  getUser() {
    const user = new User();
    user.id = '1';
    user.email = 'user@example.com';
    user.password = 'secret';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = 'user';
    user.createdAt = new Date();
    user.updatedAt = new Date();
    
    return user; // password and updatedAt will be excluded
  }

  @Get('user-with-address')
  getUserWithAddress() {
    const user = new UserWithAddress();
    user.id = '1';
    user.email = 'user@example.com';
    user.password = 'secret';
    user.address = {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      country: 'USA',
    };
    
    return user; // password and country will be excluded
  }

  @Get('user-admin')
  getUserForAdmin() {
    const user = new UserWithGroups();
    user.id = '1';
    user.email = 'user@example.com';
    user.password = 'secret';
    user.firstName = 'John';
    user.salary = 100000;
    
    // Serialize with 'admin' group
    return user; // All fields including password and salary
  }

  @Get('product')
  getProduct() {
    const product = new Product();
    product.id = '1';
    product.name = 'Laptop';
    product.price = 999.99;
    product.inStock = true;
    product.image = {
      url: 'https://example.com/image.jpg',
      alt: 'Laptop image',
      metadata: { size: 1024 },
    };
    
    return product; // Price formatted, inStock transformed, image simplified
  }

  @Post('create-user')
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(@Body() createUserDto: CreateUserDto) {
    // Create user logic here
    const user = new UserResponseDto();
    user.id = '1';
    user.email = createUserDto.email;
    user.fullName = `${createUserDto.firstName} ${createUserDto.lastName}`;
    user.role = 'user';
    user.createdAt = new Date();
    
    return user; // Serialized according to UserResponseDto
  }
}

// ============================================================================
// Manual Serialization
// ============================================================================

import { plainToInstance, instanceToPlain } from 'class-transformer';

export class SerializationService {
  // Convert plain object to class instance
  toInstance<T>(cls: new () => T, plain: any): T {
    return plainToInstance(cls, plain, {
      excludeExtraneousValues: true, // Only include @Expose() fields
    });
  }

  // Convert class instance to plain object
  toPlain(instance: any) {
    return instanceToPlain(instance, {
      excludeExtraneousValues: true,
    });
  }

  // Serialize with groups
  serializeWithGroups(instance: any, groups: string[]) {
    return instanceToPlain(instance, {
      groups,
      excludeExtraneousValues: true,
    });
  }
}


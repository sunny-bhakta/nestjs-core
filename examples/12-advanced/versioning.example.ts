/**
 * Versioning: Complete Example
 * 
 * Examples of API versioning in NestJS using URI, Header, and Media Type versioning.
 */

import { Controller, Get, Post, Body, Version, VERSION_NEUTRAL, Headers } from '@nestjs/common';
import { Module } from '@nestjs/common';

// ============================================================================
// URI Versioning
// ============================================================================

@Controller({
  path: 'users',
  version: '1', // Default version for all routes
})
export class UsersV1Controller {
  @Get()
  findAll() {
    return {
      version: '1',
      users: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ],
    };
  }

  @Get(':id')
  findOne(@Body('id') id: string) {
    return {
      version: '1',
      user: { id, name: 'John Doe' },
    };
  }
}

@Controller({
  path: 'users',
  version: '2',
})
export class UsersV2Controller {
  @Get()
  findAll() {
    return {
      version: '2',
      data: {
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        ],
        total: 2,
        page: 1,
      },
    };
  }

  @Get(':id')
  findOne(@Body('id') id: string) {
    return {
      version: '2',
      data: {
        user: {
          id,
          name: 'John Doe',
          email: 'john@example.com',
          profile: {
            bio: 'Software developer',
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      },
    };
  }
}

// ============================================================================
// Method-level Versioning
// ============================================================================

@Controller('products')
export class ProductsController {
  @Get()
  @Version('1')
  findAllV1() {
    return {
      version: '1',
      products: [
        { id: '1', name: 'Product 1', price: 100 },
      ],
    };
  }

  @Get()
  @Version('2')
  findAllV2() {
    return {
      version: '2',
      data: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: {
              amount: 100,
              currency: 'USD',
            },
            metadata: {
              category: 'Electronics',
              tags: ['new', 'popular'],
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      },
    };
  }

  @Get()
  @Version(VERSION_NEUTRAL) // Available in all versions
  findAllNeutral() {
    return {
      products: [
        { id: '1', name: 'Product 1' },
      ],
    };
  }
}

// ============================================================================
// Header Versioning
// ============================================================================

@Controller({
  path: 'orders',
  version: ['1', '2'], // Support multiple versions
})
export class OrdersController {
  @Get()
  findAll(@Headers('x-api-version') version: string) {
    if (version === '2') {
      return {
        version: '2',
        data: {
          orders: [
            {
              id: '1',
              items: [{ productId: '1', quantity: 2 }],
              total: 200,
              status: 'pending',
            },
          ],
        },
      };
    }

    return {
      version: '1',
      orders: [
        { id: '1', total: 200 },
      ],
    };
  }
}

// ============================================================================
// Media Type Versioning
// ============================================================================

@Controller('payments')
export class PaymentsController {
  @Get()
  @Version('1')
  findAllV1() {
    return {
      version: '1',
      payments: [
        { id: '1', amount: 100, status: 'completed' },
      ],
    };
  }

  @Get()
  @Version('2')
  findAllV2() {
    return {
      version: '2',
      data: {
        payments: [
          {
            id: '1',
            amount: {
              value: 100,
              currency: 'USD',
            },
            status: 'completed',
            metadata: {
              method: 'credit_card',
              transactionId: 'txn_123',
            },
          },
        ],
      },
    };
  }
}

// ============================================================================
// Version-specific DTOs
// ============================================================================

export class CreateUserV1Dto {
  name: string;
  email: string;
}

export class CreateUserV2Dto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

@Controller('users')
export class CreateUserController {
  @Post()
  @Version('1')
  createV1(@Body() createUserDto: CreateUserV1Dto) {
    return {
      version: '1',
      user: {
        id: '1',
        ...createUserDto,
      },
    };
  }

  @Post()
  @Version('2')
  createV2(@Body() createUserDto: CreateUserV2Dto) {
    return {
      version: '2',
      data: {
        user: {
          id: '1',
          name: `${createUserDto.firstName} ${createUserDto.lastName}`,
          ...createUserDto,
        },
      },
    };
  }
}

// ============================================================================
// Module Setup with Versioning
// ============================================================================

@Module({
  controllers: [
    UsersV1Controller,
    UsersV2Controller,
    ProductsController,
    OrdersController,
    PaymentsController,
    CreateUserController,
  ],
})
export class VersioningModule {}

// ============================================================================
// Main Application Setup (main.ts example)
// ============================================================================

/*
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable URI versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Or enable Header versioning
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'x-api-version',
  // });

  // Or enable Media Type versioning
  // app.enableVersioning({
  //   type: VersioningType.MEDIA_TYPE,
  //   key: 'v=',
  // });

  await app.listen(3000);
}
bootstrap();
*/


/**
 * Database: TypeORM Integration
 * 
 * TypeORM is a popular ORM for TypeScript and JavaScript.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { UsersService } from './users.service';
import { ProductsService } from './products.service';

// TypeORM Module Configuration
@Module({
  imports: [
    // Basic configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      entities: [User, Product],
      synchronize: true, // Only for development
    }),

    // Async configuration with ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Register repositories
    TypeOrmModule.forFeature([User, Product]),
  ],
  providers: [UsersService, ProductsService],
})
export class DatabaseModule {}


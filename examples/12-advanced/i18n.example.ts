/**
 * Internationalization (i18n): Complete Example
 * 
 * Examples of i18n using @nestjs/i18n.
 */

import { Controller, Get, Post, Body, Query, I18nLang, I18nService, I18n } from '@nestjs/common';
import { Module } from '@nestjs/common';

// ============================================================================
// Basic i18n Usage
// ============================================================================

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get('hello')
  hello(@I18nLang() lang: string) {
    return {
      message: this.i18n.translate('common.HELLO', { lang }),
    };
  }

  @Get('greeting')
  greeting(@I18nLang() lang: string) {
    return {
      message: this.i18n.translate('common.GREETING', {
        lang,
        args: { name: 'John' },
      }),
    };
  }

  @Get('welcome')
  welcome(@I18n() i18n: I18nService) {
    return {
      message: i18n.translate('common.WELCOME'),
    };
  }
}

// ============================================================================
// i18n with DTOs
// ============================================================================

export class CreateProductDto {
  name: string;
  description: string;
  price: number;
}

@Controller('products')
export class ProductsI18nController {
  constructor(private readonly i18n: I18nService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @I18nLang() lang: string) {
    return {
      message: this.i18n.translate('products.CREATED', { lang }),
      product: createProductDto,
    };
  }
}

// ============================================================================
// i18n with Validation Messages
// ============================================================================

import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

export class CreateUserI18nDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

@Controller('users')
export class UsersI18nController {
  @Post()
  create(@Body() createUserDto: CreateUserI18nDto) {
    return {
      message: 'User created',
      user: createUserDto,
    };
  }
}

// ============================================================================
// i18n with Interceptors
// ============================================================================

import { UseInterceptors } from '@nestjs/common';
import { I18nLangInterceptor } from 'nestjs-i18n';

@Controller('i18n-interceptor')
@UseInterceptors(I18nLangInterceptor)
export class I18nInterceptorController {
  constructor(private readonly i18n: I18nService) {}

  @Get('test')
  test() {
    return {
      message: this.i18n.translate('common.TEST'),
    };
  }
}

// ============================================================================
// Module Setup
// ============================================================================

import { I18nModule, I18nJsonLoader, QueryResolver, HeaderResolver, AcceptLanguageResolver, CookieResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true, // Watch for changes in translation files
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] }, // ?lang=en
        { use: HeaderResolver, options: ['x-custom-lang'] }, // Header: x-custom-lang: en
        AcceptLanguageResolver, // Accept-Language header
        CookieResolver, // Cookie: lang=en
      ],
    }),
  ],
  controllers: [
    I18nController,
    ProductsI18nController,
    UsersI18nController,
    I18nInterceptorController,
  ],
})
export class I18nExampleModule {}

// ============================================================================
// Translation Files Structure
// ============================================================================

/*
i18n/
  en/
    common.json
    products.json
    users.json
  es/
    common.json
    products.json
    users.json
  fr/
    common.json
    products.json
    users.json

// en/common.json
{
  "HELLO": "Hello",
  "GREETING": "Hello, {{name}}!",
  "WELCOME": "Welcome to our application",
  "TEST": "This is a test message"
}

// en/products.json
{
  "CREATED": "Product created successfully",
  "NOT_FOUND": "Product not found"
}

// es/common.json
{
  "HELLO": "Hola",
  "GREETING": "¡Hola, {{name}}!",
  "WELCOME": "Bienvenido a nuestra aplicación",
  "TEST": "Este es un mensaje de prueba"
}
*/

// ============================================================================
// Custom i18n Service
// ============================================================================

import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomI18nService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, lang?: string, args?: any) {
    return this.i18n.translate(key, { lang, args });
  }

  translateError(key: string, lang?: string) {
    return this.i18n.translate(`errors.${key}`, { lang });
  }

  translateSuccess(key: string, lang?: string) {
    return this.i18n.translate(`success.${key}`, { lang });
  }
}


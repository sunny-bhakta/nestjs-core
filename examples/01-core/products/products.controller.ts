/**
 * Core Concept: Controller - Products Controller
 * 
 * Controller for handling product-related HTTP requests.
 * This demonstrates a feature controller with basic CRUD operations.
 */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('category/:category')
  findByCategory(@Query('category') category: string) {
    return this.productsService.findByCategory(category);
  }
}


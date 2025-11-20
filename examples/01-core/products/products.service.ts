/**
 * Core Concept: Service - Products Service
 * 
 * Service class for handling product business logic.
 * This demonstrates a simple service implementation.
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [
    { id: '1', name: 'Product 1', price: 100, category: 'Electronics' },
    { id: '2', name: 'Product 2', price: 200, category: 'Clothing' },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find(product => product.id === id);
  }

  findByCategory(category: string) {
    return this.products.filter(product => product.category === category);
  }
}


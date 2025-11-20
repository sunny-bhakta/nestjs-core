/**
 * Providers: Factories and Helpers
 * 
 * Examples of factory services and helper services.
 */

import { Injectable } from '@nestjs/common';

// ============================================================================
// Factory Services
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable()
export class UserFactory {
  /**
   * Create a new user instance
   */
  create(userData: Partial<User>): User {
    return {
      id: this.generateId(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'user',
    };
  }

  /**
   * Create multiple users
   */
  createMany(count: number, template: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(template));
  }

  /**
   * Create user from DTO
   */
  createFromDto(dto: { name: string; email: string }): User {
    return this.create({
      name: dto.name,
      email: dto.email,
      role: 'user',
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

@Injectable()
export class ProductFactory {
  create(productData: { name: string; price: number; category: string }) {
    return {
      id: this.generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// ============================================================================
// Helper Services
// ============================================================================

@Injectable()
export class StringHelper {
  /**
   * Convert string to slug
   */
  toSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Capitalize first letter
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Generate random string
   */
  randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

@Injectable()
export class DateHelper {
  /**
   * Format date to ISO string
   */
  toISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Add days to date
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Check if date is in the past
   */
  isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Get difference in days
   */
  daysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

@Injectable()
export class ValidationHelper {
  /**
   * Validate email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate phone number
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

@Injectable()
export class ArrayHelper {
  /**
   * Chunk array into smaller arrays
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Remove duplicates
   */
  unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Group by property
   */
  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
}

// ============================================================================
// Usage Example
// ============================================================================

@Injectable()
export class UserService {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly stringHelper: StringHelper,
    private readonly dateHelper: DateHelper,
    private readonly validationHelper: ValidationHelper,
  ) {}

  createUser(userData: { name: string; email: string }) {
    // Validate email
    if (!this.validationHelper.isValidEmail(userData.email)) {
      throw new Error('Invalid email');
    }

    // Create user using factory
    const user = this.userFactory.create({
      name: this.stringHelper.capitalize(userData.name),
      email: userData.email.toLowerCase(),
    });

    return user;
  }
}


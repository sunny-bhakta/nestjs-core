/**
 * Core Concept: Service (Provider)
 * 
 * Services contain business logic and are injectable providers.
 * They are decorated with @Injectable() and can be injected into controllers or other services.
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  getHello(): string {
    return 'Hello World!';
  }

  getUsers(page: number = 1, limit: number = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: this.users.slice(start, end),
      page,
      limit,
      total: this.users.length,
    };
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id) || null;
  }

  createUser(createUserDto: any) {
    const newUser = {
      id: String(this.users.length + 1),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  partialUpdateUser(id: string, updateUserDto: any) {
    return this.updateUser(id, updateUserDto);
  }

  deleteUser(id: string) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.users.splice(userIndex, 1);
    return true;
  }
}


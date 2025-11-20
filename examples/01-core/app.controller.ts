/**
 * Core Concept: Controller
 * 
 * Controllers handle incoming requests and return responses to the client.
 * They define routes and delegate business logic to services.
 */

import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api') // Route prefix
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /api
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // GET /api/users?page=1&limit=10
  @Get('users')
  getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.appService.getUsers(page, limit);
  }

  // GET /api/users/:id
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  // POST /api/users
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-cache')
  createUser(@Body() createUserDto: any) {
    return this.appService.createUser(createUserDto);
  }

  // PUT /api/users/:id
  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.updateUser(id, updateUserDto);
  }

  // PATCH /api/users/:id
  @Patch('users/:id')
  partialUpdateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.partialUpdateUser(id, updateUserDto);
  }

  // DELETE /api/users/:id
  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }

  // Wildcard route - matches all routes starting with /api/docs
  @Get('docs*')
  getDocs() {
    return { message: 'Documentation' };
  }
}


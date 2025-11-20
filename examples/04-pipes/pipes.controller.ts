/**
 * Pipes: Usage Examples
 * 
 * Pipes can be applied at different levels: global, controller, method, or parameter.
 */

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UsePipes,
  ParseIntPipe,
  ParseBoolPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ValidationPipe, TrimPipe, ParseArrayPipe } from './validation.pipe';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

// DTO for validation
class CreateUserDto {
  name: string;
  email: string;
  age: number;
}

@Controller('pipes')
@UsePipes(TrimPipe) // Apply pipe to all routes in controller
export class PipesController {
  
  // Built-in ParseIntPipe
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { id, type: typeof id };
  }

  // Built-in ParseBoolPipe
  @Get('active/:isActive')
  findByActive(@Param('isActive', ParseBoolPipe) isActive: boolean) {
    return { isActive, type: typeof isActive };
  }

  // Built-in ParseEnumPipe
  @Get('role/:role')
  findByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
    return { role };
  }

  // Built-in DefaultValuePipe
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return { page, limit };
  }

  // Custom ParseArrayPipe
  @Get('tags')
  findByTags(@Query('tags', ParseArrayPipe) tags: string[]) {
    return { tags };
  }

  // ValidationPipe with DTO
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }

  // Multiple pipes (executed in order)
  @Post('trimmed')
  createTrimmed(
    @Body(TrimPipe, ValidationPipe) createUserDto: CreateUserDto,
  ) {
    return createUserDto;
  }
}


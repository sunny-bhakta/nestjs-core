import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserWithAddressDto,
  CreateUsersDto,
  UpdateUserDto,
  QueryUsersDto,
  CreateUserWithStrongPasswordDto,
} from './create-user.dto';

@Controller('validation')
export class ValidationController {
  
  // Basic validation
  @Post('users')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      user: createUserDto,
    };
  }

  // Nested object validation
  @Post('users-with-address')
  @UsePipes(new ValidationPipe())
  createUserWithAddress(@Body() createUserDto: CreateUserWithAddressDto) {
    return {
      message: 'User with address created',
      user: createUserDto,
    };
  }

  // Array validation
  @Post('users-bulk')
  @UsePipes(new ValidationPipe())
  createUsers(@Body() createUsersDto: CreateUsersDto) {
    return {
      message: 'Users created successfully',
      count: createUsersDto.users.length,
      users: createUsersDto.users,
    };
  }

  // Update with partial validation
  @Put('users/:id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return {
      message: 'User updated successfully',
      updates: updateUserDto,
    };
  }

  // Query parameter validation
  @Get('users')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUsers(@Query() query: QueryUsersDto) {
    return {
      message: 'Users retrieved',
      query,
      users: [],
    };
  }

  // Custom validator
  @Post('users-strong-password')
  @UsePipes(new ValidationPipe())
  createUserWithStrongPassword(@Body() createUserDto: CreateUserWithStrongPasswordDto) {
    return {
      message: 'User with strong password created',
      user: { ...createUserDto, password: '***' },
    };
  }
}


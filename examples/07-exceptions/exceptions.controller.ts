import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseFilters,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { AllExceptionsFilter, BusinessException, BusinessExceptionFilter } from './exception-filters';

@Controller('exceptions')
export class ExceptionsController {
  
  // Throw built-in exception
  @Get('bad-request')
  badRequest() {
    throw new BadRequestException('This is a bad request');
  }

  @Get('not-found')
  notFound() {
    throw new NotFoundException('Resource not found');
  }

  @Get('unauthorized')
  unauthorized() {
    throw new UnauthorizedException('Unauthorized access');
  }

  @Get('forbidden')
  forbidden() {
    throw new ForbiddenException('Access forbidden');
  }

  @Get('conflict')
  conflict() {
    throw new ConflictException('Resource conflict');
  }

  // Throw custom HTTP exception
  @Get('custom')
  customException() {
    throw new HttpException('Custom exception message', HttpStatus.IAMBATEAPOT);
  }

  // Throw with custom response object
  @Get('custom-response')
  customResponseException() {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Custom error response',
        error: 'Custom Error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  // Use exception filter on specific route
  @Get('filtered')
  @UseFilters(BusinessExceptionFilter)
  filteredRoute() {
    throw new BusinessException('Business logic error');
  }

  // Conditional exception
  @Get('conditional/:id')
  conditionalException(@Param('id') id: string) {
    if (id === '0') {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return { id, message: 'Success' };
  }

  // Exception in async handler
  @Post('async')
  async asyncException(@Body() body: any) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return { message: 'Success' };
  }
}


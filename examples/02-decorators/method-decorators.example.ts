/**
 * Decorators: Method Decorators
 * 
 * Method decorators define HTTP routes and configure request handling.
 */

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  All,
  HttpCode, 
  HttpStatus, 
  Header, 
  Redirect,
  Render,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UseFilters,
  SetMetadata,
} from '@nestjs/common';

@Controller('methods')
export class MethodDecoratorsController {
  
  // @Get() - Handle GET requests
  @Get()
  findAll() {
    return { message: 'GET request' };
  }

  // @Get('path') - Handle GET with specific path
  @Get('users')
  getUsers() {
    return { users: [] };
  }

  // @Post() - Handle POST requests
  @Post()
  create() {
    return { message: 'POST request' };
  }

  // @Put() - Handle PUT requests
  @Put(':id')
  update() {
    return { message: 'PUT request' };
  }

  // @Patch() - Handle PATCH requests
  @Patch(':id')
  partialUpdate() {
    return { message: 'PATCH request' };
  }

  // @Delete() - Handle DELETE requests
  @Delete(':id')
  delete() {
    return { message: 'DELETE request' };
  }

  // @All() - Handle all HTTP methods
  @All('all-methods')
  handleAll() {
    return { message: 'Handles all HTTP methods' };
  }

  // @HttpCode() - Set custom status code
  @Post('created')
  @HttpCode(HttpStatus.CREATED)
  createResource() {
    return { message: 'Resource created' };
  }

  // @Header() - Set response header
  @Get('with-header')
  @Header('Cache-Control', 'no-cache')
  getWithHeader() {
    return { message: 'Response with header' };
  }

  // @Redirect() - Redirect to another URL
  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirect() {
    // Can also return { url: string, statusCode: number } dynamically
  }

  // @Render() - Render a template (for server-side rendering)
  @Get('template')
  @Render('index')
  renderTemplate() {
    return { message: 'Hello from template' };
  }

  // @UseGuards() - Apply guards (authentication/authorization)
  @Get('protected')
  @UseGuards(/* Guard class */)
  protectedRoute() {
    return { message: 'Protected route' };
  }

  // @UseInterceptors() - Apply interceptors
  @Get('intercepted')
  @UseInterceptors(/* Interceptor class */)
  interceptedRoute() {
    return { message: 'Intercepted route' };
  }

  // @UsePipes() - Apply pipes (validation/transformation)
  @Post('validated')
  @UsePipes(/* Pipe class */)
  validatedRoute() {
    return { message: 'Validated route' };
  }

  // @UseFilters() - Apply exception filters
  @Get('filtered')
  @UseFilters(/* Exception filter class */)
  filteredRoute() {
    return { message: 'Filtered route' };
  }

  // @SetMetadata() - Set custom metadata
  @Get('metadata')
  @SetMetadata('roles', ['admin'])
  @SetMetadata('permissions', ['read'])
  routeWithMetadata() {
    return { message: 'Route with metadata' };
  }
}


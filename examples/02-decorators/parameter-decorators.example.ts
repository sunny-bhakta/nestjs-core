/**
 * Decorators: Parameter Decorators
 * 
 * Parameter decorators extract data from the request object.
 */

import { Controller, Get, Post, Body, Param, Query, Headers, Ip, Session, HostParam, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Controller('decorators')
export class ParameterDecoratorsController {
  
  // @Body() - Extract request body
  @Post('body')
  getBody(@Body() body: any) {
    return { received: body };
  }

  // @Body('property') - Extract specific property from body
  @Post('body-property')
  getBodyProperty(@Body('name') name: string) {
    return { name };
  }

  // @Param() - Extract route parameters
  @Get('param/:id')
  getParam(@Param('id') id: string) {
    return { id };
  }

  // @Param() - Extract all route parameters
  @Get('params/:id/:name')
  getAllParams(@Param() params: { id: string; name: string }) {
    return params;
  }

  // @Query() - Extract query parameters
  @Get('query')
  getQuery(@Query('page') page: number, @Query('limit') limit: number) {
    return { page, limit };
  }

  // @Query() - Extract all query parameters
  @Get('queries')
  getAllQueries(@Query() queries: any) {
    return queries;
  }

  // @Headers() - Extract headers
  @Get('headers')
  getHeaders(@Headers('authorization') auth: string) {
    return { authorization: auth };
  }

  // @Headers() - Extract all headers
  @Get('all-headers')
  getAllHeaders(@Headers() headers: any) {
    return headers;
  }

  // @Ip() - Extract client IP address
  @Get('ip')
  getIp(@Ip() ip: string) {
    return { ip };
  }

  // @Session() - Extract session data
  @Get('session')
  getSession(@Session() session: any) {
    return { sessionId: session?.id };
  }

  // @HostParam() - Extract host parameter
  @Get('host')
  getHost(@HostParam('account') account: string) {
    return { account };
  }

  // @Req() - Access full request object
  @Get('request')
  getRequest(@Req() req: Request) {
    return {
      method: req.method,
      url: req.url,
      headers: req.headers,
    };
  }

  // @Res() - Access response object (use with caution)
  @Get('response')
  getResponse(@Res() res: Response) {
    return res.json({ message: 'Direct response' });
  }

  // @Next() - Access next function (for middleware-like behavior)
  @Get('next')
  getNext(@Next() next: NextFunction) {
    // Call next() to pass control to next handler
    next();
    return { message: 'After next' };
  }
}


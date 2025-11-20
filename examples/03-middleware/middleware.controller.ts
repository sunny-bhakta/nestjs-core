import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('middleware')
export class MiddlewareController {
  @Get()
  test(@Req() req: Request) {
    return {
      message: 'Middleware applied',
      requestId: req['requestId'],
      timestamp: req['timestamp'],
    };
  }

  @Get('protected')
  protected(@Req() req: Request) {
    return {
      message: 'Protected route',
      user: req['user'],
    };
  }
}


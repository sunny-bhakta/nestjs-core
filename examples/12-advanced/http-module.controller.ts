import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { HttpModuleService } from './http-module.example';

@Controller('http')
export class HttpModuleController {
  constructor(private readonly httpService: HttpModuleService) {}

  @Get('get')
  async getData(@Query('url') url: string) {
    return this.httpService.getData(url);
  }

  @Post('post')
  async postData(@Body() data: any, @Query('url') url: string) {
    return this.httpService.postData(url, data);
  }

  @Get('with-headers')
  async withHeaders(@Query('url') url: string) {
    return this.httpService.requestWithHeaders(url, {
      'X-Custom-Header': 'value',
    });
  }

  @Get('with-auth')
  async withAuth(@Query('url') url: string, @Query('token') token: string) {
    return this.httpService.requestWithAuth(url, token);
  }

  @Get('multiple')
  async multiple(@Query('urls') urls: string) {
    const urlArray = urls.split(',');
    return this.httpService.multipleRequests(urlArray);
  }
}


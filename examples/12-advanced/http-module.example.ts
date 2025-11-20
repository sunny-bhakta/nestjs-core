/**
 * HTTP Module: Complete Example
 * 
 * Comprehensive example of using @nestjs/axios for HTTP requests.
 */

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpModuleService {
  constructor(private readonly httpService: HttpService) {}

  // GET request
  async getData(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST request
  async postData(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT request
  async putData(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(url, data, config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH request
  async patchData(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(url, data, config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE request
  async deleteData(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Request with custom headers
  async requestWithHeaders(url: string, headers: Record<string, string>) {
    return this.getData(url, { headers });
  }

  // Request with authentication
  async requestWithAuth(url: string, token: string) {
    return this.getData(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Request with timeout
  async requestWithTimeout(url: string, timeout: number = 5000) {
    return this.getData(url, { timeout });
  }

  // Request with retry logic
  async requestWithRetry(url: string, maxRetries: number = 3) {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.getData(url);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  // Multiple concurrent requests
  async multipleRequests(urls: string[]) {
    const requests = urls.map(url => this.getData(url));
    return Promise.all(requests);
  }

  // Request with query parameters
  async requestWithQuery(url: string, params: Record<string, any>) {
    return this.getData(url, { params });
  }

  // Upload file
  async uploadFile(url: string, file: Buffer, filename: string) {
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', file, filename);

    return this.postData(url, formData, {
      headers: formData.getHeaders(),
    });
  }

  // Download file
  async downloadFile(url: string, responseType: 'arraybuffer' | 'blob' = 'arraybuffer') {
    const response = await firstValueFrom(
      this.httpService.get(url, { responseType }).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException(
            error.response?.data || error.message,
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
    return response.data;
  }
}

// Module setup
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpModuleController } from './http-module.controller';

@Module({
  imports: [
    // Basic HTTP module
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),

    // HTTP module with async configuration
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        baseURL: 'https://api.example.com',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  providers: [HttpModuleService],
  controllers: [HttpModuleController],
  exports: [HttpModuleService],
})
export class HttpModuleExample {}


import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './complete-dynamic-module.example';

@Controller('database')
export class DatabaseUsageController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('connection')
  getConnection() {
    return {
      connectionString: this.databaseService.getConnectionString(),
    };
  }

  @Get('table-name')
  getTableName() {
    return {
      usersTable: this.databaseService.getTableName('users'),
      productsTable: this.databaseService.getTableName('products'),
    };
  }
}


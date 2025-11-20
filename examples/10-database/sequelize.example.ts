/**
 * Database: Sequelize Integration
 * 
 * Examples of using Sequelize with NestJS.
 */

import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Model, DataTypes } from 'sequelize';

// ============================================================================
// Sequelize Models
// ============================================================================

export class User extends Model {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

export class Product extends Model {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
  },
};

// ============================================================================
// User Service with Sequelize
// ============================================================================

@Injectable()
export class SequelizeUserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async create(createUserDto: any): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: any): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updateUserDto);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  imports: [
    // Basic Sequelize configuration
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      models: [User, Product],
      autoLoadModels: true,
      synchronize: true, // Only for development
    }),

    // Sequelize with async configuration
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [User, Product],
        autoLoadModels: true,
      }),
    }),

    // Register models
    SequelizeModule.forFeature([User, Product]),
  ],
  providers: [SequelizeUserService],
  exports: [SequelizeUserService],
})
export class SequelizeModule {}


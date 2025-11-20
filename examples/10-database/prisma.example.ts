/**
 * Database: Prisma Integration
 * 
 * Examples of using Prisma with NestJS.
 */

import { Module } from '@nestjs/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// ============================================================================
// Prisma Service
// ============================================================================

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// ============================================================================
// User Service with Prisma
// ============================================================================

@Injectable()
export class PrismaUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Partial<{ name: string; email: string }>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Relations
  async findOneWithPosts(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }
}

// ============================================================================
// Transaction Example
// ============================================================================

@Injectable()
export class PrismaTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithPosts(
    userData: { name: string; email: string },
    posts: Array<{ title: string; content: string }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
      });

      const createdPosts = await Promise.all(
        posts.map((post) =>
          tx.post.create({
            data: {
              ...post,
              userId: user.id,
            },
          }),
        ),
      );

      return {
        user,
        posts: createdPosts,
      };
    });
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  providers: [
    PrismaService,
    PrismaUserService,
    PrismaTransactionService,
  ],
  exports: [PrismaService, PrismaUserService, PrismaTransactionService],
})
export class PrismaModule {}

// ============================================================================
// Prisma Schema Example (schema.prisma)
// ============================================================================

/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/


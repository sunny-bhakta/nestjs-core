# Database Integration

NestJS supports multiple database ORMs and query builders. This guide covers TypeORM, Mongoose, Prisma, and Sequelize.

## Table of Contents

1. [TypeORM](#typeorm)
2. [Mongoose](#mongoose)
3. [Prisma](#prisma)
4. [Sequelize](#sequelize)
5. [Best Practices](#best-practices)

---

## TypeORM

TypeORM is a popular ORM for TypeScript and JavaScript that supports both Active Record and Data Mapper patterns.

### Setup

**Example:** [TypeORM Integration](../examples/10-database/typeorm.example.ts)

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      entities: [User, Product],
      synchronize: true, // Only for development
    }),
  ],
})
export class DatabaseModule {}
```

### Entities

Define database entities with decorators.

**Example:** [User Entity](../examples/10-database/entities/user.entity.ts)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToMany(() => Product, product => product.user)
  products: Product[];
}
```

### Repositories

Use repositories to access data.

**Example:** [Users Service](../examples/10-database/users.service.ts)

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
```

### Relations

Define relationships between entities.

```typescript
@OneToMany(() => Product, product => product.user)
products: Product[];

@ManyToOne(() => User, user => user.products)
user: User;
```

### Transactions

Use transactions for atomic operations.

```typescript
async createWithTransaction(userData: Partial<User>): Promise<User> {
  return this.userRepository.manager.transaction(async (transactionalEntityManager) => {
    const user = transactionalEntityManager.create(User, userData);
    return transactionalEntityManager.save(user);
  });
}
```

### Query Builder

Use query builder for complex queries.

```typescript
async findActiveUsers(): Promise<User[]> {
  return this.userRepository
    .createQueryBuilder('user')
    .where('user.isActive = :isActive', { isActive: true })
    .orderBy('user.createdAt', 'DESC')
    .getMany();
}
```

---

## Mongoose

Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

### Setup

**Example:** [Mongoose Integration](../examples/10-database/mongoose.example.ts)

```typescript
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class DatabaseModule {}
```

### Schemas

Define Mongoose schemas.

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Services

Use Mongoose models in services.

```typescript
@Injectable()
export class MongooseUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: any): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }
}
```

---

## Prisma

Prisma is a next-generation ORM that provides type-safe database access.

### Setup

**Example:** [Prisma Integration](../examples/10-database/prisma.example.ts)

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Services

Use Prisma client in services.

```typescript
@Injectable()
export class PrismaUserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: { name: string; email: string }) {
    return this.prisma.user.create({ data });
  }
}
```

### Transactions

```typescript
async createUserWithPosts(userData: any, posts: any[]) {
  return this.prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const createdPosts = await Promise.all(
      posts.map(post => tx.post.create({ data: { ...post, userId: user.id } })),
    );
    return { user, posts: createdPosts };
  });
}
```

---

## Sequelize

Sequelize is a promise-based Node.js ORM for various databases.

### Setup

**Example:** [Sequelize Integration](../examples/10-database/sequelize.example.ts)

```typescript
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      models: [User, Product],
      autoLoadModels: true,
    }),
  ],
})
export class DatabaseModule {}
```

### Models

Define Sequelize models.

```typescript
export class User extends Model {
  id: number;
  name: string;
  email: string;
}
```

### Services

Use Sequelize models in services.

```typescript
@Injectable()
export class SequelizeUserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async create(userData: any): Promise<User> {
    return this.userModel.create(userData);
  }
}
```

---

## Best Practices

1. **Choose the Right ORM**: Select based on your database and needs
2. **Use Migrations**: Always use migrations for schema changes
3. **Transactions**: Use transactions for related operations
4. **Connection Pooling**: Configure connection pooling appropriately
5. **Query Optimization**: Optimize queries for performance
6. **Type Safety**: Use TypeScript types for entities/models

---

## Resources

- [TypeORM Documentation](https://typeorm.io/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Sequelize Documentation](https://sequelize.org/)


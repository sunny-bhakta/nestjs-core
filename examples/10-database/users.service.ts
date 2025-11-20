import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Find all
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Find one
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Find by email
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Update
  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  // Delete
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Query Builder example
  async findActiveUsers(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  // Relations
  async findOneWithProducts(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  // Transactions
  async createWithTransaction(userData: Partial<User>): Promise<User> {
    return this.userRepository.manager.transaction(async (transactionalEntityManager) => {
      const user = transactionalEntityManager.create(User, userData);
      return transactionalEntityManager.save(user);
    });
  }
}


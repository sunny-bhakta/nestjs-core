import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  async generateToken(user: { id: string; email: string; roles: string[] }) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
    };
  }

  // Verify token
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Login
  async login(email: string, password: string) {
    // Find user by email (mock)
    const user = { id: '1', email, password: 'hashed_password', roles: ['user'] };

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    return this.generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }

  // Register
  async register(userData: { email: string; password: string; name: string }) {
    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user (mock)
    const user = {
      id: '1',
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      roles: ['user'],
    };

    // Generate token
    return this.generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }
}


/**
 * Authentication: Local Strategy
 * 
 * Examples of Local Strategy authentication with Passport.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use email instead of username
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}

// Usage in AuthService
@Injectable()
export class LocalAuthService {
  async validateUser(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  private async findUserByEmail(email: string) {
    // Implementation
    return null;
  }

  private async comparePassword(password: string, hash: string) {
    // Implementation
    return false;
  }
}


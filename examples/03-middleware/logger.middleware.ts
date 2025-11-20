/**
 * Middleware: Functional Middleware
 * 
 * Functional middleware is a simple function that receives request, response, and next.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Functional Middleware
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Class-based Middleware
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
      );
    });
    
    next();
  }
}

// Authentication Middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Validate token here
    req['user'] = { id: '1', email: 'user@example.com' }; // Mock user
    next();
  }
}

// Request Transformation Middleware
@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add custom properties to request
    req['requestId'] = Math.random().toString(36).substring(7);
    req['timestamp'] = new Date().toISOString();
    next();
  }
}


/**
 * Express Middleware Examples
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Parse JSON
app.use(express.json());

console.log('=== Express Middleware Examples ===\n');

// Example 1: Application-Level Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Example 2: Path-Specific Middleware
app.use('/api', (req, res, next) => {
  console.log('API route accessed');
  req.apiVersion = 'v1';
  next();
});

// Example 3: Request Logging Middleware
const requestLogger = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(requestLogger);

// Example 4: Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // Simulate token validation
  if (token === 'valid-token') {
    req.user = { id: 1, name: 'John Doe' };
    next();
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Example 5: Authorization Middleware
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};

// Example 6: Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
};

// Example 7: Async Middleware
const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Example 8: Rate Limiting Middleware (simple)
const rateLimit = {};
const rateLimiter = (maxRequests = 5, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    if (now > rateLimit[ip].resetTime) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }
    
    if (rateLimit[ip].count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    rateLimit[ip].count++;
    next();
  };
};

// Routes using middleware
app.get('/', (req, res) => {
  res.json({
    message: 'Home page',
    requestTime: req.requestTime
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'API data',
    version: req.apiVersion
  });
});

app.get('/protected', authenticate, (req, res) => {
  res.json({
    message: 'Protected route',
    user: req.user
  });
});

app.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    message: 'Admin route',
    user: req.user
  });
});

app.get('/rate-limited', rateLimiter(3, 10000), (req, res) => {
  res.json({
    message: 'Rate limited route',
    timestamp: Date.now()
  });
});

app.get('/error', (req, res, next) => {
  const err = new Error('Test error');
  err.status = 400;
  next(err);
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nTest routes:');
  console.log('  GET  /');
  console.log('  GET  /api/data');
  console.log('  GET  /protected (Header: Authorization: valid-token)');
  console.log('  GET  /rate-limited (Try multiple times)');
  console.log('  GET  /error');
  console.log('\nPress Ctrl+C to stop');
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});


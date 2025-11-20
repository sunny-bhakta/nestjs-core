# Best Practices

This document outlines best practices for Node.js development, covering code organization, performance, security, error handling, testing, and deployment.

## Code Organization

### Project Structure

```
project/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
├── tests/
├── docs/
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Module Organization

```javascript
// Good: Single responsibility
// user-service.js
class UserService {
  async getUser(id) { /* ... */ }
  async createUser(data) { /* ... */ }
}

// Bad: Mixed responsibilities
// user.js
function getUser() { /* ... */ }
function sendEmail() { /* ... */ }
function processPayment() { /* ... */ }
```

### Separation of Concerns

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Models**: Data access
- **Utils**: Helper functions
- **Middleware**: Request processing

## Performance

### Avoid Blocking Operations

```javascript
// Bad: Blocks event loop
const data = fs.readFileSync('large-file.txt');

// Good: Non-blocking
fs.readFile('large-file.txt', (err, data) => {
  // Handle data
});

// Better: Async/await
const data = await fs.promises.readFile('large-file.txt');
```

### Use Streams for Large Data

```javascript
// Bad: Loads entire file into memory
const data = fs.readFileSync('large-file.txt');
processData(data);

// Good: Stream processing
fs.createReadStream('large-file.txt')
  .pipe(transformStream)
  .pipe(fs.createWriteStream('output.txt'));
```

### Caching Strategies

```javascript
// Simple in-memory cache
const cache = new Map();

function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = expensiveOperation();
  cache.set(key, data);
  return data;
}

// With TTL (Time To Live)
function getCachedDataWithTTL(key, ttl = 3600000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = expensiveOperation();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### Connection Pooling

```javascript
// Database connection pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

// Reuse connections
pool.getConnection((err, connection) => {
  if (err) throw err;
  connection.query('SELECT * FROM users', (err, results) => {
    connection.release(); // Return to pool
    // Handle results
  });
});
```

## Security

### Input Validation

```javascript
const validator = require('validator');

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  return email;
}

function validateInput(input) {
  // Sanitize input
  return validator.escape(input);
}
```

### Avoid eval()

```javascript
// Bad: Security risk
eval(userInput);

// Good: Use safe alternatives
const result = JSON.parse(userInput); // If JSON
// Or use a safe evaluation library
```

### Secure Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Use .npmrc for security
save-exact=true
```

### Environment Variables

```javascript
// Bad: Hardcoded secrets
const apiKey = 'secret-key-123';

// Good: Environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

### HTTPS Usage

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure connection');
}).listen(443);
```

## Error Handling

### Consistent Error Handling

```javascript
// Define error types
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Use consistently
function validateUser(user) {
  if (!user.email) {
    throw new AppError('Email is required', 400);
  }
}
```

### Error Logging

```javascript
const logger = require('./logger');

function handleError(error, req, res, next) {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    requestId: req.id
  });
  
  res.status(error.statusCode || 500).json({
    error: {
      message: error.message,
      code: error.code
    }
  });
}
```

### Graceful Degradation

```javascript
async function fetchWithFallback() {
  try {
    return await fetchFromPrimary();
  } catch (error) {
    logger.warn('Primary source failed, using fallback');
    return await fetchFromFallback();
  }
}
```

## Testing

### Unit Testing

```javascript
// user-service.test.js
const { getUser } = require('./user-service');

describe('UserService', () => {
  test('should get user by id', async () => {
    const user = await getUser(1);
    expect(user).toHaveProperty('id');
    expect(user.id).toBe(1);
  });
});
```

### Integration Testing

```javascript
// api.test.js
const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
  test('GET /users', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

### Test Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Set coverage threshold in package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Deployment

### Process Managers

```javascript
// PM2 ecosystem file
module.exports = {
  apps: [{
    name: 'my-app',
    script: './server.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### Environment Configuration

```javascript
// config.js
const config = {
  development: {
    port: 3000,
    db: 'mongodb://localhost:27017/dev'
  },
  production: {
    port: process.env.PORT || 3000,
    db: process.env.DATABASE_URL
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Monitoring

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});
```

## Additional Best Practices

1. **Use const/let** - Avoid var
2. **Use async/await** - Prefer over callbacks
3. **Handle all errors** - Don't ignore errors
4. **Use meaningful names** - Clear variable/function names
5. **Keep functions small** - Single responsibility
6. **Document code** - Use JSDoc comments
7. **Use linters** - ESLint for code quality
8. **Format code** - Use Prettier
9. **Version control** - Use Git properly
10. **Code reviews** - Review before merging


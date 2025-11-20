# Error Handling

Proper error handling is crucial for building robust Node.js applications. Understanding different error types and handling patterns is essential.

## Error Types

### Standard Error Object

```javascript
const error = new Error('Something went wrong');
error.name = 'CustomError';
error.code = 'ERR_CUSTOM';

console.log(error.message); // 'Something went wrong'
console.log(error.name);     // 'CustomError'
console.log(error.stack);   // Stack trace
```

### Built-in Error Types

```javascript
// RangeError - numeric value out of range
throw new RangeError('Value out of range');

// ReferenceError - variable doesn't exist
throw new ReferenceError('Variable not defined');

// TypeError - wrong type
throw new TypeError('Expected a number');

// SyntaxError - syntax error in code
throw new SyntaxError('Invalid syntax');

// URIError - malformed URI
throw new URIError('Invalid URI');
```

### Custom Errors

```javascript
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

throw new CustomError('Custom error message', 'ERR_CUSTOM');
```

## Error Handling Patterns

### Try/Catch Blocks

```javascript
try {
  // Code that might throw
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('Error caught:', error.message);
  // Handle error
}
```

### Error-First Callbacks

```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    // Handle error
    console.error('Error reading file:', err.message);
    return;
  }
  // Handle success
  console.log(data);
});
```

### Promise Error Handling

```javascript
// Using .catch()
promiseFunction()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Using try/catch with async/await
async function handlePromise() {
  try {
    const result = await promiseFunction();
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Async/Await Error Handling

```javascript
async function asyncOperation() {
  try {
    const data = await readFileAsync('file.txt');
    const processed = await processData(data);
    return processed;
  } catch (error) {
    console.error('Error in async operation:', error);
    throw error; // Re-throw if needed
  }
}
```

## Global Error Handling

### Uncaught Exceptions

```javascript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log error, cleanup, then exit
  process.exit(1);
});
```

### Unhandled Promise Rejections

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Log and handle
});
```

### Warning: Unhandled Rejections

In newer Node.js versions, unhandled rejections will terminate the process. Always handle promise rejections.

```javascript
// Always handle promise rejections
promiseFunction()
  .catch(error => {
    console.error('Handled rejection:', error);
  });
```

## Error Propagation

### Throwing Errors

```javascript
function validateInput(input) {
  if (!input) {
    throw new Error('Input is required');
  }
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return input;
}

try {
  validateInput(null);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Re-throwing Errors

```javascript
async function processData(data) {
  try {
    return await transform(data);
  } catch (error) {
    // Log and re-throw
    console.error('Error in processData:', error);
    throw error; // Re-throw to caller
  }
}
```

### Error Wrapping

```javascript
async function fetchData() {
  try {
    return await apiCall();
  } catch (error) {
    // Wrap error with context
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}
```

## Error Logging

### Basic Logging

```javascript
function logError(error, context = {}) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    context: context
  });
}

try {
  riskyOperation();
} catch (error) {
  logError(error, { userId: 123, operation: 'riskyOperation' });
}
```

### Structured Error Logging

```javascript
const errorLogger = {
  log(error, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      ...metadata
    };
    console.error(JSON.stringify(logEntry));
  }
};

try {
  riskyOperation();
} catch (error) {
  errorLogger.log(error, {
    userId: 123,
    requestId: 'req-456'
  });
}
```

## Best Practices

1. **Always handle errors** - Don't ignore errors
2. **Use specific error types** - Use appropriate Error subclasses
3. **Provide context** - Include relevant information in error messages
4. **Log errors properly** - Use structured logging
5. **Handle async errors** - Always catch promise rejections
6. **Don't catch and ignore** - If you catch, handle it properly
7. **Use error codes** - For programmatic error handling
8. **Clean up resources** - In finally blocks or cleanup handlers
9. **Fail fast** - Catch errors early
10. **Document errors** - Document what errors your functions can throw

## Common Patterns

### Error Handling Middleware (Express-like)

```javascript
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      code: err.code
    }
  });
}
```

### Retry Logic

```javascript
async function retryOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Error Boundaries

```javascript
function safeExecute(fn) {
  try {
    return fn();
  } catch (error) {
    console.error('Safe execution error:', error);
    return null; // or default value
  }
}
```


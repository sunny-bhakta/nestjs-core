/**
 * Error Types Examples
 */

console.log('=== Error Types Examples ===\n');

// Example 1: Standard Error
console.log('1. Standard Error:');
try {
  throw new Error('This is a standard error');
} catch (error) {
  console.log('   Error message:', error.message);
  console.log('   Error name:', error.name);
  console.log('   Error stack:', error.stack.split('\n')[0]);
}

// Example 2: Built-in Error Types
console.log('\n2. Built-in Error Types:');

// RangeError
try {
  const arr = new Array(-1);
} catch (error) {
  console.log('   RangeError:', error.name, '-', error.message);
}

// TypeError
try {
  null.someProperty;
} catch (error) {
  console.log('   TypeError:', error.name, '-', error.message);
}

// ReferenceError
try {
  console.log(nonExistentVariable);
} catch (error) {
  console.log('   ReferenceError:', error.name, '-', error.message);
}

// Example 3: Custom Error Class
console.log('\n3. Custom Error Class:');

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'ERR_VALIDATION';
    Error.captureStackTrace(this, this.constructor);
  }
}

class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.code = 'ERR_DATABASE';
    Error.captureStackTrace(this, this.constructor);
  }
}

try {
  throw new ValidationError('Invalid email format', 'email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('   ValidationError caught:');
    console.log('     Message:', error.message);
    console.log('     Field:', error.field);
    console.log('     Code:', error.code);
  }
}

try {
  throw new DatabaseError('Connection failed', 'SELECT * FROM users');
} catch (error) {
  if (error instanceof DatabaseError) {
    console.log('\n   DatabaseError caught:');
    console.log('     Message:', error.message);
    console.log('     Query:', error.query);
    console.log('     Code:', error.code);
  }
}

// Example 4: Error with additional properties
console.log('\n4. Error with Additional Properties:');

function createError(message, code, details) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.timestamp = new Date().toISOString();
  return error;
}

try {
  throw createError('Operation failed', 'ERR_OPERATION', { userId: 123, action: 'update' });
} catch (error) {
  console.log('   Custom error:', {
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: error.timestamp
  });
}

console.log('\n=== Error Types Examples Complete ===');


/**
 * Global Error Handling Examples
 */

console.log('=== Global Error Handling Examples ===\n');

// Example 1: Uncaught Exception Handler
console.log('1. Uncaught Exception Handler:');

process.on('uncaughtException', (error) => {
  console.error('   Uncaught Exception:', error.message);
  console.error('   Stack:', error.stack.split('\n')[0]);
  // In production, you should log and exit gracefully
  // process.exit(1);
});

// Uncomment to test (will exit process):
// throw new Error('Uncaught exception test');

// Example 2: Unhandled Promise Rejection Handler
console.log('\n2. Unhandled Promise Rejection Handler:');

process.on('unhandledRejection', (reason, promise) => {
  console.error('   Unhandled Rejection:');
  console.error('     Reason:', reason);
  console.error('     Promise:', promise);
  // In production, log and handle appropriately
});

// Example of unhandled rejection (will be caught by handler)
Promise.reject(new Error('Unhandled promise rejection'))
  .catch(() => {
    // This catch prevents unhandled rejection
    console.log('   Promise rejection was handled');
  });

// Example 3: Warning Handler
console.log('\n3. Warning Handler:');

process.on('warning', (warning) => {
  console.warn('   Warning:', warning.name);
  console.warn('   Message:', warning.message);
  console.warn('   Stack:', warning.stack);
});

// Trigger a warning
if (process.emitWarning) {
  process.emitWarning('This is a custom warning', {
    type: 'CustomWarning',
    code: 'CUSTOM_WARNING'
  });
}

// Example 4: Graceful Shutdown
console.log('\n4. Graceful Shutdown:');

let server = {
  connections: 0,
  close: function(callback) {
    console.log('   Closing server...');
    setTimeout(() => {
      console.log('   Server closed');
      callback();
    }, 100);
  }
};

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n   Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('   Graceful shutdown complete');
    process.exit(0);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('\n   Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('   Graceful shutdown complete');
    process.exit(0);
  });
});

// Example 5: Exit Handler
console.log('\n5. Exit Handler:');

process.on('exit', (code) => {
  console.log(`   Process exiting with code: ${code}`);
  // Cleanup code here (synchronous only)
});

// Example 6: Error Logging Function
console.log('\n6. Error Logging Function:');

function logError(error, context = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    name: error.name,
    code: error.code,
    stack: error.stack,
    context: context
  };
  
  console.log('   Error logged:', JSON.stringify(logEntry, null, 2));
}

try {
  throw new Error('Test error for logging');
} catch (error) {
  logError(error, {
    userId: 123,
    operation: 'testOperation',
    requestId: 'req-456'
  });
}

// Example 7: Error Recovery
console.log('\n7. Error Recovery Pattern:');

let retryCount = 0;
const maxRetries = 3;

function recoverableOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      retryCount++;
      if (retryCount < maxRetries) {
        reject(new Error(`Attempt ${retryCount} failed`));
      } else {
        resolve('Operation succeeded after retries');
      }
    }, 100);
  });
}

async function withRetry(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`   Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) {
        throw new Error(`Operation failed after ${maxRetries} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

setTimeout(async () => {
  try {
    const result = await withRetry(recoverableOperation, maxRetries);
    console.log('   Result:', result);
  } catch (error) {
    console.log('   Final error:', error.message);
  }
  
  console.log('\n=== Global Error Handling Examples Complete ===');
  console.log('Press Ctrl+C to test graceful shutdown or wait for auto-exit...\n');
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}, 500);


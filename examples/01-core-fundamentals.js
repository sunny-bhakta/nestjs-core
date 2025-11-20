/**
 * Core Fundamentals Examples
 * Demonstrates global objects, process object, and Node.js basics
 */

// ============================================
// Global Objects
// ============================================

console.log('\n=== Global Objects ===\n');

// global / globalThis
global.myGlobalVar = 'I am a global variable';
console.log('Global variable:', globalThis.myGlobalVar);

// process object
console.log('\n=== Process Information ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Process ID:', process.pid);
console.log('Current working directory:', process.cwd());
console.log('Node executable path:', process.execPath);

// Command line arguments
console.log('\n=== Command Line Arguments ===');
console.log('All arguments:', process.argv);
console.log('Script arguments:', process.argv.slice(2));

// Environment variables
console.log('\n=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('USER:', process.env.USER || process.env.USERNAME || 'not set');
console.log('HOME:', process.env.HOME || process.env.USERPROFILE || 'not set');

// __dirname and __filename (CommonJS only)
console.log('\n=== Module Information ===');
console.log('Directory:', __dirname);
console.log('Filename:', __filename);

// Buffer (global)
console.log('\n=== Buffer Example ===');
const buffer = Buffer.from('Hello Node.js', 'utf8');
console.log('Buffer:', buffer);
console.log('Buffer as string:', buffer.toString('utf8'));
console.log('Buffer length:', buffer.length);

// ============================================
// Process Events
// ============================================

console.log('\n=== Process Events ===');

// Exit event
process.on('exit', (code) => {
  console.log(`\nProcess is about to exit with code: ${code}`);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Signal handlers (for graceful shutdown)
process.on('SIGINT', () => {
  console.log('\n\nReceived SIGINT (Ctrl+C). Exiting gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Exiting gracefully...');
  process.exit(0);
});

// ============================================
// Console Examples
// ============================================

console.log('\n=== Console Methods ===');
console.log('Standard log');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');
console.debug('Debug message');

// Console with formatting
console.log('\n=== Console Formatting ===');
console.log('String: %s, Number: %d, Object: %j', 'Hello', 42, { key: 'value' });
console.log('Current time:', new Date().toISOString());

// Console table
console.log('\n=== Console Table ===');
console.table([
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'London' },
  { name: 'Bob', age: 35, city: 'Tokyo' }
]);

// Console trace
console.log('\n=== Console Trace ===');
function functionA() {
  functionB();
}

function functionB() {
  functionC();
}

function functionC() {
  console.trace('Call stack trace');
}

// Uncomment to see trace:
// functionA();

// ============================================
// Memory Usage
// ============================================

console.log('\n=== Memory Usage ===');
const memUsage = process.memoryUsage();
console.log('Memory Usage:', {
  rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
  heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
  heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
  external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
});

console.log('\n=== Example Complete ===');
console.log('Press Ctrl+C to exit or wait for automatic exit...\n');

// Keep process alive for a few seconds to demonstrate
setTimeout(() => {
  console.log('Exiting after 5 seconds...');
  process.exit(0);
}, 5000);


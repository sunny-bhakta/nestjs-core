/**
 * Process Object Examples
 */

console.log('=== Process Object Examples ===\n');

// Process information
console.log('1. Process Information:');
console.log('   Node version:', process.version);
console.log('   Platform:', process.platform);
console.log('   Architecture:', process.arch);
console.log('   Process ID:', process.pid);
console.log('   Parent Process ID:', process.ppid);
console.log('   Current directory:', process.cwd());
console.log('   Executable path:', process.execPath);
console.log('   Node version (detailed):', process.versions);

// Command line arguments
console.log('\n2. Command Line Arguments:');
console.log('   All arguments:', process.argv);
console.log('   Script arguments:', process.argv.slice(2));

// Environment variables
console.log('\n3. Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   USER:', process.env.USER || process.env.USERNAME || 'not set');
console.log('   HOME:', process.env.HOME || process.env.USERPROFILE || 'not set');
console.log('   PATH:', process.env.PATH ? process.env.PATH.split(process.platform === 'win32' ? ';' : ':').slice(0, 3).join(', ') + '...' : 'not set');

// Memory usage
console.log('\n4. Memory Usage:');
const memUsage = process.memoryUsage();
console.log('   RSS:', Math.round(memUsage.rss / 1024 / 1024), 'MB');
console.log('   Heap Total:', Math.round(memUsage.heapTotal / 1024 / 1024), 'MB');
console.log('   Heap Used:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB');
console.log('   External:', Math.round(memUsage.external / 1024 / 1024), 'MB');
console.log('   Array Buffers:', Math.round((memUsage.arrayBuffers || 0) / 1024 / 1024), 'MB');

// Process events
console.log('\n5. Process Events:');

// Exit event
process.on('exit', (code) => {
  console.log(`   Process exiting with code: ${code}`);
});

// Uncaught exception
process.on('uncaughtException', (err) => {
  console.error('   Uncaught Exception:', err.message);
  process.exit(1);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('   Unhandled Rejection:', reason);
});

// Signal handlers
process.on('SIGINT', () => {
  console.log('\n   Received SIGINT (Ctrl+C). Exiting gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n   Received SIGTERM. Exiting gracefully...');
  process.exit(0);
});

// Process uptime
console.log('\n6. Process Uptime:');
setTimeout(() => {
  console.log('   Uptime:', process.uptime(), 'seconds');
}, 1000);

// Process title
console.log('\n7. Process Title:');
console.log('   Current title:', process.title);
process.title = 'My Node.js Process';
console.log('   New title:', process.title);

// Process nextTick
console.log('\n8. process.nextTick():');
console.log('   Before nextTick');
process.nextTick(() => {
  console.log('   Inside nextTick');
});
console.log('   After nextTick (but nextTick runs before this)');

console.log('\n=== Process Examples Complete ===');
console.log('Press Ctrl+C to test signal handlers or wait for automatic exit...\n');

// Auto exit after 3 seconds
setTimeout(() => {
  console.log('Exiting after 3 seconds...');
  process.exit(0);
}, 3000);


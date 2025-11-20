/**
 * Node.js Architecture Demonstration
 * Shows how Node.js architecture works: V8, Event Loop, Single-threaded model
 */

const os = require('os');

console.log('=== Node.js Architecture Demonstration ===\n');

// ============================================
// 1. V8 Engine Information
// ============================================

console.log('1. V8 JavaScript Engine:');
console.log('   Node.js version:', process.version);
console.log('   V8 version:', process.versions.v8);
console.log('   Platform:', process.platform);
console.log('   Architecture:', process.arch);
console.log('   Available CPU cores:', os.cpus().length);

// ============================================
// 2. Single-Threaded Model Demonstration
// ============================================

console.log('\n2. Single-Threaded Model:');
console.log('   Main thread PID:', process.pid);
console.log('   Thread ID:', process.pid); // In Node.js, main thread = process

// Demonstrate that JavaScript runs on single thread
console.log('\n   Demonstrating single-threaded execution:');
let counter = 0;

// This will block the thread
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 100) {
    // Block for 100ms
  }
  counter++;
  console.log(`   Blocking operation ${counter} completed`);
}

console.log('   Starting blocking operations...');
blockingOperation();
blockingOperation();
blockingOperation();
console.log('   All blocking operations completed (sequential)');

// ============================================
// 3. Event Loop Phases Demonstration
// ============================================

console.log('\n3. Event Loop Phases:');
console.log('   Order of execution demonstrates event loop phases:\n');

console.log('   [1] Synchronous code (executes first)');

// process.nextTick - highest priority, runs before any other async
process.nextTick(() => {
  console.log('   [2] process.nextTick() - runs before next event loop phase');
});

// Promise - microtask queue, runs after nextTick
Promise.resolve().then(() => {
  console.log('   [3] Promise.then() - microtask queue');
});

// setTimeout - timer phase
setTimeout(() => {
  console.log('   [4] setTimeout(0) - timer phase');
}, 0);

// setImmediate - check phase
setImmediate(() => {
  console.log('   [5] setImmediate() - check phase');
});

console.log('   [6] More synchronous code');

// ============================================
// 4. Non-Blocking I/O Demonstration
// ============================================

console.log('\n4. Non-Blocking I/O:');
console.log('   Starting async operations (non-blocking):');

const fs = require('fs');
const path = require('path');

// Create a test file
const testFile = path.join(__dirname, 'architecture-test.txt');
fs.writeFileSync(testFile, 'Test content for async demo');

// Non-blocking file read
fs.readFile(testFile, 'utf8', (err, data) => {
  if (err) {
    console.error('   Error:', err);
    return;
  }
  console.log('   [Async] File read completed:', data.trim());
});

console.log('   [Sync] This line executes immediately (doesn\'t wait for file read)');

// Multiple async operations
setTimeout(() => {
  console.log('   [Async] setTimeout callback');
}, 10);

setTimeout(() => {
  console.log('   [Async] Another setTimeout callback');
}, 20);

console.log('   [Sync] All async operations started, continuing execution...');

// ============================================
// 5. Event Loop and Callback Queue
// ============================================

console.log('\n5. Event Loop and Callback Queue:');

let asyncCounter = 0;

function asyncOperation(name, delay) {
  setTimeout(() => {
    asyncCounter++;
    console.log(`   [${asyncCounter}] Async operation "${name}" completed after ${delay}ms`);
  }, delay);
}

// Start multiple async operations
asyncOperation('A', 50);
asyncOperation('B', 30);
asyncOperation('C', 70);
asyncOperation('D', 10);

console.log('   All async operations started (they will complete in order of delay, not start order)');

// ============================================
// 6. Memory and Heap Information
// ============================================

console.log('\n6. Memory Architecture:');
const memUsage = process.memoryUsage();
console.log('   RSS (Resident Set Size):', Math.round(memUsage.rss / 1024 / 1024), 'MB');
console.log('   Heap Total:', Math.round(memUsage.heapTotal / 1024 / 1024), 'MB');
console.log('   Heap Used:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB');
console.log('   External:', Math.round(memUsage.external / 1024 / 1024), 'MB');

// ============================================
// 7. Thread Pool (libuv)
// ============================================

console.log('\n7. Thread Pool (libuv):');
console.log('   Node.js uses libuv for async operations');
console.log('   Thread pool size (default):', process.env.UV_THREADPOOL_SIZE || '4');
console.log('   CPU-intensive tasks can use thread pool');
console.log('   I/O operations are handled by event loop');

// ============================================
// 8. Architecture Summary
// ============================================

setTimeout(() => {
  console.log('\n8. Architecture Summary:');
  console.log('   ✓ Single main thread for JavaScript execution');
  console.log('   ✓ Event loop handles async I/O operations');
  console.log('   ✓ Thread pool (libuv) for CPU-intensive tasks');
  console.log('   ✓ Non-blocking I/O model enables high concurrency');
  console.log('   ✓ V8 engine compiles and executes JavaScript');
  
  // Cleanup
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
  
  console.log('\n=== Architecture Demonstration Complete ===');
  process.exit(0);
}, 1000);


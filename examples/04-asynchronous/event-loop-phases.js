/**
 * Event Loop Phases Detailed Examples
 * Demonstrates each phase of the Node.js event loop
 */

console.log('=== Event Loop Phases Examples ===\n');

// ============================================
// Phase 1: Timers Phase
// ============================================

console.log('Phase 1: Timers Phase');
console.log('Executes callbacks scheduled by setTimeout() and setInterval()\n');

setTimeout(() => {
  console.log('   [Timers] setTimeout callback executed');
}, 100);

let intervalCount = 0;
const intervalId = setInterval(() => {
  intervalCount++;
  console.log(`   [Timers] setInterval callback ${intervalCount}`);
  if (intervalCount >= 2) {
    clearInterval(intervalId);
    console.log('   [Timers] Interval cleared\n');
    
    // Move to next phase demonstration
    demonstratePendingCallbacks();
  }
}, 150);

function demonstratePendingCallbacks() {
  // ============================================
  // Phase 2: Pending Callbacks Phase
  // ============================================
  
  console.log('Phase 2: Pending Callbacks Phase');
  console.log('Executes I/O callbacks deferred to next iteration\n');
  
  // Most I/O callbacks go to poll phase, but some system-level
  // callbacks execute in pending callbacks phase
  console.log('   [Pending] System-level callbacks (usually not directly observable)\n');
  
  setTimeout(() => {
    demonstratePollPhase();
  }, 200);
}

function demonstratePollPhase() {
  // ============================================
  // Phase 4: Poll Phase
  // ============================================
  
  console.log('Phase 4: Poll Phase');
  console.log('Fetches new I/O events and executes I/O-related callbacks\n');
  
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'poll-test.txt');
  
  // Create test file
  fs.writeFileSync(testFile, 'Poll phase test');
  
  // File I/O callback executes in poll phase
  fs.readFile(testFile, 'utf8', (err, data) => {
    if (!err) {
      console.log('   [Poll] File read callback:', data.trim());
      fs.unlinkSync(testFile);
      console.log('   [Poll] File I/O operations complete\n');
      
      setTimeout(() => {
        demonstrateCheckPhase();
      }, 100);
    }
  });
  
  // Network I/O also executes in poll phase
  const http = require('http');
  http.get('http://jsonplaceholder.typicode.com/posts/1', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('   [Poll] HTTP request callback executed');
      console.log('   [Poll] Network I/O operations complete\n');
    });
  }).on('error', () => {
    // Ignore network errors for demo
    setTimeout(() => {
      demonstrateCheckPhase();
    }, 100);
  });
}

function demonstrateCheckPhase() {
  // ============================================
  // Phase 5: Check Phase
  // ============================================
  
  console.log('Phase 5: Check Phase');
  console.log('Executes setImmediate() callbacks\n');
  
  setImmediate(() => {
    console.log('   [Check] setImmediate callback 1');
  });
  
  setImmediate(() => {
    console.log('   [Check] setImmediate callback 2');
  });
  
  // setImmediate inside I/O callback
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'check-test.txt');
  
  fs.writeFileSync(testFile, 'test');
  fs.readFile(testFile, 'utf8', () => {
    setImmediate(() => {
      console.log('   [Check] setImmediate inside I/O callback');
      fs.unlinkSync(testFile);
      console.log('   [Check] Check phase complete\n');
      
      setTimeout(() => {
        demonstrateClosePhase();
      }, 100);
    });
  });
}

function demonstrateClosePhase() {
  // ============================================
  // Phase 6: Close Callbacks Phase
  // ============================================
  
  console.log('Phase 6: Close Callbacks Phase');
  console.log('Executes close callbacks (e.g., socket.on("close"))\n');
  
  const EventEmitter = require('events');
  
  // Simulate close event
  const emitter = new EventEmitter();
  emitter.on('close', () => {
    console.log('   [Close] Close callback executed');
  });
  
  // Trigger close event
  setTimeout(() => {
    emitter.emit('close');
    console.log('   [Close] Close phase complete\n');
    
    demonstrateCompleteCycle();
  }, 100);
}

function demonstrateCompleteCycle() {
  // ============================================
  // Complete Event Loop Cycle
  // ============================================
  
  console.log('Complete Event Loop Cycle:');
  console.log('Demonstrating all phases in one cycle\n');
  
  console.log('   [Sync] Synchronous code');
  
  // nextTick (runs before any phase)
  process.nextTick(() => {
    console.log('   [nextTick] Before event loop phases');
  });
  
  // Microtask (runs after nextTick, before phases)
  Promise.resolve().then(() => {
    console.log('   [Microtask] Promise callback');
  });
  
  // Phase 1: Timers
  setTimeout(() => {
    console.log('   [Phase 1: Timers] setTimeout');
  }, 10);
  
  // Phase 4: Poll (I/O)
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'cycle-test.txt');
  fs.writeFileSync(testFile, 'test');
  fs.readFile(testFile, 'utf8', () => {
    console.log('   [Phase 4: Poll] File I/O');
    fs.unlinkSync(testFile);
  });
  
  // Phase 5: Check
  setImmediate(() => {
    console.log('   [Phase 5: Check] setImmediate');
  });
  
  // Phase 6: Close
  const EventEmitter = require('events');
  const emitter = new EventEmitter();
  emitter.on('close', () => {
    console.log('   [Phase 6: Close] Close callback');
  });
  setTimeout(() => emitter.emit('close'), 20);
  
  console.log('   [Sync] More synchronous code\n');
  
  setTimeout(() => {
    console.log('\n=== Event Loop Phases Examples Complete ===');
    console.log('\nEvent Loop Phase Order:');
    console.log('1. Timers (setTimeout, setInterval)');
    console.log('2. Pending Callbacks (system-level)');
    console.log('3. Idle, Prepare (internal)');
    console.log('4. Poll (I/O callbacks)');
    console.log('5. Check (setImmediate)');
    console.log('6. Close Callbacks (socket.close, etc.)');
    console.log('\nNote: process.nextTick and microtasks run between phases');
    
    process.exit(0);
  }, 500);
}


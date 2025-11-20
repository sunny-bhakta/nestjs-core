/**
 * Detailed Event Loop Examples
 * Comprehensive demonstration of Event Loop phases and execution order
 */

console.log('=== Detailed Event Loop Examples ===\n');

// ============================================
// 1. Call Stack Demonstration
// ============================================

console.log('1. Call Stack:');

function level1() {
  console.log('   Level 1');
  level2();
}

function level2() {
  console.log('   Level 2');
  level3();
}

function level3() {
  console.log('   Level 3');
  console.trace('   Call stack trace');
}

level1();

// ============================================
// 2. Execution Order: Synchronous vs Async
// ============================================

setTimeout(() => {
  console.log('\n2. Execution Order:');
  console.log('   [Sync] Start');
  
  setTimeout(() => {
    console.log('   [Async] setTimeout callback');
  }, 0);
  
  console.log('   [Sync] End');
  // Output: Start, End, setTimeout callback
}, 100);

// ============================================
// 3. Queue Priority: nextTick > Promise > setTimeout
// ============================================

setTimeout(() => {
  console.log('\n3. Queue Priority:');
  
  console.log('   [Sync] 1. Synchronous');
  
  process.nextTick(() => {
    console.log('   [nextTick] 2. process.nextTick (highest priority)');
  });
  
  Promise.resolve().then(() => {
    console.log('   [Microtask] 3. Promise.then');
  });
  
  setTimeout(() => {
    console.log('   [Macrotask] 4. setTimeout');
  }, 0);
  
  setImmediate(() => {
    console.log('   [Check] 5. setImmediate');
  });
  
  console.log('   [Sync] 6. More synchronous');
  
  // Expected: 1, 6, 2, 3, 4, 5
}, 200);

// ============================================
// 4. Event Loop Phases Demonstration
// ============================================

setTimeout(() => {
  console.log('\n4. Event Loop Phases:');
  
  // Phase 1: Timers
  setTimeout(() => {
    console.log('   [Timers Phase] setTimeout callback');
  }, 10);
  
  // Phase 5: Check
  setImmediate(() => {
    console.log('   [Check Phase] setImmediate callback');
  });
  
  // Phase 4: Poll (I/O callbacks)
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'event-loop-test.txt');
  
  fs.writeFileSync(testFile, 'test');
  fs.readFile(testFile, 'utf8', (err, data) => {
    if (!err) {
      console.log('   [Poll Phase] File I/O callback');
      fs.unlinkSync(testFile);
    }
  });
  
  // Phase 6: Close callbacks (simulated)
  const EventEmitter = require('events');
  const emitter = new EventEmitter();
  emitter.on('close', () => {
    console.log('   [Close Phase] Close callback');
  });
  setTimeout(() => emitter.emit('close'), 50);
  
}, 300);

// ============================================
// 5. Microtask Queue Processing
// ============================================

setTimeout(() => {
  console.log('\n5. Microtask Queue:');
  
  Promise.resolve().then(() => {
    console.log('   [Microtask 1] First promise');
    return Promise.resolve();
  }).then(() => {
    console.log('   [Microtask 2] Second promise');
  });
  
  Promise.resolve().then(() => {
    console.log('   [Microtask 3] Third promise');
  });
  
  setTimeout(() => {
    console.log('   [Macrotask] setTimeout (runs after all microtasks)');
  }, 0);
  
}, 500);

// ============================================
// 6. Nested Queues
// ============================================

setTimeout(() => {
  console.log('\n6. Nested Queues:');
  
  setTimeout(() => {
    console.log('   [Outer setTimeout]');
    
    process.nextTick(() => {
      console.log('   [nextTick inside setTimeout]');
    });
    
    Promise.resolve().then(() => {
      console.log('   [Promise inside setTimeout]');
    });
    
    setImmediate(() => {
      console.log('   [setImmediate inside setTimeout]');
    });
  }, 10);
  
}, 700);

// ============================================
// 7. Blocking vs Non-Blocking
// ============================================

setTimeout(() => {
  console.log('\n7. Blocking vs Non-Blocking:');
  
  console.log('   [Start] Beginning operation');
  
  // Non-blocking
  setTimeout(() => {
    console.log('   [Non-blocking] setTimeout completed');
  }, 100);
  
  // Simulate blocking (in real code, avoid this)
  const start = Date.now();
  while (Date.now() - start < 50) {
    // Block for 50ms
  }
  console.log('   [Blocking] Synchronous operation completed');
  
}, 900);

// ============================================
// 8. Event Loop Lag Detection
// ============================================

setTimeout(() => {
  console.log('\n8. Event Loop Lag Detection:');
  
  let lastCheck = Date.now();
  
  const checkLag = setInterval(() => {
    const now = Date.now();
    const expected = lastCheck + 1000;
    const lag = now - expected;
    
    if (lag > 0) {
      console.log(`   Event loop lag: ${lag}ms`);
    }
    
    lastCheck = now;
    
    if (Date.now() - lastCheck > 3000) {
      clearInterval(checkLag);
    }
  }, 1000);
  
  // Stop after 3 seconds
  setTimeout(() => {
    clearInterval(checkLag);
  }, 3000);
  
}, 1100);

// ============================================
// 9. Yielding to Event Loop
// ============================================

setTimeout(() => {
  console.log('\n9. Yielding to Event Loop:');
  
  function processArray(array, callback) {
    let index = 0;
    const chunkSize = 3;
    
    function processChunk() {
      const end = Math.min(index + chunkSize, array.length);
      const chunk = array.slice(index, end);
      
      console.log(`   Processing chunk: [${chunk.join(', ')}]`);
      
      index = end;
      
      if (index < array.length) {
        // Yield to event loop
        setImmediate(processChunk);
      } else {
        callback();
      }
    }
    
    processChunk();
  }
  
  const largeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  processArray(largeArray, () => {
    console.log('   Array processing complete');
  });
  
}, 1300);

// ============================================
// 10. setImmediate vs setTimeout(0)
// ============================================

setTimeout(() => {
  console.log('\n10. setImmediate vs setTimeout(0):');
  
  // In I/O callbacks, setImmediate runs before setTimeout
  const fs = require('fs');
  const path = require('path');
  const testFile = path.join(__dirname, 'immediate-test.txt');
  
  fs.writeFileSync(testFile, 'test');
  
  fs.readFile(testFile, 'utf8', () => {
    setTimeout(() => {
      console.log('   [Inside I/O] setTimeout');
    }, 0);
    
    setImmediate(() => {
      console.log('   [Inside I/O] setImmediate (runs first)');
      fs.unlinkSync(testFile);
    });
  });
  
}, 1500);

// ============================================
// 11. Promise Chain in Event Loop
// ============================================

setTimeout(() => {
  console.log('\n11. Promise Chain:');
  
  Promise.resolve()
    .then(() => {
      console.log('   Promise 1');
      return Promise.resolve();
    })
    .then(() => {
      console.log('   Promise 2');
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('   Promise 3 (after setTimeout)');
          resolve();
        }, 10);
      });
    })
    .then(() => {
      console.log('   Promise 4');
    });
  
}, 1700);

// ============================================
// 12. Complete Execution Flow
// ============================================

setTimeout(() => {
  console.log('\n12. Complete Execution Flow:');
  console.log('   [Sync] Step 1: Synchronous code');
  
  process.nextTick(() => {
    console.log('   [nextTick] Step 2: nextTick queue');
  });
  
  Promise.resolve().then(() => {
    console.log('   [Microtask] Step 3: Microtask queue');
  });
  
  queueMicrotask(() => {
    console.log('   [Microtask] Step 4: queueMicrotask');
  });
  
  setTimeout(() => {
    console.log('   [Timers] Step 5: Timers phase');
  }, 0);
  
  setImmediate(() => {
    console.log('   [Check] Step 6: Check phase (setImmediate)');
  });
  
  console.log('   [Sync] Step 7: More synchronous code');
  
}, 1900);

setTimeout(() => {
  console.log('\n=== Event Loop Detailed Examples Complete ===');
  process.exit(0);
}, 2500);


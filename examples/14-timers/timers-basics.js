/**
 * Timers Basics Examples
 */

console.log('=== Timers Basics Examples ===\n');

// Example 1: setTimeout
console.log('1. setTimeout:');

setTimeout(() => {
  console.log('   This runs after 500ms');
}, 500);

setTimeout((arg1, arg2) => {
  console.log('   setTimeout with args:', arg1, arg2);
}, 300, 'Hello', 'World');

// Example 2: setInterval
console.log('\n2. setInterval:');

let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`   Interval count: ${count}`);
  
  if (count >= 3) {
    clearInterval(intervalId);
    console.log('   Interval cleared');
  }
}, 400);

// Example 3: setImmediate
console.log('\n3. setImmediate:');

setImmediate(() => {
  console.log('   setImmediate callback executed');
});

// Example 4: process.nextTick
console.log('\n4. process.nextTick:');

process.nextTick(() => {
  console.log('   nextTick callback executed');
});

// Example 5: Execution Order
console.log('\n5. Execution Order Demonstration:');

console.log('   [Sync] Start');

process.nextTick(() => {
  console.log('   [nextTick] Executed');
});

Promise.resolve().then(() => {
  console.log('   [Promise] Executed');
});

setTimeout(() => {
  console.log('   [setTimeout(0)] Executed');
}, 0);

setImmediate(() => {
  console.log('   [setImmediate] Executed');
});

console.log('   [Sync] End');

// Example 6: Clearing Timers
setTimeout(() => {
  console.log('\n6. Clearing Timers:');
  
  const timeoutId1 = setTimeout(() => {
    console.log('   This should not run');
  }, 100);
  
  clearTimeout(timeoutId1);
  console.log('   Timeout cleared before execution');
  
  const immediateId = setImmediate(() => {
    console.log('   This should not run');
  });
  
  clearImmediate(immediateId);
  console.log('   Immediate cleared before execution');
}, 800);

// Example 7: Timer IDs
setTimeout(() => {
  console.log('\n7. Timer IDs:');
  
  const timeoutId = setTimeout(() => {}, 100);
  const intervalId = setInterval(() => {}, 100);
  const immediateId = setImmediate(() => {});
  
  console.log('   setTimeout ID type:', typeof timeoutId);
  console.log('   setInterval ID type:', typeof intervalId);
  console.log('   setImmediate ID type:', typeof immediateId);
  
  clearTimeout(timeoutId);
  clearInterval(intervalId);
  clearImmediate(immediateId);
}, 1000);

// Example 8: Nested Timers
setTimeout(() => {
  console.log('\n8. Nested Timers:');
  
  setTimeout(() => {
    console.log('   Outer timeout');
    setTimeout(() => {
      console.log('   Inner timeout');
    }, 100);
  }, 100);
}, 1200);

setTimeout(() => {
  console.log('\n=== Timers Basics Examples Complete ===');
  process.exit(0);
}, 2000);


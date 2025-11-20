/**
 * Event Loop Examples
 * Demonstrates the order of execution in Node.js event loop
 */

console.log('=== Event Loop Examples ===\n');

console.log('1. Synchronous code executes first');
console.log('2. This is also synchronous');

// process.nextTick - Highest priority, runs before any other async operation
process.nextTick(() => {
  console.log('3. process.nextTick() - runs before next event loop phase');
});

// Promise.then - Microtask queue, runs after nextTick but before timers
Promise.resolve().then(() => {
  console.log('4. Promise.then() - microtask queue');
});

// setTimeout - Timer phase
setTimeout(() => {
  console.log('5. setTimeout(0) - timer phase');
}, 0);

// setImmediate - Check phase
setImmediate(() => {
  console.log('6. setImmediate() - check phase');
});

console.log('7. More synchronous code');

// Nested nextTick
process.nextTick(() => {
  console.log('8. Nested nextTick');
  process.nextTick(() => {
    console.log('9. Nested nextTick inside nextTick');
  });
});

// Nested promises
Promise.resolve().then(() => {
  console.log('10. First promise');
  Promise.resolve().then(() => {
    console.log('11. Nested promise');
  });
});

// Multiple setTimeouts
setTimeout(() => {
  console.log('12. setTimeout(0) - second');
}, 0);

setTimeout(() => {
  console.log('13. setTimeout(0) - third');
}, 0);

// setImmediate inside setTimeout
setTimeout(() => {
  console.log('14. Inside setTimeout');
  setImmediate(() => {
    console.log('15. setImmediate inside setTimeout');
  });
  process.nextTick(() => {
    console.log('16. nextTick inside setTimeout');
  });
}, 0);

console.log('17. Final synchronous code\n');

// Expected order (approximately):
// 1, 2, 7, 17 (synchronous)
// 3, 8, 9 (nextTick)
// 4, 10, 11 (promises)
// 5, 12, 13, 14, 16 (setTimeout)
// 6, 15 (setImmediate)

// Keep process alive
setTimeout(() => {
  console.log('\n=== Event Loop Demo Complete ===');
  process.exit(0);
}, 100);


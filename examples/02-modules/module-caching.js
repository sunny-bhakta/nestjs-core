/**
 * Module Caching Example
 * Demonstrates that modules are cached after first require
 */

// Create a counter module
const counterModule = `
let count = 0;
module.exports = {
  increment: () => ++count,
  decrement: () => --count,
  getCount: () => count,
  reset: () => { count = 0; }
};
`;

// Write module to file system
const fs = require('fs');
const path = require('path');
const modulePath = path.join(__dirname, 'counter-cache.js');

fs.writeFileSync(modulePath, counterModule);

// Now require it multiple times
const counter1 = require('./counter-cache');
const counter2 = require('./counter-cache');
const counter3 = require('./counter-cache');

console.log('=== Module Caching Example ===\n');

console.log('All three requires point to the same module instance:');
console.log('counter1 === counter2:', counter1 === counter2); // true
console.log('counter2 === counter3:', counter2 === counter3); // true

console.log('\nInitial count:', counter1.getCount()); // 0

counter1.increment();
counter1.increment();
console.log('After counter1 increments twice:', counter1.getCount()); // 2

counter2.increment();
console.log('After counter2 increments once:', counter2.getCount()); // 3
console.log('counter1 also sees:', counter1.getCount()); // 3 (shared state)

counter3.decrement();
console.log('After counter3 decrements once:', counter3.getCount()); // 2
console.log('All counters see:', counter1.getCount(), counter2.getCount(), counter3.getCount()); // All 2

// Clean up
counter1.reset();
console.log('\nAfter reset:', counter1.getCount()); // 0

// Clean up file
setTimeout(() => {
  fs.unlinkSync(modulePath);
  console.log('\nTemporary module file cleaned up');
}, 1000);


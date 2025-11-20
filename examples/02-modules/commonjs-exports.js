/**
 * CommonJS Export Examples
 */

// Method 1: Using exports object
exports.greet = (name) => {
  return `Hello, ${name}!`;
};

exports.calculate = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
};

// Method 2: Using module.exports for single export
module.exports.version = '1.0.0';

// Method 3: Replace entire exports object
// Uncomment to see:
// module.exports = {
//   greet: (name) => `Hi, ${name}!`,
//   version: '2.0.0'
// };


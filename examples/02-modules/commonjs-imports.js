/**
 * CommonJS Import Examples
 */

// Import built-in modules
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');

// Import local module
const mathUtils = require('./commonjs-exports');

// Use imported functions
console.log('=== CommonJS Import Examples ===\n');

console.log('Greeting:', mathUtils.greet('Node.js'));
console.log('Version:', mathUtils.version);
console.log('Add:', mathUtils.calculate.add(5, 3));
console.log('Subtract:', mathUtils.calculate.subtract(10, 4));
console.log('Multiply:', mathUtils.calculate.multiply(6, 7));
console.log('Divide:', mathUtils.calculate.divide(20, 4));

// Built-in modules
console.log('\n=== Built-in Modules ===');
console.log('Platform:', os.platform());
console.log('Current directory:', process.cwd());
console.log('Directory name:', __dirname);
console.log('File name:', __filename);

// Path operations
const filePath = path.join(__dirname, 'test.txt');
console.log('Joined path:', filePath);
console.log('Extension:', path.extname(filePath));
console.log('Basename:', path.basename(filePath));
console.log('Dirname:', path.dirname(filePath));


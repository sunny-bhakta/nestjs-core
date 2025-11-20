# Core Fundamentals

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, outside of a browser.

### Key Characteristics:
- **Event-driven**: Uses an event-driven, non-blocking I/O model
- **Single-threaded**: Uses a single main thread with an event loop
- **Asynchronous**: Handles I/O operations asynchronously
- **NPM**: Comes with npm, the largest ecosystem of open-source libraries

## Node.js Architecture

Node.js has a unique architecture that makes it efficient for I/O-intensive applications.

### Key Components:

1. **V8 JavaScript Engine**: Compiles and executes JavaScript code
2. **libuv**: C++ library that provides the event loop and thread pool
3. **Node.js Bindings**: JavaScript bindings to C++ libraries
4. **Event Loop**: Single-threaded event loop that handles asynchronous operations
5. **Thread Pool**: Pool of worker threads for CPU-intensive tasks

### Architecture Flow:

```
Application Code (JavaScript)
    ↓
V8 Engine (JavaScript Execution)
    ↓
Node.js Bindings
    ↓
libuv (Event Loop + Thread Pool)
    ↓
Operating System
```

### Event Loop Phases:

1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare**: Internal use
4. **Poll**: Fetches new I/O events; executes I/O related callbacks
5. **Check**: `setImmediate()` callbacks are invoked here
6. **Close Callbacks**: Some close callbacks, e.g. `socket.on('close', ...)`

### Single-Threaded Model:

- Node.js uses a single main thread for JavaScript execution
- I/O operations are handled asynchronously via the event loop
- CPU-intensive tasks can be offloaded to worker threads or child processes
- This model prevents blocking and allows high concurrency

### Example

```javascript
// Demonstrating single-threaded, non-blocking nature
console.log('1. Synchronous code');

setTimeout(() => {
  console.log('2. Timer callback');
}, 0);

setImmediate(() => {
  console.log('3. Immediate callback');
});

process.nextTick(() => {
  console.log('4. Next tick callback');
});

console.log('5. More synchronous code');

// Output order: 1, 5, 4, 2, 3
// This demonstrates the event loop phases
```

## Global Objects

Node.js provides several global objects that are available in all modules.

### Examples

```javascript
// global / globalThis - global scope object
global.myVariable = 'Hello World';
console.log(globalThis.myVariable); // 'Hello World'

// process - information about the current Node.js process
console.log(process.version); // Node.js version
console.log(process.platform); // Operating system platform
console.log(process.pid); // Process ID

// console - for printing to stdout and stderr
console.log('Standard output');
console.error('Error output');
console.warn('Warning output');

// __dirname - directory name of current module (CommonJS only)
console.log(__dirname); // Absolute path of the directory

// __filename - filename of current module (CommonJS only)
console.log(__filename); // Absolute path of the file

// Buffer - for handling binary data
const buf = Buffer.from('Hello', 'utf8');
console.log(buf); // <Buffer 48 65 6c 6c 6f>
```

## Node.js vs Browser JavaScript

### Key Differences:

1. **No DOM**: Node.js doesn't have `window`, `document`, or DOM APIs
2. **File System Access**: Node.js can read/write files
3. **Module System**: Uses CommonJS or ES modules (not script tags)
4. **Global Object**: Uses `global` instead of `window`

### Example

```javascript
// Browser JavaScript
// window.alert('Hello'); // Not available in Node.js

// Node.js JavaScript
const fs = require('fs'); // File system access
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

## Process Object

The `process` object provides information and control over the current Node.js process.

### Common Properties and Methods:

- `process.argv` - Command line arguments
- `process.env` - Environment variables
- `process.cwd()` - Current working directory
- `process.exit()` - Exit the process
- `process.on()` - Listen to process events

### Example

```javascript
// Command line arguments
console.log('Arguments:', process.argv);
// Run: node script.js arg1 arg2
// Output: ['node', 'script.js', 'arg1', 'arg2']

// Environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);

// Current working directory
console.log('CWD:', process.cwd());

// Process events
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Exiting gracefully...');
  process.exit(0);
});
```


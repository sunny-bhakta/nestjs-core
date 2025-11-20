# Event Loop

The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations, despite JavaScript being single-threaded. Understanding the event loop is crucial for writing efficient Node.js applications.

## What is the Event Loop?

The Event Loop is a mechanism that continuously checks for and executes callbacks in a specific order. It allows Node.js to handle thousands of concurrent connections with a single thread.

### Key Concepts

- **Single-threaded**: JavaScript runs on a single main thread
- **Non-blocking**: I/O operations don't block the main thread
- **Event-driven**: Code executes in response to events
- **Asynchronous**: Operations complete without waiting

## Event Loop Components

### Call Stack

The call stack is where function calls are placed and executed. It's a LIFO (Last In, First Out) structure.

```javascript
function first() {
  console.log('First');
  second();
}

function second() {
  console.log('Second');
  third();
}

function third() {
  console.log('Third');
}

first();
// Call stack: first() -> second() -> third()
// Execution: First, Second, Third
```

### Callback Queue (Macrotask Queue)

The callback queue holds callbacks from asynchronous operations like `setTimeout`, `setInterval`, and I/O operations.

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('2. setTimeout callback');
}, 0);

console.log('3. End');

// Output: 1, 3, 2
// Callback queue processes after call stack is empty
```

### Microtask Queue

The microtask queue has higher priority than the callback queue. It includes:
- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()` callbacks

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('2. setTimeout (macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise (microtask)');
});

console.log('4. End');

// Output: 1, 4, 3, 2
// Microtasks run before macrotasks
```

### process.nextTick Queue

The `process.nextTick` queue has the highest priority and runs before microtasks.

```javascript
console.log('1. Start');

setTimeout(() => {
  console.log('2. setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise');
});

process.nextTick(() => {
  console.log('4. nextTick');
});

console.log('5. End');

// Output: 1, 5, 4, 3, 2
// nextTick > Promise > setTimeout
```

## Event Loop Phases

The Event Loop has six distinct phases that execute in order:

### 1. Timers Phase

Executes callbacks scheduled by `setTimeout()` and `setInterval()`.

```javascript
setTimeout(() => {
  console.log('Timer callback');
}, 1000);
```

**Key Points:**
- Only executes callbacks whose delay has elapsed
- Actual execution time may be slightly later than specified
- Minimum delay is 1ms

### 2. Pending Callbacks Phase

Executes I/O callbacks deferred to the next loop iteration.

```javascript
fs.readFile('file.txt', (err, data) => {
  // This callback executes in pending callbacks phase
  console.log(data);
});
```

**Key Points:**
- Handles some system-level callbacks
- Usually not directly observable in application code

### 3. Idle, Prepare Phase

Internal use only. Node.js uses this phase for internal operations.

### 4. Poll Phase

Fetches new I/O events and executes I/O-related callbacks.

```javascript
// File I/O callbacks execute here
fs.readFile('file.txt', (err, data) => {
  console.log('File read in poll phase');
});
```

**Key Points:**
- Calculates how long to block and wait for I/O
- Processes events in the poll queue
- If poll queue is empty, moves to next phase

### 5. Check Phase

Executes `setImmediate()` callbacks.

```javascript
setImmediate(() => {
  console.log('setImmediate callback');
});
```

**Key Points:**
- Runs after poll phase
- Designed to execute callbacks after I/O events
- More predictable than `setTimeout(fn, 0)`

### 6. Close Callbacks Phase

Executes close callbacks (e.g., `socket.on('close', ...)`).

```javascript
const server = http.createServer();
server.on('close', () => {
  console.log('Server closed');
});
```

## Execution Order

Understanding the execution order is crucial:

```javascript
console.log('1. Synchronous');

process.nextTick(() => {
  console.log('2. nextTick');
});

Promise.resolve().then(() => {
  console.log('3. Promise');
});

setTimeout(() => {
  console.log('4. setTimeout');
}, 0);

setImmediate(() => {
  console.log('5. setImmediate');
});

console.log('6. Synchronous');

// Output: 1, 6, 2, 3, 4, 5
```

### Priority Order

1. **Synchronous code** - Executes immediately
2. **process.nextTick** - Highest priority async
3. **Microtasks** - Promise callbacks, queueMicrotask
4. **Macrotasks** - setTimeout, setInterval, I/O callbacks
5. **setImmediate** - Runs in check phase

## Visual Representation

```
┌───────────────────────────┐
│   Call Stack              │
│   (Synchronous code)      │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   process.nextTick Queue  │ ← Highest Priority
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   Microtask Queue         │ ← Promise callbacks
│   (Promise.then)          │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   Event Loop Phases:      │
│   1. Timers               │
│   2. Pending Callbacks    │
│   3. Idle, Prepare        │
│   4. Poll                 │
│   5. Check (setImmediate) │
│   6. Close Callbacks      │
└───────────────────────────┘
```

## Common Patterns

### Blocking the Event Loop

```javascript
// Bad: Blocks event loop
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Block for 5 seconds
  }
}

// Good: Non-blocking
function nonBlockingOperation() {
  setTimeout(() => {
    // Do work
  }, 0);
}
```

### Starving the Event Loop

```javascript
// WARNING: This can starve the event loop
function recursiveNextTick() {
  process.nextTick(() => {
    recursiveNextTick();
    // Other code never gets a chance to run
  });
}
```

### Proper Async Pattern

```javascript
// Good: Allows event loop to process other tasks
function processLargeArray(array) {
  let index = 0;
  
  function processChunk() {
    const chunk = array.slice(index, index + 100);
    chunk.forEach(item => {
      // Process item
    });
    
    index += 100;
    if (index < array.length) {
      setImmediate(processChunk); // Yield to event loop
    }
  }
  
  processChunk();
}
```

## I/O Operations and the Event Loop

### File I/O

```javascript
// Non-blocking file read
fs.readFile('file.txt', (err, data) => {
  // Callback executes in poll phase
  console.log(data);
});

console.log('This runs immediately');
```

### Network I/O

```javascript
// Non-blocking HTTP request
http.get('http://example.com', (res) => {
  // Callback executes in poll phase
  res.on('data', (chunk) => {
    console.log(chunk);
  });
});

console.log('Request sent, continuing execution');
```

## Best Practices

1. **Keep callbacks fast** - Don't block in callbacks
2. **Use setImmediate for I/O** - Better than setTimeout(0) in I/O callbacks
3. **Avoid recursive nextTick** - Can starve the event loop
4. **Break up long operations** - Use setImmediate to yield
5. **Understand execution order** - Know when code runs
6. **Monitor event loop lag** - Use tools to detect blocking
7. **Use worker threads** - For CPU-intensive tasks
8. **Profile your code** - Identify blocking operations

## Monitoring Event Loop

### Check Event Loop Lag

```javascript
let lastCheck = Date.now();

setInterval(() => {
  const now = Date.now();
  const lag = now - lastCheck - 1000; // Expected 1000ms
  if (lag > 10) {
    console.warn(`Event loop lag: ${lag}ms`);
  }
  lastCheck = now;
}, 1000);
```

### Detect Blocking

```javascript
const start = process.hrtime.bigint();

// Your code here

const duration = Number(process.hrtime.bigint() - start) / 1e6; // Convert to ms
if (duration > 10) {
  console.warn(`Operation took ${duration}ms`);
}
```

## Common Misconceptions

1. **"setTimeout(fn, 0) runs immediately"** - No, it schedules for the next tick
2. **"setImmediate runs before setTimeout"** - Not always, depends on context
3. **"All async code runs in parallel"** - No, it's still single-threaded
4. **"Promises are always faster"** - They're just a different scheduling mechanism
5. **"Event loop = multithreading"** - No, it's still single-threaded

## Summary

The Event Loop is Node.js's way of handling asynchronous operations efficiently:

- **Single-threaded** but non-blocking
- **Phases execute in order** - Timers → Pending → Poll → Check → Close
- **Priority matters** - nextTick > Microtasks > Macrotasks
- **I/O is non-blocking** - Operations don't wait
- **Keep operations fast** - Don't block the event loop

Understanding the event loop helps you write more efficient, predictable Node.js applications.


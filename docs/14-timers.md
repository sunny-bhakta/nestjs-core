# Timers

Node.js provides several functions for scheduling code execution. Understanding timers and their behavior in the event loop is crucial.

## setTimeout

Executes a function after a specified delay (in milliseconds).

### Basic Usage

```javascript
setTimeout(() => {
  console.log('This runs after 1000ms');
}, 1000);
```

### With Arguments

```javascript
setTimeout((arg1, arg2) => {
  console.log(arg1, arg2);
}, 1000, 'Hello', 'World');
```

### Clearing Timeout

```javascript
const timeoutId = setTimeout(() => {
  console.log('This will not run');
}, 1000);

clearTimeout(timeoutId);
```

### Important Notes

- Minimum delay is 1ms (browser minimum is 4ms)
- Actual delay may be longer due to event loop
- Returns a Timeout object (not a number in Node.js)

## setInterval

Repeatedly executes a function at specified intervals.

### Basic Usage

```javascript
const intervalId = setInterval(() => {
  console.log('This runs every 1000ms');
}, 1000);
```

### Clearing Interval

```javascript
const intervalId = setInterval(() => {
  console.log('Running...');
}, 1000);

// Stop after 5 seconds
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Interval stopped');
}, 5000);
```

### Common Pattern: Conditional Interval

```javascript
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);
  
  if (count >= 5) {
    clearInterval(intervalId);
    console.log('Interval stopped at count 5');
  }
}, 1000);
```

## setImmediate

Executes a function in the next iteration of the event loop (check phase).

### Basic Usage

```javascript
setImmediate(() => {
  console.log('This runs in the check phase');
});
```

### vs setTimeout(0)

```javascript
setTimeout(() => {
  console.log('setTimeout(0)');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

// Output order can vary, but setImmediate typically runs first
// in I/O callbacks, setTimeout runs first in the main module
```

### Clearing Immediate

```javascript
const immediateId = setImmediate(() => {
  console.log('This will not run');
});

clearImmediate(immediateId);
```

## process.nextTick

Executes a callback before the next event loop phase. Highest priority.

### Basic Usage

```javascript
process.nextTick(() => {
  console.log('This runs before the next event loop phase');
});
```

### Priority Order

```javascript
console.log('1. Synchronous');

process.nextTick(() => {
  console.log('2. nextTick');
});

setImmediate(() => {
  console.log('3. setImmediate');
});

setTimeout(() => {
  console.log('4. setTimeout');
}, 0);

// Output: 1, 2, 4, 3
```

### Recursive nextTick Warning

```javascript
// WARNING: This can starve the event loop
function recursiveNextTick() {
  process.nextTick(() => {
    recursiveNextTick();
    // This prevents other code from running
  });
}
```

## Timer Execution Order

Understanding the execution order is important:

```javascript
console.log('Start');

setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Typical output:
// Start
// End
// nextTick
// Promise
// setTimeout
// setImmediate
```

## Common Patterns

### Debouncing

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);
```

### Throttling

```javascript
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);
```

### Polling

```javascript
function poll(condition, callback, interval = 1000) {
  const check = () => {
    if (condition()) {
      callback();
    } else {
      setTimeout(check, interval);
    }
  };
  check();
}

let count = 0;
poll(
  () => count >= 5,
  () => console.log('Condition met!'),
  500
);

setInterval(() => count++, 1000);
```

### Timeout with Promise

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
  console.log('Start');
  await delay(1000);
  console.log('After 1 second');
}
```

### Timeout Race

```javascript
function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// Usage
timeoutPromise(fetch('https://api.example.com'), 5000)
  .then(data => console.log(data))
  .catch(error => console.error('Timeout or error:', error));
```

## Best Practices

1. **Use clearTimeout/clearInterval** - Always clean up timers
2. **Avoid blocking in timers** - Keep timer callbacks fast
3. **Be careful with nextTick** - Can starve the event loop
4. **Use setImmediate for I/O** - Better than setTimeout(0) in I/O callbacks
5. **Handle timer errors** - Wrap timer callbacks in try/catch
6. **Consider using libraries** - For complex timing needs (node-cron, etc.)
7. **Test timer behavior** - Timers behave differently in tests

## Common Issues

### Timer Drift

```javascript
// Bad: Can drift over time
setInterval(() => {
  doSomething();
}, 1000);

// Better: Compensate for drift
let expected = Date.now() + 1000;
setTimeout(function schedule() {
  const drift = Date.now() - expected;
  doSomething();
  expected += 1000;
  setTimeout(schedule, 1000 - drift);
}, 1000);
```

### Memory Leaks

```javascript
// Bad: Timer not cleared
const intervalId = setInterval(() => {
  // If this throws, interval continues
  riskyOperation();
}, 1000);

// Better: Handle errors and cleanup
const intervalId = setInterval(() => {
  try {
    riskyOperation();
  } catch (error) {
    console.error('Error:', error);
    clearInterval(intervalId);
  }
}, 1000);
```


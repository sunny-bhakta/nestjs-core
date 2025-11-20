# Asynchronous Programming

Node.js is built on an asynchronous, event-driven architecture. Understanding asynchronous programming is crucial for writing efficient Node.js applications.

## Callbacks

Callbacks are functions passed as arguments to other functions and executed later.

### Callback Pattern

```javascript
// Error-first callback pattern
function readFileCallback(err, data) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Data:', data);
}

fs.readFile('file.txt', 'utf8', readFileCallback);
```

### Callback Hell

Nested callbacks can become hard to read and maintain.

```javascript
// Callback hell example
fs.readFile('file1.txt', 'utf8', (err, data1) => {
  if (err) throw err;
  fs.readFile('file2.txt', 'utf8', (err, data2) => {
    if (err) throw err;
    fs.writeFile('output.txt', data1 + data2, (err) => {
      if (err) throw err;
      console.log('Done');
    });
  });
});
```

## Promises

Promises represent the eventual completion (or failure) of an asynchronous operation.

### Creating Promises

```javascript
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
```

### Using Promises

```javascript
readFilePromise('file.txt')
  .then(data => {
    console.log('File content:', data);
    return readFilePromise('file2.txt');
  })
  .then(data => {
    console.log('Second file:', data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

### Promise Methods

```javascript
// Promise.all - Wait for all promises
Promise.all([
  readFilePromise('file1.txt'),
  readFilePromise('file2.txt'),
  readFilePromise('file3.txt')
])
  .then(results => {
    console.log('All files read:', results);
  })
  .catch(err => {
    console.error('One file failed:', err);
  });

// Promise.race - First promise to resolve/reject
Promise.race([
  readFilePromise('file1.txt'),
  readFilePromise('file2.txt')
])
  .then(result => {
    console.log('First file read:', result);
  });

// Promise.allSettled - Wait for all, regardless of outcome
Promise.allSettled([
  readFilePromise('file1.txt'),
  readFilePromise('file2.txt')
])
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`File ${index + 1} succeeded`);
      } else {
        console.log(`File ${index + 1} failed:`, result.reason);
      }
    });
  });
```

## Async/Await

Async/await provides a cleaner syntax for working with promises.

### Basic Usage

```javascript
async function readFiles() {
  try {
    const data1 = await readFilePromise('file1.txt');
    const data2 = await readFilePromise('file2.txt');
    console.log('Both files read:', data1, data2);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

### Parallel Execution

```javascript
async function readFilesParallel() {
  try {
    // Execute in parallel
    const [data1, data2, data3] = await Promise.all([
      readFilePromise('file1.txt'),
      readFilePromise('file2.txt'),
      readFilePromise('file3.txt')
    ]);
    console.log('All files read in parallel');
  } catch (err) {
    console.error('Error:', err);
  }
}
```

## Event Loop

The event loop is what allows Node.js to perform non-blocking I/O operations.

### Event Loop Phases

1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending callbacks**: Executes I/O callbacks deferred to the next loop iteration
3. **Idle, prepare**: Internal use
4. **Poll**: Fetch new I/O events; execute I/O related callbacks
5. **Check**: `setImmediate()` callbacks are invoked here
6. **Close callbacks**: Some close callbacks, e.g. `socket.on('close', ...)`

### Scheduling Functions

```javascript
// setTimeout - Execute after delay
setTimeout(() => {
  console.log('This runs after 1000ms');
}, 1000);

// setImmediate - Execute in the check phase
setImmediate(() => {
  console.log('This runs in the check phase');
});

// process.nextTick - Execute before the next event loop phase
process.nextTick(() => {
  console.log('This runs before the next phase');
});

// Order of execution:
process.nextTick(() => console.log('1. nextTick'));
setImmediate(() => console.log('2. setImmediate'));
setTimeout(() => console.log('3. setTimeout'), 0);
console.log('4. Synchronous');
// Output: 4, 1, 3, 2
```

## Error Handling

### Callback Error Handling

```javascript
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    // Handle error
    console.error('Error:', err);
    return;
  }
  // Handle success
  console.log(data);
});
```

### Promise Error Handling

```javascript
readFilePromise('file.txt')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

### Async/Await Error Handling

```javascript
async function handleFile() {
  try {
    const data = await readFilePromise('file.txt');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

## Best Practices

1. **Avoid callback hell** - Use promises or async/await
2. **Always handle errors** - Don't ignore promise rejections
3. **Use Promise.all** for parallel operations when possible
4. **Understand the event loop** - Know when code executes
5. **Use async/await** for cleaner code
6. **Handle unhandled rejections** - Set up global handlers


# Utilities

The `util` module provides utility functions that are helpful for various tasks in Node.js applications.

## util.promisify

Converts a callback-based function to a promise-based one.

### Basic Usage

```javascript
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

// Now you can use async/await
async function example() {
  try {
    const data = await readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### Custom Promisify

```javascript
const util = require('util');

function callbackFunction(arg, callback) {
  setTimeout(() => {
    callback(null, `Result: ${arg}`);
  }, 100);
}

const promiseFunction = util.promisify(callbackFunction);

promiseFunction('test')
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

## util.callbackify

Converts a promise-returning function to a callback-based one.

```javascript
const util = require('util');

async function asyncFunction() {
  return 'Result';
}

const callbackFunction = util.callbackify(asyncFunction);

callbackFunction((err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});
```

## util.inspect

Returns a string representation of an object, useful for debugging.

### Basic Usage

```javascript
const util = require('util');

const obj = {
  name: 'John',
  age: 30,
  nested: { key: 'value' }
};

console.log(util.inspect(obj));
// { name: 'John', age: 30, nested: { key: 'value' } }
```

### Options

```javascript
const util = require('util');

const obj = {
  name: 'John',
  age: 30,
  nested: { key: 'value' }
};

// Show hidden properties
console.log(util.inspect(obj, { showHidden: true }));

// Set depth
console.log(util.inspect(obj, { depth: 0 })); // Only top level

// Colors
console.log(util.inspect(obj, { colors: true }));

// Compact mode
console.log(util.inspect(obj, { compact: true }));
```

## util.format

Returns a formatted string using printf-like format.

```javascript
const util = require('util');

// %s - string
// %d - number
// %j - JSON
// %o - object

console.log(util.format('%s is %d years old', 'John', 30));
// 'John is 30 years old'

console.log(util.format('Object: %j', { name: 'John' }));
// 'Object: {"name":"John"}'
```

## util.types

Provides type checking utilities.

```javascript
const util = require('util');

// Check if value is a Date
util.types.isDate(new Date()); // true

// Check if value is a RegExp
util.types.isRegExp(/test/); // true

// Check if value is a native Promise
util.types.isPromise(Promise.resolve()); // true

// Check if value is an ArrayBuffer
util.types.isArrayBuffer(new ArrayBuffer()); // true

// Many more type checks available
```

## util.inherits

Sets up prototype chain for inheritance (deprecated, use ES6 classes).

```javascript
const util = require('util');
const EventEmitter = require('events');

function MyEmitter() {
  EventEmitter.call(this);
}

util.inherits(MyEmitter, EventEmitter);

// Better: Use ES6 classes
class MyEmitter extends EventEmitter {
  constructor() {
    super();
  }
}
```

## util.deprecate

Marks a function as deprecated.

```javascript
const util = require('util');

const oldFunction = util.deprecate((arg) => {
  console.log('Old function:', arg);
}, 'oldFunction is deprecated. Use newFunction instead.');

oldFunction('test');
// Warning: oldFunction is deprecated. Use newFunction instead.
```

## util.debuglog

Creates a debug logging function.

```javascript
const util = require('util');

const debug = util.debuglog('app');

// Only logs if NODE_DEBUG=app is set
debug('This is a debug message');

// Run with: NODE_DEBUG=app node script.js
```

## util.TextEncoder / TextDecoder

For encoding/decoding text.

```javascript
const util = require('util');

const encoder = new util.TextEncoder();
const decoder = new util.TextDecoder();

const encoded = encoder.encode('Hello World');
console.log(encoded); // Uint8Array

const decoded = decoder.decode(encoded);
console.log(decoded); // 'Hello World'
```

## Common Patterns

### Promisify Multiple Functions

```javascript
const util = require('util');
const fs = require('fs');

const promisified = {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile),
  mkdir: util.promisify(fs.mkdir)
};

// Use them
async function example() {
  await promisified.writeFile('test.txt', 'Hello');
  const data = await promisified.readFile('test.txt', 'utf8');
  console.log(data);
}
```

### Custom Inspect

```javascript
const util = require('util');

class CustomClass {
  [util.inspect.custom]() {
    return 'Custom representation';
  }
}

console.log(util.inspect(new CustomClass()));
// 'Custom representation'
```

## Best Practices

1. **Use promisify** - Convert callbacks to promises for async/await
2. **Use inspect for debugging** - Better than JSON.stringify for objects
3. **Use types for validation** - Check types before operations
4. **Avoid inherits** - Use ES6 classes instead
5. **Use deprecate** - Mark old functions as deprecated
6. **Use debuglog** - For conditional debug logging


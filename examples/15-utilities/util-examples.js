/**
 * Util Module Examples
 */

const util = require('util');
const fs = require('fs');

console.log('=== Util Module Examples ===\n');

// Example 1: util.promisify
console.log('1. util.promisify:');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function promisifyExample() {
  try {
    const testFile = __dirname + '/util-test.txt';
    await writeFile(testFile, 'Hello from promisify!');
    const data = await readFile(testFile, 'utf8');
    console.log('   File content:', data);
    
    // Cleanup
    fs.unlinkSync(testFile);
  } catch (err) {
    console.error('   Error:', err.message);
  }
}

promisifyExample();

// Example 2: util.inspect
setTimeout(() => {
  console.log('\n2. util.inspect:');
  
  const obj = {
    name: 'John',
    age: 30,
    nested: {
      key: 'value',
      array: [1, 2, 3]
    }
  };
  
  console.log('   Basic inspect:');
  console.log(util.inspect(obj));
  
  console.log('\n   With colors:');
  console.log(util.inspect(obj, { colors: true }));
  
  console.log('\n   Compact mode:');
  console.log(util.inspect(obj, { compact: true }));
  
  console.log('\n   Depth limit:');
  console.log(util.inspect(obj, { depth: 1 }));
}, 200);

// Example 3: util.format
setTimeout(() => {
  console.log('\n3. util.format:');
  
  console.log('   String:', util.format('%s is %d years old', 'John', 30));
  console.log('   JSON:', util.format('Data: %j', { name: 'John', age: 30 }));
  console.log('   Object:', util.format('Object: %o', { key: 'value' }));
  console.log('   Multiple:', util.format('Name: %s, Age: %d, Data: %j', 'John', 30, { city: 'NYC' }));
}, 400);

// Example 4: util.types
setTimeout(() => {
  console.log('\n4. util.types:');
  
  console.log('   isDate:', util.types.isDate(new Date()));
  console.log('   isRegExp:', util.types.isRegExp(/test/));
  console.log('   isPromise:', util.types.isPromise(Promise.resolve()));
  console.log('   isArrayBuffer:', util.types.isArrayBuffer(new ArrayBuffer()));
  console.log('   isMap:', util.types.isMap(new Map()));
  console.log('   isSet:', util.types.isSet(new Set()));
  console.log('   isWeakMap:', util.types.isWeakMap(new WeakMap()));
  console.log('   isWeakSet:', util.types.isWeakSet(new WeakSet()));
}, 600);

// Example 5: util.deprecate
setTimeout(() => {
  console.log('\n5. util.deprecate:');
  
  const oldFunction = util.deprecate((message) => {
    console.log('   Old function output:', message);
  }, 'oldFunction is deprecated. Use newFunction instead.');
  
  oldFunction('test message');
}, 800);

// Example 6: util.debuglog
setTimeout(() => {
  console.log('\n6. util.debuglog:');
  
  const debug = util.debuglog('app');
  const debug2 = util.debuglog('app:module');
  
  console.log('   Regular log');
  debug('Debug log (only shows if NODE_DEBUG=app)');
  debug2('Module debug log (only shows if NODE_DEBUG=app:module)');
  
  console.log('   Run with: NODE_DEBUG=app node script.js to see debug logs');
}, 1000);

// Example 7: util.TextEncoder / TextDecoder
setTimeout(() => {
  console.log('\n7. util.TextEncoder / TextDecoder:');
  
  const encoder = new util.TextEncoder();
  const decoder = new util.TextDecoder();
  
  const text = 'Hello, 世界!';
  const encoded = encoder.encode(text);
  console.log('   Original:', text);
  console.log('   Encoded:', encoded);
  console.log('   Decoded:', decoder.decode(encoded));
}, 1200);

// Example 8: util.callbackify
setTimeout(() => {
  console.log('\n8. util.callbackify:');
  
  async function asyncFunction(value) {
    return `Result: ${value}`;
  }
  
  const callbackFunction = util.callbackify(asyncFunction);
  
  callbackFunction('test', (err, result) => {
    if (err) {
      console.error('   Error:', err);
      return;
    }
    console.log('   Result:', result);
  });
}, 1400);

// Example 9: Custom promisify
setTimeout(() => {
  console.log('\n9. Custom Promisify:');
  
  function callbackFunction(value, callback) {
    setTimeout(() => {
      if (value < 0) {
        callback(new Error('Negative value not allowed'));
      } else {
        callback(null, value * 2);
      }
    }, 100);
  }
  
  const promiseFunction = util.promisify(callbackFunction);
  
  promiseFunction(5)
    .then(result => {
      console.log('   Result:', result);
      return promiseFunction(-1);
    })
    .catch(err => {
      console.log('   Error caught:', err.message);
    });
}, 1600);

// Example 10: Custom inspect
setTimeout(() => {
  console.log('\n10. Custom inspect:');
  
  class CustomClass {
    constructor(name) {
      this.name = name;
    }
    
    [util.inspect.custom]() {
      return `CustomClass(${this.name})`;
    }
  }
  
  const instance = new CustomClass('Test');
  console.log('   Inspect:', util.inspect(instance));
  console.log('   Direct:', instance);
}, 1800);

setTimeout(() => {
  console.log('\n=== Util Module Examples Complete ===');
  process.exit(0);
}, 2000);


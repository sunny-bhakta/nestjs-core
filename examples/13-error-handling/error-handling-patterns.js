/**
 * Error Handling Patterns Examples
 */

const fs = require('fs');
const fsPromises = require('fs').promises;

console.log('=== Error Handling Patterns Examples ===\n');

// Example 1: Try/Catch with Synchronous Code
console.log('1. Try/Catch with Synchronous Code:');

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

try {
  const result = divide(10, 2);
  console.log('   Result:', result);
  
  const invalid = divide(10, 0);
} catch (error) {
  console.log('   Error caught:', error.message);
}

// Example 2: Error-First Callbacks
console.log('\n2. Error-First Callbacks:');

const testFile = __dirname + '/test-file.txt';
fs.writeFileSync(testFile, 'Test content');

fs.readFile(testFile, 'utf8', (err, data) => {
  if (err) {
    console.error('   Error reading file:', err.message);
    return;
  }
  console.log('   File read successfully:', data.trim());
  
  // Cleanup
  fs.unlinkSync(testFile);
});

// Example 3: Promise Error Handling
console.log('\n3. Promise Error Handling:');

function promiseOperation(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Promise operation failed'));
      } else {
        resolve('Promise operation succeeded');
      }
    }, 100);
  });
}

// Using .catch()
promiseOperation(false)
  .then(result => {
    console.log('   Success:', result);
    return promiseOperation(true);
  })
  .catch(error => {
    console.log('   Error caught:', error.message);
  });

// Example 4: Async/Await Error Handling
setTimeout(async () => {
  console.log('\n4. Async/Await Error Handling:');
  
  async function asyncOperation() {
    try {
      const data = await fsPromises.readFile(testFile, 'utf8');
      console.log('   Async read success:', data.trim());
      
      // Simulate error
      await fsPromises.readFile('non-existent.txt', 'utf8');
    } catch (error) {
      console.log('   Async error caught:', error.message);
    }
  }
  
  await asyncOperation();
}, 300);

// Example 5: Error Propagation
setTimeout(() => {
  console.log('\n5. Error Propagation:');
  
  function level1() {
    throw new Error('Error from level 1');
  }
  
  function level2() {
    try {
      level1();
    } catch (error) {
      console.log('   Caught in level2, re-throwing...');
      throw error; // Re-throw
    }
  }
  
  function level3() {
    try {
      level2();
    } catch (error) {
      console.log('   Caught in level3:', error.message);
    }
  }
  
  level3();
}, 500);

// Example 6: Error Wrapping
setTimeout(() => {
  console.log('\n6. Error Wrapping:');
  
  async function fetchData() {
    try {
      // Simulate API call failure
      throw new Error('Network timeout');
    } catch (error) {
      // Wrap with context
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
  
  fetchData().catch(error => {
    console.log('   Wrapped error:', error.message);
  });
}, 700);

// Example 7: Multiple Error Types
setTimeout(() => {
  console.log('\n7. Handling Multiple Error Types:');
  
  async function processData(data) {
    if (!data) {
      throw new TypeError('Data is required');
    }
    if (typeof data !== 'string') {
      throw new TypeError('Data must be a string');
    }
    if (data.length === 0) {
      throw new RangeError('Data cannot be empty');
    }
    return data.toUpperCase();
  }
  
  async function handleData(data) {
    try {
      return await processData(data);
    } catch (error) {
      if (error instanceof TypeError) {
        console.log('   TypeError:', error.message);
      } else if (error instanceof RangeError) {
        console.log('   RangeError:', error.message);
      } else {
        console.log('   Unknown error:', error.message);
      }
      return null;
    }
  }
  
  handleData(null);
  handleData('');
  handleData('hello');
}, 900);

setTimeout(() => {
  console.log('\n=== Error Handling Patterns Examples Complete ===');
  process.exit(0);
}, 1200);


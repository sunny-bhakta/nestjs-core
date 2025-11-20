/**
 * Promise Examples
 */

const fs = require('fs').promises;
const path = require('path');

console.log('=== Promise Examples ===\n');

// Creating a promise
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('Delay must be positive'));
      return;
    }
    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
}

// Using promises with .then()
console.log('1. Promise with .then():');
delay(500)
  .then(result => {
    console.log('   Result:', result);
    return delay(300);
  })
  .then(result => {
    console.log('   Chained result:', result);
  })
  .catch(err => {
    console.error('   Error:', err.message);
  });

// Error handling
console.log('\n2. Promise error handling:');
delay(-100)
  .then(result => {
    console.log('   Result:', result);
  })
  .catch(err => {
    console.log('   Caught error:', err.message);
  });

// Promise.all - Wait for all promises
console.log('\n3. Promise.all():');
Promise.all([
  delay(200),
  delay(300),
  delay(100)
])
  .then(results => {
    console.log('   All completed:', results);
  })
  .catch(err => {
    console.error('   Error:', err);
  });

// Promise.race - First to complete
console.log('\n4. Promise.race():');
Promise.race([
  delay(500),
  delay(200),
  delay(300)
])
  .then(result => {
    console.log('   First completed:', result);
  });

// Promise.allSettled - All regardless of outcome
console.log('\n5. Promise.allSettled():');
Promise.allSettled([
  delay(100),
  delay(-50), // This will reject
  delay(200)
])
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`   Promise ${index + 1}: Success - ${result.value}`);
      } else {
        console.log(`   Promise ${index + 1}: Failed - ${result.reason.message}`);
      }
    });
  });

// Promise.any - First to succeed
console.log('\n6. Promise.any():');
Promise.any([
  delay(-100).catch(() => 'First failed'),
  delay(150),
  delay(200)
])
  .then(result => {
    console.log('   First success:', result);
  });

// File operations with promises
console.log('\n7. File operations with promises:');
const testDir = path.join(__dirname, 'test-files');
const file1 = path.join(testDir, 'promise-file1.txt');
const file2 = path.join(testDir, 'promise-file2.txt');

async function fileOperations() {
  try {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(file1, 'File 1 content');
    await fs.writeFile(file2, 'File 2 content');
    console.log('   ✓ Files created');

    const [data1, data2] = await Promise.all([
      fs.readFile(file1, 'utf8'),
      fs.readFile(file2, 'utf8')
    ]);
    console.log('   ✓ Files read:', data1, data2);

    // Cleanup
    await fs.unlink(file1);
    await fs.unlink(file2);
    await fs.rmdir(testDir);
    console.log('   ✓ Cleanup complete');
  } catch (err) {
    console.error('   Error:', err.message);
  }
}

// Wait a bit for other promises to complete
setTimeout(() => {
  fileOperations();
}, 2000);


/**
 * Async/Await Examples
 */

const fs = require('fs').promises;
const path = require('path');

console.log('=== Async/Await Examples ===\n');

// Basic async/await
async function basicAsync() {
  console.log('1. Basic async/await:');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(`Done after ${ms}ms`), ms));
  }

  try {
    const result = await delay(500);
    console.log('   Result:', result);
  } catch (err) {
    console.error('   Error:', err);
  }
}

basicAsync();

// Sequential execution
async function sequential() {
  console.log('\n2. Sequential execution:');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
  }

  const start = Date.now();
  const result1 = await delay(200);
  const result2 = await delay(300);
  const result3 = await delay(100);
  const end = Date.now();
  
  console.log(`   Results: ${result1}, ${result2}, ${result3}`);
  console.log(`   Total time: ${end - start}ms (sequential)`);
}

setTimeout(() => sequential(), 600);

// Parallel execution
async function parallel() {
  console.log('\n3. Parallel execution:');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
  }

  const start = Date.now();
  const [result1, result2, result3] = await Promise.all([
    delay(200),
    delay(300),
    delay(100)
  ]);
  const end = Date.now();
  
  console.log(`   Results: ${result1}, ${result2}, ${result3}`);
  console.log(`   Total time: ${end - start}ms (parallel)`);
}

setTimeout(() => parallel(), 1200);

// Error handling
async function errorHandling() {
  console.log('\n4. Error handling:');
  
  function mightFail(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Operation failed'));
        } else {
          resolve('Operation succeeded');
        }
      }, 100);
    });
  }

  try {
    const result = await mightFail(false);
    console.log('   Success:', result);
  } catch (err) {
    console.error('   Error:', err.message);
  }

  try {
    await mightFail(true);
  } catch (err) {
    console.log('   Caught error:', err.message);
  }
}

setTimeout(() => errorHandling(), 1800);

// File operations with async/await
async function fileOperations() {
  console.log('\n5. File operations with async/await:');
  
  const testDir = path.join(__dirname, 'test-files');
  const files = [
    path.join(testDir, 'async-file1.txt'),
    path.join(testDir, 'async-file2.txt'),
    path.join(testDir, 'async-file3.txt')
  ];

  try {
    // Create directory
    await fs.mkdir(testDir, { recursive: true });
    console.log('   ✓ Directory created');

    // Write files in parallel
    await Promise.all([
      fs.writeFile(files[0], 'Content 1'),
      fs.writeFile(files[1], 'Content 2'),
      fs.writeFile(files[2], 'Content 3')
    ]);
    console.log('   ✓ Files written in parallel');

    // Read files sequentially
    for (let i = 0; i < files.length; i++) {
      const content = await fs.readFile(files[i], 'utf8');
      console.log(`   ✓ Read file ${i + 1}: ${content}`);
    }

    // Read all files in parallel
    const contents = await Promise.all(
      files.map(file => fs.readFile(file, 'utf8'))
    );
    console.log('   ✓ All files read in parallel:', contents);

    // Cleanup
    await Promise.all(files.map(file => fs.unlink(file)));
    await fs.rmdir(testDir);
    console.log('   ✓ Cleanup complete');

  } catch (err) {
    console.error('   Error:', err.message);
  }
}

setTimeout(() => fileOperations(), 2400);

// Async function in loops
async function asyncInLoops() {
  console.log('\n6. Async in loops:');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
  }

  const numbers = [100, 200, 300];

  // Sequential - using for...of
  console.log('   Sequential (for...of):');
  const start1 = Date.now();
  for (const num of numbers) {
    const result = await delay(num);
    console.log(`     Completed: ${result}ms`);
  }
  const end1 = Date.now();
  console.log(`   Total: ${end1 - start1}ms`);

  // Parallel - using map
  console.log('   Parallel (Promise.all + map):');
  const start2 = Date.now();
  const results = await Promise.all(numbers.map(num => delay(num)));
  const end2 = Date.now();
  console.log(`   Results: ${results.join(', ')}`);
  console.log(`   Total: ${end2 - start2}ms`);
}

setTimeout(() => asyncInLoops(), 3500);


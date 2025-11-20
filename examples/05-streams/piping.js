/**
 * Piping Streams Examples
 */

const fs = require('fs');
const { Transform, PassThrough } = require('stream');
const path = require('path');

console.log('=== Piping Streams Examples ===\n');

// Example 1: Simple pipe
console.log('1. Simple pipe (copy file):');
const inputFile = path.join(__dirname, 'input.txt');
const outputFile = path.join(__dirname, 'output.txt');

// Create input file
fs.writeFileSync(inputFile, 'Hello World\nLine 2\nLine 3', 'utf8');

fs.createReadStream(inputFile)
  .pipe(fs.createWriteStream(outputFile))
  .on('finish', () => {
    console.log('   ✓ File copied');
    const content = fs.readFileSync(outputFile, 'utf8');
    console.log('   Content:', JSON.stringify(content));
  });

// Example 2: Pipe with transform
setTimeout(() => {
  console.log('\n2. Pipe with transform (uppercase):');
  
  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });

  fs.createReadStream(inputFile)
    .pipe(upperCaseTransform)
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
      console.log('   ✓ File transformed and written');
      const content = fs.readFileSync(outputFile, 'utf8');
      console.log('   Content:', JSON.stringify(content));
    });
}, 500);

// Example 3: Multiple transforms
setTimeout(() => {
  console.log('\n3. Multiple transforms:');
  
  const addPrefix = new Transform({
    transform(chunk, encoding, callback) {
      this.push(`[PREFIX] ${chunk}`);
      callback();
    }
  });

  const addSuffix = new Transform({
    transform(chunk, encoding, callback) {
      this.push(`${chunk.toString().trim()} [SUFFIX]\n`);
      callback();
    }
  });

  fs.createReadStream(inputFile)
    .pipe(addPrefix)
    .pipe(addSuffix)
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
      console.log('   ✓ File transformed with multiple steps');
      const content = fs.readFileSync(outputFile, 'utf8');
      console.log('   Content:', content);
    });
}, 1000);

// Example 4: Error handling in pipes
setTimeout(() => {
  console.log('\n4. Error handling in pipes:');
  
  const errorTransform = new Transform({
    transform(chunk, encoding, callback) {
      if (chunk.toString().includes('error')) {
        callback(new Error('Transform error'));
      } else {
        this.push(chunk);
        callback();
      }
    }
  });

  fs.createReadStream(inputFile)
    .on('error', (err) => {
      console.error('   Read error:', err.message);
    })
    .pipe(errorTransform)
    .on('error', (err) => {
      console.error('   Transform error:', err.message);
    })
    .pipe(fs.createWriteStream(outputFile))
    .on('error', (err) => {
      console.error('   Write error:', err.message);
    })
    .on('finish', () => {
      console.log('   ✓ Pipe completed (no errors in this case)');
    });
}, 1500);

// Example 5: PassThrough stream
setTimeout(() => {
  console.log('\n5. PassThrough stream (monitoring):');
  
  const monitor = new PassThrough();
  let bytesPassed = 0;

  monitor.on('data', (chunk) => {
    bytesPassed += chunk.length;
    console.log(`   Monitoring: ${bytesPassed} bytes passed through`);
  });

  fs.createReadStream(inputFile)
    .pipe(monitor)
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', () => {
      console.log(`   ✓ Total bytes: ${bytesPassed}`);
      
      // Cleanup
      if (fs.existsSync(inputFile)) {
        fs.unlinkSync(inputFile);
      }
      if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
      }
      console.log('\n✓ Cleanup complete');
    });
}, 2000);


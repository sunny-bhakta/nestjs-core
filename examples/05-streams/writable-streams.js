/**
 * Writable Stream Examples
 */

const fs = require('fs');
const { Writable } = require('stream');
const path = require('path');

console.log('=== Writable Stream Examples ===\n');

// Example 1: Writing to file with stream
console.log('1. Writing to file with stream:');
const outputFile = path.join(__dirname, 'output.txt');
const writable = fs.createWriteStream(outputFile, 'utf8');

writable.write('Hello ');
writable.write('World');
writable.write('!\n');
writable.end('Stream ended.');

writable.on('finish', () => {
  console.log('   ✓ Finished writing');
  const content = fs.readFileSync(outputFile, 'utf8');
  console.log('   Content:', JSON.stringify(content));
});

writable.on('error', (err) => {
  console.error('   Error:', err);
});

// Example 2: Handling backpressure
setTimeout(() => {
  console.log('\n2. Handling backpressure:');
  const writable2 = fs.createWriteStream(outputFile, { highWaterMark: 10 });
  
  let data = 'A'.repeat(1000); // Large data
  let index = 0;

  function write() {
    let canWrite = true;
    while (index < data.length && canWrite) {
      canWrite = writable2.write(data[index]);
      index++;
    }

    if (index < data.length) {
      // Buffer is full, wait for drain
      writable2.once('drain', write);
    } else {
      writable2.end();
    }
  }

  writable2.on('finish', () => {
    console.log('   ✓ Finished writing with backpressure handling');
    const stats = fs.statSync(outputFile);
    console.log('   File size:', stats.size, 'bytes');
  });

  write();
}, 500);

// Example 3: Custom Writable Stream
setTimeout(() => {
  console.log('\n3. Custom Writable Stream:');
  
  class ConsoleWritable extends Writable {
    _write(chunk, encoding, callback) {
      console.log('   Received:', chunk.toString().trim());
      callback();
    }
  }

  const consoleStream = new ConsoleWritable();
  consoleStream.write('Message 1\n');
  consoleStream.write('Message 2\n');
  consoleStream.write('Message 3\n');
  consoleStream.end('Final message');

  consoleStream.on('finish', () => {
    console.log('   ✓ Console stream finished');
  });
}, 1000);

// Example 4: Object mode writable
setTimeout(() => {
  console.log('\n4. Object Mode Writable:');
  
  class ObjectWritable extends Writable {
    constructor(options) {
      super({ ...options, objectMode: true });
      this.items = [];
    }

    _write(chunk, encoding, callback) {
      this.items.push(chunk);
      console.log('   Stored object:', chunk);
      callback();
    }

    getItems() {
      return this.items;
    }
  }

  const objWritable = new ObjectWritable();
  objWritable.write({ id: 1, name: 'Alice' });
  objWritable.write({ id: 2, name: 'Bob' });
  objWritable.write({ id: 3, name: 'Charlie' });
  objWritable.end();

  objWritable.on('finish', () => {
    console.log('   All items:', objWritable.getItems());
    
    // Cleanup
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    console.log('\n✓ Cleanup complete');
  });
}, 1500);


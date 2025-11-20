/**
 * Readable Stream Examples
 */

const fs = require('fs');
const { Readable } = require('stream');
const path = require('path');

console.log('=== Readable Stream Examples ===\n');

// Example 1: Reading file with stream
console.log('1. Reading file with stream:');
const testFile = path.join(__dirname, 'test-file.txt');

// Create test file first
fs.writeFileSync(testFile, 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5', 'utf8');

const readable = fs.createReadStream(testFile, { encoding: 'utf8', highWaterMark: 10 });

let chunkCount = 0;
readable.on('data', (chunk) => {
  chunkCount++;
  console.log(`   Chunk ${chunkCount}:`, JSON.stringify(chunk));
});

readable.on('end', () => {
  console.log(`   Finished reading. Total chunks: ${chunkCount}`);
});

readable.on('error', (err) => {
  console.error('   Error:', err);
});

// Example 2: Paused mode
setTimeout(() => {
  console.log('\n2. Paused mode (readable event):');
  const readable2 = fs.createReadStream(testFile, { encoding: 'utf8', highWaterMark: 10 });
  
  readable2.on('readable', () => {
    let chunk;
    while ((chunk = readable2.read()) !== null) {
      console.log('   Read:', JSON.stringify(chunk));
    }
  });

  readable2.on('end', () => {
    console.log('   Finished reading');
  });
}, 500);

// Example 3: Custom Readable Stream
setTimeout(() => {
  console.log('\n3. Custom Readable Stream:');
  
  class NumberStream extends Readable {
    constructor(options) {
      super(options);
      this.current = 1;
      this.max = 5;
    }

    _read() {
      if (this.current <= this.max) {
        const data = `Number: ${this.current}\n`;
        this.push(data);
        this.current++;
      } else {
        this.push(null); // End stream
      }
    }
  }

  const numberStream = new NumberStream();
  numberStream.on('data', (chunk) => {
    process.stdout.write(`   ${chunk.toString()}`);
  });

  numberStream.on('end', () => {
    console.log('   Stream ended');
  });
}, 1000);

// Example 4: Object mode
setTimeout(() => {
  console.log('\n4. Object Mode Stream:');
  
  class ObjectStream extends Readable {
    constructor(options) {
      super({ ...options, objectMode: true });
      this.items = ['apple', 'banana', 'cherry'];
      this.index = 0;
    }

    _read() {
      if (this.index < this.items.length) {
        this.push({ id: this.index + 1, name: this.items[this.index] });
        this.index++;
      } else {
        this.push(null);
      }
    }
  }

  const objStream = new ObjectStream();
  objStream.on('data', (obj) => {
    console.log('   Object:', obj);
  });

  objStream.on('end', () => {
    console.log('   Stream ended');
    
    // Cleanup
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    console.log('\n✓ Cleanup complete');
  });
}, 1500);


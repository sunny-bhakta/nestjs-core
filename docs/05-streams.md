# Streams

Streams are objects that let you read data from a source or write data to a destination in a continuous fashion. They are powerful for handling large amounts of data efficiently.

## Why Streams?

- **Memory efficient**: Process data in chunks instead of loading everything into memory
- **Time efficient**: Start processing data as soon as it's available
- **Composable**: Can pipe streams together

## Types of Streams

1. **Readable**: Can read data from (e.g., `fs.createReadStream()`)
2. **Writable**: Can write data to (e.g., `fs.createWriteStream()`)
3. **Duplex**: Both readable and writable (e.g., TCP sockets)
4. **Transform**: Duplex stream that can modify data (e.g., `zlib.createGzip()`)

## Readable Streams

### Basic Usage

```javascript
const fs = require('fs');
const readable = fs.createReadStream('large-file.txt', 'utf8');

readable.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
});

readable.on('end', () => {
  console.log('Finished reading');
});

readable.on('error', (err) => {
  console.error('Error:', err);
});
```

### Reading Modes

```javascript
// Flowing mode (automatic)
readable.on('data', (chunk) => {
  console.log(chunk);
});

// Paused mode (manual)
readable.on('readable', () => {
  let chunk;
  while ((chunk = readable.read()) !== null) {
    console.log(chunk);
  }
});
```

## Writable Streams

### Basic Usage

```javascript
const fs = require('fs');
const writable = fs.createWriteStream('output.txt');

writable.write('Hello ');
writable.write('World');
writable.end('!');

writable.on('finish', () => {
  console.log('Finished writing');
});

writable.on('error', (err) => {
  console.error('Error:', err);
});
```

### Backpressure

```javascript
const writable = fs.createWriteStream('output.txt');

writable.on('drain', () => {
  console.log('Buffer drained, can write more');
  // Continue writing
});

function writeData(data) {
  if (!writable.write(data)) {
    // Buffer is full, wait for drain event
    writable.once('drain', () => {
      writeData('More data');
    });
  }
}
```

## Piping Streams

Piping connects readable and writable streams.

```javascript
const fs = require('fs');

// Simple pipe
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// Pipe with error handling
fs.createReadStream('input.txt')
  .on('error', (err) => {
    console.error('Read error:', err);
  })
  .pipe(fs.createWriteStream('output.txt'))
  .on('error', (err) => {
    console.error('Write error:', err);
  })
  .on('finish', () => {
    console.log('Copy complete');
  });
```

## Transform Streams

Transform streams modify data as it passes through.

```javascript
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

fs.createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('output.txt'));
```

## Custom Streams

### Custom Readable Stream

```javascript
const { Readable } = require('stream');

class MyReadable extends Readable {
  constructor(options) {
    super(options);
    this.count = 0;
  }

  _read() {
    if (this.count < 10) {
      this.push(`Data chunk ${this.count++}\n`);
    } else {
      this.push(null); // End stream
    }
  }
}

const readable = new MyReadable();
readable.pipe(process.stdout);
```

### Custom Writable Stream

```javascript
const { Writable } = require('stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log('Received:', chunk.toString());
    callback();
  }
}

const writable = new MyWritable();
writable.write('Hello');
writable.write('World');
writable.end();
```

## Stream Events

### Readable Stream Events

- `data`: Emitted when data is available
- `end`: Emitted when no more data
- `error`: Emitted on error
- `close`: Emitted when stream is closed
- `readable`: Emitted when data can be read

### Writable Stream Events

- `drain`: Emitted when buffer is empty
- `finish`: Emitted when `end()` is called and all data is flushed
- `error`: Emitted on error
- `close`: Emitted when stream is closed
- `pipe`: Emitted when stream is piped to

## Best Practices

1. **Always handle errors** on streams
2. **Use pipes** for simple data flow
3. **Handle backpressure** for large data
4. **Destroy streams** properly to avoid memory leaks
5. **Use object mode** for non-buffer data


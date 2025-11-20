# Buffers

Buffers are used to handle binary data in Node.js. They represent a fixed-size chunk of memory allocated outside the V8 heap.

## What are Buffers?

Buffers are similar to arrays but work with binary data. They are essential for:
- Reading/writing files
- Network communication
- Image processing
- Cryptography

## Creating Buffers

### Buffer.alloc()

Creates a new buffer of a specified size, filled with zeros.

```javascript
const buf = Buffer.alloc(10);
console.log(buf); // <Buffer 00 00 00 00 00 00 00 00 00 00>
```

### Buffer.from()

Creates a buffer from a string, array, or another buffer.

```javascript
// From string
const buf1 = Buffer.from('Hello', 'utf8');
console.log(buf1); // <Buffer 48 65 6c 6c 6f>

// From array
const buf2 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(buf2.toString()); // 'Hello'

// From another buffer
const buf3 = Buffer.from(buf1);
```

### Buffer.allocUnsafe()

Creates a buffer without initializing memory (faster but may contain old data).

```javascript
const buf = Buffer.allocUnsafe(10);
// Memory may contain old data, use fill() to clear
buf.fill(0);
```

## Buffer Operations

### Reading from Buffer

```javascript
const buf = Buffer.from('Hello World', 'utf8');

// Get byte at index
console.log(buf[0]); // 72 (H)

// Get slice
const slice = buf.slice(0, 5);
console.log(slice.toString()); // 'Hello'

// Read as string
console.log(buf.toString('utf8')); // 'Hello World'
console.log(buf.toString('hex')); // '48656c6c6f20576f726c64'
console.log(buf.toString('base64')); // 'SGVsbG8gV29ybGQ='
```

### Writing to Buffer

```javascript
const buf = Buffer.alloc(10);

// Write string
buf.write('Hello', 0, 'utf8');
console.log(buf.toString()); // 'Hello'

// Write at specific position
buf.write('World', 5, 'utf8');
console.log(buf.toString()); // 'HelloWorld'
```

### Buffer Methods

```javascript
const buf = Buffer.from('Hello World');

// Length
console.log(buf.length); // 11

// Compare buffers
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.from('World');
console.log(buf1.compare(buf2)); // -1 (buf1 < buf2)

// Copy buffer
const target = Buffer.alloc(5);
buf.copy(target, 0, 0, 5);
console.log(target.toString()); // 'Hello'

// Fill buffer
const filled = Buffer.alloc(10);
filled.fill('A');
console.log(filled.toString()); // 'AAAAAAAAAA'

// Find index
console.log(buf.indexOf('World')); // 6
console.log(buf.indexOf('o')); // 4
```

## Buffer and Strings

### Encoding

Buffers support various encodings:
- `utf8` (default)
- `ascii`
- `latin1`
- `base64`
- `hex`

```javascript
const buf = Buffer.from('Hello', 'utf8');

// Convert to different encodings
console.log(buf.toString('hex')); // '48656c6c6f'
console.log(buf.toString('base64')); // 'SGVsbG8='

// Create from different encodings
const fromHex = Buffer.from('48656c6c6f', 'hex');
console.log(fromHex.toString()); // 'Hello'
```

## Buffer Concatenation

```javascript
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');

// Method 1: Using Buffer.concat()
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // 'Hello World'

// Method 2: Using spread operator
const combined2 = Buffer.from([...buf1, ...buf2]);
console.log(combined2.toString()); // 'Hello World'
```

## Common Use Cases

### File Operations

```javascript
const fs = require('fs');

// Read file as buffer
const buffer = fs.readFileSync('image.jpg');
console.log('File size:', buffer.length);

// Write buffer to file
fs.writeFileSync('copy.jpg', buffer);
```

### Network Operations

```javascript
const http = require('http');

http.get('http://example.com/image.jpg', (res) => {
  const chunks = [];
  
  res.on('data', (chunk) => {
    chunks.push(chunk);
  });
  
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('downloaded.jpg', buffer);
  });
});
```

## Best Practices

1. **Use Buffer.alloc()** for new buffers (safer)
2. **Specify encoding** when converting to/from strings
3. **Be careful with Buffer.allocUnsafe()** - always fill if needed
4. **Use Buffer.concat()** for combining buffers
5. **Check buffer length** before operations
6. **Avoid creating too many small buffers** - use pooling for performance


# File System Operations

The `fs` module provides an API for interacting with the file system. It supports both synchronous and asynchronous operations.

## Synchronous Operations

Synchronous operations block the event loop until completion. Use sparingly.

```javascript
const fs = require('fs');

// Read file synchronously
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Write file synchronously
fs.writeFileSync('output.txt', 'Hello World');

// Check if file exists
if (fs.existsSync('file.txt')) {
  console.log('File exists');
}

// Get file stats
const stats = fs.statSync('file.txt');
console.log('File size:', stats.size);
console.log('Is file:', stats.isFile());
console.log('Is directory:', stats.isDirectory());
```

## Asynchronous Operations (Callbacks)

Asynchronous operations use callbacks and don't block the event loop.

```javascript
const fs = require('fs');

// Read file asynchronously
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log(data);
});

// Write file asynchronously
fs.writeFile('output.txt', 'Hello World', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});

// Get file stats
fs.stat('file.txt', (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('File size:', stats.size);
});
```

## Promise-based Operations

Modern approach using promises with `fs.promises` or `util.promisify`.

```javascript
const fs = require('fs').promises;
// or
const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);

// Using fs.promises
async function readFileAsync() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Using util.promisify
async function readFilePromisified() {
  try {
    const data = await readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

## Common File Operations

### Reading Files

```javascript
const fs = require('fs').promises;

// Read entire file
const data = await fs.readFile('file.txt', 'utf8');

// Read file as buffer
const buffer = await fs.readFile('image.jpg');
```

### Writing Files

```javascript
const fs = require('fs').promises;

// Write file (overwrites if exists)
await fs.writeFile('output.txt', 'Hello World', 'utf8');

// Append to file
await fs.appendFile('log.txt', 'New log entry\n', 'utf8');
```

### File and Directory Management

```javascript
const fs = require('fs').promises;

// Create directory
await fs.mkdir('new-folder', { recursive: true });

// Read directory
const files = await fs.readdir('./');
console.log(files);

// Remove file
await fs.unlink('file.txt');

// Remove directory
await fs.rmdir('empty-folder');

// Rename/move file
await fs.rename('old-name.txt', 'new-name.txt');

// Copy file
await fs.copyFile('source.txt', 'destination.txt');
```

### File Stats

```javascript
const fs = require('fs').promises;

const stats = await fs.stat('file.txt');
console.log('Size:', stats.size);
console.log('Created:', stats.birthtime);
console.log('Modified:', stats.mtime);
console.log('Is file:', stats.isFile());
console.log('Is directory:', stats.isDirectory());
console.log('Is symbolic link:', stats.isSymbolicLink());
```

## File Watching

Watch for changes in files and directories.

```javascript
const fs = require('fs');

// Watch file
fs.watch('file.txt', (eventType, filename) => {
  console.log(`Event: ${eventType}, File: ${filename}`);
});

// Watch directory
fs.watch('./', { recursive: true }, (eventType, filename) => {
  console.log(`Event: ${eventType}, File: ${filename}`);
});

// Watch file (polling-based, more reliable)
fs.watchFile('file.txt', { interval: 1000 }, (curr, prev) => {
  console.log('File changed');
  console.log('Current mtime:', curr.mtime);
  console.log('Previous mtime:', prev.mtime);
});

// Stop watching
fs.unwatchFile('file.txt');
```

## Best Practices

1. **Use async/await** for better error handling
2. **Handle errors** properly in all file operations
3. **Use streams** for large files
4. **Check file existence** before operations when needed
5. **Use `recursive: true`** when creating nested directories


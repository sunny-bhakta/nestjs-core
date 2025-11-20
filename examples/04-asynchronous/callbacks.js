/**
 * Callback Examples
 */

const fs = require('fs');
const path = require('path');

console.log('=== Callback Examples ===\n');

// Simple callback
function greet(name, callback) {
  setTimeout(() => {
    callback(`Hello, ${name}!`);
  }, 1000);
}

greet('Node.js', (message) => {
  console.log('1. Simple callback:', message);
});

// Error-first callback pattern
function divide(a, b, callback) {
  setTimeout(() => {
    if (b === 0) {
      callback(new Error('Division by zero'));
      return;
    }
    callback(null, a / b);
  }, 500);
}

divide(10, 2, (err, result) => {
  if (err) {
    console.error('2. Error:', err.message);
  } else {
    console.log('2. Division result:', result);
  }
});

divide(10, 0, (err, result) => {
  if (err) {
    console.error('3. Error:', err.message);
  } else {
    console.log('3. Division result:', result);
  }
});

// Callback hell example
console.log('\n=== Callback Hell Example ===');
const testDir = path.join(__dirname, 'test-files');

setTimeout(() => {
  fs.mkdir(testDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
      return;
    }
    console.log('✓ Directory created');

    const file1 = path.join(testDir, 'file1.txt');
    fs.writeFile(file1, 'Content 1', (err) => {
      if (err) {
        console.error('Error writing file1:', err);
        return;
      }
      console.log('✓ File 1 written');

      const file2 = path.join(testDir, 'file2.txt');
      fs.writeFile(file2, 'Content 2', (err) => {
        if (err) {
          console.error('Error writing file2:', err);
          return;
        }
        console.log('✓ File 2 written');

        fs.readFile(file1, 'utf8', (err, data1) => {
          if (err) {
            console.error('Error reading file1:', err);
            return;
          }
          fs.readFile(file2, 'utf8', (err, data2) => {
            if (err) {
              console.error('Error reading file2:', err);
              return;
            }
            const combined = path.join(testDir, 'combined.txt');
            fs.writeFile(combined, data1 + '\n' + data2, (err) => {
              if (err) {
                console.error('Error writing combined:', err);
                return;
              }
              console.log('✓ Files combined');

              // Cleanup
              fs.unlink(file1, () => {});
              fs.unlink(file2, () => {});
              fs.unlink(combined, () => {});
              fs.rmdir(testDir, () => {
                console.log('✓ Cleanup complete');
              });
            });
          });
        });
      });
    });
  });
}, 1500);


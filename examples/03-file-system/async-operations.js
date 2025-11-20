/**
 * Asynchronous File System Operations (Callbacks)
 */

const fs = require('fs');
const path = require('path');

console.log('=== Asynchronous File Operations (Callbacks) ===\n');

const testDir = path.join(__dirname, 'test-files');
const filePath = path.join(testDir, 'async-test.txt');

// Create directory asynchronously
fs.mkdir(testDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating directory:', err);
    return;
  }
  console.log('✓ Directory created');

  // Write file asynchronously
  fs.writeFile(filePath, 'Hello from async write!\nLine 2', 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('✓ File written asynchronously');

    // Read file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      console.log('✓ File read asynchronously:');
      console.log(data);

      // Get file stats asynchronously
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting stats:', err);
          return;
        }
        console.log('\n=== File Stats ===');
        console.log('File size:', stats.size, 'bytes');
        console.log('Is file:', stats.isFile());
        console.log('Modified:', stats.mtime);

        // Append to file asynchronously
        fs.appendFile(filePath, '\nAppended line!', 'utf8', (err) => {
          if (err) {
            console.error('Error appending:', err);
            return;
          }
          console.log('✓ Appended to file');

          // Read directory asynchronously
          fs.readdir(testDir, (err, files) => {
            if (err) {
              console.error('Error reading directory:', err);
              return;
            }
            console.log('\n=== Directory Contents ===');
            console.log('Files:', files);

            // Copy file asynchronously
            const copyPath = path.join(testDir, 'async-test-copy.txt');
            fs.copyFile(filePath, copyPath, (err) => {
              if (err) {
                console.error('Error copying file:', err);
                return;
              }
              console.log('✓ File copied');

              // Clean up
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error('Error deleting file:', err);
                  return;
                }
                fs.unlink(copyPath, (err) => {
                  if (err) {
                    console.error('Error deleting copy:', err);
                    return;
                  }
                  fs.rmdir(testDir, (err) => {
                    if (err) {
                      console.error('Error removing directory:', err);
                      return;
                    }
                    console.log('✓ Cleanup complete');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});


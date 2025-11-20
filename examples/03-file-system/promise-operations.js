/**
 * Promise-based File System Operations
 */

const fs = require('fs').promises;
const path = require('path');

async function fileOperations() {
  console.log('=== Promise-based File Operations ===\n');

  const testDir = path.join(__dirname, 'test-files');
  const filePath = path.join(testDir, 'promise-test.txt');

  try {
    // Create directory
    await fs.mkdir(testDir, { recursive: true });
    console.log('✓ Directory created');

    // Write file
    await fs.writeFile(filePath, 'Hello from promises!\nLine 2\nLine 3', 'utf8');
    console.log('✓ File written');

    // Read file
    const content = await fs.readFile(filePath, 'utf8');
    console.log('✓ File read:');
    console.log(content);

    // Get file stats
    const stats = await fs.stat(filePath);
    console.log('\n=== File Stats ===');
    console.log('File size:', stats.size, 'bytes');
    console.log('Is file:', stats.isFile());
    console.log('Modified:', stats.mtime);

    // Append to file
    await fs.appendFile(filePath, '\nAppended with promises!', 'utf8');
    console.log('✓ Appended to file');

    // Read directory
    const files = await fs.readdir(testDir);
    console.log('\n=== Directory Contents ===');
    console.log('Files:', files);

    // Copy file
    const copyPath = path.join(testDir, 'promise-test-copy.txt');
    await fs.copyFile(filePath, copyPath);
    console.log('✓ File copied');

    // Rename file
    const renamedPath = path.join(testDir, 'renamed-promise-file.txt');
    await fs.rename(copyPath, renamedPath);
    console.log('✓ File renamed');

    // Read the renamed file
    const renamedContent = await fs.readFile(renamedPath, 'utf8');
    console.log('\n✓ Renamed file content:');
    console.log(renamedContent);

    // Clean up
    await fs.unlink(filePath);
    await fs.unlink(renamedPath);
    await fs.rmdir(testDir);
    console.log('\n✓ Cleanup complete');

  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the async function
fileOperations().catch(console.error);


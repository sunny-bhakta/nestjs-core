/**
 * Synchronous File System Operations
 */

const fs = require('fs');
const path = require('path');

console.log('=== Synchronous File Operations ===\n');

// Create test directory
const testDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Write file synchronously
const filePath = path.join(testDir, 'sync-test.txt');
fs.writeFileSync(filePath, 'Hello from synchronous write!\nThis is line 2.', 'utf8');
console.log('✓ File written synchronously');

// Read file synchronously
const content = fs.readFileSync(filePath, 'utf8');
console.log('✓ File read synchronously:');
console.log(content);

// Check if file exists
console.log('\n=== File Existence ===');
console.log('File exists:', fs.existsSync(filePath));
console.log('Directory exists:', fs.existsSync(testDir));

// Get file stats synchronously
console.log('\n=== File Stats ===');
const stats = fs.statSync(filePath);
console.log('File size:', stats.size, 'bytes');
console.log('Is file:', stats.isFile());
console.log('Is directory:', stats.isDirectory());
console.log('Created:', stats.birthtime);
console.log('Modified:', stats.mtime);
console.log('Accessed:', stats.atime);
console.log('Mode:', stats.mode.toString(8));

// Append to file synchronously
fs.appendFileSync(filePath, '\nThis line was appended!', 'utf8');
console.log('\n✓ Appended to file');

// Read directory synchronously
console.log('\n=== Directory Contents ===');
const files = fs.readdirSync(testDir);
console.log('Files in directory:', files);

// Copy file synchronously
const copyPath = path.join(testDir, 'sync-test-copy.txt');
fs.copyFileSync(filePath, copyPath);
console.log('✓ File copied');

// Rename file synchronously
const renamedPath = path.join(testDir, 'renamed-file.txt');
fs.renameSync(copyPath, renamedPath);
console.log('✓ File renamed');

// Clean up
console.log('\n=== Cleanup ===');
fs.unlinkSync(filePath);
fs.unlinkSync(renamedPath);
fs.rmdirSync(testDir);
console.log('✓ Test files cleaned up');


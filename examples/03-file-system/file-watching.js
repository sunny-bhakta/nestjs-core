/**
 * File Watching Examples
 */

const fs = require('fs');
const path = require('path');

console.log('=== File Watching Examples ===\n');

const testDir = path.join(__dirname, 'test-files');
const watchFile = path.join(testDir, 'watch-me.txt');

// Create directory and initial file
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}
fs.writeFileSync(watchFile, 'Initial content', 'utf8');

// Method 1: fs.watch (event-based, less reliable)
console.log('=== fs.watch (Event-based) ===');
const watcher = fs.watch(watchFile, (eventType, filename) => {
  console.log(`Event type: ${eventType}`);
  console.log(`Filename: ${filename}`);
  
  if (eventType === 'change') {
    console.log('File was changed!');
    const content = fs.readFileSync(watchFile, 'utf8');
    console.log('New content:', content);
  }
});

// Method 2: fs.watchFile (polling-based, more reliable)
console.log('\n=== fs.watchFile (Polling-based) ===');
fs.watchFile(watchFile, { interval: 1000 }, (curr, prev) => {
  console.log('File changed!');
  console.log('Current mtime:', curr.mtime);
  console.log('Previous mtime:', prev.mtime);
  console.log('Size changed:', curr.size !== prev.size);
});

// Watch directory
console.log('\n=== Watching Directory ===');
const dirWatcher = fs.watch(testDir, { recursive: true }, (eventType, filename) => {
  console.log(`Directory event: ${eventType}, File: ${filename}`);
});

// Simulate file changes
setTimeout(() => {
  console.log('\n=== Simulating File Changes ===');
  fs.appendFileSync(watchFile, '\nFirst change', 'utf8');
  console.log('✓ First change made');
}, 2000);

setTimeout(() => {
  fs.writeFileSync(watchFile, 'Completely new content', 'utf8');
  console.log('✓ Second change made');
}, 4000);

setTimeout(() => {
  const newFile = path.join(testDir, 'new-file.txt');
  fs.writeFileSync(newFile, 'New file created', 'utf8');
  console.log('✓ New file created');
}, 6000);

// Clean up after 8 seconds
setTimeout(() => {
  console.log('\n=== Cleanup ===');
  
  // Stop watching
  watcher.close();
  fs.unwatchFile(watchFile);
  dirWatcher.close();
  
  // Remove files
  if (fs.existsSync(watchFile)) {
    fs.unlinkSync(watchFile);
  }
  const newFile = path.join(testDir, 'new-file.txt');
  if (fs.existsSync(newFile)) {
    fs.unlinkSync(newFile);
  }
  if (fs.existsSync(testDir)) {
    fs.rmdirSync(testDir);
  }
  
  console.log('✓ Watchers stopped and files cleaned up');
  console.log('\nPress Ctrl+C to exit');
}, 8000);


/**
 * Child Process exec() Example
 */

const { exec } = require('child_process');

console.log('=== Child Process exec() Example ===\n');

// Example 1: Simple command
console.log('1. Execute simple command:');
exec('echo "Hello from exec"', (error, stdout, stderr) => {
  if (error) {
    console.error('   Error:', error.message);
    return;
  }
  if (stderr) {
    console.error('   stderr:', stderr);
    return;
  }
  console.log('   stdout:', stdout.trim());
});

// Example 2: List files (Unix/Linux/macOS)
setTimeout(() => {
  console.log('\n2. List files:');
  if (process.platform !== 'win32') {
    exec('ls -la', (error, stdout, stderr) => {
      if (error) {
        console.error('   Error:', error.message);
        return;
      }
      console.log('   Files:');
      console.log(stdout);
    });
  } else {
    exec('dir', (error, stdout, stderr) => {
      if (error) {
        console.error('   Error:', error.message);
        return;
      }
      console.log('   Files:');
      console.log(stdout);
    });
  }
}, 500);

// Example 3: Node version
setTimeout(() => {
  console.log('\n3. Get Node version:');
  exec('node --version', (error, stdout, stderr) => {
    if (error) {
      console.error('   Error:', error.message);
      return;
    }
    console.log('   Node version:', stdout.trim());
  });
}, 1000);

// Example 4: With options
setTimeout(() => {
  console.log('\n4. Execute with options:');
  const options = {
    cwd: process.cwd(),
    env: process.env,
    timeout: 5000,
    maxBuffer: 1024 * 1024
  };

  exec('echo $NODE_ENV', options, (error, stdout, stderr) => {
    if (error) {
      console.error('   Error:', error.message);
      return;
    }
    console.log('   Environment:', stdout.trim() || 'not set');
  });
}, 1500);

setTimeout(() => {
  console.log('\n=== Examples Complete ===');
  process.exit(0);
}, 2500);


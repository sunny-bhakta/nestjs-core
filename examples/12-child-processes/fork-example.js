/**
 * Child Process fork() Example
 */

const { fork } = require('child_process');
const path = require('path');

console.log('=== Child Process fork() Example ===\n');

// Create a child script first
const childScript = `
process.on('message', (msg) => {
  console.log('Child received:', msg);
  
  if (msg === 'calculate') {
    // Simulate some work
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    process.send({ result: sum, pid: process.pid });
  }
  
  if (msg === 'exit') {
    process.exit(0);
  }
});

console.log('Child process started, PID:', process.pid);
`;

const fs = require('fs');
const childScriptPath = path.join(__dirname, 'child-worker.js');
fs.writeFileSync(childScriptPath, childScript);

// Fork the child process
console.log('1. Forking child process:');
const child = fork(childScriptPath);

child.on('message', (msg) => {
  console.log('   Parent received:', msg);
});

child.on('exit', (code) => {
  console.log(`   Child process exited with code ${code}`);
  // Cleanup
  if (fs.existsSync(childScriptPath)) {
    fs.unlinkSync(childScriptPath);
  }
  setTimeout(() => process.exit(0), 500);
});

// Send messages to child
setTimeout(() => {
  console.log('\n2. Sending calculate message:');
  child.send('calculate');
}, 500);

setTimeout(() => {
  console.log('\n3. Sending exit message:');
  child.send('exit');
}, 2000);


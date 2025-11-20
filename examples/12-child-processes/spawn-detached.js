/**
 * spawn() with Detached Option Examples
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== spawn() with Detached Option ===\n');

// Example 1: Simple Detached Process
console.log('1. Simple Detached Process:');

const simpleScript = `
console.log('Simple detached script');
setTimeout(() => {
  console.log('Script completed');
  process.exit(0);
}, 2000);
`;

const simplePath = path.join(__dirname, 'simple-detached.js');
fs.writeFileSync(simplePath, simpleScript);

const child1 = spawn('node', [simplePath], {
  detached: true,
  stdio: 'ignore'
});

console.log('   Child PID:', child1.pid);
console.log('   Detached: true');
console.log('   stdio: ignore');

child1.unref();
console.log('   unref() called - parent can exit\n');

// Example 2: Detached with Custom stdio
setTimeout(() => {
  console.log('2. Detached with Custom stdio:');
  
  const customScript = `
console.log('Output to stdout');
console.error('Output to stderr');
setTimeout(() => process.exit(0), 1000);
`;
  
  const customPath = path.join(__dirname, 'custom-detached.js');
  fs.writeFileSync(customPath, customScript);
  
  const stdoutFile = path.join(__dirname, 'stdout.log');
  const stderrFile = path.join(__dirname, 'stderr.log');
  
  const stdout = fs.openSync(stdoutFile, 'a');
  const stderr = fs.openSync(stderrFile, 'a');
  
  const child2 = spawn('node', [customPath], {
    detached: true,
    stdio: ['ignore', stdout, stderr]
  });
  
  child2.unref();
  
  console.log('   stdout redirected to:', stdoutFile);
  console.log('   stderr redirected to:', stderrFile);
  
  setTimeout(() => {
    if (fs.existsSync(stdoutFile)) {
      console.log('   stdout content:', fs.readFileSync(stdoutFile, 'utf8').trim());
      fs.unlinkSync(stdoutFile);
    }
    if (fs.existsSync(stderrFile)) {
      console.log('   stderr content:', fs.readFileSync(stderrFile, 'utf8').trim());
      fs.unlinkSync(stderrFile);
    }
    if (fs.existsSync(customPath)) {
      fs.unlinkSync(customPath);
    }
  }, 2000);
}, 500);

// Example 3: Detached Process Options
setTimeout(() => {
  console.log('\n3. Detached Process Options:');
  
  const optionsScript = `
console.log('Process options:');
console.log('PID:', process.pid);
console.log('CWD:', process.cwd());
console.log('ENV NODE_ENV:', process.env.NODE_ENV);
setTimeout(() => process.exit(0), 1000);
`;
  
  const optionsPath = path.join(__dirname, 'options-detached.js');
  fs.writeFileSync(optionsPath, optionsScript);
  
  const child3 = spawn('node', [optionsPath], {
    detached: true,
    stdio: 'ignore',
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  child3.unref();
  
  console.log('   Options set:');
  console.log('     cwd:', __dirname);
  console.log('     env.NODE_ENV: production');
  console.log('     detached: true');
  
  setTimeout(() => {
    if (fs.existsSync(optionsPath)) {
      fs.unlinkSync(optionsPath);
    }
  }, 2000);
}, 1000);

// Example 4: Process Group and Session
setTimeout(() => {
  console.log('\n4. Process Group and Session:');
  
  const groupScript = `
console.log('Process in new process group');
console.log('PID:', process.pid);
console.log('PPID:', process.ppid);
setTimeout(() => process.exit(0), 1000);
`;
  
  const groupPath = path.join(__dirname, 'group-detached.js');
  fs.writeFileSync(groupPath, groupScript);
  
  const child4 = spawn('node', [groupPath], {
    detached: true,
    stdio: 'ignore'
  });
  
  console.log('   Child PID:', child4.pid);
  console.log('   Parent PID:', process.pid);
  console.log('   Child is leader of new process group');
  console.log('   Child will not be killed when parent exits');
  
  child4.unref();
  
  setTimeout(() => {
    if (fs.existsSync(groupPath)) {
      fs.unlinkSync(groupPath);
    }
  }, 2000);
}, 1500);

// Example 5: Long-Running Detached Process
setTimeout(() => {
  console.log('\n5. Long-Running Detached Process:');
  
  const longScript = `
let count = 0;
console.log('Long-running process started');
const interval = setInterval(() => {
  count++;
  console.log(\`Running... \${count}\`);
  if (count >= 3) {
    clearInterval(interval);
    console.log('Long-running process completed');
    process.exit(0);
  }
}, 1000);
`;
  
  const longPath = path.join(__dirname, 'long-detached.js');
  fs.writeFileSync(longPath, longScript);
  
  const child5 = spawn('node', [longPath], {
    detached: true,
    stdio: 'ignore'
  });
  
  child5.unref();
  
  console.log('   Long-running process started');
  console.log('   Parent can exit, child continues');
  console.log('   Child PID:', child5.pid);
  
  // Parent exits, child continues
  setTimeout(() => {
    console.log('   Parent process can exit now');
    if (fs.existsSync(longPath)) {
      fs.unlinkSync(longPath);
    }
  }, 1000);
}, 2000);

// Cleanup
setTimeout(() => {
  console.log('\n=== Examples Complete ===');
  
  const files = [
    'simple-detached.js',
    'custom-detached.js',
    'options-detached.js',
    'group-detached.js',
    'long-detached.js'
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        // Ignore
      }
    }
  });
  
  process.exit(0);
}, 5000);


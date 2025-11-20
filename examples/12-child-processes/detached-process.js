/**
 * Detached Process Examples
 * Demonstrates creating detached child processes that run independently
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Detached Process Examples ===\n');

// Example 1: Basic Detached Process
console.log('1. Basic Detached Process:');

// Create a simple script that runs for a while
const detachedScript = `
console.log('Detached process started, PID:', process.pid);
let count = 0;
const interval = setInterval(() => {
  count++;
  console.log(\`Detached process running... count: \${count}\`);
  if (count >= 5) {
    console.log('Detached process completed');
    clearInterval(interval);
    process.exit(0);
  }
}, 1000);
`;

const scriptPath = path.join(__dirname, 'detached-worker.js');
fs.writeFileSync(scriptPath, detachedScript);

const child = spawn('node', [scriptPath], {
  detached: true,
  stdio: 'ignore' // Important: detach stdio
});

console.log('   Child process PID:', child.pid);
console.log('   Parent process PID:', process.pid);

// Unref the child process
child.unref();
console.log('   Child process detached and unrefed');
console.log('   Parent can exit, child will continue running');

// Example 2: Detached Process with Log Files
setTimeout(() => {
  console.log('\n2. Detached Process with Log Files:');
  
  const logScript = `
console.log('Logging process started');
for (let i = 0; i < 3; i++) {
  console.log(\`Log entry \${i + 1}\`);
  await new Promise(resolve => setTimeout(resolve, 500));
}
console.log('Logging process completed');
`;
  
  const logScriptPath = path.join(__dirname, 'detached-logger.js');
  fs.writeFileSync(logScriptPath, logScript);
  
  // Create log files
  const outLog = path.join(__dirname, 'detached-out.log');
  const errLog = path.join(__dirname, 'detached-err.log');
  
  const out = fs.openSync(outLog, 'a');
  const err = fs.openSync(errLog, 'a');
  
  const child2 = spawn('node', [logScriptPath], {
    detached: true,
    stdio: ['ignore', out, err]
  });
  
  child2.unref();
  
  console.log('   Detached process with logs created');
  console.log('   Output will be written to:', outLog);
  console.log('   Errors will be written to:', errLog);
  
  // Wait a bit then check logs
  setTimeout(() => {
    if (fs.existsSync(outLog)) {
      const content = fs.readFileSync(outLog, 'utf8');
      console.log('   Log content:', content.trim());
      fs.unlinkSync(outLog);
    }
    if (fs.existsSync(errLog)) {
      fs.unlinkSync(errLog);
    }
    if (fs.existsSync(logScriptPath)) {
      fs.unlinkSync(logScriptPath);
    }
  }, 3000);
}, 1000);

// Example 3: Detached Process Group
setTimeout(() => {
  console.log('\n3. Detached Process Group:');
  
  const groupScript = `
console.log('Process group leader, PID:', process.pid);
console.log('Process group ID:', process.getgid ? process.getgid() : 'N/A');
setTimeout(() => {
  console.log('Process group process exiting');
  process.exit(0);
}, 2000);
`;
  
  const groupScriptPath = path.join(__dirname, 'detached-group.js');
  fs.writeFileSync(groupScriptPath, groupScript);
  
  const child3 = spawn('node', [groupScriptPath], {
    detached: true,
    stdio: 'ignore'
  });
  
  console.log('   Child PID:', child3.pid);
  console.log('   Child becomes leader of new process group');
  
  child3.unref();
  console.log('   Parent can exit independently');
  
  setTimeout(() => {
    if (fs.existsSync(groupScriptPath)) {
      fs.unlinkSync(groupScriptPath);
    }
  }, 3000);
}, 2000);

// Example 4: Background Service Pattern
setTimeout(() => {
  console.log('\n4. Background Service Pattern:');
  
  const serviceScript = `
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'service.log');
let count = 0;

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${message}\\n\`;
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

log('Background service started');

// Simulate background work
const interval = setInterval(() => {
  count++;
  log(\`Service running... iteration \${count}\`);
  
  if (count >= 3) {
    log('Background service stopping');
    clearInterval(interval);
    process.exit(0);
  }
}, 1000);
`;
  
  const serviceScriptPath = path.join(__dirname, 'background-service.js');
  fs.writeFileSync(serviceScriptPath, serviceScript);
  
  const serviceLog = path.join(__dirname, 'service.log');
  
  const child4 = spawn('node', [serviceScriptPath], {
    detached: true,
    stdio: 'ignore',
    cwd: __dirname
  });
  
  child4.unref();
  
  console.log('   Background service started');
  console.log('   Service PID:', child4.pid);
  console.log('   Service will continue after parent exits');
  
  // Check service log after a delay
  setTimeout(() => {
    if (fs.existsSync(serviceLog)) {
      const content = fs.readFileSync(serviceLog, 'utf8');
      console.log('   Service log:');
      console.log(content);
      fs.unlinkSync(serviceLog);
    }
    if (fs.existsSync(serviceScriptPath)) {
      fs.unlinkSync(serviceScriptPath);
    }
  }, 5000);
}, 3000);

// Example 5: Detached vs Non-Detached Comparison
setTimeout(() => {
  console.log('\n5. Detached vs Non-Detached:');
  
  const compareScript = `
console.log('Child process running, PID:', process.pid);
setTimeout(() => {
  console.log('Child process exiting');
  process.exit(0);
}, 2000);
`;
  
  const compareScriptPath = path.join(__dirname, 'compare-child.js');
  fs.writeFileSync(compareScriptPath, compareScript);
  
  console.log('   Non-detached: Parent waits for child');
  const nonDetached = spawn('node', [compareScriptPath], {
    stdio: 'ignore'
  });
  
  nonDetached.on('exit', () => {
    console.log('   Non-detached: Child exited, parent continues');
    
    console.log('   Detached: Parent can exit immediately');
    const detached = spawn('node', [compareScriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    
    detached.unref();
    console.log('   Detached: Parent exited, child continues');
    
    setTimeout(() => {
      if (fs.existsSync(compareScriptPath)) {
        fs.unlinkSync(compareScriptPath);
      }
    }, 3000);
  });
}, 4000);

// Cleanup
setTimeout(() => {
  console.log('\n=== Detached Process Examples Complete ===');
  
  // Cleanup script files
  const filesToClean = [
    'detached-worker.js',
    'detached-logger.js',
    'detached-group.js',
    'background-service.js',
    'compare-child.js'
  ];
  
  filesToClean.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        // Ignore errors
      }
    }
  });
  
  process.exit(0);
}, 8000);


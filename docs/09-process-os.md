# Process and OS

Node.js provides access to the current process and operating system information through the `process` and `os` modules.

## Process Object

The `process` object provides information and control over the current Node.js process.

### Process Information

```javascript
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Process ID:', process.pid);
console.log('Parent Process ID:', process.ppid);
console.log('Current directory:', process.cwd());
console.log('Executable path:', process.execPath);
```

### Command Line Arguments

```javascript
// process.argv contains command line arguments
// [0] = node executable path
// [1] = script file path
// [2+] = actual arguments

console.log('All arguments:', process.argv);
console.log('Script arguments:', process.argv.slice(2));

// Example: node script.js arg1 arg2
// process.argv = ['node', 'script.js', 'arg1', 'arg2']
```

### Environment Variables

```javascript
// Access environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);
console.log('HOME:', process.env.HOME); // Unix
console.log('USERPROFILE:', process.env.USERPROFILE); // Windows

// Set environment variable (for current process)
process.env.MY_VAR = 'value';
```

### Process Methods

```javascript
// Change directory
process.chdir('/path/to/directory');

// Exit process
process.exit(0); // Success
process.exit(1); // Error

// Kill process
process.kill(process.pid, 'SIGTERM');
```

### Process Events

```javascript
// Exit event
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

// Uncaught exception
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});

// Signal handlers
process.on('SIGINT', () => {
  console.log('Received SIGINT (Ctrl+C)');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  process.exit(0);
});
```

### Memory Usage

```javascript
const usage = process.memoryUsage();

console.log('RSS:', usage.rss); // Resident Set Size
console.log('Heap Total:', usage.heapTotal);
console.log('Heap Used:', usage.heapUsed);
console.log('External:', usage.external);
```

## OS Module

The `os` module provides operating system-related utility methods.

### Platform Information

```javascript
const os = require('os');

console.log('Platform:', os.platform()); // 'win32', 'linux', 'darwin'
console.log('Architecture:', os.arch()); // 'x64', 'arm', etc.
console.log('Hostname:', os.hostname());
console.log('Type:', os.type()); // 'Windows_NT', 'Linux', 'Darwin'
console.log('Release:', os.release());
```

### CPU Information

```javascript
const os = require('os');

// CPU information
const cpus = os.cpus();
console.log('CPU count:', cpus.length);
console.log('CPU model:', cpus[0].model);
console.log('CPU speed:', cpus[0].speed, 'MHz');

// Load average (Unix only)
const loadAvg = os.loadavg();
console.log('Load average:', loadAvg);
```

### Memory Information

```javascript
const os = require('os');

console.log('Total memory:', os.totalmem(), 'bytes');
console.log('Free memory:', os.freemem(), 'bytes');
console.log('Used memory:', os.totalmem() - os.freemem(), 'bytes');

// In MB
console.log('Total memory:', Math.round(os.totalmem() / 1024 / 1024), 'MB');
console.log('Free memory:', Math.round(os.freemem() / 1024 / 1024), 'MB');
```

### Network Interfaces

```javascript
const os = require('os');

const interfaces = os.networkInterfaces();
console.log('Network interfaces:', interfaces);

// Get IP addresses
Object.keys(interfaces).forEach((name) => {
  interfaces[name].forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${name}: ${iface.address}`);
    }
  });
});
```

### User Information

```javascript
const os = require('os');

console.log('Home directory:', os.homedir());
console.log('Temp directory:', os.tmpdir());
console.log('User info:', os.userInfo());
```

### Path Separators

```javascript
const os = require('os');

console.log('Path separator:', os.platform() === 'win32' ? '\\' : '/');
console.log('EOL:', JSON.stringify(os.EOL)); // End of line
```

## Best Practices

1. **Handle process events** - Especially uncaught exceptions
2. **Use environment variables** - For configuration
3. **Check platform** - For cross-platform compatibility
4. **Monitor memory** - For long-running processes
5. **Graceful shutdown** - Handle SIGTERM/SIGINT
6. **Use os module** - For system information


# Child Processes and Clusters

## Child Processes

The `child_process` module allows you to spawn child processes and communicate with them.

### spawn()

Spawns a new process and returns a ChildProcess object.

```javascript
const { spawn } = require('child_process');

const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
```

### exec()

Executes a command in a shell and buffers the output.

```javascript
const { exec } = require('child_process');

exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
```

### execFile()

Similar to exec() but executes the file directly without a shell.

```javascript
const { execFile } = require('child_process');

execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

### fork()

Special case of spawn() for Node.js processes. Creates IPC channel.

```javascript
const { fork } = require('child_process');

const child = fork('child-script.js');

child.on('message', (msg) => {
  console.log('Message from child:', msg);
});

child.send({ hello: 'world' });
```

### Detached Processes

A detached process is a child process that continues running even after the parent process exits. This is useful for creating daemons or background services.

#### Basic Detached Process

```javascript
const { spawn } = require('child_process');

const child = spawn('node', ['long-running-script.js'], {
  detached: true,
  stdio: 'ignore' // Important: detach stdio
});

// Unref the child process so parent can exit
child.unref();

console.log('Parent process can exit, child continues running');
```

#### Detached Process with Output Redirection

```javascript
const { spawn } = require('child_process');
const fs = require('fs');

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./err.log', 'a');

const child = spawn('node', ['script.js'], {
  detached: true,
  stdio: ['ignore', out, err]
});

child.unref();
```

#### When to Use Detached

- **Background services**: Processes that should run independently
- **Daemons**: Long-running processes that survive parent exit
- **Task queues**: Background workers
- **Scheduled tasks**: Cron-like functionality

#### Important Notes

1. **stdio must be detached**: Set `stdio: 'ignore'` or redirect to files
2. **Call unref()**: Allows parent to exit independently
3. **Process group**: Detached process becomes leader of new process group
4. **No automatic cleanup**: Parent won't wait for detached child

```javascript
const { spawn } = require('child_process');

// Create detached process
const child = spawn('node', ['background-worker.js'], {
  detached: true,
  stdio: 'ignore'
});

// Detach from parent
child.unref();

// Parent can exit, child continues
process.exit(0); // Child still running
```

## Clusters

The `cluster` module allows you to create child processes that share server ports, enabling load balancing and better utilization of multi-core systems.

### Basic Cluster

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster || cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Workers can share any TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

## Load Balancing

### Round-Robin Scheduling

By default, Node.js uses round-robin scheduling to distribute incoming connections across workers.

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster || cluster.isPrimary) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // All workers share the same port
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Handled by worker ${process.pid}`);
  }).listen(8000);
}
```

**How Round-Robin Works:**
- Master process listens on the port
- Incoming connections are distributed to workers in rotation
- Worker 1, Worker 2, Worker 3, Worker 1, Worker 2... (round-robin)
- Ensures even distribution of load

### Sharing Server Ports

All workers share the same server port through the master process.

```javascript
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster || cluster.isPrimary) {
  // Master creates workers
  cluster.fork();
  cluster.fork();
} else {
  // Workers all listen on the same port
  // Master handles port sharing
  http.createServer((req, res) => {
    res.end(`Worker ${process.pid} handled request`);
  }).listen(3000); // All workers share port 3000
}
```

**Key Points:**
- Master process binds to the port
- Workers don't bind directly to the port
- Master distributes connections to workers
- Only one process needs to handle the port binding

### Worker Distribution

You can control how many workers to create and how they're distributed.

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  const numWorkers = os.cpus().length;
  
  console.log(`Creating ${numWorkers} workers`);
  
  // Create one worker per CPU core
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.id} (PID: ${worker.process.pid}) created`);
  }
  
  // Or create a specific number
  // for (let i = 0; i < 4; i++) {
  //   cluster.fork();
  // }
}
```

## Cluster Events

### Master Events

The master process can listen to various cluster events.

```javascript
const cluster = require('cluster');

if (cluster.isMaster || cluster.isPrimary) {
  // Worker forked
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.id} forked`);
  });
  
  // Worker online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.id} is online`);
  });
  
  // Worker exited
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} exited with code ${code}`);
    // Restart worker
    cluster.fork();
  });
  
  // Worker listening
  cluster.on('listening', (worker, address) => {
    console.log(`Worker ${worker.id} listening on ${address.address}:${address.port}`);
  });
  
  // Worker disconnected
  cluster.on('disconnect', (worker) => {
    console.log(`Worker ${worker.id} disconnected`);
  });
  
  // Worker message
  cluster.on('message', (worker, message, handle) => {
    console.log(`Message from worker ${worker.id}:`, message);
  });
}
```

### Worker Events

Workers can listen to events from the master.

```javascript
const cluster = require('cluster');

if (!cluster.isMaster && !cluster.isPrimary) {
  // Worker process
  
  // Listen for messages from master
  process.on('message', (message) => {
    console.log('Worker received:', message);
    
    // Send message back to master
    process.send({ worker: process.pid, response: 'Hello from worker' });
  });
  
  // Handle disconnect
  process.on('disconnect', () => {
    console.log('Worker disconnected from master');
  });
}
```

### Communication Between Master and Workers

```javascript
const cluster = require('cluster');

if (cluster.isMaster || cluster.isPrimary) {
  const worker = cluster.fork();
  
  // Send message to worker
  worker.send({ command: 'start', data: 'some data' });
  
  // Receive message from worker
  worker.on('message', (msg) => {
    console.log('Master received:', msg);
  });
} else {
  // Worker process
  process.on('message', (msg) => {
    console.log('Worker received:', msg);
    
    // Process and respond
    if (msg.command === 'start') {
      process.send({ status: 'started', data: msg.data });
    }
  });
}
```

## Use Cases

### Multi-Core Utilization

Clusters allow you to utilize all CPU cores effectively.

```javascript
const cluster = require('cluster');
const os = require('os');
const http = require('http');

if (cluster.isMaster || cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} starting ${numCPUs} workers`);
  
  // Create worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Each worker handles requests on a different CPU core
  http.createServer((req, res) => {
    // CPU-intensive work distributed across cores
    res.end(`Worker ${process.pid} on core`);
  }).listen(8000);
}
```

**Benefits:**
- Utilizes all available CPU cores
- Better performance for CPU-intensive tasks
- Parallel request processing

### High Availability

Clusters provide high availability by automatically restarting failed workers.

```javascript
const cluster = require('cluster');

if (cluster.isMaster || cluster.isPrimary) {
  cluster.fork();
  cluster.fork();
  
  // Automatic restart on worker failure
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Restarting worker...');
    
    // Restart worker
    const newWorker = cluster.fork();
    console.log(`New worker ${newWorker.process.pid} started`);
  });
}
```

**Features:**
- Automatic worker restart on failure
- Zero-downtime deployments
- Graceful shutdown handling
- Health monitoring

### Performance Scaling

Clusters enable horizontal scaling within a single machine.

```javascript
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster || cluster.isPrimary) {
  // Scale based on load
  const numWorkers = process.env.WORKERS || require('os').cpus().length;
  
  console.log(`Scaling to ${numWorkers} workers`);
  
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  
  // Dynamic scaling based on metrics
  setInterval(() => {
    const activeWorkers = Object.keys(cluster.workers).length;
    // Add or remove workers based on load
  }, 5000);
} else {
  http.createServer((req, res) => {
    res.end(`Worker ${process.pid}`);
  }).listen(8000);
}
```

**Scaling Benefits:**
- Handle more concurrent requests
- Better throughput
- Load distribution
- Resource optimization

## Process Options

### Common Options

```javascript
const { spawn } = require('child_process');

const child = spawn('node', ['script.js'], {
  cwd: '/path/to/working/directory',
  env: { NODE_ENV: 'production' },
  stdio: 'inherit',
  detached: false
});
```

### Option: detached

When `detached: true`, the child process becomes the leader of a new process group and can continue running after the parent exits.

**Key Points:**
- Child process runs independently
- Parent can exit without waiting for child
- Must call `child.unref()` to allow parent to exit
- `stdio` should be 'ignore' or redirected to files
- Useful for daemons and background services

```javascript
const { spawn } = require('child_process');

const child = spawn('node', ['daemon.js'], {
  detached: true,
  stdio: 'ignore'
});

child.unref(); // Allow parent to exit
```

### Option: cwd

Sets the working directory for the child process.

```javascript
const child = spawn('ls', ['-la'], {
  cwd: '/tmp'
});
```

### Option: env

Sets environment variables for the child process.

```javascript
const child = spawn('node', ['script.js'], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    CUSTOM_VAR: 'value'
  }
});
```

### Option: stdio

Controls the child process's stdio configuration.

```javascript
// 'inherit' - Use parent's stdio
spawn('node', ['script.js'], { stdio: 'inherit' });

// 'ignore' - Ignore stdio (for detached processes)
spawn('node', ['script.js'], { stdio: 'ignore' });

// Redirect to files
const fs = require('fs');
const out = fs.openSync('out.log', 'a');
spawn('node', ['script.js'], {
  stdio: ['ignore', out, 'ignore']
});
```

## Best Practices

1. **Use spawn for long-running processes**
2. **Use exec for simple commands**
3. **Handle errors properly**
4. **Use detached for background services**
5. **Always redirect stdio for detached processes**
6. **Call unref() for detached processes**
7. **Use clusters for CPU-intensive tasks**
8. **Monitor worker processes**
9. **Handle worker crashes gracefully**


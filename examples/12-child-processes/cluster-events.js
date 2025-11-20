/**
 * Cluster Events Example
 * Demonstrates all cluster events (master and worker)
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  console.log('=== Cluster Events Example ===\n');
  console.log(`Master process ${process.pid} is running\n`);

  // ============================================
  // Master Events
  // ============================================

  // Event: 'fork' - When a worker is forked
  cluster.on('fork', (worker) => {
    console.log(`[Master Event] fork: Worker ${worker.id} (PID: ${worker.process.pid}) forked`);
  });

  // Event: 'online' - When worker is online and ready
  cluster.on('online', (worker) => {
    console.log(`[Master Event] online: Worker ${worker.id} is online and ready`);
  });

  // Event: 'listening' - When worker starts listening
  cluster.on('listening', (worker, address) => {
    console.log(`[Master Event] listening: Worker ${worker.id} listening on ${address.address}:${address.port}`);
  });

  // Event: 'disconnect' - When worker disconnects
  cluster.on('disconnect', (worker) => {
    console.log(`[Master Event] disconnect: Worker ${worker.id} disconnected`);
  });

  // Event: 'exit' - When worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Master Event] exit: Worker ${worker.id} (PID: ${worker.process.pid}) exited`);
    console.log(`  Exit code: ${code}, Signal: ${signal || 'none'}`);
    
    // Restart worker after a delay
    setTimeout(() => {
      console.log(`  Restarting worker ${worker.id}...`);
      cluster.fork();
    }, 1000);
  });

  // Event: 'message' - When worker sends message
  cluster.on('message', (worker, message, handle) => {
    console.log(`[Master Event] message: Received from worker ${worker.id}:`, message);
    
    // Respond to worker
    if (message.type === 'ping') {
      worker.send({ type: 'pong', timestamp: Date.now() });
    }
  });

  // Event: 'setup' - When cluster.setupMaster() is called
  cluster.on('setup', (settings) => {
    console.log('[Master Event] setup: Cluster settings configured');
  });

  // Create workers
  console.log('Creating workers...\n');
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }

  // Send periodic messages to workers
  setInterval(() => {
    Object.keys(cluster.workers).forEach(id => {
      const worker = cluster.workers[id];
      worker.send({ type: 'heartbeat', time: Date.now() });
    });
  }, 5000);

  // Simulate worker crash after 10 seconds
  setTimeout(() => {
    console.log('\n[Test] Simulating worker crash...');
    const firstWorker = cluster.workers[Object.keys(cluster.workers)[0]];
    if (firstWorker) {
      firstWorker.kill();
    }
  }, 10000);

} else {
  // ============================================
  // Worker Process
  // ============================================

  console.log(`Worker ${cluster.worker.id} (PID: ${process.pid}) started`);

  // Worker events
  cluster.worker.on('message', (message) => {
    console.log(`[Worker ${cluster.worker.id}] Received message:`, message);
    
    // Respond to heartbeat
    if (message.type === 'heartbeat') {
      process.send({ type: 'pong', workerId: cluster.worker.id });
    }
  });

  cluster.worker.on('disconnect', () => {
    console.log(`[Worker ${cluster.worker.id}] Disconnected from master`);
  });

  cluster.worker.on('error', (error) => {
    console.error(`[Worker ${cluster.worker.id}] Error:`, error);
  });

  // Process events
  process.on('message', (message) => {
    console.log(`[Worker ${cluster.worker.id}] Process message:`, message);
    
    // Send ping to master
    if (message.type === 'heartbeat') {
      process.send({ type: 'ping', workerId: cluster.worker.id });
    }
  });

  process.on('disconnect', () => {
    console.log(`[Worker ${cluster.worker.id}] Process disconnected`);
  });

  // Create HTTP server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Worker ${cluster.worker.id} (PID: ${process.pid}) handled request\n`);
    
    // Notify master
    process.send({ type: 'request', workerId: cluster.worker.id });
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`[Worker ${cluster.worker.id}] Server listening on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`[Worker ${cluster.worker.id}] Received SIGTERM`);
    server.close(() => {
      process.exit(0);
    });
  });
}

// Handle master shutdown
if (cluster.isMaster || cluster.isPrimary) {
  process.on('SIGINT', () => {
    console.log('\n\nShutting down cluster...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
}


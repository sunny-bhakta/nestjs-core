/**
 * Cluster Example
 * Run this and make multiple requests to see different worker PIDs
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  console.log('=== Cluster Example ===\n');
  console.log(`Master process ${process.pid} is running`);
  console.log(`CPU cores: ${os.cpus().length}\n`);

  // Fork workers
  const numWorkers = os.cpus().length;
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`\nWorker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork();
  });

  // Handle messages from workers
  Object.keys(cluster.workers).forEach((id) => {
    cluster.workers[id].on('message', (msg) => {
      console.log(`Message from worker ${id}:`, msg);
    });
  });

} else {
  // Worker processes
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from worker ${process.pid}\n`);
    
    // Send message to master
    if (process.send) {
      process.send({ worker: process.pid, url: req.url });
    }
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} received SIGTERM`);
    server.close(() => {
      process.exit(0);
    });
  });
}

// Handle master shutdown
if (cluster.isMaster || cluster.isPrimary) {
  process.on('SIGINT', () => {
    console.log('\nShutting down cluster...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });
}


/**
 * Cluster Load Balancing Example
 * Demonstrates round-robin scheduling and port sharing
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  console.log('=== Cluster Load Balancing Example ===\n');
  console.log(`Master process ${process.pid} is running`);
  console.log(`CPU cores available: ${os.cpus().length}\n`);

  // Create workers (one per CPU core)
  const numWorkers = os.cpus().length;
  console.log(`Creating ${numWorkers} workers for load balancing...\n`);

  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.id} (PID: ${worker.process.pid}) created`);
  }

  // Track request distribution
  const requestCounts = {};
  
  // Monitor worker messages
  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      const workerId = worker.id;
      requestCounts[workerId] = (requestCounts[workerId] || 0) + 1;
      
      console.log(`Worker ${workerId} handled request #${requestCounts[workerId]}`);
    }
  });

  // Display load distribution
  setInterval(() => {
    console.log('\n=== Load Distribution ===');
    Object.keys(cluster.workers).forEach(id => {
      const count = requestCounts[id] || 0;
      console.log(`Worker ${id}: ${count} requests`);
    });
  }, 10000);

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`\nWorker ${worker.id} (PID: ${worker.process.pid}) died`);
    console.log('Restarting worker...');
    const newWorker = cluster.fork();
    console.log(`New worker ${newWorker.id} (PID: ${newWorker.process.pid}) started`);
  });

  console.log('\nServer is ready. Make multiple requests to see load balancing.');
  console.log('Try: curl http://localhost:3000 (multiple times)');
  console.log('\nPress Ctrl+C to stop\n');

} else {
  // Worker processes
  let requestCount = 0;

  // All workers share the same port (3000)
  // Master handles port binding and distributes connections
  const server = http.createServer((req, res) => {
    requestCount++;
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Request handled by Worker ${cluster.worker.id} (PID: ${process.pid})\n` +
            `This worker has handled ${requestCount} requests\n` +
            `Round-robin load balancing in action!\n`);
    
    // Notify master
    if (process.send) {
      process.send({ type: 'request', workerId: cluster.worker.id });
    }
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${cluster.worker.id} (PID: ${process.pid}) listening on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`Worker ${cluster.worker.id} received SIGTERM`);
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
      console.log('Cluster shut down');
      process.exit(0);
    }, 1000);
  });
}


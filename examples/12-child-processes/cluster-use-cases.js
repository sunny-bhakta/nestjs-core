/**
 * Cluster Use Cases Example
 * Demonstrates: Multi-core utilization, High availability, Performance scaling
 */

const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster || cluster.isPrimary) {
  console.log('=== Cluster Use Cases Example ===\n');
  console.log(`Master process ${process.pid}`);
  console.log(`CPU cores: ${os.cpus().length}\n`);

  // ============================================
  // Use Case 1: Multi-Core Utilization
  // ============================================
  console.log('1. Multi-Core Utilization:');
  console.log('   Creating one worker per CPU core to utilize all cores\n');

  const numCPUs = os.cpus().length;
  const workers = {};

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ WORKER_ID: i });
    workers[worker.id] = worker;
    console.log(`   Worker ${worker.id} (PID: ${worker.process.pid}) assigned to core`);
  }

  // ============================================
  // Use Case 2: High Availability
  // ============================================
  console.log('\n2. High Availability:');
  console.log('   Automatic worker restart on failure\n');

  cluster.on('exit', (worker, code, signal) => {
    console.log(`   Worker ${worker.id} (PID: ${worker.process.pid}) died`);
    console.log(`   Exit code: ${code}, Signal: ${signal || 'none'}`);
    console.log('   Restarting worker for high availability...\n');

    // Restart worker
    const newWorker = cluster.fork();
    workers[newWorker.id] = newWorker;
    console.log(`   New worker ${newWorker.id} (PID: ${newWorker.process.pid}) started\n`);
  });

  // Monitor worker health
  setInterval(() => {
    const activeWorkers = Object.keys(cluster.workers).length;
    console.log(`[Health Check] Active workers: ${activeWorkers}/${numCPUs}`);
  }, 5000);

  // ============================================
  // Use Case 3: Performance Scaling
  // ============================================
  console.log('3. Performance Scaling:');
  console.log('   Load distribution across workers\n');

  const requestStats = {};
  let totalRequests = 0;

  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      totalRequests++;
      requestStats[worker.id] = (requestStats[worker.id] || 0) + 1;
    }
  });

  // Display performance metrics
  setInterval(() => {
    console.log('\n=== Performance Metrics ===');
    console.log(`Total requests: ${totalRequests}`);
    console.log('Requests per worker:');
    Object.keys(cluster.workers).forEach(id => {
      const count = requestStats[id] || 0;
      const percentage = totalRequests > 0 ? ((count / totalRequests) * 100).toFixed(1) : 0;
      console.log(`  Worker ${id}: ${count} (${percentage}%)`);
    });
    console.log('');
  }, 10000);

  // Simulate load increase
  setTimeout(() => {
    console.log('\n[Scaling Test] Simulating increased load...');
    console.log('Workers will handle load distribution automatically\n');
  }, 3000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\nShutting down cluster gracefully...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGTERM');
    }
    setTimeout(() => {
      console.log('Cluster shut down');
      process.exit(0);
    }, 2000);
  });

} else {
  // Worker processes
  const workerId = cluster.worker.id;
  const workerPID = process.pid;
  let requestCount = 0;

  console.log(`Worker ${workerId} (PID: ${workerPID}) started`);

  // Simulate CPU-intensive work (distributed across cores)
  function processRequest() {
    // This work is distributed across CPU cores
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  }

  // HTTP server
  const server = http.createServer((req, res) => {
    requestCount++;
    
    // CPU-intensive work (utilizes multi-core)
    const result = processRequest();
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      worker: workerId,
      pid: workerPID,
      requests: requestCount,
      message: 'Request processed using multi-core CPU',
      cpuCore: `Core ${workerId}`
    }, null, 2) + '\n');

    // Notify master
    if (process.send) {
      process.send({ type: 'request', workerId: workerId });
    }
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${workerId} listening on port ${PORT} (shared port)`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`Worker ${workerId} received SIGTERM, shutting down gracefully...`);
    server.close(() => {
      console.log(`Worker ${workerId} closed server`);
      process.exit(0);
    });
  });

  // Send periodic status updates
  setInterval(() => {
    if (process.send) {
      process.send({
        type: 'status',
        workerId: workerId,
        requests: requestCount,
        uptime: process.uptime()
      });
    }
  }, 5000);
}


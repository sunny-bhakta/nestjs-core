/**
 * Basic HTTP Server Example
 */

const http = require('http');

console.log('=== Basic HTTP Server ===\n');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Set response headers
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'X-Custom-Header': 'Node.js Server'
  });
  
  // Send response
  res.end('Hello from Node.js HTTP Server!\n');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server\n');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Handle client connections
server.on('connection', (socket) => {
  console.log('New connection from:', socket.remoteAddress);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});


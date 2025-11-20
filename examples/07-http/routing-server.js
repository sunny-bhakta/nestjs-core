/**
 * HTTP Server with Routing
 */

const http = require('http');
const url = require('url');

console.log('=== HTTP Server with Routing ===\n');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  console.log(`${req.method} ${path}`);

  // Route handling
  if (path === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Home</title></head>
        <body>
          <h1>Welcome to Node.js Server</h1>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/api/data">API Data</a></li>
            <li><a href="/api/user?name=Alice&age=30">User API</a></li>
          </ul>
        </body>
      </html>
    `);
  } else if (path === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>About</title></head>
        <body>
          <h1>About Page</h1>
          <p>This is a Node.js HTTP server example.</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  } else if (path === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'API Data',
      timestamp: new Date().toISOString(),
      data: [1, 2, 3, 4, 5]
    }));
  } else if (path === '/api/user' && req.method === 'GET') {
    const name = query.name || 'Unknown';
    const age = query.age || 'N/A';
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: name,
      age: parseInt(age),
      query: query
    }));
  } else if (path === '/api/post' && req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          received: data,
          message: 'Data received successfully'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid JSON'
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>404</title></head>
        <body>
          <h1>404 Not Found</h1>
          <p>The requested resource was not found.</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('  GET  /');
  console.log('  GET  /about');
  console.log('  GET  /api/data');
  console.log('  GET  /api/user?name=Alice&age=30');
  console.log('  POST /api/post');
  console.log('\nPress Ctrl+C to stop the server\n');
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});


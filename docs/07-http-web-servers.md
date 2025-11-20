# HTTP and Web Servers

Node.js provides built-in modules for creating HTTP servers and making HTTP requests.

## Creating an HTTP Server

### Basic Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Request Object

The request object (`req`) contains information about the incoming request.

```javascript
const server = http.createServer((req, res) => {
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log('Pathname:', url.pathname);
  console.log('Query:', url.searchParams);
});
```

### Response Object

The response object (`res`) is used to send data back to the client.

```javascript
const server = http.createServer((req, res) => {
  // Set status code and headers
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Custom-Header': 'value'
  });
  
  // Send response
  res.end(JSON.stringify({ message: 'Hello' }));
});
```

## Handling Different Routes

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (path === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Page</h1>');
  } else if (path === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: 'API response' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000);
```

## Reading Request Body

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received data:', data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, received: data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

server.listen(3000);
```

## Making HTTP Requests

### GET Request

```javascript
const http = require('http');

const options = {
  hostname: 'api.example.com',
  port: 80,
  path: '/data',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();
```

### Using http.get()

```javascript
const http = require('http');

http.get('http://api.example.com/data', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
```

## HTTPS

```javascript
const https = require('https');

const options = {
  hostname: 'api.example.com',
  port: 443,
  path: '/data',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log(chunk.toString());
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();
```

## Server Events

```javascript
const server = http.createServer((req, res) => {
  res.end('Hello');
});

server.on('request', (req, res) => {
  console.log('Request received');
});

server.on('connection', (socket) => {
  console.log('New connection');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(3000);
```

## Best Practices

1. **Handle errors** - Always handle request errors
2. **Set proper headers** - Content-Type, CORS, etc.
3. **Validate input** - Check request data
4. **Use HTTPS** - For production, use HTTPS
5. **Handle timeouts** - Set request timeouts
6. **Parse URLs properly** - Use URL module
7. **Stream large responses** - Use streams for large data


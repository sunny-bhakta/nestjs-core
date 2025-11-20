/**
 * Express Routing Examples
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('=== Express Routing Examples ===\n');

// Example 1: Basic HTTP Methods
app.get('/example', (req, res) => {
  res.json({ method: 'GET', message: 'GET request' });
});

app.post('/example', (req, res) => {
  res.json({ method: 'POST', message: 'POST request', body: req.body });
});

app.put('/example', (req, res) => {
  res.json({ method: 'PUT', message: 'PUT request', body: req.body });
});

app.delete('/example', (req, res) => {
  res.json({ method: 'DELETE', message: 'DELETE request' });
});

app.patch('/example', (req, res) => {
  res.json({ method: 'PATCH', message: 'PATCH request', body: req.body });
});

// Example 2: Route Parameters
app.get('/users/:userId', (req, res) => {
  res.json({
    message: 'Single parameter',
    userId: req.params.userId
  });
});

app.get('/users/:userId/posts/:postId', (req, res) => {
  res.json({
    message: 'Multiple parameters',
    userId: req.params.userId,
    postId: req.params.postId,
    allParams: req.params
  });
});

// Example 3: Optional Parameters
app.get('/products/:id?', (req, res) => {
  const id = req.params.id || 'all';
  res.json({
    message: 'Optional parameter',
    productId: id
  });
});

// Example 4: Query Parameters
app.get('/search', (req, res) => {
  res.json({
    message: 'Query parameters',
    query: req.query.q,
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    allQuery: req.query
  });
});

// Example 5: Route Chaining with app.route()
app.route('/book')
  .get((req, res) => {
    res.json({ action: 'Get book', method: 'GET' });
  })
  .post((req, res) => {
    res.json({ action: 'Create book', method: 'POST', body: req.body });
  })
  .put((req, res) => {
    res.json({ action: 'Update book', method: 'PUT', body: req.body });
  })
  .delete((req, res) => {
    res.json({ action: 'Delete book', method: 'DELETE' });
  });

// Example 6: Multiple Route Handlers
app.get('/multi',
  (req, res, next) => {
    console.log('First handler');
    req.customData = 'Processed by first handler';
    next();
  },
  (req, res, next) => {
    console.log('Second handler');
    req.customData += ' and second handler';
    next();
  },
  (req, res) => {
    res.json({
      message: 'Multiple handlers',
      data: req.customData
    });
  }
);

// Example 7: All HTTP Methods
app.all('/all-methods', (req, res) => {
  res.json({
    message: 'Handles all HTTP methods',
    method: req.method,
    path: req.path
  });
});

// Example 8: Wildcard Routes
app.get('/files/*', (req, res) => {
  res.json({
    message: 'Wildcard route',
    path: req.params[0],
    fullPath: req.path
  });
});

// Example 9: Regular Expression Routes
app.get(/^\/user\/(\d+)$/, (req, res) => {
  res.json({
    message: 'Regex route',
    userId: req.params[0]
  });
});

// Example 10: 404 Handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('  GET    /example');
  console.log('  POST   /example');
  console.log('  PUT    /example');
  console.log('  DELETE /example');
  console.log('  GET    /users/:userId');
  console.log('  GET    /users/:userId/posts/:postId');
  console.log('  GET    /search?q=query&page=1');
  console.log('  GET    /book');
  console.log('  POST   /book');
  console.log('  GET    /multi');
  console.log('  *      /all-methods');
  console.log('  GET    /files/*');
  console.log('\nPress Ctrl+C to stop');
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});


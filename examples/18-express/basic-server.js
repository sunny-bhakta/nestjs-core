/**
 * Basic Express Server Example
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  res.json({
    message: `User ID: ${req.params.id}`,
    params: req.params
  });
});

// Route with query parameters
app.get('/search', (req, res) => {
  res.json({
    query: req.query.q,
    page: req.query.page || 1,
    allQuery: req.query
  });
});

// POST route
app.post('/users', express.json(), (req, res) => {
  res.status(201).json({
    message: 'User created',
    data: req.body
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log('\nTry these routes:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/users/123`);
  console.log(`  GET  http://localhost:${PORT}/search?q=nodejs&page=2`);
  console.log(`  POST http://localhost:${PORT}/users (with JSON body)`);
  console.log('\nPress Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  process.exit(0);
});


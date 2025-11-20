/**
 * RESTful API Example with Express
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

let nextId = 4;

console.log('=== RESTful API Example ===\n');

// GET /users - Get all users
app.get('/users', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredUsers = users;
  
  // Search filter
  if (search) {
    filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(start, end);
  
  res.json({
    data: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ data: user });
});

// POST /users - Create new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }
  
  // Check if email exists
  if (users.some(u => u.email === email)) {
    return res.status(409).json({
      error: 'Email already exists'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully',
    data: newUser
  });
});

// PUT /users/:id - Update user (full update)
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

// PATCH /users/:id - Update user (partial update)
app.patch('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`REST API server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET    /users              - Get all users');
  console.log('  GET    /users?page=1&limit=2&search=john');
  console.log('  GET    /users/:id          - Get user by ID');
  console.log('  POST   /users              - Create user');
  console.log('  PUT    /users/:id          - Update user (full)');
  console.log('  PATCH  /users/:id          - Update user (partial)');
  console.log('  DELETE /users/:id          - Delete user');
  console.log('\nExample requests:');
  console.log('  curl http://localhost:3000/users');
  console.log('  curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d \'{"name":"Alice","email":"alice@example.com"}\'');
  console.log('\nPress Ctrl+C to stop');
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});


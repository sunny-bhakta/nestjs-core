/**
 * Express Router Module Example
 * Demonstrates organizing routes using Router
 */

const express = require('express');
const app = express();

// Parse JSON
app.use(express.json());

// Create routers
const usersRouter = express.Router();
const postsRouter = express.Router();

// Users Router
usersRouter.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

usersRouter.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

usersRouter.post('/', (req, res) => {
  res.json({ message: 'Create user', body: req.body });
});

usersRouter.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id}`, body: req.body });
});

usersRouter.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id}` });
});

// Posts Router
postsRouter.get('/', (req, res) => {
  res.json({ message: 'Get all posts' });
});

postsRouter.get('/:id', (req, res) => {
  res.json({ message: `Get post ${req.params.id}` });
});

postsRouter.post('/', (req, res) => {
  res.json({ message: 'Create post', body: req.body });
});

// Mount routers
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'API Root',
    endpoints: {
      users: '/users',
      posts: '/posts'
    }
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('  GET    /');
  console.log('  GET    /users');
  console.log('  GET    /users/:id');
  console.log('  POST   /users');
  console.log('  PUT    /users/:id');
  console.log('  DELETE /users/:id');
  console.log('  GET    /posts');
  console.log('  GET    /posts/:id');
  console.log('  POST   /posts');
  console.log('\nPress Ctrl+C to stop');
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});


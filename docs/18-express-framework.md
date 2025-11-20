# Express.js Framework

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.

## What is Express?

Express is a fast, unopinionated, minimalist web framework for Node.js. It provides:
- Simple routing
- Middleware support
- Template engine integration
- Static file serving
- HTTP utility methods

## Installation

```bash
npm install express
```

## Basic Server Setup

### Minimal Example

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### With Express Generator

```bash
npx express-generator myapp
cd myapp
npm install
npm start
```

## Routing

### Basic Routes

```javascript
const express = require('express');
const app = express();

// GET route
app.get('/', (req, res) => {
  res.send('GET request to homepage');
});

// POST route
app.post('/', (req, res) => {
  res.send('POST request to homepage');
});

// PUT route
app.put('/user', (req, res) => {
  res.send('PUT request to /user');
});

// DELETE route
app.delete('/user', (req, res) => {
  res.send('DELETE request to /user');
});

// All HTTP methods
app.all('/secret', (req, res) => {
  res.send('Accessing secret area');
});
```

### Route Parameters

```javascript
// Single parameter
app.get('/users/:userId', (req, res) => {
  res.send(`User ID: ${req.params.userId}`);
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  res.json({
    userId: req.params.userId,
    postId: req.params.postId
  });
});

// Optional parameters
app.get('/users/:userId?', (req, res) => {
  const userId = req.params.userId || 'all';
  res.send(`User: ${userId}`);
});
```

### Query Parameters

```javascript
app.get('/search', (req, res) => {
  const query = req.query.q;
  const page = req.query.page || 1;
  res.json({
    query: query,
    page: page
  });
});

// URL: /search?q=nodejs&page=2
```

### Route Handlers

```javascript
// Single handler
app.get('/example', (req, res) => {
  res.send('Single handler');
});

// Multiple handlers
app.get('/example',
  (req, res, next) => {
    console.log('First handler');
    next();
  },
  (req, res) => {
    res.send('Second handler');
  }
);

// Array of handlers
const handlers = [
  (req, res, next) => {
    console.log('Handler 1');
    next();
  },
  (req, res, next) => {
    console.log('Handler 2');
    next();
  },
  (req, res) => {
    res.send('Handler 3');
  }
];
app.get('/example', handlers);
```

### Route Methods

```javascript
// app.route() for chaining
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update the book');
  });
```

### Router Module

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users list');
});

router.get('/:id', (req, res) => {
  res.send(`User ${req.params.id}`);
});

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

## Middleware

Middleware functions have access to the request object (req), response object (res), and the next middleware function.

### Basic Middleware

```javascript
const myMiddleware = (req, res, next) => {
  console.log('Middleware executed');
  next(); // Pass control to next middleware
};

app.use(myMiddleware);
```

### Application-Level Middleware

```javascript
// Execute for all routes
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Execute for specific path
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});
```

### Router-Level Middleware

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});
```

### Error-Handling Middleware

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Built-in Middleware

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Parse cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

### Third-Party Middleware

```javascript
// CORS
const cors = require('cors');
app.use(cors());

// Helmet (security)
const helmet = require('helmet');
app.use(helmet());

// Morgan (logging)
const morgan = require('morgan');
app.use(morgan('combined'));

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

## Request Object

The `req` object represents the HTTP request.

### Request Properties

```javascript
app.get('/example', (req, res) => {
  // Request properties
  console.log(req.method);      // HTTP method
  console.log(req.url);         // URL path
  console.log(req.path);        // Path portion
  console.log(req.query);       // Query string parameters
  console.log(req.params);      // Route parameters
  console.log(req.headers);     // Request headers
  console.log(req.body);        // Request body (if parsed)
  console.log(req.cookies);     // Cookies (if parsed)
  console.log(req.ip);          // Client IP
  console.log(req.hostname);    // Hostname
  console.log(req.protocol);    // Protocol (http/https)
});
```

### Request Methods

```javascript
app.post('/example', (req, res) => {
  // Check content type
  req.is('json');           // Check if JSON
  req.is('application/json');
  
  // Get header
  req.get('Content-Type');
  
  // Check if request is secure
  req.secure;
  
  // Get base URL
  req.baseUrl;
  
  // Get original URL
  req.originalUrl;
});
```

## Response Object

The `res` object represents the HTTP response.

### Sending Responses

```javascript
// Send text
res.send('Hello World');

// Send JSON
res.json({ message: 'Hello' });

// Send status code
res.status(404).send('Not Found');

// Send file
res.sendFile('/path/to/file.html');

// Download file
res.download('/path/to/file.pdf');

// Redirect
res.redirect('/new-path');
res.redirect(301, '/new-path');
```

### Response Methods

```javascript
app.get('/example', (req, res) => {
  // Set header
  res.set('Content-Type', 'text/plain');
  res.set({
    'Content-Type': 'text/plain',
    'Content-Length': '123'
  });
  
  // Set status
  res.status(200);
  
  // Set cookie
  res.cookie('name', 'value', { maxAge: 900000 });
  
  // Clear cookie
  res.clearCookie('name');
  
  // Set content type
  res.type('json');
  res.type('html');
  
  // End response
  res.end();
  
  // Send response
  res.send('Response');
});
```

## Template Engines

### EJS (Embedded JavaScript)

```javascript
// Install: npm install ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    users: ['John', 'Jane', 'Bob']
  });
});
```

```html
<!-- views/index.ejs -->
<h1><%= title %></h1>
<ul>
  <% users.forEach(user => { %>
    <li><%= user %></li>
  <% }); %>
</ul>
```

### Handlebars

```javascript
// Install: npm install express-handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});
```

### Pug (Jade)

```javascript
// Install: npm install pug
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});
```

```pug
// views/index.pug
html
  head
    title= title
  body
    h1 Welcome
```

## Static Files

```javascript
// Serve static files from 'public' directory
app.use(express.static('public'));

// Multiple static directories
app.use(express.static('public'));
app.use(express.static('files'));

// Virtual path prefix
app.use('/static', express.static('public'));
// Files accessible at /static/style.css

// Options
app.use(express.static('public', {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, path) => {
    res.set('X-Custom-Header', 'value');
  }
}));
```

## Error Handling

### Basic Error Handling

```javascript
app.get('/error', (req, res, next) => {
  const err = new Error('Something went wrong');
  err.status = 500;
  next(err);
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status
    }
  });
});
```

### Async Error Handling

```javascript
// Wrap async route handlers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.get('/async', asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));
```

## Best Practices

### Project Structure

```
project/
├── routes/
│   ├── index.js
│   ├── users.js
│   └── posts.js
├── controllers/
│   ├── userController.js
│   └── postController.js
├── models/
│   ├── User.js
│   └── Post.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   └── index.ejs
├── app.js
└── server.js
```

### Environment Variables

```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} on port ${PORT}`);
});
```

### Security Best Practices

```javascript
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Input validation
const { body, validationResult } = require('express-validator');
app.post('/user',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

### Logging

```javascript
const morgan = require('morgan');

// Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production
app.use(morgan('combined'));
```

### CORS

```javascript
const cors = require('cors');

// Enable all CORS requests
app.use(cors());

// Configure CORS
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

## Common Patterns

### RESTful API

```javascript
// GET /users - Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  res.json(user);
});

// POST /users - Create user
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

// PUT /users/:id - Update user
app.put('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.status(204).send();
});
```

### Authentication Middleware

```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token
  req.user = { id: 1, name: 'John' };
  next();
};

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
```

## Summary

Express.js provides:
- **Simple routing** - Easy route definition
- **Middleware** - Powerful request processing
- **Template engines** - Server-side rendering
- **Static files** - Easy file serving
- **Error handling** - Built-in error handling
- **Extensibility** - Large ecosystem

Express is the foundation for many Node.js web applications and APIs.


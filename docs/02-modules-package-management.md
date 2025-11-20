# Modules and Package Management

## CommonJS Modules

CommonJS is the original module system in Node.js. It uses `require()` to import modules and `module.exports` or `exports` to export functionality.

### Exporting from a Module

```javascript
// math.js - Exporting individual functions
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// Or using module.exports
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

// Or export a single function
module.exports = (a, b) => a + b;
```

### Importing a Module

```javascript
// Import entire module
const math = require('./math');
console.log(math.add(2, 3)); // 5

// Import built-in module
const fs = require('fs');
const path = require('path');

// Import from node_modules
const express = require('express');
```

### Module Caching

Modules are cached after the first require. Subsequent requires return the cached version.

```javascript
// module.js
let count = 0;
module.exports = {
  increment: () => ++count,
  getCount: () => count
};

// app.js
const mod1 = require('./module');
const mod2 = require('./module'); // Same instance

mod1.increment();
console.log(mod2.getCount()); // 1 (shared state)
```

## ES6 Modules (ESM)

ES6 modules use `import` and `export` statements. To use ES modules, either:
1. Use `.mjs` extension, or
2. Add `"type": "module"` to `package.json`

### Exporting (ES Modules)

```javascript
// math.mjs
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Default export
export default {
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};
```

### Importing (ES Modules)

```javascript
// app.mjs
import { add, subtract } from './math.mjs';
import math from './math.mjs'; // default import

console.log(add(2, 3)); // 5
console.log(math.multiply(4, 5)); // 20

// Dynamic import
const module = await import('./math.mjs');
```

## Built-in Modules

Node.js comes with many built-in modules. Here are the most commonly used:

### File System (`fs`)

```javascript
const fs = require('fs');

// Read file
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### Path (`path`)

```javascript
const path = require('path');

const filePath = path.join(__dirname, 'data', 'file.txt');
const ext = path.extname(filePath); // '.txt'
const basename = path.basename(filePath); // 'file.txt'
```

### HTTP (`http`)

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000);
```

### URL (`url`)

```javascript
const url = require('url');

const myUrl = new URL('https://example.com/path?query=value');
console.log(myUrl.hostname); // 'example.com'
console.log(myUrl.pathname); // '/path'
console.log(myUrl.searchParams.get('query')); // 'value'
```

## Package Management with npm

### package.json

The `package.json` file defines your project's dependencies and scripts.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
```

### npm Commands

```bash
# Initialize a new project
npm init

# Install a package
npm install express
npm install express --save
npm install nodemon --save-dev

# Install all dependencies
npm install

# Run scripts
npm start
npm run dev
npm test

# Update packages
npm update

# Uninstall package
npm uninstall express
```

### Semantic Versioning

- `^4.18.0` - Compatible with 4.x.x (caret)
- `~4.18.0` - Compatible with 4.18.x (tilde)
- `4.18.0` - Exact version
- `*` - Latest version

## Module Resolution

Node.js resolves modules in this order:

1. Core modules (built-in)
2. Local files (relative paths: `./`, `../`)
3. `node_modules` directory (current and parent directories)
4. Global modules (if installed with `-g`)

### Example Module Structure

```
project/
├── node_modules/
│   └── express/
├── src/
│   ├── utils/
│   │   └── helper.js
│   └── app.js
├── package.json
└── index.js
```

```javascript
// index.js
const express = require('express'); // from node_modules
const helper = require('./src/utils/helper'); // local file
const fs = require('fs'); // built-in module
```


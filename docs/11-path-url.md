# Path and URL Modules

## Path Module

The `path` module provides utilities for working with file and directory paths.

### Joining Paths

```javascript
const path = require('path');

// Join paths (handles separators automatically)
const fullPath = path.join('/users', 'john', 'documents', 'file.txt');
console.log(fullPath); // '/users/john/documents/file.txt' (Unix)
                      // '\\users\\john\\documents\\file.txt' (Windows)
```

### Resolving Paths

```javascript
const path = require('path');

// Resolve to absolute path
const absolute = path.resolve('file.txt');
console.log(absolute); // Full absolute path

// Resolve with multiple segments
const resolved = path.resolve('users', 'john', 'file.txt');
console.log(resolved);
```

### Path Components

```javascript
const path = require('path');
const filePath = '/users/john/documents/file.txt';

// Get components
console.log(path.dirname(filePath));  // '/users/john/documents'
console.log(path.basename(filePath)); // 'file.txt'
console.log(path.extname(filePath));  // '.txt'
console.log(path.basename(filePath, '.txt')); // 'file'
```

### Parsing Paths

```javascript
const path = require('path');
const filePath = '/users/john/documents/file.txt';

const parsed = path.parse(filePath);
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/john/documents',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

### Formatting Paths

```javascript
const path = require('path');

const parsed = {
  root: '/',
  dir: '/users/john',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
};

const formatted = path.format(parsed);
console.log(formatted); // '/users/john/file.txt'
```

### Normalizing Paths

```javascript
const path = require('path');

// Normalize path (remove . and ..)
const normalized = path.normalize('/users/../john/./documents/file.txt');
console.log(normalized); // '/john/documents/file.txt'
```

### Platform-Specific

```javascript
const path = require('path');

// Check if absolute
console.log(path.isAbsolute('/users/file.txt')); // true (Unix)
console.log(path.isAbsolute('C:\\users\\file.txt')); // true (Windows)
console.log(path.isAbsolute('file.txt')); // false

// Get delimiter and separator
console.log(path.delimiter); // ';' (Windows) or ':' (Unix)
console.log(path.sep); // '\\' (Windows) or '/' (Unix)
```

## URL Module

The `url` module provides utilities for URL resolution and parsing.

### Parsing URLs

```javascript
const url = require('url');

// Parse URL
const myUrl = new URL('https://example.com:8080/path/to/page?query=value#hash');
console.log(myUrl.href);        // Full URL
console.log(myUrl.protocol);    // 'https:'
console.log(myUrl.hostname);    // 'example.com'
console.log(myUrl.port);        // '8080'
console.log(myUrl.pathname);    // '/path/to/page'
console.log(myUrl.search);      // '?query=value'
console.log(myUrl.hash);        // '#hash'
```

### Query Parameters

```javascript
const url = require('url');

const myUrl = new URL('https://example.com?name=John&age=30&city=NYC');

// Get query parameters
console.log(myUrl.searchParams.get('name')); // 'John'
console.log(myUrl.searchParams.get('age'));  // '30'

// Check if parameter exists
console.log(myUrl.searchParams.has('name')); // true

// Get all values
console.log(myUrl.searchParams.getAll('tag')); // []

// Set parameter
myUrl.searchParams.set('name', 'Jane');
console.log(myUrl.href); // Updated URL

// Append parameter
myUrl.searchParams.append('tag', 'nodejs');
myUrl.searchParams.append('tag', 'javascript');

// Delete parameter
myUrl.searchParams.delete('age');

// Iterate
myUrl.searchParams.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
```

### URL Resolution

```javascript
const url = require('url');

// Resolve relative URL
const base = 'https://example.com/path/';
const relative = '../other/page.html';
const resolved = new URL(relative, base);
console.log(resolved.href); // 'https://example.com/other/page.html'
```

### Legacy url.parse()

```javascript
const url = require('url');

// Legacy parse (still available)
const parsed = url.parse('https://example.com/path?query=value', true);
console.log(parsed.hostname); // 'example.com'
console.log(parsed.query);    // { query: 'value' } (if true passed)
```

## Best Practices

1. **Use path.join()** - For cross-platform compatibility
2. **Use path.resolve()** - For absolute paths
3. **Use URL class** - Instead of legacy url.parse()
4. **Handle query parameters** - Use URLSearchParams
5. **Normalize paths** - Before using them
6. **Check platform** - When needed for path operations


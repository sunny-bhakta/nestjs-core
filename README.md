# Node.js Core Concepts

This repository contains comprehensive documentation and working code examples of essential Node.js concepts that every developer should understand.

## 📚 Documentation and Examples

All concepts include detailed documentation and working code examples:

- **[📖 Documentation](./docs/)** - Detailed explanations for each concept
- **[💻 Code Examples](./examples/)** - Working code examples you can run

## Table of Contents

1. [Core Fundamentals](#core-fundamentals)
2. [Modules and Package Management](#modules-and-package-management)
3. [File System Operations](#file-system-operations)
4. [Asynchronous Programming](#asynchronous-programming)
5. [Streams](#streams)
6. [Events and Event Emitter](#events-and-event-emitter)
7. [HTTP and Web Servers](#http-and-web-servers)
8. [Buffers](#buffers)
9. [Process and OS](#process-and-os)
10. [Error Handling](#error-handling)
11. [Child Processes](#child-processes)
12. [Clusters](#clusters)
13. [Path Module](#path-module)
14. [URL Module](#url-module)
15. [Crypto Module](#crypto-module)
16. [Timers](#timers)
17. [Utilities](#utilities)
18. [Best Practices](#best-practices)

---

## Core Fundamentals

**📖 [Full Documentation](./docs/01-core-fundamentals.md)** | **💻 [Examples](./examples/01-core-fundamentals.js)** | **🏗️ [Architecture Demo](./examples/01-architecture-demo.js)**

### 1. What is Node.js?
- JavaScript runtime built on Chrome's V8 engine
- Event-driven, non-blocking I/O model
- Single-threaded with event loop
- Package ecosystem (npm)

### 2. Node.js Architecture
- V8 JavaScript Engine
- Node.js Bindings (libuv)
- Event Loop
- Thread Pool
- Callback Queue

### 3. Global Objects
- `global` / `globalThis`
- `process`
- `console`
- `Buffer`
- `__dirname` (CommonJS)
- `__filename` (CommonJS)
- `module`
- `exports`
- `require`

### 4. Node.js vs Browser JavaScript
- No `window` object
- No `document` object
- Access to file system
- Server-side capabilities
- Different module system

---

## Modules and Package Management

**📖 [Full Documentation](./docs/02-modules-package-management.md)** | **💻 [Examples](./examples/02-modules/)**

### 1. CommonJS Modules
- `require()` function
- `module.exports`
- `exports` object
- Module caching
- Module resolution

### 2. ES6 Modules (ESM)
- `import` / `export` statements
- `.mjs` extension
- `"type": "module"` in package.json
- Dynamic imports

### 3. Built-in Modules
- `fs` - File System
- `http` / `https` - HTTP/HTTPS
- `path` - Path utilities
- `url` - URL parsing
- `crypto` - Cryptographic functions
- `os` - Operating system utilities
- `events` - Event emitter
- `stream` - Streams
- `util` - Utility functions
- `buffer` - Binary data
- `child_process` - Child processes
- `cluster` - Clustering
- `net` - Network
- `dns` - DNS
- `zlib` - Compression
- `readline` - Readline interface

### 4. npm (Node Package Manager)
- `package.json`
- `package-lock.json`
- Installing packages
- Semantic versioning
- npm scripts
- npm registry
- Private packages

### 5. Module Patterns
- Exporting functions
- Exporting objects
- Exporting classes
- Default exports
- Named exports

---

## File System Operations

**📖 [Full Documentation](./docs/03-file-system-operations.md)** | **💻 [Examples](./examples/03-file-system/)**

### 1. Synchronous Operations
- `fs.readFileSync()`
- `fs.writeFileSync()`
- `fs.mkdirSync()`
- `fs.unlinkSync()`
- `fs.statSync()`

### 2. Asynchronous Operations
- `fs.readFile()`
- `fs.writeFile()`
- `fs.mkdir()`
- `fs.unlink()`
- `fs.stat()`
- Callback pattern

### 3. Promise-based Operations
- `fs.promises.readFile()`
- `fs.promises.writeFile()`
- `fs.promises.mkdir()`
- Using async/await

### 4. File Operations
- Reading files
- Writing files
- Appending to files
- Deleting files
- Renaming files
- Copying files

### 5. Directory Operations
- Creating directories
- Reading directories
- Removing directories
- Directory traversal

### 6. File Watching
- `fs.watch()`
- `fs.watchFile()`
- File system events

---

## Asynchronous Programming

**📖 [Full Documentation](./docs/04-asynchronous-programming.md)** | **💻 [Examples](./examples/04-asynchronous/)** | **🔄 [Event Loop Deep Dive](./docs/17-event-loop.md)**

### 1. Callbacks
- Callback pattern
- Callback hell
- Error-first callbacks
- Nested callbacks

### 2. Promises
- Creating promises
- `.then()` / `.catch()`
- Promise chaining
- `Promise.all()`
- `Promise.race()`
- `Promise.allSettled()`
- `Promise.any()`

### 3. Async/Await
- `async` functions
- `await` keyword
- Error handling with try/catch
- Sequential vs parallel execution

### 4. Event Loop
- Call stack
- Callback queue (Macrotask queue)
- Microtask queue
- Process.nextTick() queue
- Execution order and priority
- **📖 [Detailed Event Loop Guide](./docs/17-event-loop.md)**

### 5. Event Loop Phases
- **Phase 1: Timers** - setTimeout, setInterval callbacks
- **Phase 2: Pending Callbacks** - Deferred I/O callbacks
- **Phase 3: Idle, Prepare** - Internal use
- **Phase 4: Poll** - Fetch I/O events, execute I/O callbacks
- **Phase 5: Check** - setImmediate() callbacks
- **Phase 6: Close Callbacks** - Close event callbacks
- **💻 [Phase Examples](./examples/04-asynchronous/event-loop-phases.js)**

---

## Streams

**📖 [Full Documentation](./docs/05-streams.md)** | **💻 [Examples](./examples/05-streams/)**

### 1. Stream Types
- Readable streams
- Writable streams
- Duplex streams
- Transform streams

### 2. Readable Streams
- `fs.createReadStream()`
- `stream.Readable`
- Reading data
- Piping
- Events: `data`, `end`, `error`

### 3. Writable Streams
- `fs.createWriteStream()`
- `stream.Writable`
- Writing data
- Events: `drain`, `finish`, `error`

### 4. Piping
- `pipe()` method
- Chaining pipes
- Error handling in pipes

### 5. Transform Streams
- `stream.Transform`
- Data transformation
- Creating custom transforms

### 6. Stream Modes
- Flowing mode
- Paused mode
- Switching between modes

---

## Events and Event Emitter

**📖 [Full Documentation](./docs/06-events-event-emitter.md)** | **💻 [Examples](./examples/06-events/)**

### 1. Event Emitter Pattern
- `events.EventEmitter`
- Creating event emitters
- Extending EventEmitter

### 2. Event Methods
- `on()` / `addListener()`
- `once()`
- `emit()`
- `removeListener()`
- `removeAllListeners()`
- `listeners()`

### 3. Event Types
- Custom events
- Built-in events
- Error events

### 4. Event Best Practices
- Error handling
- Memory leaks
- Event naming conventions

---

## HTTP and Web Servers

**📖 [Full Documentation](./docs/07-http-web-servers.md)** | **💻 [Examples](./examples/07-http/)**

### 1. Creating HTTP Server
- `http.createServer()`
- Request object
- Response object
- Server methods

### 2. HTTP Methods
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

### 3. Request Handling
- Parsing URLs
- Query parameters
- Request headers
- Request body
- Content-Type

### 4. Response Handling
- Status codes
- Response headers
- Sending data
- JSON responses
- HTML responses

### 5. HTTPS
- `https.createServer()`
- SSL/TLS certificates
- Secure connections

### 6. HTTP Client
- `http.request()`
- `http.get()`
- Making HTTP requests
- Handling responses

### 7. Express.js (Framework)
- Routing
- Middleware
- Request/Response objects
- Template engines
- Static files
- **📖 [Full Express Documentation](./docs/18-express-framework.md)** | **💻 [Examples](./examples/18-express/)**

---

## Buffers

**📖 [Full Documentation](./docs/08-buffers.md)** | **💻 [Examples](./examples/08-buffers/)**

### 1. What are Buffers?
- Binary data handling
- Fixed-size memory allocation
- Array-like structure

### 2. Creating Buffers
- `Buffer.alloc()`
- `Buffer.from()`
- `Buffer.allocUnsafe()`

### 3. Buffer Operations
- Reading data
- Writing data
- Converting to strings
- Converting from strings
- Buffer concatenation

### 4. Buffer Methods
- `toString()`
- `slice()`
- `copy()`
- `fill()`
- `indexOf()`

---

## Process and OS

**📖 [Full Documentation](./docs/09-process-os.md)** | **💻 [Examples](./examples/09-process-os/)**

### 1. Process Object
- `process.argv`
- `process.env`
- `process.cwd()`
- `process.exit()`
- `process.on()`
- Process events

### 2. Environment Variables
- Accessing env variables
- Setting env variables
- `.env` files
- dotenv package

### 3. OS Module
- `os.platform()`
- `os.arch()`
- `os.cpus()`
- `os.totalmem()`
- `os.freemem()`
- `os.hostname()`
- `os.homedir()`

### 4. Process Events
- `exit`
- `uncaughtException`
- `unhandledRejection`
- `SIGINT` / `SIGTERM`

---

## Error Handling

**📖 [Full Documentation](./docs/13-error-handling.md)** | **💻 [Examples](./examples/13-error-handling/)**

### 1. Error Types
- Standard Error
- Custom errors
- Error objects
- Error properties

### 2. Error Handling Patterns
- Try/catch blocks
- Error-first callbacks
- Promise rejections
- Async/await error handling

### 3. Global Error Handling
- `process.on('uncaughtException')`
- `process.on('unhandledRejection')`
- Error middleware

### 4. Best Practices
- Always handle errors
- Don't ignore errors
- Log errors appropriately
- Error propagation

---

## Child Processes

**📖 [Full Documentation](./docs/12-child-processes-clusters.md)** | **💻 [Examples](./examples/12-child-processes/)**

### 1. Spawning Processes
- `child_process.spawn()`
- `child_process.exec()`
- `child_process.execFile()`
- `child_process.fork()`

### 2. Process Communication
- stdin/stdout/stderr
- IPC (Inter-Process Communication)
- Sending messages
- Receiving messages

### 3. Process Options
- `cwd` - Working directory
- `env` - Environment variables
- `stdio` - Standard I/O configuration
- `detached` - Run independently of parent
- **💻 [Detached Process Examples](./examples/12-child-processes/detached-process.js)**

### 4. Use Cases
- Running shell commands
- Executing scripts
- Parallel processing
- Worker processes

---

## Clusters

**📖 [Full Documentation](./docs/12-child-processes-clusters.md)** | **💻 [Examples](./examples/12-child-processes/)**

### 1. Cluster Module
- `cluster` module
- Master process
- Worker processes
- Process forking

### 2. Load Balancing
- Round-robin scheduling - Even distribution of requests
- Sharing server ports - All workers share the same port
- Worker distribution - One worker per CPU core
- **💻 [Load Balancing Example](./examples/12-child-processes/cluster-load-balancing.js)**

### 3. Cluster Events
- Worker events - fork, online, listening, disconnect, exit
- Master events - message, setup, worker management
- Communication - IPC between master and workers
- **💻 [Cluster Events Example](./examples/12-child-processes/cluster-events.js)**

### 4. Use Cases
- Multi-core utilization - Use all CPU cores effectively
- High availability - Automatic worker restart on failure
- Performance scaling - Handle more concurrent requests
- **💻 [Use Cases Example](./examples/12-child-processes/cluster-use-cases.js)**

---

## Path Module

**📖 [Full Documentation](./docs/11-path-url.md)** | **💻 [Examples](./examples/11-path-url/)**

### 1. Path Operations
- `path.join()`
- `path.resolve()`
- `path.normalize()`
- `path.parse()`
- `path.format()`

### 2. Path Utilities
- `path.basename()`
- `path.dirname()`
- `path.extname()`
- `path.isAbsolute()`

### 3. Platform Differences
- Windows vs Unix paths
- Path separators
- Cross-platform compatibility

---

## URL Module

**📖 [Full Documentation](./docs/11-path-url.md)** | **💻 [Examples](./examples/11-path-url/)**

### 1. URL Parsing
- `url.parse()`
- `url.format()`
- `url.resolve()`
- URL object properties

### 2. URL Components
- Protocol
- Hostname
- Port
- Pathname
- Query string
- Hash

### 3. URLSearchParams
- Creating params
- Getting values
- Setting values
- Iterating params

---

## Crypto Module

**📖 [Full Documentation](./docs/10-crypto.md)** | **💻 [Examples](./examples/10-crypto/)**

### 1. Hashing
- `crypto.createHash()`
- MD5, SHA1, SHA256, SHA512
- Hash algorithms

### 2. Encryption
- `crypto.createCipher()`
- `crypto.createDecipher()`
- Symmetric encryption
- Asymmetric encryption

### 3. Digital Signatures
- `crypto.createSign()`
- `crypto.createVerify()`
- Signing data
- Verifying signatures

### 4. Random Data
- `crypto.randomBytes()`
- Generating secure random data
- UUIDs

---

## Timers

**📖 [Full Documentation](./docs/14-timers.md)** | **💻 [Examples](./examples/14-timers/)**

### 1. setTimeout
- Delayed execution
- Clearing timeouts
- `clearTimeout()`

### 2. setInterval
- Repeated execution
- Clearing intervals
- `clearInterval()`

### 3. setImmediate
- Immediate execution
- Event loop scheduling
- `clearImmediate()`

### 4. process.nextTick
- Next tick queue
- Microtask scheduling
- Priority over setImmediate

---

## Utilities

**📖 [Full Documentation](./docs/15-utilities.md)** | **💻 [Examples](./examples/15-utilities/)**

### 1. Util Module
- `util.promisify()`
- `util.inherits()`
- `util.inspect()`
- `util.format()`
- `util.types()`

### 2. Debugging
- `console.log()`
- `console.error()`
- `console.warn()`
- `console.debug()`
- `console.trace()`

### 3. Assertions
- `assert` module
- Testing utilities
- Assertion methods

---

## Best Practices

**📖 [Full Documentation](./docs/16-best-practices.md)**

### 1. Code Organization
- Project structure
- Module organization
- Separation of concerns

### 2. Performance
- Avoiding blocking operations
- Using streams for large data
- Caching strategies
- Connection pooling

### 3. Security
- Input validation
- Avoiding eval()
- Secure dependencies
- Environment variables
- HTTPS usage

### 4. Error Handling
- Consistent error handling
- Error logging
- Graceful degradation

### 5. Testing
- Unit testing
- Integration testing
- Test frameworks (Jest, Mocha)
- Test coverage

### 6. Deployment
- Process managers (PM2)
- Environment configuration
- Logging
- Monitoring

---

## Additional Topics

### 1. WebSockets
- `ws` package
- Real-time communication
- Socket.io

### 2. RESTful APIs
- API design
- REST principles
- Express.js routing

### 3. GraphQL
- GraphQL basics
- Apollo Server
- Schema definition

### 4. Database Integration
- MongoDB (Mongoose)
- PostgreSQL
- MySQL
- Redis

### 5. Authentication & Authorization
- JWT tokens
- OAuth
- Session management
- bcrypt

### 6. File Uploads
- Multer
- File validation
- Storage strategies

### 7. Caching
- Redis caching
- Memory caching
- Cache strategies

### 8. Logging
- Winston
- Morgan
- Log levels
- Log rotation

### 9. Testing
- Jest
- Mocha/Chai
- Supertest
- Test coverage

### 10. TypeScript
- TypeScript with Node.js
- Type definitions
- ts-node

---

## Quick Start

### Running Examples

1. **Core Fundamentals**
   ```bash
   node examples/01-core-fundamentals.js
   node examples/01-architecture-demo.js
   ```

2. **Modules**
   ```bash
   node examples/02-modules/commonjs-imports.js
   node examples/02-modules/esm-imports.mjs
   ```

3. **File System**
   ```bash
   node examples/03-file-system/promise-operations.js
   ```

4. **Asynchronous Programming**
   ```bash
   node examples/04-asynchronous/async-await.js
   node examples/04-asynchronous/event-loop.js
   node examples/04-asynchronous/event-loop-detailed.js
   node examples/04-asynchronous/event-loop-phases.js
   ```

5. **Streams**
   ```bash
   node examples/05-streams/piping.js
   ```

6. **Events**
   ```bash
   node examples/06-events/basic-events.js
   ```

7. **HTTP Server**
   ```bash
   node examples/07-http/basic-server.js
   # Then visit http://localhost:3000
   ```

8. **Buffers**
   ```bash
   node examples/08-buffers/buffer-basics.js
   ```

9. **Process & OS**
   ```bash
   node examples/09-process-os/process-examples.js
   node examples/09-process-os/os-examples.js
   ```

10. **Crypto**
    ```bash
    node examples/10-crypto/hashing.js
    ```

11. **Path & URL**
    ```bash
    node examples/11-path-url/path-examples.js
    node examples/11-path-url/url-examples.js
    ```

12. **Child Processes & Clusters**
    ```bash
    node examples/12-child-processes/exec-example.js
    node examples/12-child-processes/cluster-example.js
    node examples/12-child-processes/detached-process.js
    node examples/12-child-processes/spawn-detached.js
    node examples/12-child-processes/cluster-load-balancing.js
    node examples/12-child-processes/cluster-events.js
    node examples/12-child-processes/cluster-use-cases.js
    ```

13. **Error Handling**
    ```bash
    node examples/13-error-handling/error-types.js
    node examples/13-error-handling/error-handling-patterns.js
    node examples/13-error-handling/global-error-handling.js
    ```

14. **Timers**
    ```bash
    node examples/14-timers/timers-basics.js
    node examples/14-timers/timer-patterns.js
    ```

15. **Utilities**
    ```bash
    node examples/15-utilities/util-examples.js
    ```

16. **Express.js**
    ```bash
    node examples/18-express/basic-server.js
    node examples/18-express/routing.js
    node examples/18-express/middleware.js
    node examples/18-express/rest-api.js
    node examples/18-express/router-module.js
    ```

## Documentation Structure

```
nodejs-core/
├── docs/                    # Detailed documentation
│   ├── 01-core-fundamentals.md
│   ├── 02-modules-package-management.md
│   ├── 03-file-system-operations.md
│   ├── 04-asynchronous-programming.md
│   ├── 05-streams.md
│   ├── 06-events-event-emitter.md
│   ├── 07-http-web-servers.md
│   ├── 08-buffers.md
│   ├── 09-process-os.md
│   ├── 10-crypto.md
│   ├── 11-path-url.md
│   ├── 12-child-processes-clusters.md
│   ├── 13-error-handling.md
│   ├── 14-timers.md
│   ├── 15-utilities.md
│   ├── 16-best-practices.md
│   ├── 17-event-loop.md
│   └── 18-express-framework.md
├── examples/                # Working code examples
│   ├── 01-core-fundamentals.js
│   ├── 02-modules/
│   ├── 03-file-system/
│   ├── 04-asynchronous/
│   ├── 05-streams/
│   ├── 06-events/
│   ├── 07-http/
│   ├── 08-buffers/
│   ├── 09-process-os/
│   ├── 10-crypto/
│   ├── 11-path-url/
│   ├── 12-child-processes/
│   ├── 13-error-handling/
│   ├── 14-timers/
│   ├── 15-utilities/
│   └── 18-express/
└── README.md
```

## Resources

- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Node.js API Reference](https://nodejs.org/api/)
- [npm Documentation](https://docs.npmjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## License

This repository is for educational purposes.


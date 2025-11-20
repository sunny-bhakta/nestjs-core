# Events and Event Emitter

Node.js is built on an event-driven architecture. The `EventEmitter` class is the foundation for many Node.js modules and allows you to create your own event-driven systems.

## Event Emitter Basics

### Using EventEmitter

```javascript
const EventEmitter = require('events');

// Create an instance
const emitter = new EventEmitter();

// Listen to an event
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Emit an event
emitter.emit('greet', 'Node.js');
```

## Event Methods

### on() / addListener()

Register an event listener.

```javascript
emitter.on('data', (data) => {
  console.log('Data received:', data);
});

// Same as addListener
emitter.addListener('data', (data) => {
  console.log('Data received:', data);
});
```

### once()

Register a one-time event listener.

```javascript
emitter.once('connect', () => {
  console.log('Connected (only once)');
});

emitter.emit('connect'); // Logs
emitter.emit('connect'); // Doesn't log
```

### emit()

Emit an event, triggering all registered listeners.

```javascript
emitter.emit('event', 'arg1', 'arg2', 'arg3');
```

### removeListener() / off()

Remove an event listener.

```javascript
function handler(data) {
  console.log('Data:', data);
}

emitter.on('data', handler);
emitter.removeListener('data', handler);
// or
emitter.off('data', handler);
```

### removeAllListeners()

Remove all listeners for an event or all events.

```javascript
emitter.removeAllListeners('data'); // Remove all 'data' listeners
emitter.removeAllListeners(); // Remove all listeners
```

### listeners()

Get all listeners for an event.

```javascript
const listeners = emitter.listeners('data');
console.log('Listeners:', listeners);
```

## Extending EventEmitter

Create classes that emit events.

```javascript
const EventEmitter = require('events');

class MyClass extends EventEmitter {
  constructor() {
    super();
    this.data = [];
  }

  add(item) {
    this.data.push(item);
    this.emit('add', item);
  }

  remove(item) {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
      this.emit('remove', item);
    }
  }
}

const myObj = new MyClass();

myObj.on('add', (item) => {
  console.log('Item added:', item);
});

myObj.add('test');
```

## Event Patterns

### Error Events

Always handle error events.

```javascript
emitter.on('error', (err) => {
  console.error('Error occurred:', err);
});

// If error event is not handled, it will crash the process
emitter.emit('error', new Error('Something went wrong'));
```

### Event Order

Listeners are called in the order they were registered.

```javascript
emitter.on('event', () => console.log('First'));
emitter.on('event', () => console.log('Second'));
emitter.on('event', () => console.log('Third'));

emitter.emit('event');
// Output: First, Second, Third
```

### prependListener()

Add listener to the beginning.

```javascript
emitter.on('event', () => console.log('Second'));
emitter.prependListener('event', () => console.log('First'));

emitter.emit('event');
// Output: First, Second
```

## Best Practices

1. **Always handle error events** - Unhandled error events crash the process
2. **Use once() for one-time events** - Prevents memory leaks
3. **Remove listeners when done** - Prevents memory leaks
4. **Use meaningful event names** - Makes code more readable
5. **Document your events** - Helps other developers


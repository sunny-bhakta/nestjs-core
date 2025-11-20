/**
 * Custom Event Emitter Class Examples
 */

const EventEmitter = require('events');

console.log('=== Custom Event Emitter Examples ===\n');

// Example 1: Simple custom emitter
class Timer extends EventEmitter {
  constructor(interval) {
    super();
    this.interval = interval;
    this.count = 0;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.count++;
      this.emit('tick', this.count);
      
      if (this.count >= 5) {
        this.emit('done');
        this.stop();
      }
    }, this.interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.emit('stopped');
    }
  }
}

console.log('1. Timer Event Emitter:');
const timer = new Timer(200);

timer.on('tick', (count) => {
  console.log(`   Tick ${count}`);
});

timer.on('done', () => {
  console.log('   Timer done!');
});

timer.on('stopped', () => {
  console.log('   Timer stopped');
});

timer.start();

// Example 2: Data Store with events
setTimeout(() => {
  console.log('\n2. Data Store Event Emitter:');
  
  class DataStore extends EventEmitter {
    constructor() {
      super();
      this.data = {};
    }

    set(key, value) {
      const oldValue = this.data[key];
      this.data[key] = value;
      this.emit('set', { key, value, oldValue });
    }

    get(key) {
      const value = this.data[key];
      this.emit('get', { key, value });
      return value;
    }

    delete(key) {
      if (key in this.data) {
        const value = this.data[key];
        delete this.data[key];
        this.emit('delete', { key, value });
        return true;
      }
      return false;
    }

    clear() {
      this.data = {};
      this.emit('clear');
    }
  }

  const store = new DataStore();

  store.on('set', ({ key, value }) => {
    console.log(`   Set: ${key} = ${value}`);
  });

  store.on('get', ({ key, value }) => {
    console.log(`   Get: ${key} = ${value}`);
  });

  store.on('delete', ({ key }) => {
    console.log(`   Deleted: ${key}`);
  });

  store.on('clear', () => {
    console.log('   Store cleared');
  });

  store.set('name', 'Alice');
  store.set('age', 30);
  store.get('name');
  store.delete('age');
  store.clear();
}, 1500);

// Example 3: HTTP-like request emitter
setTimeout(() => {
  console.log('\n3. Request Event Emitter:');
  
  class Request extends EventEmitter {
    constructor(url) {
      super();
      this.url = url;
      this.status = 'pending';
    }

    send() {
      this.status = 'sending';
      this.emit('request', this.url);

      // Simulate async operation
      setTimeout(() => {
        this.status = 'completed';
        this.emit('response', { status: 200, data: 'Response data' });
      }, 300);
    }
  }

  const request = new Request('https://api.example.com/data');

  request.on('request', (url) => {
    console.log(`   Requesting: ${url}`);
  });

  request.on('response', (response) => {
    console.log(`   Response: ${response.status}`, response.data);
  });

  request.send();
}, 3000);

// Keep process alive
setTimeout(() => {
  console.log('\n=== Examples Complete ===');
  process.exit(0);
}, 4000);


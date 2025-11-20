/**
 * Basic Event Emitter Examples
 */

const EventEmitter = require('events');

console.log('=== Basic Event Emitter Examples ===\n');

// Create an event emitter
const emitter = new EventEmitter();

// Example 1: Basic event listening and emitting
console.log('1. Basic event:');
emitter.on('greet', (name) => {
  console.log(`   Hello, ${name}!`);
});

emitter.emit('greet', 'Node.js');
emitter.emit('greet', 'World');

// Example 2: Multiple listeners
console.log('\n2. Multiple listeners:');
emitter.on('data', (data) => {
  console.log('   Listener 1:', data);
});

emitter.on('data', (data) => {
  console.log('   Listener 2:', data);
});

emitter.emit('data', 'Some data');

// Example 3: Once listener
console.log('\n3. Once listener:');
emitter.once('connect', () => {
  console.log('   Connected (this will only fire once)');
});

emitter.emit('connect');
emitter.emit('connect'); // Won't fire

// Example 4: Event with multiple arguments
console.log('\n4. Multiple arguments:');
emitter.on('user', (name, age, city) => {
  console.log(`   User: ${name}, Age: ${age}, City: ${city}`);
});

emitter.emit('user', 'Alice', 30, 'New York');

// Example 5: Error event
console.log('\n5. Error event:');
emitter.on('error', (err) => {
  console.error('   Error caught:', err.message);
});

emitter.emit('error', new Error('Something went wrong'));

// Example 6: Remove listener
console.log('\n6. Remove listener:');
function handler(data) {
  console.log('   Handler called:', data);
}

emitter.on('test', handler);
emitter.emit('test', 'First'); // Will fire

emitter.removeListener('test', handler);
emitter.emit('test', 'Second'); // Won't fire

// Example 7: Listener count
console.log('\n7. Listener information:');
emitter.on('info', () => {});
emitter.on('info', () => {});
console.log('   Listener count:', emitter.listenerCount('info'));
console.log('   Listeners:', emitter.listeners('info').length);

// Example 8: Event names
console.log('\n8. Event names:');
emitter.on('event1', () => {});
emitter.on('event2', () => {});
console.log('   Event names:', emitter.eventNames());

// Example 9: prependListener
console.log('\n9. prependListener (add to beginning):');
emitter.on('order', () => console.log('   Second'));
emitter.prependListener('order', () => console.log('   First'));
emitter.emit('order');

// Example 10: setMaxListeners
console.log('\n10. Max listeners:');
emitter.setMaxListeners(15);
console.log('   Max listeners set to 15');

console.log('\n=== Examples Complete ===');


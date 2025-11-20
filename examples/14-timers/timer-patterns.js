/**
 * Timer Patterns Examples
 */

console.log('=== Timer Patterns Examples ===\n');

// Example 1: Debouncing
console.log('1. Debouncing:');

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedLog = debounce((message) => {
  console.log('   Debounced:', message);
}, 300);

console.log('   Calling debounced function multiple times...');
debouncedLog('Call 1');
debouncedLog('Call 2');
debouncedLog('Call 3');
// Only the last call will execute after 300ms

// Example 2: Throttling
setTimeout(() => {
  console.log('\n2. Throttling:');
  
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }
  
  const throttledLog = throttle((count) => {
    console.log('   Throttled call:', count);
  }, 500);
  
  let callCount = 0;
  const intervalId = setInterval(() => {
    callCount++;
    throttledLog(callCount);
    if (callCount >= 5) {
      clearInterval(intervalId);
    }
  }, 200);
}, 500);

// Example 3: Polling
setTimeout(() => {
  console.log('\n3. Polling:');
  
  let pollCount = 0;
  
  function poll(condition, callback, interval = 500) {
    const check = () => {
      if (condition()) {
        callback();
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  }
  
  poll(
    () => {
      pollCount++;
      return pollCount >= 3;
    },
    () => {
      console.log('   Polling condition met!');
    },
    300
  );
}, 1000);

// Example 4: Delay with Promise
setTimeout(() => {
  console.log('\n4. Delay with Promise:');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function delayedOperation() {
    console.log('   Start');
    await delay(200);
    console.log('   After 200ms');
    await delay(200);
    console.log('   After another 200ms');
  }
  
  delayedOperation();
}, 1500);

// Example 5: Timeout Race
setTimeout(() => {
  console.log('\n5. Timeout Race:');
  
  function timeoutPromise(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  }
  
  // Simulate slow operation
  const slowOperation = new Promise(resolve => {
    setTimeout(() => resolve('Operation completed'), 1000);
  });
  
  timeoutPromise(slowOperation, 500)
    .then(result => {
      console.log('   Result:', result);
    })
    .catch(error => {
      console.log('   Error:', error.message);
    });
}, 2000);

// Example 6: Timer Drift Compensation
setTimeout(() => {
  console.log('\n6. Timer Drift Compensation:');
  
  let expected = Date.now() + 500;
  let iteration = 0;
  
  function schedule() {
    const drift = Date.now() - expected;
    iteration++;
    console.log(`   Iteration ${iteration}, drift: ${drift}ms`);
    
    if (iteration >= 3) {
      return;
    }
    
    expected += 500;
    setTimeout(schedule, 500 - drift);
  }
  
  schedule();
}, 3000);

// Example 7: Conditional Interval
setTimeout(() => {
  console.log('\n7. Conditional Interval:');
  
  let counter = 0;
  const maxCount = 3;
  
  const conditionalInterval = setInterval(() => {
    counter++;
    console.log(`   Counter: ${counter}`);
    
    if (counter >= maxCount) {
      clearInterval(conditionalInterval);
      console.log('   Interval stopped at max count');
    }
  }, 400);
}, 4000);

// Example 8: Cleanup Pattern
setTimeout(() => {
  console.log('\n8. Cleanup Pattern:');
  
  const timers = [];
  
  function addTimer(callback, delay) {
    const id = setTimeout(() => {
      callback();
      // Remove from array after execution
      const index = timers.indexOf(id);
      if (index > -1) {
        timers.splice(index, 1);
      }
    }, delay);
    timers.push(id);
    return id;
  }
  
  function clearAllTimers() {
    timers.forEach(id => clearTimeout(id));
    timers.length = 0;
    console.log('   All timers cleared');
  }
  
  addTimer(() => console.log('   Timer 1'), 100);
  addTimer(() => console.log('   Timer 2'), 200);
  addTimer(() => console.log('   Timer 3'), 300);
  
  setTimeout(() => {
    clearAllTimers();
  }, 150);
}, 5000);

setTimeout(() => {
  console.log('\n=== Timer Patterns Examples Complete ===');
  process.exit(0);
}, 6000);


/**
 * ES6 Module Import Examples
 */

// Named imports
import { PI, circleArea, circleCircumference, Calculator } from './esm-exports.mjs';

// Default import
import calcInfo from './esm-exports.mjs';

console.log('=== ES6 Module Import Examples ===\n');

// Use named imports
console.log('PI:', PI);
console.log('Circle area (radius 5):', circleArea(5));
console.log('Circle circumference (radius 5):', circleCircumference(5));

// Use class
const calc = new Calculator();
console.log('\n=== Calculator ===');
console.log('10 + 5 =', calc.add(10, 5));
console.log('20 - 8 =', calc.subtract(20, 8));
console.log('History:', calc.getHistory());

// Use default import
console.log('\n=== Module Info ===');
console.log(calcInfo.getInfo());

// Dynamic import example
console.log('\n=== Dynamic Import ===');
async function loadModule() {
  const module = await import('./esm-exports.mjs');
  console.log('Dynamically loaded PI:', module.PI);
  const calc2 = new module.Calculator();
  console.log('Dynamic calc result:', calc2.add(100, 200));
}

loadModule().catch(console.error);


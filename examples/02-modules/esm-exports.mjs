/**
 * ES6 Module Export Examples
 */

// Named exports
export const PI = 3.14159;

export function circleArea(radius) {
  return PI * radius * radius;
}

export function circleCircumference(radius) {
  return 2 * PI * radius;
}

export class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = a + b;
    this.history.push({ operation: 'add', a, b, result });
    return result;
  }

  subtract(a, b) {
    const result = a - b;
    this.history.push({ operation: 'subtract', a, b, result });
    return result;
  }

  getHistory() {
    return this.history;
  }
}

// Default export
export default {
  version: '2.0.0',
  author: 'Node.js Developer',
  getInfo() {
    return `Calculator v${this.version} by ${this.author}`;
  }
};


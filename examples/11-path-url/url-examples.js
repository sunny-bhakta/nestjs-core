/**
 * URL Module Examples
 */

const url = require('url');

console.log('=== URL Module Examples ===\n');

// Example 1: Parsing URLs
console.log('1. Parsing URLs:');
const myUrl = new URL('https://example.com:8080/path/to/page?query=value&name=John#hash');
console.log('   Full URL:', myUrl.href);
console.log('   Protocol:', myUrl.protocol);
console.log('   Hostname:', myUrl.hostname);
console.log('   Port:', myUrl.port);
console.log('   Host:', myUrl.host);
console.log('   Pathname:', myUrl.pathname);
console.log('   Search:', myUrl.search);
console.log('   Hash:', myUrl.hash);
console.log('   Origin:', myUrl.origin);

// Example 2: Query parameters
console.log('\n2. Query Parameters:');
const urlWithParams = new URL('https://example.com?name=John&age=30&city=NYC&tag=nodejs&tag=javascript');
console.log('   URL:', urlWithParams.href);

// Get parameter
console.log('   name:', urlWithParams.searchParams.get('name'));
console.log('   age:', urlWithParams.searchParams.get('age'));

// Check if exists
console.log('   Has name:', urlWithParams.searchParams.has('name'));
console.log('   Has email:', urlWithParams.searchParams.has('email'));

// Get all values (for duplicate keys)
console.log('   All tags:', urlWithParams.searchParams.getAll('tag'));

// Iterate
console.log('   All parameters:');
urlWithParams.searchParams.forEach((value, key) => {
  console.log(`     ${key}: ${value}`);
});

// Example 3: Modifying query parameters
console.log('\n3. Modifying query parameters:');
const modifiableUrl = new URL('https://example.com?name=John');
console.log('   Original:', modifiableUrl.href);

// Set parameter
modifiableUrl.searchParams.set('name', 'Jane');
console.log('   After set name=Jane:', modifiableUrl.href);

// Append parameter
modifiableUrl.searchParams.append('tag', 'nodejs');
modifiableUrl.searchParams.append('tag', 'javascript');
console.log('   After append tags:', modifiableUrl.href);

// Delete parameter
modifiableUrl.searchParams.delete('name');
console.log('   After delete name:', modifiableUrl.href);

// Example 4: URL resolution
console.log('\n4. URL Resolution:');
const base = 'https://example.com/path/to/';
const relative1 = '../other/page.html';
const relative2 = '/absolute/path.html';
const relative3 = 'relative/path.html';

console.log('   Base:', base);
console.log('   Resolve ../other/page.html:', new URL(relative1, base).href);
console.log('   Resolve /absolute/path.html:', new URL(relative2, base).href);
console.log('   Resolve relative/path.html:', new URL(relative3, base).href);

// Example 5: Legacy url.parse()
console.log('\n5. Legacy url.parse():');
const parsed = url.parse('https://example.com/path?query=value#hash', true);
console.log('   Protocol:', parsed.protocol);
console.log('   Host:', parsed.host);
console.log('   Pathname:', parsed.pathname);
console.log('   Query:', parsed.query);
console.log('   Hash:', parsed.hash);

// Example 6: URL formatting
console.log('\n6. URL Formatting:');
const formattedUrl = url.format({
  protocol: 'https',
  hostname: 'example.com',
  port: 8080,
  pathname: '/path/to/page',
  query: { name: 'John', age: 30 },
  hash: 'section1'
});
console.log('   Formatted:', formattedUrl);

// Example 7: URLSearchParams standalone
console.log('\n7. URLSearchParams Standalone:');
const params = new URLSearchParams('name=John&age=30&city=NYC');
console.log('   name:', params.get('name'));
console.log('   age:', params.get('age'));
console.log('   toString():', params.toString());

// Add parameter
params.append('tag', 'nodejs');
console.log('   After append:', params.toString());

// Example 8: Special characters
console.log('\n8. Special Characters:');
const specialUrl = new URL('https://example.com/search?q=hello%20world&lang=en');
console.log('   Encoded URL:', specialUrl.href);
console.log('   Decoded query:', specialUrl.searchParams.get('q'));

// Encode
const searchParams = new URLSearchParams();
searchParams.set('q', 'hello world');
searchParams.set('lang', 'en');
console.log('   Encoded params:', searchParams.toString());

console.log('\n=== URL Examples Complete ===');


/**
 * Crypto Hashing Examples
 */

const crypto = require('crypto');

console.log('=== Crypto Hashing Examples ===\n');

const data = 'Hello, Node.js Crypto!';

// Example 1: MD5 (not recommended for security, but shown for completeness)
console.log('1. MD5 Hash:');
const md5 = crypto.createHash('md5').update(data).digest('hex');
console.log('   MD5:', md5);

// Example 2: SHA-1 (deprecated for security)
console.log('\n2. SHA-1 Hash:');
const sha1 = crypto.createHash('sha1').update(data).digest('hex');
console.log('   SHA-1:', sha1);

// Example 3: SHA-256 (recommended)
console.log('\n3. SHA-256 Hash:');
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
console.log('   SHA-256:', sha256);

// Example 4: SHA-512
console.log('\n4. SHA-512 Hash:');
const sha512 = crypto.createHash('sha512').update(data).digest('hex');
console.log('   SHA-512:', sha512);

// Example 5: Hash with multiple updates
console.log('\n5. Hash with multiple updates:');
const hash = crypto.createHash('sha256');
hash.update('Hello, ');
hash.update('Node.js ');
hash.update('Crypto!');
const finalHash = hash.digest('hex');
console.log('   Final hash:', finalHash);

// Example 6: Different output formats
console.log('\n6. Different output formats:');
const hash2 = crypto.createHash('sha256').update(data);
console.log('   Hex:', hash2.copy().digest('hex'));
console.log('   Base64:', hash2.copy().digest('base64'));
console.log('   Binary:', hash2.copy().digest('binary').substring(0, 20) + '...');

// Example 7: File hashing (simulated)
console.log('\n7. Simulated file hashing:');
function hashFile(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

const fileContent = 'File content line 1\nFile content line 2\nFile content line 3';
const fileHash = hashFile(fileContent);
console.log('   File hash:', fileHash);

// Example 8: Comparing hashes
console.log('\n8. Hash comparison:');
const data1 = 'Hello World';
const data2 = 'Hello World';
const data3 = 'Hello World!';

const hash1 = crypto.createHash('sha256').update(data1).digest('hex');
const hash2_1 = crypto.createHash('sha256').update(data2).digest('hex');
const hash3 = crypto.createHash('sha256').update(data3).digest('hex');

console.log('   Hash1:', hash1);
console.log('   Hash2:', hash2_1);
console.log('   Hash3:', hash3);
console.log('   Hash1 === Hash2:', hash1 === hash2_1);
console.log('   Hash1 === Hash3:', hash1 === hash3);

console.log('\n=== Hashing Examples Complete ===');


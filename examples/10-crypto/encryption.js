/**
 * Crypto Encryption Examples
 */

const crypto = require('crypto');

console.log('=== Crypto Encryption Examples ===\n');

const algorithm = 'aes-256-cbc';
const message = 'Hello, this is a secret message!';

// Example 1: Basic encryption/decryption
console.log('1. Basic AES Encryption:');

// Generate key and IV
const key = crypto.randomBytes(32); // 32 bytes for AES-256
const iv = crypto.randomBytes(16);  // 16 bytes for AES

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(message, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('   Encrypted:', encrypted);
console.log('   Key (hex):', key.toString('hex'));
console.log('   IV (hex):', iv.toString('hex'));

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('   Decrypted:', decrypted);
console.log('   Match:', message === decrypted);

// Example 2: Using password-based key derivation
setTimeout(() => {
  console.log('\n2. Password-based Encryption:');
  
  const password = 'mySecretPassword';
  const salt = crypto.randomBytes(16);
  
  // Derive key from password
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv2 = crypto.randomBytes(16);
  
  // Encrypt
  const cipher2 = crypto.createCipheriv('aes-256-cbc', derivedKey, iv2);
  let encrypted2 = cipher2.update(message, 'utf8', 'hex');
  encrypted2 += cipher2.final('hex');
  
  console.log('   Encrypted:', encrypted2);
  
  // Decrypt (need same password and salt)
  const derivedKey2 = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const decipher2 = crypto.createDecipheriv('aes-256-cbc', derivedKey2, iv2);
  let decrypted2 = decipher2.update(encrypted2, 'hex', 'utf8');
  decrypted2 += decipher2.final('utf8');
  
  console.log('   Decrypted:', decrypted2);
}, 100);

// Example 3: HMAC for message authentication
setTimeout(() => {
  console.log('\n3. HMAC (Hash-based Message Authentication Code):');
  
  const secret = 'my-secret-key';
  const data = 'Important message';
  
  // Create HMAC
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  console.log('   Data:', data);
  console.log('   HMAC signature:', signature);
  
  // Verify HMAC
  const verifyHmac = crypto.createHmac('sha256', secret);
  verifyHmac.update(data);
  const verifySignature = verifyHmac.digest('hex');
  
  console.log('   Signature valid:', signature === verifySignature);
}, 200);

// Example 4: Random data generation
setTimeout(() => {
  console.log('\n4. Random Data Generation:');
  
  // Random bytes
  const randomBytes = crypto.randomBytes(16);
  console.log('   Random bytes (hex):', randomBytes.toString('hex'));
  
  // Random integer
  const randomInt = crypto.randomInt(1, 100);
  console.log('   Random integer (1-100):', randomInt);
  
  // UUID (Node.js 14.17.0+)
  try {
    const uuid = crypto.randomUUID();
    console.log('   UUID:', uuid);
  } catch (err) {
    console.log('   UUID not available (requires Node.js 14.17.0+)');
  }
}, 300);

setTimeout(() => {
  console.log('\n=== Encryption Examples Complete ===');
  process.exit(0);
}, 500);


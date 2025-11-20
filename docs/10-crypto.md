# Crypto Module

The `crypto` module provides cryptographic functionality including hashing, encryption, decryption, and digital signatures.

## Hashing

### Basic Hashing

```javascript
const crypto = require('crypto');

// Create hash
const hash = crypto.createHash('sha256');
hash.update('Hello World');
const digest = hash.digest('hex');
console.log(digest); // 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
```

### Available Hash Algorithms

- `md5`, `sha1`, `sha256`, `sha512`
- `ripemd160`, `whirlpool`
- And more

```javascript
const data = 'Hello World';

const md5 = crypto.createHash('md5').update(data).digest('hex');
const sha1 = crypto.createHash('sha1').update(data).digest('hex');
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
const sha512 = crypto.createHash('sha512').update(data).digest('hex');
```

## HMAC (Hash-based Message Authentication Code)

```javascript
const crypto = require('crypto');

const secret = 'my-secret-key';
const message = 'Hello World';

const hmac = crypto.createHmac('sha256', secret);
hmac.update(message);
const signature = hmac.digest('hex');
console.log(signature);
```

## Encryption and Decryption

### AES Encryption

```javascript
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello World', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('Encrypted:', encrypted);

// Decrypt
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('Decrypted:', decrypted);
```

## Random Data

### Random Bytes

```javascript
const crypto = require('crypto');

// Generate random bytes
const randomBytes = crypto.randomBytes(16);
console.log('Random bytes:', randomBytes.toString('hex'));

// Generate random integer
const randomInt = crypto.randomInt(1, 100);
console.log('Random integer:', randomInt);
```

### UUID (with crypto.randomUUID)

```javascript
const crypto = require('crypto');

// Generate UUID v4
const uuid = crypto.randomUUID();
console.log('UUID:', uuid);
```

## Digital Signatures

### Creating and Verifying Signatures

```javascript
const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');

// Generate key pair
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const data = 'Hello World';

// Sign
const sign = crypto.createSign('sha256');
sign.update(data);
sign.end();
const signature = sign.sign(privateKey, 'hex');
console.log('Signature:', signature);

// Verify
const verify = crypto.createVerify('sha256');
verify.update(data);
verify.end();
const isValid = verify.verify(publicKey, signature, 'hex');
console.log('Valid:', isValid);
```

## Password Hashing (bcrypt-like)

```javascript
const crypto = require('crypto');

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password, hash, salt) {
  const newHash = hashPassword(password, salt);
  return newHash === hash;
}

// Usage
const salt = crypto.randomBytes(16).toString('hex');
const password = 'myPassword123';
const hashed = hashPassword(password, salt);
console.log('Hashed:', hashed);

const isValid = verifyPassword(password, hashed, salt);
console.log('Valid:', isValid);
```

## Best Practices

1. **Use strong algorithms** - SHA-256 or better
2. **Never store plain passwords** - Always hash
3. **Use random IVs** - For encryption
4. **Keep keys secure** - Use environment variables
5. **Use HMAC** - For message authentication
6. **Use proper key derivation** - For passwords (pbkdf2, scrypt)


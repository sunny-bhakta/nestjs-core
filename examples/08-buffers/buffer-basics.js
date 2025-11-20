/**
 * Buffer Basics Examples
 */

console.log('=== Buffer Basics Examples ===\n');

// Example 1: Creating buffers
console.log('1. Creating buffers:');

// Buffer.alloc() - safe, filled with zeros
const buf1 = Buffer.alloc(10);
console.log('   Buffer.alloc(10):', buf1);
console.log('   As string:', buf1.toString());

// Buffer.from() - from string
const buf2 = Buffer.from('Hello', 'utf8');
console.log('   Buffer.from("Hello"):', buf2);
console.log('   As string:', buf2.toString());
console.log('   As hex:', buf2.toString('hex'));
console.log('   As base64:', buf2.toString('base64'));

// Buffer.from() - from array
const buf3 = Buffer.from([72, 101, 108, 108, 111]);
console.log('   Buffer.from([72, 101, 108, 108, 111]):', buf3.toString());

// Buffer.allocUnsafe() - faster but may contain old data
const buf4 = Buffer.allocUnsafe(10);
buf4.fill(0); // Clear old data
console.log('   Buffer.allocUnsafe(10) (filled):', buf4);

// Example 2: Buffer properties
console.log('\n2. Buffer properties:');
const buf = Buffer.from('Hello World', 'utf8');
console.log('   Length:', buf.length);
console.log('   First byte:', buf[0]);
console.log('   Last byte:', buf[buf.length - 1]);
console.log('   Byte at index 6:', buf[6], `(${String.fromCharCode(buf[6])})`);

// Example 3: Reading from buffer
console.log('\n3. Reading from buffer:');
const readBuf = Buffer.from('Node.js is awesome', 'utf8');

// Slice
const slice = readBuf.slice(0, 8);
console.log('   Slice(0, 8):', slice.toString());

// Subarray (same as slice)
const sub = readBuf.subarray(8, 10);
console.log('   Subarray(8, 10):', sub.toString());

// To string with encoding
console.log('   As utf8:', readBuf.toString('utf8'));
console.log('   As hex:', readBuf.toString('hex'));
console.log('   As base64:', readBuf.toString('base64'));

// Example 4: Writing to buffer
console.log('\n4. Writing to buffer:');
const writeBuf = Buffer.alloc(20);

// Write string
writeBuf.write('Hello', 0, 'utf8');
console.log('   After write("Hello"):', writeBuf.toString());

// Write at specific position
writeBuf.write('World', 6, 'utf8');
console.log('   After write("World", 6):', writeBuf.toString());

// Fill buffer
writeBuf.fill('!', 11);
console.log('   After fill("!", 11):', writeBuf.toString());

// Example 5: Buffer methods
console.log('\n5. Buffer methods:');
const methodBuf = Buffer.from('Hello World');

// indexOf
console.log('   indexOf("World"):', methodBuf.indexOf('World'));
console.log('   indexOf("o"):', methodBuf.indexOf('o'));
console.log('   lastIndexOf("o"):', methodBuf.lastIndexOf('o'));

// includes
console.log('   includes("World"):', methodBuf.includes('World'));
console.log('   includes("Node"):', methodBuf.includes('Node'));

// Compare
const bufA = Buffer.from('Apple');
const bufB = Buffer.from('Banana');
console.log('   Compare "Apple" vs "Banana":', bufA.compare(bufB));
console.log('   Compare "Banana" vs "Apple":', bufB.compare(bufA));
console.log('   Compare "Apple" vs "Apple":', bufA.compare(Buffer.from('Apple')));

// Example 6: Buffer concatenation
console.log('\n6. Buffer concatenation:');
const concat1 = Buffer.from('Hello ');
const concat2 = Buffer.from('World');
const concat3 = Buffer.from('!');

// Method 1: Buffer.concat()
const combined = Buffer.concat([concat1, concat2, concat3]);
console.log('   Buffer.concat():', combined.toString());

// Method 2: Manual
const manual = Buffer.alloc(concat1.length + concat2.length + concat3.length);
concat1.copy(manual, 0);
concat2.copy(manual, concat1.length);
concat3.copy(manual, concat1.length + concat2.length);
console.log('   Manual copy():', manual.toString());

// Example 7: Encoding conversions
console.log('\n7. Encoding conversions:');
const encodeBuf = Buffer.from('Hello, 世界', 'utf8');

console.log('   Original:', encodeBuf.toString('utf8'));
console.log('   Hex:', encodeBuf.toString('hex'));
console.log('   Base64:', encodeBuf.toString('base64'));
console.log('   ASCII:', encodeBuf.toString('ascii'));

// Convert back
const fromHex = Buffer.from(encodeBuf.toString('hex'), 'hex');
console.log('   From hex:', fromHex.toString('utf8'));

const fromBase64 = Buffer.from(encodeBuf.toString('base64'), 'base64');
console.log('   From base64:', fromBase64.toString('utf8'));

// Example 8: Buffer iteration
console.log('\n8. Buffer iteration:');
const iterBuf = Buffer.from('ABC', 'utf8');

// For...of
console.log('   For...of:');
for (const byte of iterBuf) {
  console.log(`     Byte: ${byte} (${String.fromCharCode(byte)})`);
}

// forEach
console.log('   forEach:');
iterBuf.forEach((byte, index) => {
  console.log(`     [${index}]: ${byte}`);
});

// Map
const doubled = Buffer.from(iterBuf.map(byte => byte * 2));
console.log('   Mapped (doubled):', doubled);

console.log('\n=== Examples Complete ===');


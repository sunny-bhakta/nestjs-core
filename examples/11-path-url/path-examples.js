/**
 * Path Module Examples
 */

const path = require('path');

console.log('=== Path Module Examples ===\n');

// Example 1: Joining paths
console.log('1. Joining paths:');
const joined = path.join('users', 'john', 'documents', 'file.txt');
console.log('   Joined:', joined);

const joined2 = path.join('/users', 'john', '..', 'documents', 'file.txt');
console.log('   Joined with ..:', joined2);

// Example 2: Resolving paths
console.log('\n2. Resolving paths:');
const resolved = path.resolve('file.txt');
console.log('   Resolved:', resolved);

const resolved2 = path.resolve('users', 'john', 'file.txt');
console.log('   Resolved multiple:', resolved2);

// Example 3: Path components
console.log('\n3. Path components:');
const filePath = '/users/john/documents/file.txt';
console.log('   Original path:', filePath);
console.log('   dirname:', path.dirname(filePath));
console.log('   basename:', path.basename(filePath));
console.log('   extname:', path.extname(filePath));
console.log('   basename without ext:', path.basename(filePath, '.txt'));

// Example 4: Parsing paths
console.log('\n4. Parsing paths:');
const parsed = path.parse(filePath);
console.log('   Parsed object:');
console.log('     root:', parsed.root);
console.log('     dir:', parsed.dir);
console.log('     base:', parsed.base);
console.log('     ext:', parsed.ext);
console.log('     name:', parsed.name);

// Example 5: Formatting paths
console.log('\n5. Formatting paths:');
const formatted = path.format({
  root: '/',
  dir: '/users/john',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
});
console.log('   Formatted:', formatted);

// Example 6: Normalizing paths
console.log('\n6. Normalizing paths:');
const normalized = path.normalize('/users/../john/./documents/file.txt');
console.log('   Normalized:', normalized);

const normalized2 = path.normalize('users/../john/./documents/file.txt');
console.log('   Normalized relative:', normalized2);

// Example 7: Platform-specific
console.log('\n7. Platform-specific:');
console.log('   Platform:', process.platform);
console.log('   Separator:', path.sep);
console.log('   Delimiter:', path.delimiter);
console.log('   Is absolute (/file.txt):', path.isAbsolute('/file.txt'));
console.log('   Is absolute (file.txt):', path.isAbsolute('file.txt'));
console.log('   Is absolute (C:\\file.txt):', path.isAbsolute('C:\\file.txt'));

// Example 8: Relative paths
console.log('\n8. Relative paths:');
const from = '/users/john/documents';
const to = '/users/john/images/photo.jpg';
const relative = path.relative(from, to);
console.log('   From:', from);
console.log('   To:', to);
console.log('   Relative:', relative);

// Example 9: Working with current directory
console.log('\n9. Current directory operations:');
console.log('   Current directory:', process.cwd());
console.log('   __dirname:', __dirname);
console.log('   __filename:', __filename);
console.log('   Join with __dirname:', path.join(__dirname, 'test.txt'));

console.log('\n=== Path Examples Complete ===');


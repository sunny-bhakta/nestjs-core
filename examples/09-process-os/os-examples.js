/**
 * OS Module Examples
 */

const os = require('os');

console.log('=== OS Module Examples ===\n');

// Platform information
console.log('1. Platform Information:');
console.log('   Platform:', os.platform());
console.log('   Type:', os.type());
console.log('   Release:', os.release());
console.log('   Architecture:', os.arch());
console.log('   Hostname:', os.hostname());

// CPU information
console.log('\n2. CPU Information:');
const cpus = os.cpus();
console.log('   CPU count:', cpus.length);
if (cpus.length > 0) {
  console.log('   CPU model:', cpus[0].model);
  console.log('   CPU speed:', cpus[0].speed, 'MHz');
  console.log('   CPU times:', cpus[0].times);
}

// Load average (Unix/Linux/macOS only)
console.log('\n3. Load Average (Unix/Linux/macOS):');
const loadAvg = os.loadavg();
if (loadAvg[0] !== 0 || loadAvg[1] !== 0 || loadAvg[2] !== 0) {
  console.log('   1 minute:', loadAvg[0].toFixed(2));
  console.log('   5 minutes:', loadAvg[1].toFixed(2));
  console.log('   15 minutes:', loadAvg[2].toFixed(2));
} else {
  console.log('   Not available on this platform');
}

// Memory information
console.log('\n4. Memory Information:');
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;

console.log('   Total memory:', Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100, 'GB');
console.log('   Free memory:', Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100, 'GB');
console.log('   Used memory:', Math.round(usedMem / 1024 / 1024 / 1024 * 100) / 100, 'GB');
console.log('   Usage:', Math.round((usedMem / totalMem) * 100), '%');

// Network interfaces
console.log('\n5. Network Interfaces:');
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach((name) => {
  console.log(`   ${name}:`);
  interfaces[name].forEach((iface) => {
    console.log(`     - ${iface.family}: ${iface.address} (internal: ${iface.internal})`);
  });
});

// Get IP addresses
console.log('\n6. IP Addresses:');
Object.keys(interfaces).forEach((name) => {
  interfaces[name].forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`   ${name}: ${iface.address}`);
    }
  });
});

// User information
console.log('\n7. User Information:');
const userInfo = os.userInfo();
console.log('   Username:', userInfo.username);
console.log('   Home directory:', userInfo.homedir);
console.log('   UID:', userInfo.uid);
console.log('   GID:', userInfo.gid);
console.log('   Shell:', userInfo.shell || 'N/A');

// Directories
console.log('\n8. Directories:');
console.log('   Home directory:', os.homedir());
console.log('   Temp directory:', os.tmpdir());

// End of line
console.log('\n9. End of Line:');
console.log('   EOL:', JSON.stringify(os.EOL));
console.log('   EOL length:', os.EOL.length);

// Constants
console.log('\n10. OS Constants:');
console.log('   Endianness:', os.endianness());
console.log('   Constants available:', Object.keys(os.constants).slice(0, 5).join(', ') + '...');

console.log('\n=== OS Examples Complete ===');


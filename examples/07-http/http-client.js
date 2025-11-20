/**
 * HTTP Client Examples
 */

const http = require('http');

console.log('=== HTTP Client Examples ===\n');

// Example 1: Simple GET request with http.get()
console.log('1. Simple GET request:');
http.get('http://jsonplaceholder.typicode.com/posts/1', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('   Response:', JSON.parse(data).title);
  });
}).on('error', (err) => {
  console.error('   Error:', err.message);
});

// Example 2: GET request with http.request()
setTimeout(() => {
  console.log('\n2. GET request with options:');
  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 80,
    path: '/posts/2',
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js HTTP Client'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers:`, res.headers['content-type']);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const post = JSON.parse(data);
      console.log(`   Title: ${post.title}`);
    });
  });

  req.on('error', (err) => {
    console.error('   Error:', err.message);
  });

  req.end();
}, 1000);

// Example 3: POST request
setTimeout(() => {
  console.log('\n3. POST request:');
  const postData = JSON.stringify({
    title: 'Test Post',
    body: 'This is a test post',
    userId: 1
  });

  const options = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 80,
    path: '/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log(`   Created post with ID: ${response.id}`);
    });
  });

  req.on('error', (err) => {
    console.error('   Error:', err.message);
  });

  req.write(postData);
  req.end();
}, 2000);

// Example 4: Handling redirects
setTimeout(() => {
  console.log('\n4. Following redirects:');
  function followRedirect(url, callback) {
    http.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        console.log(`   Redirecting to: ${redirectUrl}`);
        followRedirect(redirectUrl, callback);
      } else {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          callback(null, data);
        });
      }
    }).on('error', callback);
  }

  // This example might not have redirects, but shows the pattern
  followRedirect('http://jsonplaceholder.typicode.com/posts/3', (err, data) => {
    if (err) {
      console.error('   Error:', err.message);
    } else {
      console.log('   Response received');
    }
  });
}, 3000);

setTimeout(() => {
  console.log('\n=== Examples Complete ===');
  process.exit(0);
}, 5000);


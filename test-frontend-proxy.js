const http = require('http');

// Test if frontend proxy is working
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/customers',  // Fixed: Added /api prefix
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Body: ${data}`);
    console.log('Request completed');
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
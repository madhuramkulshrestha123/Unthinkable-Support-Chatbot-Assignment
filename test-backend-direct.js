const http = require('http');

// Test if backend server is working directly
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/customers',
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
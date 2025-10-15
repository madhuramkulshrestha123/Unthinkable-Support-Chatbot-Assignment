const http = require('http');

// Test the full integration: create session -> send message -> get AI response
console.log('Testing full integration...');

// Step 1: Create a session through the frontend proxy
const sessionOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/sessions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const sessionData = JSON.stringify({
  customerId: 1
});

const sessionReq = http.request(sessionOptions, (res) => {
  let sessionData = '';
  
  res.on('data', (chunk) => {
    sessionData += chunk;
  });
  
  res.on('end', () => {
    const session = JSON.parse(sessionData);
    console.log('Session created:', session);
    
    // Step 2: Send a message to test AI response
    const messageOptions = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/sessions/${session.sessionId}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add CORS headers if needed
      }
    };
    
    const messageData = JSON.stringify({
      message: "What did I order for lunch last time?",
      sender: "user"
    });
    
    const messageReq = http.request(messageOptions, (res) => {
      let messageResponse = '';
      
      res.on('data', (chunk) => {
        messageResponse += chunk;
      });
      
      res.on('end', () => {
        console.log('Full integration test completed successfully!');
        console.log('AI Response:', JSON.parse(messageResponse).aiMessage.text);
      });
    });
    
    messageReq.on('error', (error) => {
      console.error('Error sending message:', error.message);
    });
    
    messageReq.write(messageData);
    messageReq.end();
  });
});

sessionReq.on('error', (error) => {
  console.error('Error creating session:', error.message);
});

sessionReq.write(sessionData);
sessionReq.end();
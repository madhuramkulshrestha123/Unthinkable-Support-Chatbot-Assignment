const http = require('http');

// First create a session
const sessionOptions = {
  hostname: 'localhost',
  port: 3002,
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
    
    // Now send a message to test AI response
    const messageOptions = {
      hostname: 'localhost',
      port: 3002,
      path: `/api/sessions/${session.sessionId}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const messageData = JSON.stringify({
      message: "What can you tell me about my orders?",
      sender: "user"
    });
    
    const messageReq = http.request(messageOptions, (res) => {
      let messageResponse = '';
      
      res.on('data', (chunk) => {
        messageResponse += chunk;
      });
      
      res.on('end', () => {
        console.log('AI Response:', JSON.parse(messageResponse));
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
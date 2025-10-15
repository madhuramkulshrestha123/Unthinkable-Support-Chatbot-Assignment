# Demo Instructions

This document provides step-by-step instructions for demonstrating the Unthinkable Support Chatbot.

## Prerequisites

1. Node.js installed on your system
2. Two terminal windows (or command prompts)

## Starting the Application

### Method 1: Using Batch Files (Windows)

1. Double-click `start-backend.bat` to start the backend server
2. Double-click `start-frontend.bat` to start the frontend server

### Method 2: Manual Start

1. Open a terminal and navigate to the backend directory:
   ```
   cd backend
   node server.js
   ```

2. Open a second terminal and navigate to the frontend directory:
   ```
   cd frontend
   node server.js
   ```

### Method 3: Start Both Servers

1. Double-click `start-all.bat` to start both servers simultaneously

## Accessing the Application

Once both servers are running:

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the customer support interface with:
   - Chat window on the left
   - Customer profile cards on the right

## Demo Workflow

### 1. View Customer Profiles

- On the right side, you'll see customer profile cards for:
  - Madhuram Srinivasan
  - Priya Kumar
  - Rajesh Venkat

- Each card displays:
  - Customer name and ID
  - Order history with details (items, dates, amounts, payment methods)

### 2. Start a Chat Session

- Click the "Chat as [Customer Name]" button on any customer card
- The chat window on the left will become active
- An AI greeting message will appear

### 3. Interact with the AI Bot

- Type a message in the chat input at the bottom
- Example queries to try:
  - "What are your delivery hours?"
  - "How can I track my order?"
  - "I want to cancel my order ORD-001"
  - "What payment methods do you accept?"

- The AI will respond based on:
  - FAQ matching
  - Keyword detection
  - Escalation scenarios for complex queries

### 4. View Chat History

- All messages are displayed in the chat window
- User messages appear on the right (blue)
- AI responses appear on the left (gray)
- Timestamps are shown for each message

### 5. Switch Between Customers

- You can switch to chatting with a different customer at any time
- Simply click "Chat as [Another Customer Name]" on a different card
- The chat history will update to reflect the new customer's session

## API Endpoints

You can also test the backend API directly:

1. Get all customers:
   ```
   GET http://localhost:3002/api/customers
   ```

2. Get a specific customer:
   ```
   GET http://localhost:3002/api/customers/1
   ```

3. Get all FAQs:
   ```
   GET http://localhost:3002/api/faqs
   ```

4. Create a chat session:
   ```
   POST http://localhost:3002/api/sessions
   Body: { "customerId": 1 }
   ```

5. Send a message:
   ```
   POST http://localhost:3002/api/sessions/{sessionId}/messages
   Body: { "message": "Hello", "sender": "user" }
   ```

## Stopping the Application

To stop the servers:

1. In each terminal window, press `Ctrl + C`
2. Close the terminal windows

## Troubleshooting

### Port Conflicts

If you see an error about ports being in use:

1. Edit the `.env` file in the backend directory to change the PORT
2. Update the proxy target in `frontend/server.js` to match the new port

### CORS Issues

If you see CORS errors in the browser console:

1. Ensure both servers are running
2. Check that the frontend proxy is correctly configured

### No Response from AI

If the AI doesn't respond:

1. Check that the backend server is running
2. Verify the API endpoints are accessible
3. Check the terminal output for error messages
# Unthinkable Support Chatbot

This project simulates an AI-powered customer support chatbot. It includes a backend API with REST endpoints and a frontend interface with a chatbot and customer profiles.

## Features

- RESTful API backend built with Node.js and Express
- Frontend with chat interface and customer profile cards
- Contextual memory to retain conversation history
- FAQ handling with escalation simulation
- Session tracking for customer interactions
- Multi-language support (English and Hindi)
- Customer management system (create, view customers)
- Interactive chat suggestions to guide users
- Responsive design with green and white color theme
- Navigation bar with logo, menu options, and language selector
- Footer with contact information and developer details
- Working page with demo video placeholder
- FAQ page with horizontal cards layout

## New Features Added

### UI Enhancements
- **Navigation Bar**: Added logo on left upper side with menu options (Create Customer, Working, FAQ) on right and language selector (English/Hindi)
- **Color Theme**: Implemented green and white color scheme throughout the application
- **Layout Restructuring**: Customer cards on left side, chat window on right side
- **Scrollable Areas**: Added scrollbars for customer list and chat messages to prevent page expansion
- **Chat Suggestions**: Added suggestion buttons below chat messages to help users know what to ask

### Customer Management
- **Create Customer Page**: Form to add new customers with order history
- **Customer Persistence**: Newly created customers appear automatically on home page
- **Customer Details**: Display customer ID, order history with items, prices, dates, and payment methods

### Language Support
- **Multi-language UI**: All interface elements translate between English and Hindi
- **AI Language Preference**: Chatbot responses requested in user's selected language
- **Real-time Translation**: Language changes take effect immediately without page refresh

### Additional Pages
- **Working Page**: Explains how the chatbot works with step-by-step instructions and demo video
- **FAQ Page**: Horizontal cards layout with common questions and answers
- **Footer**: Added to all pages with contact information, portfolio links, and developer attribution

### Chat Enhancements
- **Brief Responses**: AI responses formatted to be concise and easy to understand
- **Contextual Awareness**: Chatbot references customer's order history in responses
- **Improved Scrolling**: Chat window maintains fixed size with scrollbar for overflow content

## Project Structure

```
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── ...                # Other backend files
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   ├── script.js          # Frontend logic
│   ├── create-customer.html # Customer creation page
│   ├── working.html       # How it works page with demo video
│   ├── faq.html           # Frequently asked questions page
│   └── ...                # Other frontend files
└── README.md              # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   
   Or for development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup

The frontend is built with vanilla HTML, CSS, and JavaScript. To run the frontend with API proxy support:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

### Running Both Servers

To start both servers simultaneously:

```
npm run dev
```

This will start both the backend and frontend servers concurrently.

## API Endpoints

- `GET /api/customers` - Get all customers (http://localhost:3002/api/customers)
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `GET /api/faqs` - Get all FAQs
- `POST /api/sessions` - Create a new chat session
- `GET /api/sessions/:sessionId` - Get chat history
- `POST /api/sessions/:sessionId/messages` - Send a message

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Select a customer card from the left panel
4. Click "Chat" to start a conversation
5. Type your message and press Enter or click Send
6. Use the language selector to switch between English and Hindi
7. Navigate to other pages using the menu options

## Documentation

- [Full README](./README.md)
- [Demo Instructions](./DEMO.md)
- [Prompt Documentation](./PROMPTS.md)
- [Architecture](./architecture.md)
- [Project Summary](./SUMMARY.md)

## License

MIT License
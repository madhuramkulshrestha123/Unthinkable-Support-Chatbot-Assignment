# Project Structure

This document outlines the complete file structure of the Unthinkable Support Chatbot project.

```
C:\USERS\DELL\DOCUMENTS\GITHUB\ASSIGNMENT
│
├── backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── server.js
│   └── package.json
│
├── Documentation/
│   ├── README.md
│   ├── DEMO.md
│   ├── PROMPTS.md
│   ├── architecture.md
│   └── SUMMARY.md
│
├── Scripts/
│   ├── start-all.bat
│   ├── start-backend.bat
│   └── start-frontend.bat
│
├── Test Files/
│   ├── test-api.js
│   └── test_api.py
│
└── Root Files/
    ├── README.md
    ├── .gitignore
    └── package-lock.json
```

## File Descriptions

### Backend Files

**server.js**
- Main backend application file
- Implements Express.js server
- Contains all API endpoints
- Manages customer data and chat sessions
- Handles AI response generation

**.env**
- Environment configuration file
- Stores server port configuration

**package.json**
- Backend dependencies and scripts
- Defines start commands

### Frontend Files

**index.html**
- Main HTML structure
- Contains chat interface and customer cards
- Links to CSS and JavaScript files

**styles.css**
- Complete styling for the application
- Responsive design for all screen sizes
- Custom components for chat and cards

**script.js**
- Frontend JavaScript logic
- Handles API communication
- Manages UI interactions and updates
- Implements chat functionality

**server.js**
- Frontend Express server
- Serves static files
- Proxies API requests to backend

### Documentation Files

**README.md**
- Main project documentation
- Setup and usage instructions
- API endpoint reference

**DEMO.md**
- Step-by-step demo instructions
- Workflow guidance
- Troubleshooting tips

**PROMPTS.md**
- Detailed AI prompt documentation
- Response logic explanation
- Template examples

**architecture.md**
- System architecture diagram
- Component descriptions
- Data flow explanation

**SUMMARY.md**
- Project overview and features
- Implementation details
- Future enhancement suggestions

### Script Files

**start-all.bat**
- Windows batch file to start both servers
- Launches backend and frontend simultaneously

**start-backend.bat**
- Windows batch file to start backend server only

**start-frontend.bat**
- Windows batch file to start frontend server only

### Test Files

**test-api.js**
- Node.js script to test backend API
- Simple HTTP request example

**test_api.py**
- Python script to test backend API
- Uses requests library for testing

### Root Files

**README.md**
- Top-level project documentation
- GitHub repository overview

This structure provides a clean separation of concerns between frontend and backend components, with comprehensive documentation to support development and deployment.
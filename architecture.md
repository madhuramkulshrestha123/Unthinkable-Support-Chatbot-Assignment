# Application Architecture

```mermaid
graph TD
    A[Frontend - Browser] --> B[Frontend Server]
    B --> C[Backend API Server]
    C --> D[(In-Memory Storage)]
    
    A -->|User Interface| B
    B -->|API Proxy| C
    C -->|REST API| D
    D -->|Data| C
    C -->|JSON Response| B
    B -->|HTML/CSS/JS| A
```

## Components

### Frontend
- **Technologies**: HTML, CSS, JavaScript
- **Features**:
  - Customer profile cards display
  - Chat interface
  - Real-time messaging
  - Responsive design

### Frontend Server
- **Technologies**: Node.js, Express
- **Features**:
  - Static file serving
  - API proxy to backend
  - Route handling

### Backend API Server
- **Technologies**: Node.js, Express
- **Features**:
  - RESTful API endpoints
  - Customer data management
  - Session handling
  - Message processing
  - FAQ matching

### Data Storage
- **Technologies**: In-memory JavaScript objects
- **Features**:
  - Customer profiles
  - Order history
  - Chat sessions
  - FAQ database
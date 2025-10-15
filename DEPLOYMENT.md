# Deployment Instructions

This document provides detailed instructions for deploying the Unthinkable Support Chatbot application on Render (backend) and Vercel (frontend).

## Backend Deployment on Render

### Environment Variables

Create the following environment variables in your Render dashboard:

```
# Server Configuration
PORT=3002

# API Keys
HUGGING_FACE_API_KEY=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
GEMINI_API_KEY=AIzaSyBrNvhdSvxTW4HKKR3SHvp-TiuQicpfE1s

# Database
MONGODB_URI=mongodb+srv://madhuramkulshrestha447_db_user:zcJhsxO8nplUIaZy@cluster0.2mytyuy.mongodb.net/
```

### Deployment Steps

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to: `npm install`
4. Set the start command to: `npm start`
5. Set the environment variables as listed above
6. Deploy the service

After deployment, note the URL of your deployed backend service. You'll need this for the frontend configuration.

## Frontend Deployment on Vercel

### Environment Variables

Set the following environment variable in your Vercel dashboard:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with the actual URL of your deployed backend service.

### Deployment Steps

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the root directory to: `frontend`
4. Set the build command to: `npm install`
5. Set the output directory to: `dist` (or leave empty if not using a build process)
6. Set the install command to: `npm install`
7. Add the environment variable as specified above
8. Deploy the project

## Configuration Files

The application uses configuration files to handle different environments:

- `config.js`: Default configuration file loaded by all HTML pages
- `config.prod.js`: Template for production configuration (rename to config.js when deploying)

The configuration automatically detects the environment and uses the appropriate API base URL:
- Local development: `/api` (uses proxy)
- Production: Value from `NEXT_PUBLIC_BACKEND_URL` environment variable

## Post-Deployment Verification

After deploying both services:

1. Visit your frontend URL
2. Try to load customer data (this will make a request to the backend)
3. Verify that the browser's developer console shows requests going to your Render backend URL
4. Test creating a customer and starting a chat session

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Render backend has CORS enabled (it's already configured in the code)
2. **API Connection Issues**: Verify that the `NEXT_PUBLIC_BACKEND_URL` environment variable is correctly set in Vercel
3. **Environment Variables Not Loading**: Make sure you're using the correct prefix (`NEXT_PUBLIC_`) for Vercel to expose the variable to the browser

### Checking Configuration

You can verify that your configuration is working by opening the browser's developer console and typing:
```javascript
console.log(config.API_BASE);
```

This should show either `/api` (local development) or your Render backend URL (production).
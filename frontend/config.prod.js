// Production configuration file template
// Rename this file to config.js when deploying to production
// and set the NEXT_PUBLIC_BACKEND_URL environment variable in Vercel

const config = {
  // For Vercel deployment, this will be set by the environment variable
  // Example: https://your-backend-url.onrender.com
  API_BASE: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend-url.onrender.com'
};

// Export the configuration
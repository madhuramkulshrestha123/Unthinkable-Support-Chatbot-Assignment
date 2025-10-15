// Configuration file for the frontend application
// This file handles environment-specific settings

// For local development, we use the relative path
// For production deployment, we use the environment variable
const getConfig = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For production deployment on Vercel, use the environment variable
    // For local development, fallback to '/api'
    return {
      API_BASE: process.env.NEXT_PUBLIC_BACKEND_URL || '/api'
    };
  }
  
  // Server-side fallback
  return {
    API_BASE: '/api'
  };
};

// Export the configuration
const config = getConfig();
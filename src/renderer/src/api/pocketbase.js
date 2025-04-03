import PocketBase from 'pocketbase';

// Create a single PocketBase instance for the entire app
// Using the cloud VPS URL instead of local server
// Replace this URL with your actual PocketBase server URL
const pb = new PocketBase('http://localhost:8090');

pb.autoCancellation(false);

// Export the PocketBase instance
export default pb;

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);

  // Format the error message
  if (error.response?.data) {
    return {
      message: error.message,
      data: error.response.data
    };
  }

  return {
    message: error.message || 'An unknown error occurred',
    data: null
  };
};

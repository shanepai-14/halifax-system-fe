

export const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // Check if it's already a full URL
    if (filePath.startsWith('http')) {
      return filePath;
    }
  
    // Get the base URL from environment variables
    const baseURL =  'http://localhost:8000';
    
    // Remove any leading slashes from the file path
    const cleanPath = filePath.replace(/^\/+/, '');
    
    return `${baseURL}/storage/${cleanPath}`;
  };
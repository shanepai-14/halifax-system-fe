

export const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // Check if it's already a full URL
    if (filePath.startsWith('http')) {
      return filePath;
    }
  
    // Get the base URL from environment variables
    const baseURL =  'https://hgasims.site';
    
    // Remove any leading slashes from the file path
    const cleanPath = filePath.replace(/^\/+/, '');
    
    return `${baseURL}/storage/${cleanPath}`;
  };
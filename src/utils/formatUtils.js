
// export const formatCurrency = (amount, currency = '₱') => {
//   if (amount === null || amount === undefined || isNaN(amount)) {
//     return `${currency}0.00`;
//   }
  
//   return `${currency}${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
// };


export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

// export const formatDate = (date, format = 'short') => {
//   if (!date) return '-';
  
//   const dateObj = new Date(date);
  
//   if (isNaN(dateObj.getTime())) {
//     return '-';
//   }
  
//   const options = {
//     short: { 
//       year: 'numeric', 
//       month: '2-digit', 
//       day: '2-digit' 
//     },
//     long: { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     },
//     datetime: { 
//       year: 'numeric', 
//       month: '2-digit', 
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     }
//   };
  
//   return dateObj.toLocaleDateString('en-US', options[format] || options.short);
// };

/**
 * Format number with thousands separator
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  return Number(num).toLocaleString();
};





export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
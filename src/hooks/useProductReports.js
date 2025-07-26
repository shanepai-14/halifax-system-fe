// hooks/useProductReports.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import api from '../lib/axios';

export const useProductReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductDeliveryReports = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/products/${productId}/delivery-reports`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch delivery reports');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch delivery reports';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchProductDeliveryReports,
    loading,
    error
  };
};
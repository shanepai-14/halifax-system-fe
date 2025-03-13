import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

/**
 * Hook to fetch price history for a product
 * @param {number} productId - The product ID
 * @returns {Object} Price history data and loading/error states
 */
export function useProductPriceHistory(productId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/product-prices/by-product/${productId}`);
      setData(response.data.data);
    } catch (err) {
      setError(err);
      console.error('Error fetching price history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: fetchData
  };
}

/**
 * Hook to fetch current active price for a product
 * @param {number} productId - The product ID
 * @returns {Object} Current price data and loading/error states
 */
export function useCurrentProductPrice(productId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/product-prices/current/${productId}`);
      setData(response.data.data);
    } catch (err) {
      setError(err);
      console.error('Error fetching current price:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: fetchData
  };
}

/**
 * Hook to create a new price record
 * @returns {Object} Create price function and loading/error states
 */
export function useCreateProductPrice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (priceData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/product-prices', priceData);
      toast.success('Price created successfully');
      return response.data;
    } catch (err) {
      setError(err);
      console.error('Error creating price:', err);
      toast.error(err.response?.data?.message || 'Failed to create price');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error
  };
}

/**
 * Hook to update an existing price record
 * @returns {Object} Update price function and loading/error states
 */
export function useUpdateProductPrice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ id, data }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/product-prices/${id}`, data);
      toast.success('Price updated successfully');
      return response.data;
    } catch (err) {
      setError(err);
      console.error('Error updating price:', err);
      toast.error(err.response?.data?.message || 'Failed to update price');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error
  };
}

/**
 * Hook to set a price as active
 * @returns {Object} Set active price function and loading/error states
 */
export function useSetActiveProductPrice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ id, productId }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/product-prices/${id}/set-active`);
      toast.success('Price set as active successfully');
      return response.data;
    } catch (err) {
      setError(err);
      console.error('Error setting active price:', err);
      toast.error(err.response?.data?.message || 'Failed to set price as active');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error
  };
}

/**
 * Hook to delete a price record
 * @returns {Object} Delete price function and loading/error states
 */
export function useDeleteProductPrice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ id, productId }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/product-prices/${id}`);
      toast.success('Price deleted successfully');
      return response.data;
    } catch (err) {
      setError(err);
      console.error('Error deleting price:', err);
      toast.error(err.response?.data?.message || 'Failed to delete price');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error
  };
}

/**
 * Hook to fetch product price statistics
 * @returns {Object} Price statistics data and loading/error states
 */
export function useProductPriceStats() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/product-prices/stats');
      setData(response.data.data);
    } catch (err) {
      setError(err);
      console.error('Error fetching price statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refetch: fetchData
  };
}
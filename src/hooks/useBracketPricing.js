import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export const useBracketPricing = () => {
  const [loading, setLoading] = useState(false);
  const [brackets, setBrackets] = useState([]);
  const [activeBracket, setActiveBracket] = useState(null);

  // Get all brackets for a product
  const getProductBrackets = async (productId) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/brackets`);
      setBrackets(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product brackets:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch brackets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get active bracket for a product
  const getActiveBracket = async (productId) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/active-bracket`);
      setActiveBracket(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch active bracket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new bracket
  const createBracket = async (productId, bracketData) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/products/${productId}/brackets`, bracketData);
      toast.success('Bracket created successfully');
      
      // Refresh brackets list
      await getProductBrackets(productId);
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to create bracket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a bracket
  const updateBracket = async (bracketId, bracketData) => {
    try {
      setLoading(true);
      const response = await api.put(`/bracket-pricing/brackets/${bracketId}`, bracketData);
      toast.success('Bracket updated successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error updating bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to update bracket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a bracket
  const deleteBracket = async (bracketId) => {
    try {
      setLoading(true);
      await api.delete(`/bracket-pricing/brackets/${bracketId}`);
      toast.success('Bracket deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to delete bracket');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activate a bracket
  const activateBracket = async (bracketId) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/brackets/${bracketId}/activate`);
      toast.success('Bracket activated successfully');
      setActiveBracket(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error activating bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to activate bracket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Deactivate bracket pricing for a product
  const deactivateBracketPricing = async (productId) => {
    try {
      setLoading(true);
      await api.delete(`/bracket-pricing/products/${productId}/deactivate`);
      toast.success('Bracket pricing deactivated successfully');
      setActiveBracket(null);
      return true;
    } catch (error) {
      console.error('Error deactivating bracket pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate bracket pricing');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get pricing breakdown
  const getPricingBreakdown = async (productId, priceType = 'regular', quantities = [1, 5, 10, 25, 50, 100]) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/breakdown`, {
        params: { price_type: priceType, quantities }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pricing breakdown:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch pricing breakdown');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate price for specific quantity
  const calculatePrice = async (productId, quantity, priceType) => {
    try {
      const response = await api.post(`/bracket-pricing/products/${productId}/calculate-price`, {
        quantity,
        price_type: priceType
      });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating price:', error);
      toast.error(error.response?.data?.message || 'Failed to calculate price');
      return null;
    }
  };

  // Get optimal pricing suggestions
  const getOptimalPricingSuggestions = async (productId, targetMargin = 0.3, quantities = [1, 10, 25, 50]) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/suggestions`, {
        params: { target_margin: targetMargin, quantities }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pricing suggestions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch pricing suggestions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clone a bracket
  const cloneBracket = async (bracketId, newBracketData = {}) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/brackets/${bracketId}/clone`, newBracketData);
      toast.success('Bracket cloned successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error cloning bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to clone bracket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Import brackets from CSV
  const importFromCsv = async (productId, csvData) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/products/${productId}/import-csv`, {
        csv_data: csvData
      });
      toast.success('Brackets imported successfully');
      
      // Refresh brackets list
      await getProductBrackets(productId);
      
      return response.data.data;
    } catch (error) {
      console.error('Error importing brackets:', error);
      toast.error(error.response?.data?.message || 'Failed to import brackets');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get specific bracket details
  const getBracket = async (bracketId) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/brackets/${bracketId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch bracket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    brackets,
    activeBracket,
    setBrackets,
    setActiveBracket,
    
    // CRUD operations
    getProductBrackets,
    getActiveBracket,
    createBracket,
    updateBracket,
    deleteBracket,
    getBracket,
    
    // Activation/Deactivation
    activateBracket,
    deactivateBracketPricing,
    
    // Pricing calculations
    getPricingBreakdown,
    calculatePrice,
    getOptimalPricingSuggestions,
    
    // Additional features
    cloneBracket,
    importFromCsv
  };
};
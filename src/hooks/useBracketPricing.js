import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export const useBracketPricing = () => {
  const [loading, setLoading] = useState(false);

  // Create bracket with multiple prices per tier
  const createBracket = async (productId, bracketData) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/products/${productId}/brackets`, bracketData);
      toast.success('Bracket created successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error creating bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to create bracket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update bracket
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

  // Get all brackets for a product
  const getProductBrackets = async (productId) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/brackets`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product brackets:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch product brackets');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all price options for a specific quantity (NEW - supports multiple prices per tier)
  const getPriceOptionsForQuantity = async (productId, quantity, priceType = 'regular') => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/price-options`, {
        params: { quantity, price_type: priceType }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching price options:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch price options');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate best price for quantity
  const calculateBestPrice = async (productId, quantity, priceType = 'regular') => {
    try {
      const response = await api.post(`/bracket-pricing/products/${productId}/calculate-best-price`, {
        quantity,
        price_type: priceType
      });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating best price:', error);
      toast.error(error.response?.data?.message || 'Failed to calculate best price');
      return null;
    }
  };

  // Get enhanced pricing breakdown with multiple options per quantity
  const getPricingBreakdown = async (productId, priceType = 'regular', quantities = [1, 5, 10, 25, 50, 100]) => {
    try {
      setLoading(true);
      const response = await api.get(`/bracket-pricing/products/${productId}/pricing-breakdown`, {
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

  // Activate a specific bracket
  const activateSpecificBracket = async (bracketId) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/brackets/${bracketId}/activate`);
      toast.success('Bracket activated successfully');
      return response.data;
    } catch (error) {
      console.error('Error activating bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to activate bracket');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Deactivate bracket pricing for a product
  const deactivateBracketPricing = async (productId) => {
    try {
      setLoading(true);
      const response = await api.post(`/bracket-pricing/products/${productId}/deactivate`);
      toast.success('Bracket pricing deactivated successfully');
      return response.data;
    } catch (error) {
      console.error('Error deactivating bracket pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate bracket pricing');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a bracket
  const deleteBracket = async (bracketId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/bracket-pricing/brackets/${bracketId}`);
      toast.success('Bracket deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error deleting bracket:', error);
      toast.error(error.response?.data?.message || 'Failed to delete bracket');
      return false;
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

  // Get optimal pricing suggestions with multiple options per tier
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

  // Helper function to group price options by tier
  const groupPriceOptionsByTier = (bracketItems) => {
    const tierMap = new Map();
    
    bracketItems.forEach(item => {
      const tierKey = `${item.min_quantity}-${item.max_quantity || 'inf'}`;
      
      if (!tierMap.has(tierKey)) {
        tierMap.set(tierKey, {
          min_quantity: item.min_quantity,
          max_quantity: item.max_quantity,
          quantity_range: item.quantity_range,
          price_entries: []
        });
      }
      
      tierMap.get(tierKey).price_entries.push({
        id: item.id,
        price: item.price,
        price_type: item.price_type,
        label: item.label,
        is_active: item.is_active,
        sort_order: item.sort_order
      });
    });
    
    // Sort tiers by min_quantity and sort price entries within each tier
    const sortedTiers = Array.from(tierMap.values()).sort((a, b) => a.min_quantity - b.min_quantity);
    
    sortedTiers.forEach(tier => {
      tier.price_entries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });
    
    return sortedTiers;
  };

  // Helper function to format price option for display
  const formatPriceOption = (option, quantity = 1) => {
    return {
      ...option,
      displayPrice: `${parseFloat(option.price).toFixed(2)}`,
      displayTotal: `${(parseFloat(option.price) * quantity).toFixed(2)}`,
      displayLabel: option.label || `${option.price_type} Price`,
      displayRange: option.quantity_range || `${option.min_quantity}+`,
      statusText: option.is_active ? 'Active' : 'Inactive',
    };
  };

  // Helper function to find best price from multiple options
  const findBestPriceInOptions = (options, criteria = 'lowest') => {
    if (!options || options.length === 0) return null;
    
    const activeOptions = options.filter(option => option.is_active);
    if (activeOptions.length === 0) return null;
    
    switch (criteria) {
      case 'lowest':
        return activeOptions.reduce((best, current) => 
          parseFloat(current.price) < parseFloat(best.price) ? current : best
        );
      case 'highest':
        return activeOptions.reduce((best, current) => 
          parseFloat(current.price) > parseFloat(best.price) ? current : best
        );
      case 'first_active':
        return activeOptions[0];
      default:
        return activeOptions[0];
    }
  };

  // Helper function to get statistics from bracket data
  const getBracketStatistics = (bracket) => {
    if (!bracket || !bracket.bracket_items) {
      return {
        totalOptions: 0,
        totalTiers: 0,
        activeOptions: 0,
        priceTypeBreakdown: {},
        priceRange: { min: 0, max: 0 }
      };
    }

    const items = bracket.bracket_items;
    const tiers = groupPriceOptionsByTier(items);
    const priceTypeCount = {};
    
    items.forEach(item => {
      priceTypeCount[item.price_type] = (priceTypeCount[item.price_type] || 0) + 1;
    });

    const prices = items.map(item => parseFloat(item.price));

    return {
      totalOptions: items.length,
      totalTiers: tiers.length,
      activeOptions: items.filter(item => item.is_active).length,
      priceTypeBreakdown: priceTypeCount,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: prices.reduce((sum, price) => sum + price, 0) / prices.length
      }
    };
  };

  // Validate pricing data before submission
  const validatePricingData = (bracketData) => {
    const errors = [];

    if (!bracketData.effective_from) {
      errors.push('Effective from date is required');
    }

    if (bracketData.effective_to && bracketData.effective_to <= bracketData.effective_from) {
      errors.push('Effective to date must be after effective from date');
    }

    if (!bracketData.bracket_items || bracketData.bracket_items.length === 0) {
      errors.push('At least one price entry is required');
    }

    bracketData.bracket_items?.forEach((item, index) => {
      if (!item.min_quantity || item.min_quantity < 1) {
        errors.push(`Item ${index + 1}: Minimum quantity must be at least 1`);
      }

      if (item.max_quantity && item.max_quantity <= item.min_quantity) {
        errors.push(`Item ${index + 1}: Maximum quantity must be greater than minimum quantity`);
      }

      if (!item.price || item.price < 0) {
        errors.push(`Item ${index + 1}: Price must be a positive number`);
      }

      if (!item.price_type || !['regular', 'wholesale', 'walk_in'].includes(item.price_type)) {
        errors.push(`Item ${index + 1}: Invalid price type`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    loading,
    
    // Enhanced CRUD operations
    createBracket,
    updateBracket,
    getProductBrackets,
    deleteBracket,
    cloneBracket,
    
    // Enhanced pricing operations
    getPriceOptionsForQuantity,
    calculateBestPrice,
    getPricingBreakdown,
    
    // Bracket management
    activateSpecificBracket,
    deactivateBracketPricing,
    
    // Suggestions and optimization
    getOptimalPricingSuggestions,
    
    // Helper functions
    groupPriceOptionsByTier,
    formatPriceOption,
    findBestPriceInOptions,
    getBracketStatistics,
    validatePricingData
  };
};

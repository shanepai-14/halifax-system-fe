import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

/**
 * Hook to fetch the entire inventory
 */
export const useGetInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await api.get('/inventory');
      return response.data.data;
    }
  });
};

/**
 * Hook to fetch inventory data for a specific product
 */
export const useGetProductInventory = (productId) => {
  return useQuery({
    queryKey: ['inventory', productId],
    queryFn: async () => {
      const response = await api.get(`/inventory/product/${productId}`);
      return response.data.data;
    },
    enabled: !!productId
  });
};

/**
 * Hook to create an inventory adjustment
 */
export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inventory/adjustments', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['inventory']);
      queryClient.invalidateQueries(['inventory', variables.product_id]);
      queryClient.invalidateQueries(['inventory-adjustments']);
      queryClient.invalidateQueries(['inventory-adjustments', variables.product_id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create adjustment');
    }
  });
};

/**
 * Hook to fetch all inventory adjustments
 */
export const useGetAdjustments = (filters = {}) => {
  return useQuery({
    queryKey: ['inventory-adjustments', filters],
    queryFn: async () => {
      const response = await api.get('/inventory/adjustments', { params: filters });
      return response.data.data;
    }
  });
};

/**
 * Hook to fetch adjustments for a specific product
 */
export const useGetProductAdjustments = (productId) => {
  return useQuery({
    queryKey: ['inventory-adjustments', productId],
    queryFn: async () => {
      const response = await api.get(`/inventory/adjustments/product/${productId}`);
      return response.data.data;
    },
    enabled: !!productId
  });
};

/**
 * Hook to fetch inventory logs
 */
export const useGetInventoryLogs = (filters = {}) => {
  return useQuery({
    queryKey: ['inventory-logs', filters],
    queryFn: async () => {
      const response = await api.get('/inventory/logs', { params: filters });
      return response.data.data;
    }
  });
};

/**
 * Hook to fetch inventory logs for a specific product
 */
export const useGetProductInventoryLogs = (productId) => {
  return useQuery({
    queryKey: ['inventory-logs', productId],
    queryFn: async () => {
      const response = await api.get(`/inventory/logs/product/${productId}`);
      return response.data.data;
    },
    enabled: !!productId
  });
};

/**
 * Hook to fetch all product transactions (purchases, sales, etc.)
 */
export const useGetProductTransactions = (productId) => {
  return useQuery({
    queryKey: ['product-transactions', productId],
    queryFn: async () => {
      const response = await api.get(`/inventory/transactions/product/${productId}`);
      return response.data.data;
    },
    enabled: !!productId
  });
};

/**
 * Hook to generate inventory reports
 */
export const useGenerateInventoryReport = () => {
  return useMutation({
    mutationFn: async (filters) => {
      const response = await api.post('/inventory/reports', filters, {
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: (error) => {
      toast.error('Failed to generate inventory report');
    }
  });
};

/**
 * Hook to create an inventory count (physical count) session
 */
export const useCreateInventoryCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inventory/counts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory-counts']);
      toast.success('Inventory count session created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create inventory count');
    }
  });
};

/**
 * Hook to get all inventory count sessions
 */
export const useGetInventoryCounts = () => {
  return useQuery({
    queryKey: ['inventory-counts'],
    queryFn: async () => {
      const response = await api.get('/inventory/counts');
      return response.data.data;
    }
  });
};

/**
 * Hook to get a specific inventory count session
 */
export const useGetInventoryCount = (countId) => {
  return useQuery({
    queryKey: ['inventory-counts', countId],
    queryFn: async () => {
      const response = await api.get(`/inventory/counts/${countId}`);
      return response.data.data;
    },
    enabled: !!countId
  });
};

/**
 * Hook to update an inventory count
 */
export const useUpdateInventoryCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ countId, data }) => {
      const response = await api.put(`/inventory/counts/${countId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['inventory-counts']);
      queryClient.invalidateQueries(['inventory-counts', variables.countId]);
      toast.success('Inventory count updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update inventory count');
    }
  });
};

/**
 * Hook to finalize an inventory count and apply discrepancies
 */
export const useFinalizeInventoryCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (countId) => {
      const response = await api.post(`/inventory/counts/${countId}/finalize`);
      return response.data;
    },
    onSuccess: (data, countId) => {
      queryClient.invalidateQueries(['inventory']);
      queryClient.invalidateQueries(['inventory-counts']);
      queryClient.invalidateQueries(['inventory-counts', countId]);
      toast.success('Inventory count finalized and discrepancies applied');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to finalize inventory count');
    }
  });
};

/**
 * Hook to get inventory warnings (low stock, expired, etc.)
 */
export const useGetInventoryWarnings = () => {
  return useQuery({
    queryKey: ['inventory-warnings'],
    queryFn: async () => {
      const response = await api.get('/inventory/warnings');
      return response.data.data;
    }
  });
};
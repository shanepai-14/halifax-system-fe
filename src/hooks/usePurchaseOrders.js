import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Get all purchase orders
export const usePurchaseOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: async () => {
      const response = await api.get('/purchase-orders', { params: filters });
      return response.data.data;
    },
  });
};

// Get single purchase order
export const usePurchaseOrder = (id) => {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: async () => {
      const response = await api.get(`/purchase-orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create purchase order
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/purchase-orders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase-orders']);
    },
  });
};

// Update purchase order
export const useUpdatePurchaseOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await api.put(`/purchase-orders/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['purchase-orders']);
      },
    });
  };

  export const useUpdatePurchaseOrderStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ id, status }) => {
        const response = await api.put(`/purchase-orders/${id}/status`, { status });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['purchase-orders']);
      },
    });
  };

  export const useUploadAttachment = () => {
    return useMutation({
      mutationFn: async ({ id, file }) => {
        const formData = new FormData();
        formData.append('attachment', file);
        
        const response = await api.post(`/purchase-orders/${id}/attachment`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
    });
  };

// Update received quantities
export const useUpdateReceivedQuantities = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, items }) => {
      const response = await api.put(`/purchase-orders/${id}/received`, { items });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase-orders']);
    },
  });
};

// Cancel purchase order
export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.put(`/purchase-orders/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['purchase-orders']);
    },
  });
};

// Get purchase order stats
export const usePurchaseOrderStats = () => {
  return useQuery({
    queryKey: ['purchase-orders-stats'],
    queryFn: async () => {
      const response = await api.get('/purchase-orders/stats');
      return response.data.data;
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Get all additional costs
export const usePurchaseOrderCosts = (filters = {}) => {
  return useQuery({
    queryKey: ['purchase-order-costs', filters],
    queryFn: async () => {
      const response = await api.get('/purchase-order-costs', { params: filters });
      return response.data.data;
    },
  });
};

// Get additional costs for specific purchase order
export const usePurchaseOrderCostsByPo = (poId) => {
  return useQuery({
    queryKey: ['purchase-order-costs', 'po', poId],
    queryFn: async () => {
      const response = await api.get('/purchase-order-costs', { 
        params: { po_id: poId } 
      });
      return response.data.data;
    },
    enabled: !!poId,
  });
};

// Get single additional cost
export const usePurchaseOrderCost = (id) => {
  return useQuery({
    queryKey: ['purchase-order-costs', id],
    queryFn: async () => {
      const response = await api.get(`/purchase-order-costs/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create additional cost
export const useCreatePurchaseOrderCost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/purchase-order-costs', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['purchase-order-costs']);
      queryClient.invalidateQueries(['purchase-orders']);
      if (data?.data?.po_id) {
        queryClient.invalidateQueries(['purchase-order-costs', 'po', data.data.po_id]);
      }
    },
  });
};

// Update additional cost
export const useUpdatePurchaseOrderCost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/purchase-order-costs/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['purchase-order-costs']);
      queryClient.invalidateQueries(['purchase-orders']);
      if (data?.data?.po_id) {
        queryClient.invalidateQueries(['purchase-order-costs', 'po', data.data.po_id]);
      }
    },
  });
};

// Delete additional cost
export const useDeletePurchaseOrderCost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/purchase-order-costs/${id}`);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(['purchase-order-costs']);
      queryClient.invalidateQueries(['purchase-orders']);
      // Note: Since we don't have PO ID in the response after deletion,
      // you might want to pass it in the context if needed
      if (context?.poId) {
        queryClient.invalidateQueries(['purchase-order-costs', 'po', context.poId]);
      }
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Get all suppliers
export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await api.get('/suppliers');
      return response.data.data;
    },
    enabled: false // Prevent automatic fetching
  });
};

// Create supplier
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (supplierData) => {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    }
  });
};

// Update supplier
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/suppliers/${id}`, data);
      return response.data;
    }
  });
};

// Delete supplier
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    }
  });
};

export const useSupplierPurchaseHistory = (supplierId, page = 1, perPage = 50) => {
  return useQuery({
    queryKey: ['supplier', supplierId, 'purchase-history', page, perPage],
    queryFn: async () => {
      const response = await api.get(`/suppliers/${supplierId}/purchase-history?page=${page}&per_page=${perPage}`);
      return response.data.data;
    },
    enabled: !!supplierId,
    keepPreviousData: true // Keep previous data while loading new data
  });
};
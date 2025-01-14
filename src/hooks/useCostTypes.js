import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Get all cost types
export const useCostTypes = (filters = {}) => {
  return useQuery({
    queryKey: ['cost-types', filters],
    queryFn: async () => {
      const response = await api.get('/additional-cost-types', { params: filters });
      return response.data.data;
    },
  });
};

// Get single cost type
export const useCostType = (id) => {
  return useQuery({
    queryKey: ['cost-types', id],
    queryFn: async () => {
      const response = await api.get(`/additional-cost-types/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create cost type
export const useCreateCostType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/additional-cost-types', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cost-types']);
    },
  });
};

// Update cost type
export const useUpdateCostType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/additional-cost-types/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cost-types']);
    },
  });
};

// Toggle cost type active status
export const useToggleCostTypeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.put(`/additional-cost-types/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cost-types']);
    },
  });
};
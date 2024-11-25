import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Products hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

// Product Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/product-categories');
      return response.data.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await api.post('/product-categories', categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
  });
};

// Attributes hooks
export const useAttributes = () => {
  return useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await api.get('/attributes');
      return response.data.data;
    },
  });
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attributeData) => {
      const response = await api.post('/attributes', attributeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('attributes');
    },
  });
};
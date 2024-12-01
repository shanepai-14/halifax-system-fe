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
    enabled: false // This prevents automatic fetching
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
 
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id,  data }) => {
      const response = await api.put(`/products/${id}`,  data); // Use PUT or PATCH based on your API design
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Error updating product:', error);
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
    enabled: false
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await api.post('/product-categories', categoryData);
      return response.data;
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
    enabled: false
  });
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attributeData) => {
      const response = await api.post('/attributes', attributeData);
      return response.data;
    },
    
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, image }) => {
      const formData = new FormData();
      formData.append('product_image', image);
      
      const response = await api.post(`/products/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (productId) => {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    }
  });
};
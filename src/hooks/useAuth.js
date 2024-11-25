import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/slices/authSlice';
import api from '@/lib/axios';

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post('/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      await api.post('/logout');
    },
    onSuccess: () => {
      dispatch(logout());
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
  });
};
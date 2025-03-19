import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Typography
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useCustomers } from '@/hooks/useCustomers';
import { useSelector } from 'react-redux';
import { selectCustomersLoading } from '@/store/slices/customerSlice';

const CustomerModal = ({ open, handleClose, customer = null, handleSuccess }) => {
  const initialFormData = {
    customer_name: '',
    contact_number: '',
    email: '',
    address: '',
    city: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const isLoading = useSelector(selectCustomersLoading);
  const { createCustomer, updateCustomer } = useCustomers();
  
  const isEditing = !!customer;

  // Reset form when modal opens or customer changes
  useEffect(() => {
    if (open) {
      if (customer) {
        setFormData({
          customer_name: customer.customer_name || '',
          contact_number: customer.contact_number || '',
          email: customer.email || '',
          address: customer.address || '',
          city: customer.city || ''
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [open, customer]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      let result;
      if (isEditing) {
        result = await updateCustomer(customer.id, formData);
      } else {
        result = await createCustomer(formData);
      }
      
      if (handleSuccess) {
        handleSuccess(result);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="customer-dialog-title"
    >
      <DialogTitle id="customer-dialog-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Customer Name *"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              error={!!errors.customer_name}
              helperText={errors.customer_name}
              disabled={isLoading}
              required

            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              error={!!errors.contact_number}
              helperText={errors.contact_number}
              disabled={isLoading}

            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}

            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              disabled={isLoading}
              multiline
              rows={2}

            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              disabled={isLoading}

            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;
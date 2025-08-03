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
  Typography,
  Autocomplete,
  Divider,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { CloseOutlined , StarOutlined, StarFilled } from '@ant-design/icons';
import { useCustomers } from '@/hooks/useCustomers';
import { useSelector } from 'react-redux';
import { selectCustomersLoading } from '@/store/slices/customerSlice';
import cities from '@/utils/cities';
import { toast } from 'sonner';
import api from '@/lib/axios';
const CustomerModal = ({ open, handleClose, customer = null, handleSuccess }) => {
  const initialFormData = {
    customer_name: '',
    contact_number: '',
    email: '',
    address: '',
    city: '',
    business_name: '',
    business_address: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const isLoading = useSelector(selectCustomersLoading);
  const [valuedCustomerDialogOpen, setValuedCustomerDialogOpen] = useState(false);
  const [valuedCustomerNotes, setValuedCustomerNotes] = useState('');
  const [isTogglingValuedStatus, setIsTogglingValuedStatus] = useState(false);
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
          city: customer.city || '',
          business_name: customer.business_name || '',
          business_address: customer.business_address || ''
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

   const handleValuedCustomerToggle = async (isChecked) => {
    if (!customer?.id) {
      toast.error('Please save the customer first before changing valued status');
      return;
    }

    if (isChecked) {
      // Show confirmation dialog when marking as valued customer
      setValuedCustomerNotes(customer?.valued_customer_notes || '');
      setValuedCustomerDialogOpen(true);
    } else {
      // Directly remove valued status when unchecking
      await confirmValuedCustomerToggle(false, '');
    }
  };

   const confirmValuedCustomerToggle = async (isValuedCustomer, notes = '') => {
    try {
      setIsTogglingValuedStatus(true);
      
      const response = await api.put(`/customers/${customer.id}/valued-status`, {
        is_valued_customer: isValuedCustomer,
        notes: notes
      });

      // Update the customer data with the response
      const updatedCustomer = response.data.data;
      
      // Call the success handler to update the parent component
      if (handleSuccess) {
        handleSuccess(updatedCustomer);
      }

      // Show success message
      toast.success(
        isValuedCustomer 
          ? 'Customer marked as valued customer successfully' 
          : 'Valued customer status removed successfully'
      );

      // Close the dialog
      setValuedCustomerDialogOpen(false);
      setValuedCustomerNotes('');

    } catch (error) {
      console.error('Error toggling valued customer status:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to update customer status. Please try again.'
      );
    } finally {
      setIsTogglingValuedStatus(false);
    }
  };

  // NEW: Handle dialog close
  const handleValuedCustomerDialogClose = () => {
    setValuedCustomerDialogOpen(false);
    setValuedCustomerNotes('');
  };

  return (
    <>
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
              label="Business Name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              error={!!errors.business_name}
              helperText={errors.business_name}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Business Address"
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              error={!!errors.business_address}
              helperText={errors.business_address}
              disabled={isLoading}
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
            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={(option) => `${option.name}`} // Display city name
              value={cities.find((city) => city.name === formData.city) || null}
              onChange={(event, newValue) => {
                handleChange({
                  target: { name: "city", value: newValue ? newValue.name : "" }
                });
              }}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  name="city"
                  size="normal"
                  slotProps={{
                    inputLabel: {
                      sx: { top: '1px' }, 
                    },
                  }}
                  error={!!errors.city}
                  helperText={errors.city}
                  disabled={isLoading}
                />
              )}
            />
          </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="start" alignItems="center">
                 {customer?.id && (


                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customer?.is_valued_customer || false}
                      onChange={(e) => handleValuedCustomerToggle(e.target.checked)}
                      icon={<StarOutlined style={{ fontSize: 23 }} />} // increase icon size
                      checkedIcon={<StarFilled style={{ color: '#ffa726', fontSize: 23 }} />}
                    />
                  }
                  label={
                    <Typography fontSize={18} fontWeight={500}>
                      Mark as Valued Customer
                    </Typography>
                  }
                />

          )}
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
 <Dialog 
        open={valuedCustomerDialogOpen} 
        onClose={handleValuedCustomerDialogClose}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarFilled style={{ color: '#ffa726' }} />
            Mark as Valued Customer
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This will enable custom pricing options for <strong>{customer?.customer_name}</strong>.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Valued customers can have:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Custom pricing per product and quantity range
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Priority over standard and bracket pricing
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Special pricing templates and bulk discounts
            </Typography>
          </Box>
          
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            value={valuedCustomerNotes}
            onChange={(e) => setValuedCustomerNotes(e.target.value)}
            placeholder="Reason for valued customer status, special terms, volume commitments, etc."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleValuedCustomerDialogClose}
            disabled={isTogglingValuedStatus}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => confirmValuedCustomerToggle(true, valuedCustomerNotes)}
            variant="contained"
            disabled={isTogglingValuedStatus}
            startIcon={isTogglingValuedStatus ? <CircularProgress size={16} /> : <StarFilled />}
          >
            {isTogglingValuedStatus ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
    
  );
};

export default CustomerModal;

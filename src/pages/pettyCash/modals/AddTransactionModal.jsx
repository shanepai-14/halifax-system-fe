import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  Autocomplete,
  Alert
} from '@mui/material';
import { CloseOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { usePettyCash } from '@/hooks/usePettyCash';

const AddTransactionModal = ({ open, onClose, onSuccess, employees, balance }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    purpose: '',
    description: '',
    amount_issued: ''
  });
  const [errors, setErrors] = useState({});

  const { createTransaction, loading } = usePettyCash();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }



    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.amount_issued) {
      newErrors.amount_issued = 'Amount is required';
    } else if (parseFloat(formData.amount_issued) <= 0) {
      newErrors.amount_issued = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount_issued) > balance) {
      newErrors.amount_issued = 'Amount cannot exceed available balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        ...formData,
        amount_issued: parseFloat(formData.amount_issued)
      };

      const result =  await createTransaction(data);

      handleClose(true ,result);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleClose = (success = false, result = null) => {
    setFormData({
      employee_id: '',
      purpose: '',
      description: '',
      amount_issued: ''
    });
    setErrors({});
    success ? onSuccess(result) : onClose();
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">New Petty Cash Transaction</Typography>
          <IconButton edge="end" color="inherit" onClick={() => handleClose()} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Available Balance: {new Intl.NumberFormat('en-PH', { 
              style: 'currency', 
              currency: 'PHP' 
            }).format(balance)}
          </Alert>
          
          <FormControl 
  fullWidth 
  margin="dense" 
  error={!!errors.employee_id}
>
  <Autocomplete
    id="employee-autocomplete"
    options={employees || []}
    getOptionLabel={(option) => `${option.full_name} - ${option.position}`}
    value={employees.find(employee => employee.id === formData.employee_id) || null}
    onChange={(event, newValue) => {
      handleChange({
        target: {
          name: 'employee_id',
          value: newValue ? newValue.id : ''
        }
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Employee *"
        error={!!errors.employee_id}
        helperText={errors.employee_id}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <>
              <InputAdornment position="start">
                <UserOutlined />
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
          )
        }}
      />
    )}
    noOptionsText="No employees available"
    loading={employees.length === 0}
    loadingText="Loading employees..."
  />
</FormControl>
          
          
          <TextField
            margin="dense"
            fullWidth
            label="Purpose *"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            error={!!errors.purpose}
            helperText={errors.purpose}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Amount to Issue *"
            type="number"
            name="amount_issued"
            value={formData.amount_issued}
            onChange={handleChange}
            error={!!errors.amount_issued}
            helperText={errors.amount_issued}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DollarOutlined />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !employees.length}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {loading ? 'Submitting...' : 'Create Transaction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionModal;
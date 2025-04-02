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
  InputAdornment
} from '@mui/material';
import { CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { usePettyCash } from '@/hooks/usePettyCash';

const AddFundModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const { createFund, loading } = usePettyCash();

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

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
        amount: parseFloat(formData.amount)
      };
      
      await createFund(data);
      handleClose(true);
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  };

  const handleClose = (success = false) => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: ''
    });
    setErrors({});
    success ? onSuccess() : onClose();
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Add Petty Cash Fund</Typography>
          <IconButton edge="end" color="inherit" onClick={() => handleClose()} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DollarOutlined />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="dense"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {loading ? 'Submitting...' : 'Add Fund'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFundModal;
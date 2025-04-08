import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
  Box
} from '@mui/material';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { usePayments } from '@/hooks/usePayments';
import { toast } from 'sonner';

const PaymentModal = ({ open, handleClose, sale, onSuccess }) => {
  const initialFormData = {
    payment_method: 'cash',
    amount: '',
    reference_number: '',
    remarks: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPayment } = usePayments();

  useEffect(() => {
    if (open && sale) {
      setFormData({
        ...initialFormData,
        amount: (sale.total - sale.amount_received )|| 0,
        received_by : sale.customer_id,
      });
      setErrors({});
    }
  }, [open, sale]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > parseFloat(sale?.total|| 0)) {
      newErrors.amount = 'Amount cannot exceed the due amount';
    }

    // Make reference number required when payment method is cheque
    if (formData.payment_method === 'cheque' && !formData.reference_number) {
      newErrors.reference_number = 'Reference number is required for cheque payments';
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
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      const result = await createPayment(sale.id, payload);
      
      if (result) {
        if (onSuccess) {
          onSuccess(result);
        }
        handleClose();
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="payment-dialog-title"
    >
      <DialogTitle id="payment-dialog-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Record Payment
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {sale && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">
              Sale #{sale.invoice_number}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Customer: {sale.customer?.customer_name || 'Walk-in Customer'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Order Date: {new Date(sale.order_date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  Total Amount: ₱{parseFloat(sale.total).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="error">
                  Amount Due: ₱{parseFloat(sale.total - sale.amount_received || 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payment_method}>
              <InputLabel id="payment-method-label">Payment Method *</InputLabel>
              <Select
                labelId="payment-method-label"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                label="Payment Method *"
                disabled={isSubmitting}
              >
                <MenuItem value="cod">Cash</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="online">Online Payment</MenuItem>

              </Select>
              {errors.payment_method && (
                <Typography variant="caption" color="error">
                  {errors.payment_method}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amount *"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Payment Date *"
              name="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={handleChange}
              error={!!errors.payment_date}
              helperText={errors.payment_date}
              disabled={true}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required={formData.payment_method === 'cheque'}
              label={formData.payment_method === 'cheque' ? "Reference Number *" : "Reference Number"}
              name="reference_number"
              value={formData.reference_number}
              onChange={handleChange}
              error={!!errors.reference_number}
              helperText={errors.reference_number}
              disabled={isSubmitting}
              placeholder="Cheque/Transaction No."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              multiline
              rows={2}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
        >
          {isSubmitting ? 'Processing...' : 'Save Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
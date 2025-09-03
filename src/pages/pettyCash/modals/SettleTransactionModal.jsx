import React, { useState, useEffect } from 'react';
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
  FormHelperText,
  Alert,
  Grid
} from '@mui/material';
import { CloseOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import { usePettyCash } from '@/hooks/usePettyCash';
import { formatCurrency } from '@/utils/formatUtils';

const SettleTransactionModal = ({ open, onClose, onSuccess, transaction }) => {
  const [formData, setFormData] = useState({
    amount_spent: '',
    amount_returned: '',
    remarks: '',
    receipt_attachment: null
  });
  const [errors, setErrors] = useState({});
  const [fileErrorText, setFileErrorText] = useState('');
  const [calculatedRemainder, setCalculatedRemainder] = useState(0);

  const { settleTransaction, loading } = usePettyCash();

  useEffect(() => {
    if (transaction) {
      // Reset form data when transaction changes
      setFormData({
        amount_spent: '',
        amount_returned: '',
        remarks: '',
        receipt_attachment: null
      });
      setErrors({});
      setFileErrorText('');
    }
  }, [transaction]);

  useEffect(() => {
    if (transaction && formData.amount_spent) {
      const amountIssued = parseFloat(transaction.amount_issued);
      const amountSpent = parseFloat(formData.amount_spent) || 0;
      const remainder = amountIssued - amountSpent;
      
      setCalculatedRemainder(remainder >= 0 ? remainder : 0);
      
      // Automatically set the amount returned to the remainder
      if (remainder >= 0) {
        setFormData(prev => ({
          ...prev,
          amount_returned: Number(remainder)
        }));
      }
    }
  }, [formData.amount_spent, transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileErrorText('');
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setFileErrorText('File size must be less than 2MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setFileErrorText('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      
      setFormData(prev => ({ ...prev, receipt_attachment: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount_spent) {
      newErrors.amount_spent = 'Amount spent is required';
    } else if (parseFloat(formData.amount_spent) < 0) {
      newErrors.amount_spent = 'Amount spent cannot be negative';
    } else if (transaction && parseFloat(formData.amount_spent) > parseFloat(transaction.amount_issued)) {
      newErrors.amount_spent = 'Amount spent cannot exceed issued amount';
    }

    if (formData.amount_returned === null || 
      formData.amount_returned === '' || 
      formData.amount_returned === undefined) {
      newErrors.amount_returned = 'Amount returned is required';
    } else if (parseFloat(formData.amount_returned) < 0) {
      newErrors.amount_returned = 'Amount returned cannot be negative';
    }

    // Check if the sum of spent and returned equals the issued amount
    if (
      transaction && 
      formData.amount_spent && 
      formData.amount_returned && 
      !newErrors.amount_spent && 
      !newErrors.amount_returned
    ) {
      const amountIssued = parseFloat(transaction.amount_issued);
      const amountSpent = parseFloat(formData.amount_spent);
      const amountReturned = parseFloat(formData.amount_returned);
      
      if (Math.abs((amountSpent + amountReturned) - amountIssued) > 0.01) { // Allow a small rounding error
        newErrors.amount_returned = 'Total of spent and returned must equal issued amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || fileErrorText) {
      return;
    }

    try {
      // If there's a file attachment, use FormData
      let data;
      if (formData.receipt_attachment) {
        data = new FormData();
        data.append('amount_spent', formData.amount_spent);
        data.append('amount_returned', formData.amount_returned);
        data.append('remarks', formData.remarks);
        data.append('receipt_attachment', formData.receipt_attachment);
      } else {
        data = {
          amount_spent: parseFloat(formData.amount_spent),
          amount_returned: parseFloat(formData.amount_returned),
          remarks: formData.remarks
        };
      }
      
      await settleTransaction(transaction.id, data);
      handleClose(true);
    } catch (error) {
      console.error('Error settling transaction:', error);
    }
  };


  const handleClose = (success = false) => {
    setFormData({
      amount_spent: '',
      amount_returned: '',
      remarks: '',
      receipt_attachment: null
    });
    setErrors({});
    setFileErrorText('');
    success ? onSuccess(success) : onClose();
  };

  if (!transaction) {
    return null;
  }

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Settle Transaction</Typography>
          <IconButton edge="end" color="inherit" onClick={() => handleClose()} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Transaction Reference: {transaction.transaction_reference}
            <br />
            Employee: {transaction.employee?.full_name}
            <br />
            Issued Amount: {formatCurrency(transaction.amount_issued)}
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                fullWidth
                label="Amount Spent *"
                type="number"
                name="amount_spent"
                value={formData.amount_spent}
                onChange={handleChange}
                error={!!errors.amount_spent}
                helperText={errors.amount_spent}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                fullWidth
                label="Amount Returned *"
                type="number"
                name="amount_returned"
                value={formData.amount_returned}
                onChange={handleChange}
                error={!!errors.amount_returned}
                helperText={errors.amount_returned}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          {/* Display remainder amount */}
          {formData.amount_spent && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Remaining amount to be returned: {formatCurrency(calculatedRemainder)}
            </Typography>
          )}
          
          <TextField
            margin="dense"
            fullWidth
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            multiline
            rows={2}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>Receipt Attachment</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FileOutlined />}
              fullWidth
            >
              Upload Receipt
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            {formData.receipt_attachment && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected file: {formData.receipt_attachment.name}
              </Typography>
            )}
            {fileErrorText && (
              <FormHelperText error>{fileErrorText}</FormHelperText>
            )}
          </Box>
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
            {loading ? 'Submitting...' : 'Settle Transaction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettleTransactionModal;
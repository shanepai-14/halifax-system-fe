import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  ContainerOutlined ,
  DeleteOutlined,
} from '@ant-design/icons';
import { usePayments } from '@/hooks/usePayments';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { formatCurrency } from '@/utils/currencyFormat';
import { toast } from 'sonner';

const PaymentHistory = ({ sale, onPaymentUpdate , setSelectedReceipt }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const { getPaymentHistory, voidPayment, isLoading } = usePayments();
  const currentUser = useSelector(selectCurrentUser);

  // Check if user has admin or cashier role
  const canManagePayments = currentUser?.role === 'admin' || currentUser?.role === 'cashier';

  if (!canManagePayments ) {
    return null; // Don't render the button if user doesn't have permission
  }

  useEffect(() => {
    if (sale) {
      fetchPaymentHistory();
    }
  }, [sale]);

  const handleClick = (payment) => {
    setSelectedReceipt({ payment: { ...payment }, sale });
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const data = await getPaymentHistory(sale.id);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoidPayment = async () => {
    if (!voidReason.trim()) {
      toast.error('Please provide a reason for voiding the payment');
      return;
    }

    try {
      await voidPayment(selectedPayment.id, voidReason);
      fetchPaymentHistory();
      if (onPaymentUpdate) {
        onPaymentUpdate();
      }
      setVoidDialogOpen(false);
      setVoidReason('');
      setSelectedPayment(null);
      toast.success('Payment voided successfully');
    } catch (error) {
      console.error('Error voiding payment:', error);
      toast.error(error.response?.data?.message || 'Failed to void payment');
    }
  };

  const openVoidDialog = (payment) => {
    setSelectedPayment(payment);
    setVoidDialogOpen(true);
  };

  const closeVoidDialog = () => {
    setVoidDialogOpen(false);
    setVoidReason('');
    setSelectedPayment(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    

  };


  const getStatusChip = (status) => {
    if (status === 'completed') {
      return <Chip label="Completed" color="success" size="small" />;
    } else if (status === 'voided') {
      return <Chip label="Voided" color="error" size="small" />;
    }
    return <Chip label={status} size="small" />;
  };

  const paymentMethodDisplay = (method) => {
    const methodMap = {
      'cash': 'Cash',
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'cheque': 'Cheque',
      'bank_transfer': 'Bank Transfer',
      'online': 'Online Payment',
      'mobile_payment': 'Mobile Payment',
      'store_credit': 'Store Credit'
    };
    
    return methodMap[method] || method;
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2">Loading payment history...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment History
        </Typography>
        
        {payments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payment records found for this sale.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Reference No.</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Received By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.created_at)}</TableCell>
                    <TableCell>{paymentMethodDisplay(payment.payment_method)}</TableCell>
                    <TableCell>
                    {payment.payment_method === 'cheque' 
                      ? `${payment.reference_number || '-'} (${formatDateOnly(payment.payment_date)})` 
                      : (payment.reference_number || '-')}
                  </TableCell>
                    <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>{payment.received_by?.customer_name || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Receipt">
                        <IconButton size="small" color="primary" onClick={() => handleClick(payment)}>
                        <ContainerOutlined />
                        </IconButton>
                      </Tooltip>
                      
                      {payment.status === 'completed' && canManagePayments && (
                        <Tooltip title="Void Payment">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => openVoidDialog(payment)}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {payment.status === 'voided' && (
                        <Tooltip title={`Void reason: ${payment.void_reason}`}>
                          <Box component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                            (Voided)
                          </Box>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Void Payment Dialog */}
      <Dialog open={voidDialogOpen} onClose={closeVoidDialog}>
        <DialogTitle>Void Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Are you sure you want to void this payment? This action cannot be undone.
          </Typography>
          
          {selectedPayment && (
            <Box sx={{ my: 2 }}>
              <Typography variant="body2">
                <strong>Payment Method:</strong> {paymentMethodDisplay(selectedPayment.payment_method)}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedPayment.payment_date)}
              </Typography>
            </Box>
          )}
          
          <TextField
            label="Reason for voiding payment"
            fullWidth
            multiline
            rows={3}
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            required
            margin="dense"
            error={!voidReason.trim()}
            helperText={!voidReason.trim() ? 'Reason is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVoidDialog}>Cancel</Button>
          <Button 
            onClick={handleVoidPayment} 
            color="error" 
            disabled={isLoading || !voidReason.trim()}
          >
            {isLoading ? 'Processing...' : 'Void Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentHistory;
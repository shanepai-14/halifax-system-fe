import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { MoneyCollectOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import PaymentModal from './PaymentModal';
import { formatCurrency } from '@/utils/currencyFormat';

const PaymentButton = ({ sale, onPaymentSuccess, disabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  // Check if user has admin or cashier role
  const canCreatePayments = currentUser?.role === 'admin' || currentUser?.role === 'cashier';

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePaymentSuccess = (result) => {
    setLoading(false);
    setModalOpen(false);
    if (onPaymentSuccess) {
      onPaymentSuccess(result);
    }
  };


  if (!canCreatePayments) {
    return null; // Don't render the button if user doesn't have permission
  }

  if (sale?.is_paid) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="success.main" fontWeight="bold">
          PAID
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        color="success"
        startIcon={loading ? <CircularProgress size={20} /> : <MoneyCollectOutlined />}
        onClick={handleOpenModal}
        disabled={disabled || loading}
        sx={{ mr: 1 }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
      
      {sale && sale.amount_due > 0 && (
        <Typography variant="body2" color="error" sx={{ ml: 1, fontWeight: 'medium' }}>
          Due: {formatCurrency(sale.amount_due)}
        </Typography>
      )}

      <PaymentModal
        open={modalOpen}
        handleClose={handleCloseModal}
        sale={sale}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default PaymentButton;
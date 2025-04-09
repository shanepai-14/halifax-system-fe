import React, { useState } from 'react';
import { Button, Box, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { usePayments } from '@/hooks/usePayments';

/**
 * CompletePaymentButton - A button component to mark pending payments as complete
 * 
 * @param {Object} props
 * @param {Object} props.payment - The payment object with id and status
 * @param {Function} props.onSuccess - Callback function after successful completion
 * @param {string} props.size - Button size (small, medium, large)
 */
const CompletePaymentButton = ({ 
  payment, 
  onSuccess, 
  size = "medium" 
}) => {
  
    const { completePayment } = usePayments();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPending = payment?.status === 'pending';

  if (!isPending) {
    return null;
  }

  const handleInitiateComplete = () => {
    setConfirming(true);
  };

  const handleCancelComplete = () => {
    setConfirming(false);
  };

  const handleConfirmComplete = async () => {
    try {
      setLoading(true);
      
      const response = await completePayment(payment.id);
      
      if (response) {
        const processedData = {
          sale: { ...response.sale },
          payment: { ...response }
        };
        console.log('processedData', processedData);
        onSuccess(processedData);
      }
    } catch (error) {
      console.error('Error in confirmation process:', error);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  // If in confirmation mode, show Yes/No buttons
  if (confirming) {
    return (
   <>
        <Tooltip title="Yes, complete this payment">
          <Button
            variant="contained"
            color="success"
            size={size}
            onClick={handleConfirmComplete}
            disabled={loading}
            startIcon={<CheckIcon />}
            sx={{ mr: 1 }}
          >
            {loading ? 'Processing...' : 'Yes'}
          </Button>
        </Tooltip>
        
        <Tooltip title="No, cancel">
          <Button
            variant="outlined"
            color="error"
            size={size}
            onClick={handleCancelComplete}
            disabled={loading}
            startIcon={<CloseIcon />}
            sx={{ mr: 1 }}
          >
            No
          </Button>
        </Tooltip>
        </>
    );
  }

  // Default state: "Complete" button (only shown for pending payments)
  return (
    <Button
      variant="outlined"
      color="primary"
      size={size}
      onClick={handleInitiateComplete}
      disabled={loading}
      sx={{ mr: 1 }}
    >
      Complete
    </Button>
  );
};

export default CompletePaymentButton;
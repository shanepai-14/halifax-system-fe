import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { CloseOutlined, PrinterOutlined } from '@ant-design/icons';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', { 
    style: 'currency', 
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to format datetime
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const FundReceiptModal = ({ open, onClose, fund, isNew = false }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({contentRef});

  if (!fund) {
    return null;
  }

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip label="APPROVED" color="success" />;
      case 'pending':
        return <Chip label="PENDING" color="warning" />;
      case 'rejected':
        return <Chip label="REJECTED" color="error" />;
      default:
        return <Chip label={status.toUpperCase()} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">
          {isNew ? 'New Fund Receipt' : 'Fund Receipt'}
        </Typography>
        <Box>
          <IconButton color="primary" onClick={handlePrint} sx={{ mr: 1 }}>
            <PrinterOutlined />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box ref={contentRef} sx={{ p: 3 }}>
          {/* Receipt Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4">PETTY CASH FUND</Typography>
            <Typography variant="h6">{fund.transaction_reference}</Typography>
            <Typography variant="body2" color="textSecondary">{formatDateTime(fund.created_at)}</Typography>
            <Box sx={{ mt: 1 }}>
              {getStatusChip(fund.status)}
            </Box>
          </Box>

          {/* Company Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography>Halifax Glass & Aluminum Supply</Typography>
              <Typography>Malagamot Road, Panacan</Typography>
              <Typography>glasshalifax@gmail.com</Typography>
              <Typography>0939 924 3876</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h6">Fund Details</Typography>
              <Typography><strong>Date:</strong> {formatDate(fund.date)}</Typography>
              <Typography><strong>Created on:</strong> {formatDateTime(fund.created_at)}</Typography>
              {fund.status === 'approved' && (
                <Typography><strong>Approved on:</strong> {formatDateTime(fund.updated_at)}</Typography>
              )}
            </Grid>
          </Grid>

          {/* Fund Amount */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: 3, 
              textAlign: 'center',
              backgroundColor: fund.status === 'approved' ? 'success.light' : 'background.paper'
            }}
          >
            <Typography variant="h6" gutterBottom>Fund Amount</Typography>
            <Typography variant="h3">{formatCurrency(fund.amount)}</Typography>
          </Paper>

          {/* Description */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography>{fund.description}</Typography>
          </Paper>

          {/* Personnel Information */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Created By</Typography>
                <Typography>{fund.creator?.name || 'System User'}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatDateTime(fund.created_at)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Approved By</Typography>
                {fund.status === 'approved' ? (
                  <>
                    <Typography>{fund.approver?.name || 'Manager'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDateTime(fund.updated_at)}
                    </Typography>
                  </>
                ) : (
                  <Typography color="textSecondary">Pending approval</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Signature Lines */}
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography>Prepared By</Typography>
                <Typography variant="caption">
                  {fund.creator?.name || 'System User'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography>Approved By</Typography>
                <Typography variant="caption">
                  {fund.status === 'approved' ? (fund.approver?.name || 'Manager') : ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              This document serves as an official record of petty cash fund allocation.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<PrinterOutlined />} 
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FundReceiptModal;
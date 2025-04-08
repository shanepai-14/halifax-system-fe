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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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

const TransactionReceiptModal = ({ open, onClose, transaction, isNew = false }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef
  });

  if (!transaction) {
    return null;
  }

  const getStatusText = (status) => {
    const statusMap = {
      'issued': 'ISSUED',
      'settled': 'SETTLED',
      'approved': 'APPROVED',
      'cancelled': 'CANCELLED'
    };
    return statusMap[status] || status.toUpperCase();
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
          {isNew ? 'New Transaction Receipt' : 'Transaction Receipt'}
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
            <Typography variant="h4">PETTY CASH TRANSACTION</Typography>
            <Typography variant="h6">{transaction.transaction_reference}</Typography>
            <Box sx={{ 
              display: 'inline-block', 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 1, 
              px: 2, 
              py: 0.5, 
              mt: 1,
              backgroundColor: 
                transaction.status === 'approved' ? 'success.light' : 
                transaction.status === 'issued' ? 'primary.light' :
                transaction.status === 'settled' ? 'info.light' : 
                'error.light'
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {getStatusText(transaction.status)}
              </Typography>
            </Box>
          </Box>

          {/* Company and Transaction Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography>Halifax Glass & Aluminum Supply</Typography>
              <Typography>Malagamot Road, Panacan</Typography>
              <Typography>glasshalifax@gmail.com</Typography>
              <Typography>0939 924 3876</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography><strong>Date:</strong> {formatDateTime(transaction.created_at)}</Typography>
              <Typography><strong>Purpose:</strong> {transaction.purpose}</Typography>
              <Typography><strong>Expense:</strong> {transaction.expense}</Typography>
              {transaction.status === 'settled' || transaction.status === 'approved' ? (
                <Typography><strong>Settled on:</strong> {formatDate(transaction.updated_at)}</Typography>
              ) : null}
            </Grid>
          </Grid>

          {/* Employee Details */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Employee Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography><strong>Name:</strong> {transaction.employee?.full_name || 'N/A'}</Typography>
                <Typography><strong>Position:</strong> {transaction.employee?.position || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Department:</strong> {transaction.employee?.department || 'N/A'}</Typography>
                <Typography><strong>Contact:</strong> {transaction.employee?.phone_number || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Transaction Summary */}
          <Typography variant="h6" gutterBottom>Transaction Summary</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="right"><strong>Amount</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Amount Issued</TableCell>
                  <TableCell align="right">{formatCurrency(transaction.amount_issued)}</TableCell>
                </TableRow>
                {(transaction.status === 'settled' || transaction.status === 'approved') && (
                  <>
                    <TableRow>
                      <TableCell>Amount Spent</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount_spent)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amount Returned</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount_returned)}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Description */}
          {transaction.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography>{transaction.description}</Typography>
              </Paper>
            </Box>
          )}

          {/* Remarks */}
          {transaction.remarks && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Remarks</Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography>{transaction.remarks}</Typography>
              </Paper>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Signature Lines */}
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography>Issued By</Typography>
                <Typography variant="caption">
                  {transaction.issuer?.name || 'System User'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography>Received By</Typography>
                <Typography variant="caption">
                  {transaction.employee?.full_name || 'Employee'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography>Approved By</Typography>
                <Typography variant="caption">
                  {transaction.status === 'approved' ? (transaction.approver?.name || 'Manager') : ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              This document serves as an official record of petty cash disbursement.
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

export default TransactionReceiptModal;
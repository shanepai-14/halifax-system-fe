import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';

const PaymentReceipt = ({ receipt, onClose }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef
  });
   console.log(receipt);
  // if (!receipt || !receipt.payment || !receipt.sale) {
  //   return null;
  // }

  const { payment, sale } = receipt;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount).toFixed(2)}`;
  };

  // Map payment methods to display names
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Payment Receipt</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrinterOutlined />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseOutlined />}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ mt: 2 }}>
        <Box ref={contentRef} sx={{ p: 4 }}>
          {/* Company Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4">PAYMENT RECEIPT</Typography>
            <Typography variant="h6">{payment.reference_number}</Typography>
            <Typography variant="body2">{formatDate(payment.payment_date)}</Typography>
          </Box>

          {/* Company Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={6}>
              <Typography >Halifax Glass & Aluminum Supply</Typography>
              <Typography >Malagamot Road, Panacan</Typography>
              <Typography >glasshalifax@gmail.com</Typography>
              <Typography >0939 924 3876</Typography>
            </Grid>
            <Grid item xs={6} md={6} sx={{ textAlign: { xs: 'right', md: 'right' } }}>
              <Typography >
                <strong>Invoice #:</strong> {sale.invoice_number}
              </Typography>
              <Typography >
                <strong>Order Date:</strong> {formatDate(sale.order_date)}
              </Typography>
              <Typography >
                <strong>Payment Status:</strong> {sale.is_paid ? 'PAID' : 'PARTIALLY PAID'}
              </Typography>
            </Grid>
          </Grid>

          {/* Customer Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={6}>
              <Typography ><strong>Bill To:</strong></Typography>
              <Typography >
                {sale.customer?.customer_name || 'Walk-in Customer'}
              </Typography>
              <Typography >
                {sale.customer?.address || sale.address || 'N/A'}
              </Typography>
              <Typography >
                {sale.customer?.city || sale.city || 'N/A'}
              </Typography>
              <Typography >
                {sale.customer?.contact_number || sale.phone || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} sx={{ textAlign: { xs: 'right', md: 'right' } }}>
              <Typography  ><strong>Payment Info:</strong></Typography>
              <Typography >
                <strong>Method:</strong> {paymentMethodDisplay(payment.payment_method)}
              </Typography>
              {payment.reference_number && (
                <Typography >
                  <strong>Reference #:</strong> {payment.reference_number}
                </Typography>
              )}
              <Typography >
                <strong>Received By:</strong> {payment.received_by?.customer_name || 'System'}
              </Typography>
            </Grid>
          </Grid>


          {/* Items Summary */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" gutterBottom>Items Summary</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.product_name || `Product #${item.product_id}`}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.sold_price)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.total_sold_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Divider sx={{ my: 1 }} />
               {/* Payment Details */}
               <Box sx={{ mb: 3 }}>
            
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography >
                  <strong>Sale Total:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography >
                  {formatCurrency(sale.total)}
                </Typography>
              </Grid>
              
              
              <Grid item xs={6}>
                <Typography >
                  <strong>This Payment:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography  sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(payment.amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography >
                  <strong>Remaining Balance:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography >
                  {formatCurrency(sale.total - sale.amount_received)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          

          {/* Notes/Remarks */}
          {(payment.remarks || sale.remarks) && (
            <Box sx={{ mb: 3 }}>
              <Typography  gutterBottom>Notes:</Typography>
              <Typography >{payment.remarks || sale.remarks}</Typography>
            </Box>
          )}

          {/* Footer with signature lines */}
          <Box sx={{ mt: 4, pt: 2 }}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                  <Typography variant="caption">Customer Signature</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                  <Typography variant="caption">Authorized Signature</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {/* Thank you message */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography >
              Thank you for your business!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentReceipt;
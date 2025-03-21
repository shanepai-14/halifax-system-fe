import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Typography, Box, Paper, Grid, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FileTextOutlined, PrinterOutlined, RollbackOutlined, HomeOutlined } from '@ant-design/icons';
import { getFileUrl } from '@/utils/fileHelper';
import { useSales } from '@/hooks/useSales';
import { formatDateForDisplay } from '@/utils/dateUtils';

// Format date for display - if not provided in utils
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const DeliveryReportView = ({ report }) => {
  const [createMemoOpen, setCreateMemoOpen] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', type: 'info' });
  
  const navigate = useNavigate();
  const contentRef = useRef();
  const { createCreditMemo } = useSales();

  // Initialize return items from report items
  React.useEffect(() => {
    if (report && report.items) {
      setReturnItems(
        report.items.map(item => ({
          ...item,
          return_quantity: 0,
          max_quantity: item.quantity
        }))
      );
    }
  }, [report]);

  const handlePrint = useReactToPrint({
    contentRef
  });

  const handleOpenCreateMemo = () => {
    setCreateMemoOpen(true);
  };

  const handleCloseCreateMemo = () => {
    setCreateMemoOpen(false);
  };

  const handleReturnQuantityChange = (itemId, value) => {
    const quantity = parseInt(value) || 0;
    setReturnItems(
      returnItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            return_quantity: Math.min(Math.max(0, quantity), item.max_quantity)
          };
        }
        return item;
      })
    );
  };

  const handleSubmitCreditMemo = async () => {
    // Filter items that have return quantity > 0
    const itemsToReturn = returnItems.filter(item => item.return_quantity > 0);
    
    if (itemsToReturn.length === 0) {
      setAlertInfo({
        open: true,
        message: 'Please specify at least one item to return',
        type: 'error'
      });
      return;
    }

    try {
      const memoData = {
        sale_id: report.id,
        reason: returnReason,
        items: itemsToReturn.map(item => ({
          product_id: item.product_id,
          quantity: item.return_quantity,
          price: item.sold_price
        }))
      };

      // Call API to create credit memo
      const result = await createCreditMemo(memoData);
      
      if (result) {
        setAlertInfo({
          open: true,
          message: 'Credit memo created successfully!',
          type: 'success'
        });
        handleCloseCreateMemo();
      }
    } catch (error) {
      setAlertInfo({
        open: true,
        message: error.message || 'Failed to create credit memo',
        type: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  };

  if (!report) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">No delivery report data available</Typography>
        <Button 
          variant="contained" 
          startIcon={<HomeOutlined />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  // Calculate totals
  const subtotal = report.items.reduce((sum, item) => {
    return sum + (parseFloat(item.sold_price) * item.quantity);
  }, 0);

  const totalDiscount = report.items.reduce((sum, item) => {
    const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
    const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
    return sum + discountAmount;
  }, 0);

  const totalAmount = subtotal - totalDiscount;

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Delivery Report Details</Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrinterOutlined />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RollbackOutlined />}
              onClick={handleOpenCreateMemo}
              disabled={report.status === 'cancelled' || report.returns?.length > 0}
            >
              Create Credit Memo
            </Button>
          </Box>
        </Box>

        <Box ref={contentRef} sx={{ p: 2 }}>
          {/* Report Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4">DELIVERY REPORT</Typography>
            <Typography variant="h6">{report.invoice_number}</Typography>
          </Box>

          {/* Customer & Order Info */}
          <Grid container spacing={2}>
            <Grid item xs={9} md={9}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Customer Information</Typography>
                <Typography variant="body1">{report.customer?.customer_name || 'Walk-in Customer'}</Typography>
                <Typography variant="body2">{report.address}</Typography>
                <Typography variant="body2">{report.city}</Typography>
                <Typography variant="body2">Phone: {report.phone}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={3} md={3}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Order Details</Typography>
                <Typography variant="body2">
                  <strong>Order Date:</strong> {formatDate(report.order_date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Delivery Date:</strong> {formatDate(report.delivery_date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment Method:</strong> {report.payment_method.charAt(0).toUpperCase() + report.payment_method.slice(1)}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Items Table */}
          <Typography variant="subtitle1" gutterBottom>Order Items</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Discount (%)</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.items.map((item) => {
                  const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
                  const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
                  const finalAmount = itemSubtotal - discountAmount;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.product_name}</TableCell>
                      <TableCell>{item.product?.product_code}</TableCell>
                      <TableCell align="right">₱{parseFloat(item.sold_price).toFixed(2)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{parseFloat(item.discount).toFixed(2)}%</TableCell>
                      <TableCell align="right">₱{finalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Returns Table (if any) */}
          {report.returns && report.returns.length > 0 && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Returns</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.returns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell>{returnItem.product?.product_name}</TableCell>
                        <TableCell>{returnItem.product?.product_code}</TableCell>
                        <TableCell align="right">₱{parseFloat(returnItem.price).toFixed(2)}</TableCell>
                        <TableCell align="center">{returnItem.quantity}</TableCell>
                        <TableCell align="right">₱{(parseFloat(returnItem.price) * returnItem.quantity).toFixed(2)}</TableCell>
                        <TableCell>{returnItem.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Payment Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Grid container spacing={1} sx={{ maxWidth: '400px' }}>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">Subtotal:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">₱{subtotal.toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" align="right">Discount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">₱{totalDiscount.toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" align="right">Total Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" align="right">₱{totalAmount.toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" align="right">Amount Received:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">₱{parseFloat(report.amount_received).toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" align="right">Change:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">₱{parseFloat(report.change).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Additional Information */}
          {report.remarks && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Remarks:</Typography>
              <Typography variant="body2">{report.remarks}</Typography>
            </Box>
          )}
          
          {/* Delivery Status */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              <strong>Delivery Status:</strong> {report.is_delivered ? 'Delivered' : 'Pending Delivery'}
            </Typography>
            <Typography variant="body2">
              <strong>Created By:</strong> {report.user?.name}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Credit Memo Dialog */}
      <Dialog 
        open={createMemoOpen} 
        onClose={handleCloseCreateMemo}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Credit Memo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Specify the items and quantities to be returned. Only items that are part of this delivery 
            report can be returned.
          </DialogContentText>
          
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Available</TableCell>
                  <TableCell align="center">Return Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.product_name}</TableCell>
                    <TableCell>{item.product?.product_code}</TableCell>
                    <TableCell align="right">₱{parseFloat(item.sold_price).toFixed(2)}</TableCell>
                    <TableCell align="center">{item.max_quantity}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: item.max_quantity } }}
                        value={item.return_quantity}
                        onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                        size="small"
                        sx={{ width: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ₱{(parseFloat(item.sold_price) * item.return_quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TextField
            margin="dense"
            id="returnReason"
            label="Reason for Return"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateMemo}>Cancel</Button>
          <Button onClick={handleSubmitCreditMemo} variant="contained" color="primary">
            Create Credit Memo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertInfo.type} sx={{ width: '100%' }}>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeliveryReportView;
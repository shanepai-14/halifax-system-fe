import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Typography, Box, Paper, Grid, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PrinterOutlined, RollbackOutlined, HomeOutlined } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import CreditMemoModal from './CreditMemoModal';
import CreditMemoReportModal from './CreditMemoReportModal';

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
  const [creditMemoReportOpen, setCreditMemoReportOpen] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
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

  const handleOpenCreditMemoReport = () => {
    setCreditMemoReportOpen(true);
  };

  const handleCloseCreditMemoReport = () => {
    setCreditMemoReportOpen(false);
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
      alert('Please specify at least one item to return');
      return;
    }

    const refund_amount = itemsToReturn.reduce((total, item) => {
      return total + item.return_quantity * item.sold_price;
    }, 0);

    try {
      const memoData = {
        sale_id: report.id,
        remarks: returnReason,
        refund_method:'cash',
        refund_amount: refund_amount,
        items: itemsToReturn.map(item => ({
          sale_item_id : item.id,
          product_id: item.product_id,
          quantity: item.return_quantity,
          price: item.sold_price
        }))
      };

      // Call API to create credit memo
      const result = await createCreditMemo(memoData);
      
      if (result) {
        handleCloseCreateMemo();
      }
    } catch (error) {
      // Error handling
    }
  };

  // Calculate total credit memo amount
  const totalCreditMemoAmount = report?.returns?.reduce((total, returnRecord) => {
    return total + parseFloat(returnRecord.refund_amount || 0);
  }, 0) || 0;

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
              disabled={report.status == 'pending'}
            >
              Create Credit Memo
            </Button>
          </Box>
        </Box>

        <Box ref={contentRef} sx={{ p: 2 }}>
          {/* Company Header with Logo */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={12}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h4">DELIVERY REPORT</Typography>
                {/* <Typography variant="h6">{report.invoice_number}</Typography> */}
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent:'space-between'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="h6">Halifax Glass & Aluminum Supply</Typography>
                <Typography variant="body2">Malagamot Road, Panacan</Typography>
                <Typography variant="body2">glasshalifax@gmail.com</Typography>
                <Typography variant="body2">0939 924 3876</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          
                <Typography variant="body2">
                  <strong>Order Date:</strong> {formatDate(report.order_date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Delivery Date:</strong> {formatDate(report.delivery_date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment Method:</strong> {report.payment_method.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {report.status.toUpperCase()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Customer & Order Info */}
          <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">

            <Grid item xs={6} md={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">
                <strong> Delivered to:</strong>  {report.customer?.business_name || report.customer?.customer_name}
                </Typography>
                <Typography variant="body2"><strong>Address:</strong>  {report.customer?.business_address || report.address}</Typography>
                <Typography variant="body2"><strong>City:</strong>  {report.city}</Typography>
                <Typography variant="body2"><strong>Phone:</strong>  {report.phone}</Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={6}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2">
                  <strong>DR #:</strong> {report.invoice_number}
                </Typography>
                {report.term_days !== 0 && report.term_days && (
              <>
                <Typography variant="subtitle2">
                  <strong>Term :</strong> {report.term_days}
                </Typography>
                </>
                )}
              </Box>
            </Grid>
        </Grid>


          <Divider sx={{ my: 1 }} />

          {/* Items Table */}
          <Typography variant="subtitle1" gutterBottom>Order Items</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Qty</TableCell>
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

      

       <Box sx={{ display: 'flex',justifyContent: 'space-between' }}>
       <Box sx={{  display: 'flex', flexDirection:'column',justifyContent: 'flex-start' }}>
            <Typography variant="body2">
              <strong>Delivery Status:</strong> {report.is_delivered ? 'Delivered' : 'Pending Delivery'}
            </Typography>
            <Typography variant="body2">
              <strong>Encoded By:</strong> {report.user?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid container spacing={0} sx={{ maxWidth: '400px' }}>
              <Grid item xs={6} >
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

              {/* Credit Memo Total - Only show when returns exist */}
              {report.returns && report.returns.length > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body2" 
                      align="right"
                      onClick={handleOpenCreditMemoReport}
                      sx={{ 
                        cursor: 'pointer', 
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' } 
                      }}
                    >
                      Credit Memo Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body2" 
                      align="right"
                      onClick={handleOpenCreditMemoReport}
                      sx={{ 
                        cursor: 'pointer', 
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' } 
                      }}
                    >
                      ₱{totalCreditMemoAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={6}>
                <Typography variant="body1" fontWeight="bold" align="right">Total Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold" align="right">
                ₱{(totalAmount - (totalCreditMemoAmount || 0)).toFixed(2)}
              </Typography>
              </Grid>
              {report.amount_received !== '0.00' && report.amount_received && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">Amount Received:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    ₱{parseFloat(report.amount_received).toFixed(2)}
                  </Typography>
                </Grid>
              </>
            )}
         {report.change !== '0.00' && report.change && (
           <>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">Change:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right">₱{parseFloat(report.change).toFixed(2)} {typeof(report.change)}</Typography>
              </Grid>
           
            </>
        
        )}
         </Grid>
      </Box>
       </Box>
          {/* Additional Information */}
          {report.remarks && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Remarks:</Typography>
              <Typography variant="body2">{report.remarks}</Typography>
            </Box>
          )}
          

          {/* Signature Lines */}
          <Grid container spacing={2} sx={{ mt: 4,px:2,display:'flex',justifyContent:'space-between' }} >
            <Grid item xs={2.4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Prepared By</Typography>
              </Box>
            </Grid>
            <Grid item xs={2.4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Checked By</Typography>
              </Box>
            </Grid>
            <Grid item xs={2.4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Released By</Typography>
              </Box>
            </Grid>
           
          </Grid>
          <Grid container spacing={2} sx={{ mt: 4,px:2,display:'flex',justifyContent:'center',gap:30 }} >
          <Grid item xs={2.4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Delivered By</Typography>
              </Box>
            </Grid>
            <Grid item xs={2.4}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Received By</Typography>
              </Box>
            </Grid>
            </Grid>
        </Box>
      </Paper>

      {/* Credit Memo Modal Component */}
      <CreditMemoModal 
        open={createMemoOpen}
        onClose={handleCloseCreateMemo}
        returnItems={returnItems}
        handleReturnQuantityChange={handleReturnQuantityChange}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
        handleSubmitCreditMemo={handleSubmitCreditMemo}
      />

      {/* Credit Memo Report Modal - Only rendered when returns exist */}
      {report.returns && report.returns.length > 0 && (
        <CreditMemoReportModal
          open={creditMemoReportOpen}
          onClose={handleCloseCreditMemoReport}
          returns={report.returns}
          report={report}
        />
      )}
    </>
  );
  }

export default DeliveryReportView;
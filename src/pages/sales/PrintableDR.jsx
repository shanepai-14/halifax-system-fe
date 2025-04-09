import React from 'react';
  import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    Grid,
    Paper,
  } from '@mui/material';
  import { formatDate } from '@/utils/dateUtils';

const PrintableDR = ({ deliveryReportData, contentRef }) => {
    if (!deliveryReportData || !deliveryReportData.orderItems) return null;
  
    // Calculate subtotal for each item
    const calculateItemSubtotal = (item) => {
      const subtotal = item.price * item.quantity;
      const discountPercentage = parseFloat(item.discount) || 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      return subtotal - discountAmount;
    };
  
    // Calculate total price
    const calculateTotal = () => {
      return deliveryReportData.orderItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
    };
    
    return (
      <Box 
        ref={contentRef} 
        sx={{ 
          display: 'none', // Hide the content by default
          '@media print': { // Show only when printing
            display: 'block',
            p: 4,
            bgcolor: 'white'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            DELIVERY REPORT
          </Typography>
          <Typography variant="h6">
            DR #: {deliveryReportData.invoiceNumber || 'DR-' + Math.floor(100000 + Math.random() * 900000)}
          </Typography>
          <Typography variant="body1">
            Date: {formatDate(deliveryReportData.orderDate)}
          </Typography>
        </Box>
  
        {/* Customer and Order Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Customer Information:
            </Typography>
            <Typography>{deliveryReportData.customer?.name || '-'}</Typography>
            <Typography>{deliveryReportData.customer?.address || '-'}</Typography>
            <Typography>City: {deliveryReportData.customer?.city || '-'}</Typography>
            <Typography>Phone: {deliveryReportData.customer?.phone || '-'}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ mb: 1 }}>
              <strong>Order Date:</strong> {formatDate(deliveryReportData.orderDate)}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Delivery Date:</strong> {formatDate(deliveryReportData.deliveryDate)}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Payment Method:</strong> {
                deliveryReportData.paymentMethod 
                  ? deliveryReportData.paymentMethod.charAt(0).toUpperCase() + deliveryReportData.paymentMethod.slice(1) 
                  : 'Cash'
              }
            </Typography>
          </Box>
        </Box>
  
        <Divider sx={{ mb: 4 }} />
  
        {/* Order Items Table */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Order Items
        </Typography>
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryReportData.orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>₱{Number(item.price).toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{(parseFloat(item.discount) || 0).toFixed(2)}%</TableCell>
                <TableCell>₱{calculateItemSubtotal(item).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total:
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                ₱{calculateTotal().toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
  
        {/* Grand Total */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Paper elevation={1} sx={{ p: 2, width: '300px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Grand Total: ₱{calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Box>
  
        {/* Footer */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
            <Box sx={{ width: '200px' }}>
              <Divider />
              <Typography sx={{ mt: 1 }}>Prepared by</Typography>
            </Box>
            <Box sx={{ width: '200px' }}>
              <Divider />
              <Typography sx={{ mt: 1 }}>Checked by</Typography>
            </Box>
            <Box sx={{ width: '200px' }}>
              <Divider />
              <Typography sx={{ mt: 1 }}>Received by</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default PrintableDR;
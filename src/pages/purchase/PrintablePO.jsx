import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';


const PrintablePO = ({ purchaseOrder , contentRef }) => {

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const quantity = item.received_quantity || item.requested_quantity;
      return sum + (item.price * quantity);
    }, 0);
  };

  return (
    <>

   

      {/* Hidden printable content */}
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
            PURCHASE ORDER
          </Typography>
          <Typography variant="h6">
            PO Number: {purchaseOrder?.po_number}
          </Typography>
        </Box>

        {/* Company and Supplier Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Supplier Information:
            </Typography>
            <Typography>{purchaseOrder?.supplier?.supplier_name}</Typography>
            <Typography>{purchaseOrder?.supplier?.address}</Typography>
            <Typography>{purchaseOrder?.supplier?.contact_number}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ mb: 1 }}>
              <strong>Date:</strong> {new Date(purchaseOrder?.po_date).toLocaleDateString()}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Status:</strong> {purchaseOrder?.status?.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            {purchaseOrder?.invoice && (
              <Typography>
                <strong>Invoice Number:</strong> {purchaseOrder.invoice}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Items Table */}
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Requested Qty</TableCell>

                <TableCell sx={{ fontWeight: 'bold' }}>Received Qty</TableCell>
              
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrder?.items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product?.product_name}</TableCell>
                <TableCell>{item.requested_quantity}</TableCell>

                  <TableCell>{item.received_quantity || 0}</TableCell>
                
                <TableCell>₱{Number(item.price).toFixed(2)}</TableCell>
                <TableCell>
                  ₱{(item.price * (item.received_quantity || item.requested_quantity)).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={purchaseOrder?.status === 'pending' ? 3 : 4} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Amount:
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                ₱{calculateTotal(purchaseOrder?.items || []).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Footer */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
            <Box sx={{ width: '200px' }}>
              <Divider />
              <Typography sx={{ mt: 1 }}>Prepared by</Typography>
            </Box>
            <Box sx={{ width: '200px' }}>
              <Divider />
              <Typography sx={{ mt: 1 }}>Approved by</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintablePO;
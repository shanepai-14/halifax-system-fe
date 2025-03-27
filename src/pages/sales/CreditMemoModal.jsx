import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Typography, Box, Chip
} from '@mui/material';

const  CreditMemoModal = ({ 
  open, 
  onClose, 
  returnItems, 
  handleReturnQuantityChange, 
  returnReason, 
  setReturnReason, 
  handleSubmitCreditMemo,
  returns = [] // Add returns as a new prop with default empty array
}) => {
  // State to hold adjusted return items
  const [adjustedItems, setAdjustedItems] = useState([]);

  // Process return items when they change or returns change
  useEffect(() => {
    if (returnItems && returnItems.length > 0) {
      // Create a map to track returned quantities by product_id
      const returnedQuantities = {};
      
      // Calculate total returned quantities for each product across all returns
      if (returns && returns.length > 0) {
        returns.forEach(returnRecord => {
          returnRecord.items.forEach(item => {
            const productId = item.product_id;
            if (!returnedQuantities[productId]) {
              returnedQuantities[productId] = 0;
            }
            returnedQuantities[productId] += parseInt(item.quantity);
          });
        });
      }
      
      // Adjust available quantities
      const adjusted = returnItems.map(item => {
        const productId = item.product_id;
        const returnedQty = returnedQuantities[productId] || 0;
        const availableQty = Math.max(0, item.max_quantity - returnedQty);
        
        return {
          ...item,
          original_max_quantity: item.max_quantity,
          max_quantity: availableQty,
          already_returned: returnedQty
        };
      });
      
      setAdjustedItems(adjusted);
    } else {
      setAdjustedItems([]);
    }
  }, [returnItems, returns]);

  // Flag if any products are available for return
  const hasAvailableItems = adjustedItems.some(item => item.max_quantity > 0);
  
  // Calculate total amount of current return items
  const totalReturnAmount = adjustedItems.reduce((total, item) => {
    return total + (parseFloat(item.sold_price) * item.return_quantity);
  }, 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create Credit Memo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Specify the items and quantities to be returned. Only items that are part of this delivery 
          report can be returned.
        </DialogContentText>
        
        {/* Summary of previous returns */}
        {returns && returns.length > 0 && (
          <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: 'background.level2', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Previous Returns:
            </Typography>
            {returns.map((ret, index) => (
              <Box key={ret.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={ret.credit_memo_number} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2">
                  {new Date(ret.return_date).toLocaleDateString()} - 
                  ₱{parseFloat(ret.refund_amount).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Code</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Original Qty</TableCell>
                <TableCell align="center">Already Returned</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Return Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adjustedItems.map((item) => (
                <TableRow 
                  key={item.id} 
                  sx={item.max_quantity === 0 ? { backgroundColor: 'rgba(0,0,0,0.04)' } : {}}
                >
                  <TableCell>{item.product?.product_name}</TableCell>
                  <TableCell>{item.product?.product_code}</TableCell>
                  <TableCell align="right">₱{parseFloat(item.sold_price).toFixed(2)}</TableCell>
                  <TableCell align="center">{item.original_max_quantity}</TableCell>
                  <TableCell align="center">
                    {item.already_returned > 0 && (
                      <Chip 
                        label={item.already_returned} 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                      />
                    )}
                    {item.already_returned === 0 && '-'}
                  </TableCell>
                  <TableCell align="center">{item.max_quantity}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      InputProps={{ 
                        inputProps: { 
                          min: 0, 
                          max: item.max_quantity 
                        } 
                      }}
                      value={item.return_quantity}
                      onChange={(e) => handleReturnQuantityChange(item.id, e.target.value,item.already_returned)}
                      size="small"
                      sx={{ width: '80px' }}
                      disabled={item.max_quantity === 0}
                    />
                  </TableCell>
                  <TableCell align="right">
                    ₱{(parseFloat(item.sold_price) * item.return_quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Typography variant="subtitle2">Total Return Amount:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    ₱{totalReturnAmount.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        {!hasAvailableItems && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="error.main">
              All items have been fully returned. No further returns are possible.
            </Typography>
          </Box>
        )}
        
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
          disabled={!hasAvailableItems}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmitCreditMemo} 
          variant="contained" 
          color="primary"
          disabled={!hasAvailableItems || totalReturnAmount <= 0}
        >
          Create Credit Memo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditMemoModal;
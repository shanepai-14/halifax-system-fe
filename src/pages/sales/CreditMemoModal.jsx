import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button
} from '@mui/material';

const CreditMemoModal = ({ 
  open, 
  onClose, 
  returnItems, 
  handleReturnQuantityChange, 
  returnReason, 
  setReturnReason, 
  handleSubmitCreditMemo 
}) => {
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmitCreditMemo} variant="contained" color="primary">
          Create Credit Memo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditMemoModal;
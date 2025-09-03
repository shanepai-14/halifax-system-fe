import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Modal, Box, Typography, Button, Paper, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/formatUtils';
const CreditMemoReportModal = ({ open, onClose, returns, report }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
     contentRef
  });

  // Calculate total refund amount from all returns
  const totalRefundAmount = returns?.reduce((total, returnRecord) => {
    return total + parseFloat(returnRecord.refund_amount);
  }, 0) || 0;

  if (!returns || returns.length === 0) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="credit-memo-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="credit-memo-modal-title" variant="h5">
            Credit Memo Details
          </Typography>
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
            <IconButton onClick={onClose} color="default">
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>

        <Box ref={contentRef} sx={{ p: 2 }}>
          {/* Company Header */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={12}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h4">CREDIT MEMO</Typography>
                <Typography variant="body2">DR #: {report?.invoice_number}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h6">Halifax Glass & Aluminum Supply</Typography>
                <Typography variant="body2">Malagamot Road, Panacan</Typography>
                <Typography variant="body2">glasshalifax@gmail.com</Typography>
                <Typography variant="body2">0939 924 3876</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(new Date())}
                </Typography>
                <Typography variant="subtitle2">
                  <strong>Customer:</strong> {report?.customer?.business_name || report?.customer?.customer_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {report?.customer?.business_address || report?.address}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {report?.phone}
                </Typography>
              </Box>
            </Grid>
          </Grid>

     

          <Divider sx={{ my: 2 }} />

          {/* Returns Table */}
          {returns.map((returnRecord, index) => (
            <Box key={returnRecord.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">
                  Credit Memo #{returnRecord.credit_memo_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(returnRecord.return_date)}
                </Typography>
              </Box>
              
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {returnRecord.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{`Product #${item.product_id}`}</TableCell>
                        <TableCell>{`P-${item.product_id}`}</TableCell>
                        <TableCell align="right">₱{parseFloat(item.price).toFixed(2)}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">₱{parseFloat(item.subtotal).toFixed(2)}</TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell>{item.return_reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Grid container spacing={0} sx={{ maxWidth: '300px' }}>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold" align="right">Refund Amount:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold" align="right">
                      ₱{parseFloat(returnRecord.refund_amount).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">Method:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {returnRecord.refund_method.toUpperCase()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {index < returns.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}

          {/* Total Refund */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Grid container spacing={0} sx={{ maxWidth: '300px' }}>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight="bold" align="right">Total Refund:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight="bold" align="right">
                  ₱{totalRefundAmount.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Remarks */}
          {returns[0]?.remarks && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Remarks:</Typography>
              <Typography variant="body2">{returns[0].remarks}</Typography>
            </Box>
          )}

          {/* Signature Lines */}
          <Grid container spacing={2} sx={{ mt: 4, px: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={3}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Prepared By</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Approved By</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center' }}>
                <Typography variant="caption">Customer Signature</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreditMemoReportModal;
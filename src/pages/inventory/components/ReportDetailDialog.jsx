import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { PrinterOutlined } from '@ant-design/icons';

const ReportDetailDialog = ({ 
  open, 
  onClose, 
  report, 
  product 
}) => {
  if (!report) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Receiving Report Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            PO #{report.reference_id}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Receipt Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Batch Number:</strong> {report.batch_number || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Receipt Date:</strong> {new Date(report.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Invoice Number:</strong> {report.invoice_number || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Payment Status:</strong> {report.is_paid ? 'Paid' : 'Unpaid'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Supplier Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Supplier:</strong> {report.supplier_name || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Contact:</strong> {report.supplier_contact || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {report.supplier_phone || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Product Details
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Received Qty</TableCell>
                  <TableCell>Cost Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{report.quantity}</TableCell>
                  <TableCell>₱{report.cost_price?.toFixed(2) || 'N/A'}</TableCell>
                  <TableCell>₱{((report.quantity || 0) * (report.cost_price || 0)).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined"
              startIcon={<PrinterOutlined />}
            >
              Print Report
            </Button>
            <Button 
              variant="contained"
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailDialog;
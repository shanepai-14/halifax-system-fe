import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  Button,
  Typography
} from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const ReceivingReportsTable = ({ 
  transactions, 
}) => {
  // Filter to show only purchase transactions
  const purchaseTransactions = transactions || [];

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return `₱${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = purchaseTransactions.map(transaction => ({
      'Batch Number': transaction.batch_number,
      'Supplier': transaction.supplier || 'N/A',
      'Quantity Received': parseFloat(transaction.quantity_received),
      'Quantity Sold': parseFloat(transaction.sold_quantity),
      'Cost Price': parseFloat(transaction.cost_price).toFixed(2),
      'Distribution Price': parseFloat(transaction.distribution_price).toFixed(2),
      'Received Date': formatDate(transaction.received_at),
      'Invoice': transaction.invoice || 'N/A',
      'Payment Status': transaction.payment_status || 'N/A'
    }));


    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receiving Reports');

    // Set column widths
    const maxWidth = 20;
    const wscols = [
      { wch: 15 },  // Batch Number
      { wch: 15 },  // Supplier
      { wch: 15 },  // Quantity Received
      { wch: 12 },  // Quantity Sold
      { wch: 12 },  // Cost Price
      { wch: 15 },  // Distribution Price
      { wch: 12 },  // Received Date
      { wch: 12 },  // Invoice
      { wch: 15 },  // Payment Status
    ];
    ws['!cols'] = wscols;

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `receiving_reports_${today}.xlsx`;

    // Write file
    XLSX.writeFile(wb, filename);
  };

  if (purchaseTransactions?.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No receiving reports found for this product.
      </Alert>
    );
  }

  // Calculate totals
  const totalReceived = purchaseTransactions.reduce((sum, t) => sum + parseFloat(t.quantity_received), 0);
  const totalSold = purchaseTransactions.reduce((sum, t) => sum + parseFloat(t.sold_quantity), 0);
  const available = totalReceived - totalSold;

  return (
    <Box>
            

                      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" >
               Receiving Reports
          </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadOutlined />}
          onClick={exportToExcel}
          size="small"
        >
          Export to Excel
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty Received</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty Sold</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Distribution Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Received Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseTransactions.map((transaction) => (
              <TableRow 
                key={transaction.received_item_id || transaction.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'grey.50' }
                }}
              >
                <TableCell>
                  <Chip 
                    label={transaction.batch_number}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>{transaction.supplier || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={`+${parseInt(transaction.quantity_received)}`}
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {parseInt(transaction.sold_quantity) > 0 ? (
                    <Chip 
                      label={parseInt(transaction.sold_quantity)}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <span style={{ color: '#999' }}>0.00</span>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {formatCurrency(transaction.cost_price)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {parseFloat(transaction.distribution_price) > 0 ? (
                    formatCurrency(transaction.distribution_price)
                  ) : (
                    <span style={{ color: '#999' }}>-</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(transaction.received_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Summary Section */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Chip 
          label={`Total Received: ${totalReceived}`}
          color="success"
        />
        <Chip 
          label={`Total Sold: ${totalSold}`}
          color="warning"
        />
        <Chip 
          label={`Available: ${available}`}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ReceivingReportsTable;
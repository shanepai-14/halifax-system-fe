// ProductHistoryModal.jsx
import React, { useState, useCallback, memo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Button, Box, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, CircularProgress
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { useProductReports } from '@/hooks/useProductReports';

const ProductHistoryModal = memo(({ open, onClose, product }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchProductDeliveryReports } = useProductReports();

  // Fetch reports when modal opens
  React.useEffect(() => {
    if (open && product?.id) {
      const fetchReports = async () => {
        setLoading(true);
        try {
          const data = await fetchProductDeliveryReports(product.id);
          setReports(data || []);
        } catch (error) {
          console.error('Failed to fetch reports:', error);
          setReports([]);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [open, product?.id, fetchProductDeliveryReports]);

  // Export to Excel function
  const handleExportExcel = useCallback(() => {
    if (!reports || reports.length === 0) return;

    // Import XLSX dynamically
    import('xlsx').then((XLSX) => {
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for Excel
      const excelData = reports.map((report, index) => ({
        'No.': index + 1,
        'DR#': report.dr_number || '-',
        'Date Sold': formatDate(report.date_sold),
        'Customer Name': report.customer_name || 'Walk-in Customer',
        'Sold Price': report.sold_price,
        'Distribution Price': report.distribution_price,
        'Quantity': report.quantity,
        'Total': report.sold_price * report.quantity
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const columnWidths = [
        { wch: 5 },  // No.
        { wch: 15 }, // DR#
        { wch: 12 }, // Date Sold
        { wch: 20 }, // Customer Name
        { wch: 12 }, // Sold Price
        { wch: 15 }, // Distribution Price
        { wch: 10 }, // Quantity
        { wch: 12 }  // Total
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Reports');
      
      // Generate filename
      const filename = `${product?.product_name || product?.name || 'Product'}_Delivery_Reports_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Save file
      XLSX.writeFile(workbook, filename);
    }).catch((error) => {
      console.error('Failed to export Excel:', error);
    });
  }, [reports, product]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div">
              Sales History - {product?.product_name || product?.name || 'Product'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Product Code: {product?.product_code || product?.code || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {reports.length > 0 && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleExportExcel}
                startIcon={<Typography>📊</Typography>}
              >
                Export Excel
              </Button>
            )}
            <IconButton onClick={onClose} size="small">
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ flex: 1, p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : reports && reports.length > 0 ? (
          <TableContainer sx={{ height: '100%' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>DR#</strong></TableCell>
                  <TableCell><strong>Date Sold</strong></TableCell>
                  <TableCell><strong>Customer Name</strong></TableCell>
                  <TableCell align="right"><strong>Sold Price</strong></TableCell>
                  <TableCell align="right"><strong>Distribution Price</strong></TableCell>
                  <TableCell align="center"><strong>Quantity</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report, index) => (
                  <TableRow key={`${report.dr_number}-${index}`} hover>
                    <TableCell>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                        {report.dr_number || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(report.date_sold)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.customer_name || 'Walk-in Customer'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main">
                        {formatCurrency(report.sold_price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="info.main">
                        {formatCurrency(report.distribution_price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={report.quantity} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency((report.sold_price || 0) * (report.quantity || 0))}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Sales History Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This product has not been sold yet or no delivery reports are available.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
});


export default ProductHistoryModal;





// ===================================================================

// Example usage in your ProductPage.jsx:

/*
import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { HistoryOutlined } from '@ant-design/icons';
import ProductHistoryModal from './ProductHistoryModal';

const ProductPage = () => {
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setHistoryModalOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      // Your existing product grid/table
      // Add this to each product:
      <Tooltip title="View Sales History">
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleViewHistory(product)}
        >
          <HistoryOutlined />
        </IconButton>
      </Tooltip>

      // Add the modal
      <ProductHistoryModal
        open={historyModalOpen}
        onClose={handleCloseHistory}
        product={selectedProduct}
      />
    </div>
  );
};
*/
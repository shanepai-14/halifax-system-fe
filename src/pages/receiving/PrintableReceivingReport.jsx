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
import { format } from 'date-fns';

/**
 * Component for printing a receiving report
 * @param {Object} props
 * @param {Object} props.receivingReport - The receiving report data to print
 * @param {React.Ref} props.contentRef - Ref for the print content
 */
const PrintableReceivingReport = ({ receivingReport, contentRef }) => {
  if (!receivingReport) return null;

  const calculateItemsTotal = (items) => {
    return items.reduce((sum, item) => 
      sum + (item.cost_price * item.received_quantity), 0
    );
  };

  const calculateCostsTotal = (costs) => {
    return costs.reduce((sum, cost) => 
      sum + (Number(cost.amount) || 0), 0
    );
  };

  const calculateGrandTotal = () => {
    const itemsTotal = calculateItemsTotal(receivingReport.received_items || []);
    const costsTotal = calculateCostsTotal(receivingReport.additional_costs || []);
    return itemsTotal + costsTotal;
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
          RECEIVING REPORT
        </Typography>
        <Typography variant="h6">
          Batch Number: {receivingReport.batch_number}
        </Typography>
      </Box>

      {/* Company and Supplier Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Supplier Information:
          </Typography>
          <Typography>{receivingReport.supplier?.supplier_name}</Typography>
          <Typography>{receivingReport.supplier?.address}</Typography>
          <Typography>{receivingReport.supplier?.contact_number}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ mb: 1 }}>
            <strong>Purchase Order:</strong> {receivingReport.po_number}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Date Received:</strong> {format(new Date(receivingReport.created_at), 'MMMM dd, yyyy')}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <strong>Status:</strong> {receivingReport.status.toUpperCase()}
          </Typography>
          {receivingReport.invoice && (
            <Typography>
              <strong>Invoice Number:</strong> {receivingReport.invoice}
            </Typography>
          )}
          {receivingReport.term > 0 && (
            <Typography>
              <strong>Payment Terms:</strong> {receivingReport.term} days
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Received Items Table */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Received Items
      </Typography>
      <Table sx={{ mb: 4 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Unit</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Walk-in Price</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Wholesale Price</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Regular Price</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(receivingReport.received_items || []).map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.product?.product_name}</TableCell>
              <TableCell>{item.received_quantity}</TableCell>
              <TableCell>{item.attribute?.unit_of_measurement}</TableCell>
              <TableCell>₱{Number(item.cost_price).toFixed(2)}</TableCell>
              <TableCell>₱{Number(item.walk_in_price).toFixed(2)}</TableCell>
              <TableCell>₱{Number(item.wholesale_price).toFixed(2)}</TableCell>
              <TableCell>₱{Number(item.regular_price).toFixed(2)}</TableCell>
              <TableCell>
                ₱{(item.cost_price * item.received_quantity).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={7} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              Items Total:
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              ₱{calculateItemsTotal(receivingReport.received_items || []).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Additional Costs Table */}
      {(receivingReport.additional_costs || []).length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Additional Costs
          </Typography>
          <Table sx={{ mb: 4 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Cost Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receivingReport.additional_costs.map((cost, index) => (
                <TableRow key={index}>
                  <TableCell>{cost.cost_type?.name}</TableCell>
                  <TableCell>₱{Number(cost.amount).toFixed(2)}</TableCell>
                  <TableCell>{cost.remarks || ''}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Additional Costs Total:
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  ₱{calculateCostsTotal(receivingReport.additional_costs).toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {/* Grand Total */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Paper elevation={2} sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Grand Total: ₱{calculateGrandTotal().toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
          <Box sx={{ width: '200px' }}>
            <Divider />
            <Typography sx={{ mt: 1 }}>Received by</Typography>
          </Box>
          <Box sx={{ width: '200px' }}>
            <Divider />
            <Typography sx={{ mt: 1 }}>Checked by</Typography>
          </Box>
          <Box sx={{ width: '200px' }}>
            <Divider />
            <Typography sx={{ mt: 1 }}>Approved by</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

}
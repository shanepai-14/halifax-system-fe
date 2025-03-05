import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Button,
  Chip,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { EyeOutlined } from '@ant-design/icons';

const ReceivingReportsAccordion = ({ 
  transactions, 
  onViewReport 
}) => {
  const [expanded, setExpanded] = useState(false);

  // Filter to show only purchase transactions
  const purchaseTransactions = transactions?.filter(t => t.transaction_type === 'purchase') || [];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (purchaseTransactions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No receiving reports found for this product.
      </Alert>
    );
  }

  return (
    <Box>
      {purchaseTransactions.map((transaction, index) => (
        <Accordion 
          key={transaction.id}
          expanded={expanded === `panel${index}`}
          onChange={handleAccordionChange(`panel${index}`)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ReceiptIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">
                  Receiving Report #{transaction.reference_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Received: {new Date(transaction.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={`+${transaction.quantity}`} 
                  color="success"
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Batch Number:</strong> {transaction.batch_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Invoice:</strong> {transaction.invoice_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Quantity Received:</strong> {transaction.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Cost Price:</strong> ₱{transaction.cost_price?.toFixed(2) || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Supplier:</strong> {transaction.supplier_name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Payment Status:</strong> {transaction.is_paid ? 'Paid' : 'Unpaid'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<EyeOutlined />}
                      onClick={() => onViewReport(transaction)}
                    >
                      View Full Report
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ReceivingReportsAccordion;
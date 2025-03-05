import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider
} from '@mui/material';

const InventoryValuationCard = ({ productInventory }) => {
  const avgCostPrice = productInventory?.avg_cost_price || 0;
  const quantity = productInventory?.quantity || 0;
  const totalValue = avgCostPrice * quantity;

  return (
    <Card elevation={1} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Inventory Valuation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Average Cost Price:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {/* ₱{avgCostPrice?.toFixed(2)} */}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Current Quantity:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {quantity}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Total Value:</Typography>
          <Typography variant="body2" fontWeight="bold">
            ₱{totalValue?.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InventoryValuationCard;
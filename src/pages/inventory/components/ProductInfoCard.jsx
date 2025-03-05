import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Chip
} from '@mui/material';
import { EditOutlined, PrinterOutlined  } from '@ant-design/icons';

// Status indicators with colors
const inventoryStatus = {
  low: { color: 'error', label: 'Low Stock', icon: null },
  normal: { color: 'success', label: 'Normal', icon: null },
  overstocked: { color: 'warning', label: 'Overstocked', icon: null },
};

const ProductInfoCard = ({ 
  product, 
  productInventory, 
  category, 
  status, 
  onAdjustInventory 
}) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
              {product.product_name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {product.product_code}
            </Typography>
          </Box>
          {product.product_image && (
            <Box
              component="img"
              sx={{ width: 80, height: 80, objectFit: 'contain' }}
              src={`/storage/${product.product_image}`}
              alt={product.product_name}
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Current Stock
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="h4" component="div" sx={{ mr: 2 }}>
              {productInventory?.quantity || 0}
            </Typography>
            <Chip 
              label={inventoryStatus[status]?.label} 
              color={inventoryStatus[status]?.color}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Category:</strong> {category?.name || 'N/A'}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Reorder Level:</strong> {product.reorder_level || 'Not Set'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditOutlined />}
            fullWidth
            onClick={onAdjustInventory}
            sx={{ mb: 1 }}
          >
            Adjust Inventory
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrinterOutlined />}
            fullWidth
            sx={{ mb: 1 }}
          >
            Print Inventory Report
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
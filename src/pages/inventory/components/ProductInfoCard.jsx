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
import { getFileUrl } from '@/utils/formatUtils';

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
        <Box sx={{ display: 'flex', justifyContent:"space-between" , mb: 0 }}>
       <Box sx={{ display: 'flex', alignItems: 'center'}}>
       {product.product_image && (
            <Box
              component="img"
              sx={{ width: 80, height: 80, objectFit: 'contain',mr:1 }}
              src={getFileUrl(product.product_image)}
              alt={product.product_name}
  
            />
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
              {product.product_name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {product.product_code}
            </Typography>
            <Typography variant="body2" gutterBottom>
          <strong>Category:</strong> {category?.name || 'N/A'}
          </Typography>
          </Box>
       </Box>

          <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Current Stock
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="h4" component="div" sx={{ mr: 2 ,mb:1 }}>
              {productInventory?.quantity || 0}
            </Typography>
            <Chip 
              label={inventoryStatus[status]?.label} 
              color={inventoryStatus[status]?.color}
              size="small"
            />
          </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Reorder Level:</strong> {product.reorder_level || 'Not Set'}
        </Typography>
        </Box>

        </Box>


{/* 

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
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
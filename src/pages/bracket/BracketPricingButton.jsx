import React, { useState } from 'react';
import {
  Button,
  Dialog,
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import {
  PriceChange as BracketIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import BracketPricingManagement from './BracketPricingManagement';

const BracketPricingButton = ({ 
  product, 
  variant = "outlined", 
  size = "small",
  showStatus = true,
  fullWidth = false 
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getBracketStatus = () => {
    // This would ideally come from the product data
    // For now, we'll assume it's passed in the product object
    if (product?.use_bracket_pricing) {
      return { active: true, label: 'Bracket Pricing' };
    }
    return { active: false, label: 'Traditional Pricing' };
  };

  const status = getBracketStatus();

  return (
    <>
      <Box sx={{  }}>
        <Tooltip title="Manage bracket pricing for this product">
          <Button
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            onClick={handleOpen}
            startIcon={<BracketIcon />}
            sx={{
              borderColor: status.active ? 'success.main' : undefined,
              color: status.active ? 'success.main' : undefined
            }}
          >
            Bracket Pricing
          </Button>
        </Tooltip>
        
        {/* {showStatus && (
          <Chip
            label={status.label}
            color={status.active ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        )} */}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh'
          }
        }}
      >
        <BracketPricingManagement
          product={product}
          onClose={handleClose}
        />
      </Dialog>
    </>
  );
};

export default BracketPricingButton;
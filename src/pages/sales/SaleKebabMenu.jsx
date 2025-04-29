import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';

const SaleKebabMenu = ({ sale }) => {
  // State for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get cancelSale function from useSales hook
  const { cancelSale } = useSales();

  // Open menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Open cancel dialog
  const handleOpenCancelDialog = () => {
    handleClose(); // Close the menu
    setCancelDialogOpen(true);
  };

  // Close cancel dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelReason('');
  };

  // Handle cancel sale
  const handleCancelSale = async () => {
    if (!cancelReason.trim()) {
      return; // Don't proceed if no reason is provided
    }
    
    setIsSubmitting(true);
    
    try {
      await cancelSale(sale.id, cancelReason);
      handleCloseCancelDialog();
    } catch (error) {
      console.error('Error cancelling sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable cancel option for sales that are already cancelled or completed
  const isCancelDisabled = sale.status === 'cancelled' || 
                           sale.status === 'completed' || 
                           sale.status === 'returned';

  return (
    <>
      {/* Kebab Menu */}
      <IconButton
        aria-label="more"
        aria-controls="sale-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon  />
      </IconButton>
      
      <Menu
        id="sale-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem 
          onClick={handleOpenCancelDialog} 
          disabled={isCancelDisabled}
          sx={{ 
            color: isCancelDisabled ? 'text.disabled' : 'error.main', 
            '&.Mui-disabled': { opacity: 0.6 }
          }}
        >
          <CloseCircleOutlined style={{ marginRight: 8 }} />
          Cancel Sale
        </MenuItem>
        {/* Add other menu items here */}
      </Menu>

      {/* Cancel Sale Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-sale-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="cancel-sale-dialog-title">
          Cancel Sale
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to cancel sale #{sale.invoice_number}? This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            id="cancel-reason"
            label="Reason for Cancellation"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            variant="outlined"
            required
            error={!cancelReason.trim()}
            helperText={!cancelReason.trim() ? "Reason is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Back
          </Button>
          <Button 
            onClick={handleCancelSale} 
            color="error" 
            disabled={!cancelReason.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaleKebabMenu;
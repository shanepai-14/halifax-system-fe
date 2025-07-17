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
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import { formatDateForInput } from '@/utils/dateUtils';

const SaleKebabMenu = ({ sale , refresh }) => {
  // State for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  console.log(sale);
  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for delivery date update dialog
  const [deliveryDateDialogOpen, setDeliveryDateDialogOpen] = useState(false);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');
  const [isUpdatingDeliveryDate, setIsUpdatingDeliveryDate] = useState(false);
  
  // Get functions from useSales hook
  const { cancelSale, updateDeliveryDate } = useSales();

 

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
    handleClose();
    setCancelDialogOpen(true);
  };

  // Close cancel dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelReason('');
  };

  // Open delivery date dialog
  const handleOpenDeliveryDateDialog = () => {
    handleClose();
    console.log(sale.delivery_date);
    setNewDeliveryDate(formatDateForInput(sale.delivery_date));
    console.log(formatDateForInput(sale.delivery_date));
    setDeliveryDateDialogOpen(true);
  };

  // Close delivery date dialog
  const handleCloseDeliveryDateDialog = () => {
    setDeliveryDateDialogOpen(false);
    setNewDeliveryDate('');
  };

  // Handle cancel sale
  const handleCancelSale = async () => {
    if (!cancelReason.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await cancelSale(sale.id, cancelReason);
      refresh(sale.id, true);
      handleCloseCancelDialog();
    } catch (error) {
      console.error('Error cancelling sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delivery date update
  const handleUpdateDeliveryDate = async () => {
    if (!newDeliveryDate) {
      return;
    }
    
    setIsUpdatingDeliveryDate(true);
    
    try {
      await updateDeliveryDate(sale.id, newDeliveryDate);
      refresh(sale.id, true);
      handleCloseDeliveryDateDialog();
    } catch (error) {
      console.error('Error updating delivery date:', error);
    } finally {
      setIsUpdatingDeliveryDate(false);
    }
  };

  // Disable options for certain sale statuses
  const isCancelDisabled = sale.status === 'cancelled' || 
                           sale.status === 'completed' || 
                           sale.status === 'returned';

  const isDeliveryDateUpdateDisabled = sale.status === 'cancelled' || 
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
        <MoreVertIcon />
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
          onClick={handleOpenDeliveryDateDialog} 
          disabled={isDeliveryDateUpdateDisabled}
          sx={{ 
            color: isDeliveryDateUpdateDisabled ? 'text.disabled' : 'primary.main',
            '&.Mui-disabled': { opacity: 0.6 }
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} />
          Edit Delivery Date
        </MenuItem>
        
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
      </Menu>

      {/* Update Delivery Date Dialog */}
      <Dialog
        open={deliveryDateDialogOpen}
        onClose={handleCloseDeliveryDateDialog}
        aria-labelledby="delivery-date-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delivery-date-dialog-title">
          Edit Delivery Date
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Edit the delivery date for sale #{sale.invoice_number}.
          </DialogContentText>
          <TextField
            autoFocus
            id="new-delivery-date"
            label="Delivery Date"
            type="date"
            fullWidth
            value={newDeliveryDate}
            onChange={(e) => setNewDeliveryDate(e.target.value)}
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: formatDateForInput(new Date()) // Prevent selecting past dates
            }}
            error={!newDeliveryDate}
            helperText={!newDeliveryDate ? "Delivery date is required" : ""}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeliveryDateDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateDeliveryDate} 
            color="primary" 
            variant="contained"
            disabled={!newDeliveryDate || isUpdatingDeliveryDate}
            startIcon={isUpdatingDeliveryDate ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isUpdatingDeliveryDate ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

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
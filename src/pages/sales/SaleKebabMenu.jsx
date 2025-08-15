import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  CircularProgress,
  Typography,
  Box,
  Slider,
  Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CloseCircleOutlined, EditOutlined, FontSizeOutlined , TruckOutlined  } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import { formatDateForInput } from '@/utils/formatUtils';
import { selectCurrentUser } from '@/store/slices/authSlice';

const SaleKebabMenu = ({ sale, refresh, itemsFontSize, setItemsFontSize }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for delivery date update dialog
  const [deliveryDateDialogOpen, setDeliveryDateDialogOpen] = useState(false);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');
  const [isUpdatingDeliveryDate, setIsUpdatingDeliveryDate] = useState(false);
  
  // State for font size dialog
  const [fontSizeDialogOpen, setFontSizeDialogOpen] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(itemsFontSize);

  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === 'admin';
  
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
    setNewDeliveryDate(formatDateForInput(sale.delivery_date));
    setDeliveryDateDialogOpen(true);
  };

  // Close delivery date dialog
  const handleCloseDeliveryDateDialog = () => {
    setDeliveryDateDialogOpen(false);
    setNewDeliveryDate('');
  };

  // Open font size dialog
  const handleOpenFontSizeDialog = () => {
    handleClose();
    setTempFontSize(itemsFontSize);
    setFontSizeDialogOpen(true);
  };

  // Close font size dialog
  const handleCloseFontSizeDialog = () => {
    setFontSizeDialogOpen(false);
    setTempFontSize(itemsFontSize);
  };

  // Apply font size changes
  const handleApplyFontSize = () => {
  setItemsFontSize(tempFontSize);
  localStorage.setItem('deliveryReport_fontSize', tempFontSize.toString()); // Add this line
  setFontSizeDialogOpen(false);
  };

  // Reset font size to default
  const handleResetFontSize = () => {
  setTempFontSize(12);
  localStorage.setItem('deliveryReport_fontSize', '12'); // Add this line
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
            width: '22ch',
          },
        }}
      >
        <MenuItem 
          onClick={handleOpenFontSizeDialog}
          sx={{ color: 'info.main' }}
        >
          <FontSizeOutlined style={{ marginRight: 8 }} />
          Adjust Font Size
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={handleOpenDeliveryDateDialog} 
          disabled={isDeliveryDateUpdateDisabled}
          sx={{ 
            color: isDeliveryDateUpdateDisabled ? 'text.disabled' : 'warning.main',
            '&.Mui-disabled': { opacity: 0.6 }
          }}
        >
          <TruckOutlined style={{ marginRight: 8 }} />
          Edit Delivery Date
        </MenuItem>
        
        {isAdmin && (
          <MenuItem
            onClick={() => navigate(`/app/delivery-report/edit/${sale.id}`)}
            sx={{ 
              color: 'primary.main',
            }}
          >
            <EditOutlined style={{ marginRight: 8 }} />
            Edit Sale
          </MenuItem>
        )}

        
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

      {/* Font Size Adjustment Dialog */}
      <Dialog
        open={fontSizeDialogOpen}
        onClose={handleCloseFontSizeDialog}
        aria-labelledby="font-size-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="font-size-dialog-title">
          Adjust Items Font Size
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Adjust the font size for product items in the delivery report. This is useful for optimizing the layout for different printers.
          </DialogContentText>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Font Size: {tempFontSize}px
            </Typography>
            <Slider
              value={tempFontSize}
              onChange={(event, newValue) => setTempFontSize(newValue)}
              aria-labelledby="font-size-slider"
              min={8}
              max={20}
              step={1}
              marks={[
                { value: 8, label: '8px' },
                { value: 12, label: '12px' },
                { value: 16, label: '16px' },
                { value: 20, label: '20px' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview:
            </Typography>
            <Typography sx={{ fontSize: tempFontSize, fontFamily: '"Courier New", monospace' }}>
              Sample Product Item Name - ₱1,234.56
            </Typography>
            <Typography sx={{ fontSize: tempFontSize - 1, fontFamily: '"Courier New", monospace', color: 'text.secondary' }}>
              Composition: Sample composition text
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFontSize}
            >
              Reset to Default (12px)
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFontSizeDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleApplyFontSize} 
            color="primary" 
            variant="contained"
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>

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
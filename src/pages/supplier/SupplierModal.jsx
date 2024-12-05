import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const SupplierModal = ({ 
  open, 
  handleClose, 
  handleAddSupplier,
  handleUpdateSupplier,
  mode = 'create',
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setFormData(initialData);
    } else {
      setFormData({
        supplier_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [initialData, mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'edit') {
      handleUpdateSupplier({
        supplier_id: formData.supplier_id,  // Make sure to include the ID
        ...formData
      });
    } else {
      handleAddSupplier(formData);
    }
    handleClose();
  }
  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Supplier';
      case 'edit':
        return 'Edit Supplier';
      case 'view':
        return 'Supplier Details';
      default:
        return 'Supplier';
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="supplier-modal-title"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography id="supplier-modal-title" variant="h6" component="h2">
            {getModalTitle()}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseOutlined />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Supplier Name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                required
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                required
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={3}
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button onClick={handleClose} variant="outlined">
                  {mode === 'view' ? 'Close' : 'Cancel'}
                </Button>
                {mode !== 'view' && (
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    {mode === 'edit' ? 'Update Supplier' : 'Add Supplier'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default SupplierModal;
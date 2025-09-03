import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import api from '@/lib/axios';

const WarehouseManagement = ({ onWarehouseChange }) => {
  // State management
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  // Form state
  const [warehouseForm, setWarehouseForm] = useState({
    code: '',
    name: '',
    location: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    description: '',
    is_active: true
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Load warehouses
  useEffect(() => {
    loadWarehouses();
  }, [page, rowsPerPage, searchTerm]);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        per_page: rowsPerPage,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await api.get(`/warehouses?${params}`);
      
      if (response.data.success) {
        setWarehouses(response.data.data.data);
        setTotalCount(response.data.data.total);
      }
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle create warehouse
  const handleCreateWarehouse = () => {
    setSelectedWarehouse(null);
    setWarehouseForm({
      code: '',
      name: '',
      location: '',
      address: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      description: '',
      is_active: true
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Handle edit warehouse
  const handleEditWarehouse = async (warehouse) => {
    try {
      const response = await api.get(`/warehouses/${warehouse.id}`);
      if (response.data.success) {
        const warehouseData = response.data.data;
        setSelectedWarehouse(warehouseData);
        setWarehouseForm({
          code: warehouseData.code || '',
          name: warehouseData.name || '',
          location: warehouseData.location || '',
          address: warehouseData.address || '',
          contact_person: warehouseData.contact_person || '',
          contact_phone: warehouseData.contact_phone || '',
          contact_email: warehouseData.contact_email || '',
          description: warehouseData.description || '',
          is_active: warehouseData.is_active !== false
        });
        setFormErrors({});
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading warehouse details:', error);
    }
  };

  // Handle form submission
  const handleSubmitWarehouse = async () => {
    try {
      setSubmitLoading(true);
      setFormErrors({});

      let response;
      if (selectedWarehouse) {
        response = await api.put(`/warehouses/${selectedWarehouse.id}`, warehouseForm);
      } else {
        response = await api.post('/warehouses', warehouseForm);
      }

      if (response.data.success) {
        setDialogOpen(false);
        loadWarehouses();
        
        // Notify parent component about warehouse changes
        if (onWarehouseChange) {
          onWarehouseChange();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      console.error('Error saving warehouse:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete warehouse
  const handleDeleteWarehouse = (warehouse) => {
    setWarehouseToDelete(warehouse);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWarehouse = async () => {
    try {
      setSubmitLoading(true);
      const response = await api.delete(`/warehouses/${warehouseToDelete.id}`);
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        setWarehouseToDelete(null);
        loadWarehouses();
        
        // Notify parent component about warehouse changes
        if (onWarehouseChange) {
          onWarehouseChange();
        }
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      // You might want to show an error message to the user here
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setWarehouseForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!warehouseForm.code.trim()) {
      errors.code = 'Warehouse code is required';
    }
    
    if (!warehouseForm.name.trim()) {
      errors.name = 'Warehouse name is required';
    }
    
    if (warehouseForm.contact_email && !warehouseForm.contact_email.includes('@')) {
      errors.contact_email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = validateForm;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Warehouse Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateWarehouse}
          disabled={loading}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Warehouses Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={30} />
                    <Typography sx={{ mt: 1 }}>Loading warehouses...</Typography>
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No warehouses found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {warehouse.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarehouseIcon color="action" />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {warehouse.name}
                          </Typography>
                          {warehouse.description && (
                            <Typography variant="caption" color="textSecondary">
                              {warehouse.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {warehouse.location || 'Not specified'}
                        </Typography>
                      </Box>
                      {warehouse.address && (
                        <Typography variant="caption" color="textSecondary">
                          {warehouse.address}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        {warehouse.contact_person && (
                          <Typography variant="body2">
                            {warehouse.contact_person}
                          </Typography>
                        )}
                        {warehouse.contact_phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {warehouse.contact_phone}
                            </Typography>
                          </Box>
                        )}
                        {warehouse.contact_email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {warehouse.contact_email}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={warehouse.is_active ? 'Active' : 'Inactive'}
                        color={warehouse.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Warehouse">
                          <IconButton
                            size="small"
                            onClick={() => handleEditWarehouse(warehouse)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Warehouse">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteWarehouse(warehouse)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Create/Edit Warehouse Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !submitLoading && setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={submitLoading}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {selectedWarehouse ? 'Edit Warehouse' : 'Create New Warehouse'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warehouse Code *"
                  value={warehouseForm.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                  disabled={submitLoading}
                  placeholder="e.g., WH001, MAIN, BRA"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warehouse Name *"
                  value={warehouseForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  disabled={submitLoading}
                  placeholder="e.g., Main Warehouse, Branch A"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={warehouseForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={submitLoading}
                  placeholder="e.g., Davao City, Manila"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={warehouseForm.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  disabled={submitLoading}
                  placeholder="Manager or contact person name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={warehouseForm.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={submitLoading}
                  multiline
                  rows={2}
                  placeholder="Full warehouse address"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={warehouseForm.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  disabled={submitLoading}
                  placeholder="e.g., +63 82 123 4567"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={warehouseForm.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  error={!!formErrors.contact_email}
                  helperText={formErrors.contact_email}
                  disabled={submitLoading}
                  placeholder="warehouse@company.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={warehouseForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={submitLoading}
                  multiline
                  rows={3}
                  placeholder="Additional notes or description about this warehouse"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={warehouseForm.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      disabled={submitLoading}
                    />
                  }
                  label="Active Warehouse"
                />
                <Typography variant="caption" color="textSecondary" display="block">
                  Inactive warehouses won't appear in transfer destination options
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSubmitWarehouse}
            disabled={submitLoading || !warehouseForm.code.trim() || !warehouseForm.name.trim()}
          >
            {submitLoading ? (
              <CircularProgress size={20} />
            ) : (
              selectedWarehouse ? 'Update Warehouse' : 'Create Warehouse'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !submitLoading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        disableEscapeKeyDown={submitLoading}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Delete Warehouse
          </Typography>
        </DialogTitle>
        <DialogContent>
          {warehouseToDelete && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> This action cannot be undone. Are you sure you want to delete this warehouse?
                </Typography>
              </Alert>
              <Typography variant="body1">
                <strong>Warehouse:</strong> {warehouseToDelete.name} ({warehouseToDelete.code})
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Location: {warehouseToDelete.location || 'Not specified'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="error"
            onClick={confirmDeleteWarehouse}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <CircularProgress size={20} />
            ) : (
              'Delete Warehouse'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehouseManagement;
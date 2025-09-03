import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  CheckCircle ,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
  Inventory as PackageIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as TransferIcon,
 AssignmentTurnedIn ,
} from '@mui/icons-material';
import api from '@/lib/axios';
import WarehouseManagement from './WarehouseManagement';
import MainCard from '@components/MainCard';
import { useNavigate } from 'react-router-dom';


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transfer-tabpanel-${index}`}
      aria-labelledby={`transfer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TransferManagement = () => {
    const navigate = useNavigate();



  const [activeTab, setActiveTab] = useState(0);
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);






  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: '',
    delivery_date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Status configurations
  const statusConfig = {
    in_transit: { color: 'info', label: 'In Transit', bgColor: '#d1ecf1', textColor: '#0c5460' },
    completed: { color: 'success', label: 'Completed', bgColor: '#d4edda', textColor: '#155724' },
    cancelled: { color: 'error', label: 'Cancelled', bgColor: '#f8d7da', textColor: '#721c24' }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount || 0);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadTransfers();
  }, [page, rowsPerPage, searchTerm, statusFilter, warehouseFilter, startDate, endDate]);

  useEffect(() => {
    loadWarehouses();
    loadStats();
  }, []);

  // API calls
  const loadTransfers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        per_page: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(warehouseFilter !== 'all' && { warehouse_id: warehouseFilter }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate })
      });

      const response = await api.get(`/transfers?${params}`);
      
      if (response.data.success) {
         const transfersWithTotals = response.data.data.data.map((transfer) => {
      const total_items = transfer.items?.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
      );

      const totalCost = transfer.items?.reduce(
        (sum, item) => sum + parseFloat(item.total_cost),
        0
      );

      return {
        ...transfer,
        total_items : total_items,
        totalCost,
      };
    });

    setTransfers(transfersWithTotals);
        setTotalCount(response.data.data.total);
      }
    } catch (error) {
      console.error('Error loading transfers:', error);
      showNotification('Failed to load transfers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await api.get('/transfers/warehouses/list');
      if (response.data.success) {
        setWarehouses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading warehouses:', error);
    }
  };

//   const loadProducts = async () => {
//     try {
//       // Use your existing products API endpoint
//       const response = await api.get('/inventory');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error loading products:', error);
//     }
//   };

  const loadStats = async () => {
    try {
      const params = new URLSearchParams({
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate })
      });

      const response = await api.get(`/transfers/statistics/overview?${params}`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Event handlers
    const handleCreateTransfer = () => {
    navigate('/app/transfers/create');
    };

    const handleViewTransfer = async (transfer) => {
    if (transfer) {
        // // compute total items
        // const total_items = transfer.items?.reduce(
        // (sum, item) => sum + parseFloat(item.quantity),
        // 0
        // );

        // // store with transfer details
        // setSelectedTransfer({
        // ...transfer,
        // total_items :total_items 
        // });

        // setDetailsDialogOpen(true);
        navigate(`/app/transfers/${transfer.id}`, { 
        state: { transferData: transfer } 
      });
    }
    };


  const handleUpdateStatus = (transfer, action) => {
    setSelectedTransfer({ ...transfer, action });
    setStatusForm({
      status: action === 'complete' ? 'completed' : 'cancelled',
      delivery_date: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setStatusDialogOpen(true);
  };

 const handleEditTransfer = (transfer) => {
  navigate(`/app/transfers/edit/${transfer.id}`);
};


  const handleSubmitStatusUpdate = async () => {
    try {
      setSubmitLoading(true);

      const response = await api.patch(`/transfers/${selectedTransfer.id}/status`, statusForm);

      if (response.data.success) {
        showNotification(response.data.message, 'success');
        setStatusDialogOpen(false);
        setSelectedTransfer(null);
        loadTransfers();
        loadStats();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };







  const handleWarehouseChange = () => {
  loadWarehouses(); // Reload warehouses when changes occur
};

// Added tab change handler
const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setWarehouseFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

    const renderActionButtons = (transfer) => {
    return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
        {/* View Details - Keep as dialog */}
        <Tooltip title="View Details">
            <IconButton onClick={() => handleViewTransfer(transfer)}>
            <ViewIcon />
            </IconButton>
        </Tooltip>

        {/* Edit - Navigate to form page */}
        {transfer.status === 'in_transit' && (
            <Tooltip title="Edit Transfer">
            <IconButton onClick={() => handleEditTransfer(transfer)}>
                <EditIcon />
            </IconButton>
            </Tooltip>
        )}

        {/* Status updates - Keep as dialogs */}
        {transfer.status === 'in_transit' && (
            <>
            <Tooltip title="Mark as Completed">
                <IconButton onClick={() => handleUpdateStatus(transfer, 'complete')}>
                <AssignmentTurnedIn  />
                </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Transfer">
                <IconButton onClick={() => handleUpdateStatus(transfer, 'cancel')}>
                <CancelIcon />
                </IconButton>
            </Tooltip>
            </>
        )}
        </Box>
    );
    };

function TransferActionButtons({ transfer }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {/* View Details - Keep as dialog */}
      <Tooltip title="View Details">
        <IconButton onClick={() => handleViewTransfer(transfer)}>
          <ViewIcon />
        </IconButton>
      </Tooltip>

      {/* Edit - Navigate to form page */}
      {transfer.status === 'in_transit' && (
        <Tooltip title="Edit Transfer">
          <IconButton onClick={() => handleEditTransfer(transfer)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Status updates - Keep as dialogs */}
      {transfer.status === 'in_transit' && (
        <>
          <Tooltip title="Mark as Completed">
            <IconButton onClick={() => handleUpdateStatus(transfer, 'complete')}>
              <AssignmentTurnedIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel Transfer">
            <IconButton onClick={() => handleUpdateStatus(transfer, 'cancel')}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}

    const renderStatusChip = (status) => {
        const config = statusConfig[status] || statusConfig.in_transit;
        return (
        <Box
            sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: config.bgColor,
            color: config.textColor,
            fontSize: '0.75rem',
            fontWeight: 500
            }}
        >
            {config.label}
        </Box>
        );
    };



  return (
     <MainCard >
    <Container maxWidth="xl" >
      {/* Loading Backdrop */}
      <Backdrop open={submitLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

   
        <Box 
        sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
        }}
        >
        <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="transfer management tabs"
        >
            <Tab 
            icon={<TransferIcon />}
            iconPosition="start" 
            label="Transfers" 
            id="transfer-tab-0" 
            />
            <Tab 
            icon={<WarehouseIcon />}
            iconPosition="start" 
            label="Warehouses" 
            id="transfer-tab-1" 
            />
        </Tabs>

        {activeTab === 0 && (
            <Button
            variant="contained"
            onClick={handleCreateTransfer}
            disabled={loading}
            startIcon={<AddIcon />}
            >
            New Transfer
            </Button>
        )}
        </Box>


     <TabPanel value={activeTab} index={0}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PackageIcon size={24} color="#666" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Transfers
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_transfers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShippingIcon size={34} color="#0c5460" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    In Transit
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#0c5460' }}>
                    {stats.in_transit_transfers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={24} color="#155724" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#155724' }}>
                    {stats.completed_transfers || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarehouseIcon size={24} color="#333" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(stats.total_value || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={20} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Warehouse</InputLabel>
              <Select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                label="Warehouse"
              >
                <MenuItem value="all">All Warehouses</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FilterIcon size={16} />
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Transfers Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Transfer #</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={30} />
                    <Typography sx={{ mt: 1 }}>Loading transfers...</Typography>
                  </TableCell>
                </TableRow>
              ) : transfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No transfers found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transfers.map((transfer) => (
                  <TableRow key={transfer.id} hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {transfer.transfer_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {transfer.warehouse?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {transfer.warehouse?.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transfer.total_items} items
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(transfer.total_value)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(transfer.status)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transfer.delivery_date ? formatDate(transfer.delivery_date) : 'Not set'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transfer.created_at)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {transfer.creator?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TransferActionButtons transfer={transfer}/>

                      {/* {renderActionButtons(transfer)} */}
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
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
  <WarehouseManagement onWarehouseChange={handleWarehouseChange} />
    </TabPanel>



      {/* Transfer Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Transfer Details: {selectedTransfer?.transfer_number}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Destination Warehouse</Typography>
                  <Typography variant="body1">{selectedTransfer.warehouse?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {selectedTransfer.warehouse?.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  {renderStatusChip(selectedTransfer.status)}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Items</Typography>
                  <Typography variant="body1">{selectedTransfer.total_items} items</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Quantity: {selectedTransfer.total_quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Value</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(selectedTransfer.total_value)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Delivery Date</Typography>
                  <Typography variant="body1">
                    {selectedTransfer.delivery_date ? formatDate(selectedTransfer.delivery_date) : 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Created By</Typography>
                  <Typography variant="body1">{selectedTransfer.creator?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(selectedTransfer.created_at)}
                  </Typography>
                </Grid>
                {selectedTransfer.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedTransfer.notes}</Typography>
                  </Grid>
                )}
              </Grid>

              {/* Transfer Items List */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Transfer Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                      {/* <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell> */}
                      <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTransfer.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.product?.product_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {item.product?.product_code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {parseInt(item.quantity)}
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography variant="body2">
                            {formatCurrency(item.unit_cost)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.total_cost)}
                          </Typography>
                        </TableCell> */}
                        <TableCell>
                          <Typography variant="caption" color="textSecondary">
                            {item.notes || 'No notes'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => !submitLoading && setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={submitLoading}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Update Transfer Status
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTransfer && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Transfer: <strong>{selectedTransfer.transfer_number}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Destination: <strong>{selectedTransfer.warehouse?.name}</strong>
              </Typography>
              
              {selectedTransfer.action === 'cancel' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Cancellation Reason"
                  value={statusForm.reason}
                  onChange={(e) => setStatusForm({...statusForm, reason: e.target.value})}
                  placeholder="Please provide a reason for cancellation..."
                  sx={{ mb: 2 }}
                  disabled={submitLoading}
                  required
                />
              )}
              
              {selectedTransfer.action === 'complete' && (
                <TextField
                  fullWidth
                  type="date"
                  label="Actual Delivery Date"
                  value={statusForm.delivery_date}
                  onChange={(e) => setStatusForm({...statusForm, delivery_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  disabled={submitLoading}
                />
              )}

              {selectedTransfer.action === 'cancel' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <strong>Warning:</strong> Cancelling this transfer will restore the inventory quantities 
                  that were reduced when the transfer was created.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setStatusDialogOpen(false)}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color={selectedTransfer?.action === 'cancel' ? 'error' : 'primary'}
            onClick={handleSubmitStatusUpdate}
            disabled={
              submitLoading || 
              (selectedTransfer?.action === 'cancel' && !statusForm.reason.trim())
            }
          >
            {submitLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                {selectedTransfer?.action === 'complete' && 'Mark Completed'}
                {selectedTransfer?.action === 'cancel' && 'Cancel Transfer'}
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({...notification, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({...notification, open: false})} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
    </MainCard>
  );
};

export default TransferManagement;
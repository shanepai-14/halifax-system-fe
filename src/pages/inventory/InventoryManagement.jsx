import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Skeleton,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined,
  WarningOutlined
} from '@ant-design/icons';
import InventoryAdjustmentForm from './InventoryAdjustmentForm';
import InventorySummaryCards from './components/InventorySummaryCards';
import { useSelector } from 'react-redux';
import { selectProducts, selectCategories } from '@/store/slices/productsSlice';
import { toast } from 'sonner';
import { 
  useGetInventory, 
  useCreateAdjustment, 
  useGetAdjustments,
  useGetInventoryLogs,
  useInventorySummaryStats
} from '@/hooks/useInventory';

// Status indicators with colors
const inventoryStatus = {
  low: { color: 'error', label: 'Low Stock' },
  normal: { color: 'success', label: 'Normal' },
  overstocked: { color: 'warning', label: 'Overstocked' },
};

const adjustmentTypes = [
  { value: 'addition', label: 'Addition' },
  { value: 'reduction', label: 'Reduction' },
  { value: 'damage', label: 'Damage' },
  { value: 'loss', label: 'Loss' },
];

// Skeleton loader for table rows
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Get data from Redux and custom hooks
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const { data: inventory = [], isLoading: isLoadingInventory, refetch: refetchInventory } = useGetInventory();
  const { data: adjustments = [], isLoading: isLoadingAdjustments } = useGetAdjustments();
  const { mutateAsync: createAdjustment } = useCreateAdjustment();
  const { data: inventoryLogs = [], isLoading: isLoadingLogs } = useGetInventoryLogs();
  const { data: summaryStats = {}, isLoading: isLoadingStats } = useInventorySummaryStats();

  const inventoryData = React.useMemo(() => {
    return inventory.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        ...item,
        ...product,
        status: determineStockStatus(item.quantity, product?.reorder_level || 0)
      };
    });
  }, [inventory, products]);

  // Calculate summary statistics from inventory data
  const inventorySummaryStats = React.useMemo(() => {
    // This would normally be calculated from real data
    // Here using sample calculations for demonstration
    const totalItems = inventoryData.length;
    const totalValue = inventoryData.reduce(
      (sum, item) => sum + (item.quantity * (item.cost_price || 0)), 0
    );
    const lowStockItems = inventoryData.filter(item => item.status === 'low').length;
    const reorderNeeded = inventoryData.filter(
      item => item.quantity <= (item.reorder_level * 0.7)
    ).length;
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      reorderNeeded,
      // Other statistics would come from various sources in a real app
      topSellingItems: 5,
      incomingStock: 42,
      inventoryTurnover: 4.2,
      stockAccuracy: 98.3
    };
  }, [inventoryData]);

  // Filter inventory data
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || 
      item.product_category_id?.toString() === categoryFilter;
  
    const matchesStatus = statusFilter === 'All Status' ||
      item.status === statusFilter.toLowerCase();
  
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Determine stock status based on quantity and reorder level
  function determineStockStatus(quantity, reorderLevel) {
    if (quantity <= reorderLevel) {
      return 'low';
    } else if (quantity > reorderLevel * 3) {
      return 'overstocked';
    } else {
      return 'normal';
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
  };

  const handleOpenAdjustmentDialog = (product) => {
    setSelectedProduct(product);
    setAdjustmentDialogOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  }

  const handleCloseAdjustmentDialog = () => {
    setAdjustmentDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAdjustmentSubmit = async (adjustmentData) => {
    try {
      // Create payload with basic fields
      const payload = {
        id: adjustmentData.id,
        quantity: adjustmentData.quantity,
        adjustment_type: adjustmentData.type,
        reason: adjustmentData.reason,
        notes: adjustmentData.notes
      };
      
      // Add pricing fields to payload if adjustment type is 'addition'
      if (adjustmentData.type === 'addition') {
        payload.distribution_price = adjustmentData.distribution_price;
        payload.walk_in_price = adjustmentData.walk_in_price;
        payload.wholesale_price = adjustmentData.wholesale_price;
        payload.regular_price = adjustmentData.regular_price;
      }
      
      await createAdjustment(payload);
      toast.success('Inventory adjustment recorded successfully');
      refetchInventory();
      handleCloseAdjustmentDialog();
    } catch (error) {
      toast.error('Error recording adjustment: ' + (error.message || 'Unknown error'));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewProduct = (productId) => {
    navigate(`/app/inventory/${productId}`);
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
        <InventorySummaryCards 
        inventoryData={inventoryData} 
        stats={summaryStats}
        isLoading={isLoadingStats}
      />
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Current Inventory" />
          <Tab label="Adjustments History" />
          <Tab label="Inventory Logs" />
        </Tabs>

        {/* Current Inventory Tab */}
        {tabValue === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <TextField
                  placeholder="Search product name or code"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="All Categories">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Stock Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Stock Status"
                  >
                    <MenuItem value="All Status">All Status</MenuItem>
                    <MenuItem value="Low">Low Stock</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Overstocked">Overstocked</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Button 
                  variant="text" 
                  color="error" 
                  sx={{mr: 1}} 
                  onClick={handleClearFilter}
                >
                  <ClearOutlined />
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<ReloadOutlined />}
                  onClick={() => refetchInventory()}
                  sx={{ mr: 1 }}
                >
                  Refresh
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<PlusOutlined />}
                  onClick={() => handleOpenAdjustmentDialog({ product_id: null })}
                >
                  New Adjustment
                </Button>
              </Box>
            </Box>

            {/* Low stock alert */}
            {filteredData.some(item => item.status === 'low') && (
              <Alert 
                severity="warning" 
                sx={{ mb: 2 }}
                icon={<WarningOutlined />}
              >
                Some products are below their reorder levels. Please check and restock as needed.
              </Alert>
            )}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Code</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Current Qty</TableCell>
                    <TableCell>Reorder Level</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingInventory ? (
                    Array.from(Array(rowsPerPage)).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No inventory items found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.product_id} hover>
                          <TableCell>{item.product_code}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {/* {item.product_image && (
                                <Box
                                  component="img"
                                  sx={{ width: 40, height: 40, mr: 2, objectFit: 'contain' }}
                                  src={`/storage/${item.product_image}`}
                                  alt={item.product_name}
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.png';
                                  }}
                                />
                              )} */}
                              {item.product_name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {categories.find(c => c.id === item.product_category_id)?.name || '-'}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.reorder_level}</TableCell>
                          <TableCell>
                            <Chip 
                              label={inventoryStatus[item.status]?.label} 
                              color={inventoryStatus[item.status]?.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Product Details">
                              <IconButton onClick={() => handleViewProduct(item.product_id)}>
                                <EyeOutlined />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Adjust Inventory">
                              <IconButton onClick={() => handleOpenAdjustmentDialog(item)}>
                                <EditOutlined />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                disabled={page === 0} 
                onClick={() => setPage(page - 1)}
                sx={{ mr: 1 }}
              >
                Previous
              </Button>
              <Button 
                disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1} 
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {/* Adjustments History Tab */}
        {tabValue === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Inventory Adjustments History
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<DownloadOutlined />}
                onClick={() => console.log('Download adjustments report')}
              >
                Export Report
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Adjustment Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Performed By</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingAdjustments ? (
                    Array.from(Array(rowsPerPage)).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : adjustments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No adjustment records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    adjustments.map((adjustment) => {
                      const product = products.find(p => p.id === adjustment.product_id);
                      return (
                        <TableRow key={adjustment.id} hover>
                          <TableCell>
                            {new Date(adjustment.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{product?.product_name || 'Unknown Product'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={adjustment.adjustment_type.charAt(0).toUpperCase() + adjustment.adjustment_type.slice(1)} 
                              color={
                                adjustment.adjustment_type === 'addition' || adjustment.adjustment_type === 'return' 
                                  ? 'success' 
                                  : adjustment.adjustment_type === 'correction' 
                                    ? 'info' 
                                    : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {adjustment.adjustment_type === 'addition' || adjustment.adjustment_type === 'return' 
                              ? `+${adjustment.quantity}` 
                              : `-${adjustment.quantity}`}
                          </TableCell>
                          <TableCell>{adjustment.reason}</TableCell>
                          <TableCell>{adjustment.user?.name || 'System'}</TableCell>
                          <TableCell>{adjustment.notes || '-'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Inventory Logs Tab */}
        {tabValue === 2 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Inventory Transaction History
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<DownloadOutlined />}
                onClick={() => console.log('Download logs report')}
              >
                Export Logs
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Transaction Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Before</TableCell>
                    <TableCell>After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingLogs ? (
                    Array.from(Array(rowsPerPage)).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : inventoryLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No inventory logs found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventoryLogs.map((log) => {
                      const product = products.find(p => p.id === log.product_id);
                      return (
                        <TableRow key={log.id} hover>
                          <TableCell>
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{product?.product_name || 'Unknown Product'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={log.transaction_type.charAt(0).toUpperCase() + log.transaction_type.slice(1)} 
                              color={
                                log.transaction_type === 'purchase' || log.transaction_type === 'adjustment_in'
                                  ? 'success' 
                                  : log.transaction_type === 'sales' || log.transaction_type === 'adjustment_out'
                                    ? 'error' 
                                    : 'info'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {log.transaction_type === 'purchase' || log.transaction_type === 'adjustment_in'
                              ? `+${log.quantity}` 
                              : `-${log.quantity}`}
                          </TableCell>
                          <TableCell>
                            {log.reference_type === 'purchase_order' 
                              ? `PO-${log.reference_id}` 
                              : log.reference_type === 'sales_order'
                                ? `SO-${log.reference_id}`
                                : log.reference_type === 'adjustment'
                                  ? `ADJ-${log.reference_id}`
                                  : log.reference_id}
                          </TableCell>
                          <TableCell>{log.quantity_before}</TableCell>
                          <TableCell>{log.quantity_after}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      {/* Adjustment Dialog */}
      <Dialog 
        open={adjustmentDialogOpen} 
        onClose={handleCloseAdjustmentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct?.product_name 
            ? `Adjust Inventory: ${selectedProduct.product_name}` 
            : 'New Inventory Adjustment'}
        </DialogTitle>
        <DialogContent>
          <InventoryAdjustmentForm 
            product={selectedProduct}
            products={products}
            adjustmentTypes={adjustmentTypes}
            onSubmit={handleAdjustmentSubmit}
            onCancel={handleCloseAdjustmentDialog}
            onSelectedProduct={handleSelectProduct}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default InventoryManagement;
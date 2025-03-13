import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle
} from '@mui/material';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectProducts, selectAttributes, selectCategories } from '@/store/slices/productsSlice';
import { toast } from 'sonner';
import { 
  useGetProductInventory, 
  useCreateAdjustment, 
  useGetProductAdjustments,
  useGetProductInventoryLogs,
  useGetProductTransactions,
  useGetProductReport
} from '@/hooks/useInventory';

// Import the component pieces
import ProductInfoCard from './components/ProductInfoCard';
import ProductAttributesCard from './components/ProductAttributesCard';
import InventoryValuationCard from './components/InventoryValuationCard';
import StockMovementChart from './components/StockMovementChart';
import ReceivingReportsAccordion from './components/ReceivingReportsAccordion';
import TransactionHistoryTable from './components/TransactionHistoryTable';
import AdjustmentsTable from './components/AdjustmentsTable';
import ReportDetailDialog from './components/ReportDetailDialog';
import InventoryAdjustmentForm from './InventoryAdjustmentForm';
import OverviewTabContent from './components/OverviewTabContent';

// Adjustment types array (for consistent use across components)
const adjustmentTypes = [
  { value: 'addition', label: 'Addition' },
  { value: 'reduction', label: 'Reduction' },
  { value: 'damage', label: 'Damage' },
  { value: 'loss', label: 'Loss' },
  // { value: 'return', label: 'Return' },
  { value: 'correction', label: 'Correction' },
];

const InventoryProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [chartPeriod, setChartPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data using custom hooks
  const { data: productInventory, isLoading: isLoadingInventory, refetch: refetchInventory } = useGetProductInventory(id);
  const { data: productAdjustments, isLoading: isLoadingAdjustments } = useGetProductAdjustments(id);
  const { data: inventoryLogs, isLoading: isLoadingLogs } = useGetProductInventoryLogs(id);
  const { data: productTransactions, isLoading: isLoadingTransactions } = useGetProductTransactions(id);
  const { data: productReport, isLoading: isLoadingReport } = useGetProductReport(id);
 
  const { mutateAsync: createAdjustment } = useCreateAdjustment();

  // Get data from Redux
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const attributes = useSelector(selectAttributes);

  // Find product details
  const product = products.find(p => p.id === Number(id));
  
  // Determine stock status based on quantity and reorder level
  const determineStockStatus = (quantity, reorderLevel) => {
    if (quantity <= reorderLevel) {
      return 'low';
    } else if (quantity > reorderLevel * 3) {
      return 'overstocked';
    } else {
      return 'normal';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenAdjustmentDialog = () => {
    setAdjustmentDialogOpen(true);
  };

  const handleCloseAdjustmentDialog = () => {
    setAdjustmentDialogOpen(false);
  };

  const handleAdjustmentSubmit = async (adjustmentData) => {
    try {
      await createAdjustment({
        id: Number(id),
        product_id: Number(id),
        quantity: Number(adjustmentData.quantity),
        adjustment_type: adjustmentData.type,
        reason: adjustmentData.reason,
        notes: adjustmentData.notes
      });
      toast.success('Inventory adjustment recorded successfully');
      refetchInventory();
      handleCloseAdjustmentDialog();
    } catch (error) {
      toast.error('Error recording adjustment: ' + (error.message || 'Unknown error'));
    }
  };

  const handleOpenReportDialog = (report) => {
    setSelectedReport(report);
    setReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
    setSelectedReport(null);
  };

  const handleChartPeriodChange = (period) => {
    setChartPeriod(period);
  };

  if (isLoadingInventory && !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/app/inventory')}
            sx={{ mb: 2 }}
          >
            Back to Inventory
          </Button>
          <Alert severity="error">
            Product not found. The product may have been deleted or you don't have permission to view it.
          </Alert>
        </Box>
      </Container>
    );
  }

  const status = determineStockStatus(
    productInventory?.quantity || 0, 
    product.reorder_level || 0
  );

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, mb: 4, px: '0!important' }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/app/inventory')}
          sx={{ mb: 2 }}
        >
          Back to Inventory
        </Button>

        <Grid container spacing={3}>
          {/* Left Column - Product Info */}
          <Grid item xs={12} md={4}>
            {/* Product Info Card */}
            <ProductInfoCard 
              product={product}
              productInventory={productInventory}
              category={categories.find(c => c.id === product.product_category_id)}
              status={status}
              onAdjustInventory={handleOpenAdjustmentDialog}
            />

            {/* Product Attributes Card */}
            {/* <ProductAttributesCard 
              product={product}
              attributes={attributes}
            /> */}

            {/* Inventory Valuation Card */}
            {/* <InventoryValuationCard 
              productInventory={productInventory}
            /> */}
          </Grid>

          {/* Right Column - Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Overview" />
                <Tab label="Stock History" />
                <Tab label="Receiving Reports" />
                <Tab label="Adjustments" />
              </Tabs>

              {/* Overview Tab */}
              {tabValue === 0 && (
                <OverviewTabContent
                  product={product}
                  inventoryLogs={inventoryLogs}
                  isLoadingLogs={isLoadingLogs}
                  productTransactions={productTransactions}
                  isLoadingTransactions={isLoadingTransactions}
                  status={status}
                />
              )}

              {/* Stock History Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Stock History
                  </Typography>

                  {/* Stock Movement Chart */}
                  <StockMovementChart
                    stockHistoryData={inventoryLogs?.map(log => ({
                      date: new Date(log.created_at).toLocaleDateString(),
                      quantity: log.quantity_after,
                      transaction: log.transaction_type,
                    })) || []}
                    isLoading={isLoadingLogs}
                    chartPeriod={chartPeriod}
                    onPeriodChange={handleChartPeriodChange}
                  />

                  {/* Transaction History Table */}
                  <TransactionHistoryTable
                    transactions={productTransactions}
                    isLoading={isLoadingTransactions}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    showSearch={true}
                  />
                </Box>
              )}

              {/* Receiving Reports Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Receiving Reports
                  </Typography>
                  
                  <ReceivingReportsAccordion
                    transactions={productReport}
                    onViewReport={handleOpenReportDialog}
                  />
                </Box>
              )}

              {/* Adjustments Tab */}
              {tabValue === 3 && (
                <AdjustmentsTable
                  adjustments={productAdjustments}
                  isLoading={isLoadingAdjustments}
                  onNewAdjustment={handleOpenAdjustmentDialog}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Adjustment Dialog */}
      <Dialog 
        open={adjustmentDialogOpen} 
        onClose={handleCloseAdjustmentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Adjust Inventory: {product.product_name}
        </DialogTitle>
        <Dialog>
          <InventoryAdjustmentForm 
            product={product}
            products={[product]}
            adjustmentTypes={adjustmentTypes}
            onSubmit={handleAdjustmentSubmit}
            onCancel={handleCloseAdjustmentDialog}
          />
        </Dialog>
      </Dialog>

      {/* Receiving Report Detail Dialog */}
      <ReportDetailDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        report={selectedReport}
        product={product}
      />
    </Container>
  );
};

export default InventoryProductDetail;
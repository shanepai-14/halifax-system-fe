import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Skeleton
} from '@mui/material';
import { 
  ShoppingCartOutlined, 
  WarningOutlined,
  BranchesOutlined,
  DollarOutlined
} from '@ant-design/icons';

const InventorySummaryCards = ({ inventoryData = [], stats = {}, isLoading = false }) => {
  // Format for currency display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value || 0);
  };

  // Loading component for cards
  const CardSkeleton = () => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton width={120} height={30} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Skeleton width={80} height={60} />
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width={100} height={24} />
        <Skeleton width={80} height={24} />
      </Box>
    </Paper>
  );

  // Prepare category data for display
  const categories = stats.categoriesWithValue 
    ? Object.entries(stats.categoriesWithValue)
        .sort(([, a], [, b]) => b.value - a.value)
        .map(([id, data]) => ({ id, ...data }))
    : [];

  return (
    <>
      {/* Main stats cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Inventory Stats */}
        <Grid item xs={12} sm={6} md={6}>
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: '4px solid #1976d2',
                borderRadius: '4px'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Inventory
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(25, 118, 210, 0.12)'
                }}>
                  <Box sx={{ color: '#1976d2' }}>
                    <ShoppingCartOutlined style={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                {stats.totalItems || inventoryData.length}
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(stats.totalValue || 0)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} sm={6} md={6}>
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: '4px solid #f44336',
                borderRadius: '4px'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Low Stock Items
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(244, 67, 54, 0.12)'
                }}>
                  <Box sx={{ color: '#f44336' }}>
                    <WarningOutlined style={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336', mb: 1 }}>
                {stats.lowStockItems || 0}
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Require Reorder
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {stats.reorderNeeded || 0}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Category heading */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BranchesOutlined style={{ fontSize: 20, marginRight: 8, color: '#4caf50' }} />
        <Typography variant="h6">
          Inventory by Category
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          ({stats.categoryCount || 0} categories)
        </Typography>
      </Box>

      {/* Category cards */}
      <Grid container spacing={2}>
        {isLoading ? (
          // Skeleton loaders for categories
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CardSkeleton />
            </Grid>
          ))
        ) : categories.length > 0 ? (
          // Real category data
          categories.map(category => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={category.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: '100%',
                  borderLeft: '4px solid #4caf50',
                  borderRadius: '4px'
                }}
              >
                <Typography variant="subtitle2" noWrap title={category.name} sx={{ mb: 1 }}>
                  {category.name}
                </Typography>
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 1 }}>
                  {formatCurrency(category.value)}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Items
                    </Typography>
                    <Typography variant="body1">
                      {category.count}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          // No data state
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No category data available
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default InventorySummaryCards;
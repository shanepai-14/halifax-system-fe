import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Card, Typography, Box, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, Button, IconButton,
  Chip, Alert, CircularProgress, Backdrop, Snackbar
} from '@mui/material';
import {
  ReloadOutlined,
  DownloadOutlined,
  ToolOutlined,
  RiseOutlined,
  ReconciliationOutlined ,
  PieChartOutlined,
} from '@ant-design/icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Import modular components
import DashboardOverview from './components/DashboardOverview';
import RevenueChart from './components/RevenueChart';
import BreakdownAnalysis from './components/BreakdownAnalysis';
import TransactionsTab from './components/TransactionsTab';
import ExportPanel from './components/ExportPanel';
import AdminPanel from './components/AdminPanel';

// Import custom hook
import { useReports } from '@/hooks/useReports';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';

// Tab configuration
const TABS = [
  { 
    label: 'Dashboard', 
    value: 'dashboard', 
    icon: <ReconciliationOutlined  />,
    description: 'Overview of key metrics and KPIs'
  },
  { 
    label: 'Revenue Analysis', 
    value: 'revenue', 
    icon: <RiseOutlined />,
    description: 'Detailed revenue breakdown and trends'
  },
  { 
    label: 'Transactions', 
    value: 'transactions', 
    icon: <ReconciliationOutlined />,
    description: 'Detailed transaction listing and analysis'
 },
//   { 
//     label: 'Profit Analysis', 
//     value: 'profit', 
//     icon: <LineChartOutlined />,
//     description: 'Profit margins and profitability analysis'
//   },
//   { 
//     label: 'Trends & Forecasts', 
//     value: 'trends', 
//     icon: <LineChartOutlined />,
//     description: 'Historical trends and future predictions'
//   },
  { 
    label: 'Breakdowns', 
    value: 'breakdowns', 
    icon: <PieChartOutlined />,
    description: 'Customer and payment method analysis'
  },
//   { 
//     label: 'Performance', 
//     value: 'performance', 
//     icon: <ReconciliationOutlined  />,
//     description: 'Performance metrics and comparisons'
//   }
];

const ReportsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [refreshing, setRefreshing] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'info' });

  // Custom hook and user data
  const {
    loading,
    error,
    dashboardData,
    getDashboardData,
    clearError,
    clearData
  } = useReports();

  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === 'admin';

  // Available years for selection (last 5 years + current year + next year)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 4; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Available months
  const availableMonths = useMemo(() => [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ], []);

  // Effect to load initial data
  useEffect(() => {
    loadInitialData();
  }, [selectedYear, selectedMonth]);

  // Effect to clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Load initial dashboard data
  const loadInitialData = async () => {
    try {
      await getDashboardData(selectedYear, selectedMonth);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Handle month change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      clearData();
      await loadInitialData();
      setAlertState({
        open: true,
        message: 'Data refreshed successfully!',
        severity: 'success'
      });
    } catch (err) {
      setAlertState({
        open: true,
        message: 'Failed to refresh data. Please try again.',
        severity: 'error'
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export dialog
  const handleExportDialog = () => {
    setExportDialogOpen(true);
  };

  // Handle admin dialog
  const handleAdminDialog = () => {
    setAdminDialogOpen(true);
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  // Get active tab configuration
  const activeTabConfig = TABS.find(tab => tab.value === activeTab);

  // Render tab content
  const renderTabContent = () => {
    const commonProps = {
      selectedYear,
      selectedMonth,
      onYearChange: setSelectedYear,
      onMonthChange: setSelectedMonth
    };

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview {...commonProps} dashboardData={dashboardData} />;
      
      case 'revenue':
        return <RevenueChart {...commonProps} />;
      
     case 'transactions':
        return <TransactionsTab />;
    //   case 'profit':
    //     return <ProfitAnalysis {...commonProps} />;
      
    //   case 'trends':
    //     return <TrendsAnalysis {...commonProps} />;
      
      case 'breakdowns':
        return <BreakdownAnalysis {...commonProps} />;
      
    //   case 'performance':
    //     return <PerformanceMetrics {...commonProps} />;
      
      default:
        return <DashboardOverview {...commonProps} dashboardData={dashboardData} />;
    }
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, p: "0!important" }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Reports & Analytics
            </Typography>
            {activeTabConfig && (
              <Typography variant="body2" color="text.secondary">
                {activeTabConfig.description}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Year Selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                label="Year"
              >
                {availableYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Month Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Month"
              >
                {availableMonths.map(month => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Action Buttons */}
            <IconButton 
              onClick={handleRefresh} 
              disabled={loading || refreshing}
              color="primary"
              title="Refresh Data"
            >
              <ReloadOutlined />
            </IconButton>
            
            <IconButton 
              onClick={handleExportDialog}
              color="primary"
              title="Export Data"
            >
              <DownloadOutlined />
            </IconButton>
            
            {isAdmin && (
              <IconButton 
                onClick={handleAdminDialog}
                color="secondary"
                title="Admin Panel"
              >
                <ToolOutlined />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Status Indicators */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {loading && (
            <Chip 
              icon={<CircularProgress size={16} />} 
              label="Loading..." 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
          )}
          
          {error && (
            <Chip 
              label={`Error: ${error}`} 
              color="error" 
              variant="outlined" 
              size="small" 
              onDelete={clearError}
            />
          )}
          
          {refreshing && (
            <Chip 
              icon={<CircularProgress size={16} />} 
              label="Refreshing..." 
              color="secondary" 
              variant="outlined" 
              size="small" 
            />
          )}
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  <Typography variant="body2" component="span">
                    {tab.label}
                  </Typography>
                </Box>
              }
              value={tab.value}
            />
          ))}
        </Tabs>
      </Card>

      {/* Main Content Area */}
      <Box sx={{ minHeight: '60vh' }}>
        {error ? (
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
            sx={{ mb: 2 }}
          >
            <Typography variant="body1">
              <strong>Error loading reports data:</strong> {error}
            </Typography>
          </Alert>
        ) : (
          renderTabContent()
        )}
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={refreshing}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Refreshing Data...
          </Typography>
        </Box>
      </Backdrop>

      {/* Export Panel Dialog */}
      <ExportPanel
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {/* Admin Panel Dialog */}
      {isAdmin && (
        <AdminPanel
          open={adminDialogOpen}
          onClose={() => setAdminDialogOpen(false)}
        />
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertState.severity} 
          sx={{ width: '100%' }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportsPage;
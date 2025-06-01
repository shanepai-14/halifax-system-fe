import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Button, ButtonGroup, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Line, Bar } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/currencyFormat';
import { parse } from 'filepond';

const CHART_TYPES = [
  { value: 'line', label: 'Line Chart', icon: <PieChartOutlined /> },
//   { value: 'bar', label: 'Bar Chart', icon: <BarChartOutlined /> },
//   { value: 'table', label: 'Data Table', icon: <BarChartOutlined /> }
];

const PERIOD_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

const RevenueChart = ({ selectedYear, selectedMonth }) => {
  // State management
  const [chartType, setChartType] = useState('line');
  const [periodType, setPeriodType] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);

  // Custom hook
  const { 
    loading, 
    error, 
    getChartData, 
    getMonthlyReport, 
    getYearlyReport, 
    getDailyReport,
    formatChartData,
    chartOptions
  } = useReports();

  // Available metrics for display
  const availableMetrics = [
    { value: 'revenue', label: 'Revenue', color: 'rgba(54, 162, 235, 1)' },
    { value: 'profit', label: 'Profit', color: 'rgba(75, 192, 192, 1)' },
    { value: 'cogs', label: 'COGS', color: 'rgba(255, 99, 132, 1)' }
  ];

  // Load chart data based on period type
  useEffect(() => {
    loadChartData();
  }, [periodType, selectedYear, selectedMonth]);

  const loadChartData = async () => {
    try {
      let data;
      let tableInfo = [];
      
      switch (periodType) {
        case 'daily':
          data = await getChartData('daily', { year: selectedYear, month: selectedMonth });
          const dailyReport = await getDailyReport(selectedYear, selectedMonth);
          if (dailyReport) {
            tableInfo = dailyReport.map(item => ({
              period: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`,
              revenue: item.total_revenue || 0,
              profit: item.total_profit || 0,
              cogs: item.total_cogs || 0,
              sales_count: item.total_sales_count || 0,
              profit_margin: item.total_revenue > 0 ? ((item.total_profit / item.total_revenue) * 100).toFixed(2) : 0
            }));
          }
          break;
          
        case 'monthly':
          data = await getChartData('monthly', { year: selectedYear });
          const monthlyReport = await getMonthlyReport(selectedYear);
          if (monthlyReport) {
            tableInfo = monthlyReport.map(item => ({
              period: `${selectedYear}-${String(item.month).padStart(2, '0')}`,
              revenue: item.total_revenue || 0,
              profit: item.total_profit || 0,
              cogs: item.total_cogs || 0,
              sales_count: item.total_sales_count || 0,
              profit_margin: item.total_revenue > 0 ? ((item.total_profit / item.total_revenue) * 100).toFixed(2) : 0
            }));
          }
          break;
          
        case 'yearly':
          const currentYear = new Date().getFullYear();
          const startYear = currentYear - 4;
          data = await getChartData('yearly', { start_year: startYear, end_year: currentYear });
          const yearlyReport = await getYearlyReport(startYear, currentYear);
          if (yearlyReport) {
            tableInfo = yearlyReport.map(item => ({
              period: item.year.toString(),
              revenue: item.total_revenue || 0,
              profit: item.total_profit || 0,
              cogs: item.total_cogs || 0,
              sales_count: item.total_sales_count || 0,
              profit_margin: item.total_revenue > 0 ? ((item.total_profit / item.total_revenue) * 100).toFixed(2) : 0
            }));
          }
          break;
      }
      
      if (data) {
        setChartData(formatChartData(data, chartType === 'bar' ? 'bar' : 'line'));
      }
      
      setTableData(tableInfo);
    } catch (err) {
      console.error('Error loading chart data:', err);
    }
  };

  // Memoized chart configuration
  const enhancedChartOptions = useMemo(() => ({
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: `${periodType.charAt(0).toUpperCase() + periodType.slice(1)} Revenue Analysis`,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: periodType === 'daily' ? 'Day' : periodType === 'monthly' ? 'Month' : 'Year'
        }
      }
    }
  }), [chartOptions, periodType]);

  // Filter chart data for single metric view
  const filteredChartData = useMemo(() => {
    if (!chartData || selectedMetric === 'all') return chartData;
    
    const selectedDataset = chartData.datasets.find(dataset => 
      dataset.label.toLowerCase() === selectedMetric.toLowerCase()
    );
    
    if (!selectedDataset) return chartData;
    
    return {
      ...chartData,
      datasets: [selectedDataset]
    };
  }, [chartData, selectedMetric]);

  // Handle chart type change
  const handleChartTypeChange = (newType) => {
    setChartType(newType);
    if (chartData) {
      setChartData(formatChartData(chartData, newType === 'bar' ? 'bar' : 'line'));
    }
  };

  // Handle period type change
  const handlePeriodTypeChange = (event) => {
    setPeriodType(event.target.value);
  };

  // Handle metric change
  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  // Render chart component
  const renderChart = () => {
    if (!filteredChartData || !filteredChartData.labels.length) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Typography color="text.secondary">
            No data available for the selected period
          </Typography>
        </Box>
      );
    }

    const ChartComponent = chartType === 'bar' ? Bar : Line;
    
    return (
      <Box sx={{ height: 400 }}>
        <ChartComponent data={filteredChartData} options={enhancedChartOptions} />
      </Box>
    );
  };

  // Render data table
  const renderTable = () => {
    if (!tableData.length) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Typography color="text.secondary">
            No data available for the selected period
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell align="right">COGS</TableCell>
              <TableCell align="right">Sales Count</TableCell>
              <TableCell align="right">Profit Margin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.period}</TableCell>
                <TableCell align="right">{formatCurrency(row.revenue)}</TableCell>
                <TableCell align="right">{formatCurrency(row.profit)}</TableCell>
                <TableCell align="right">{formatCurrency(row.cogs)}</TableCell>
                <TableCell align="right">{row.sales_count}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={`${row.profit_margin}%`}
                    color={row.profit_margin > 20 ? 'success' : row.profit_margin > 10 ? 'warning' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading revenue data: {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Controls */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Period Type Selector */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={periodType}
                  onChange={handlePeriodTypeChange}
                  label="Period"
                >
                  {PERIOD_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Metric Selector */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={handleMetricChange}
                  label="Metric"
                >
                  <MenuItem value="all">All Metrics</MenuItem>
                  {availableMetrics.map(metric => (
                    <MenuItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Chart Type Buttons */}
              <ButtonGroup variant="outlined" size="small">
                {CHART_TYPES.map(type => (
                  <Button
                    key={type.value}
                    onClick={() => handleChartTypeChange(type.value)}
                    variant={chartType === type.value ? 'contained' : 'outlined'}
                    startIcon={type.icon}
                  >
                    {type.label}
                  </Button>
                ))}
              </ButtonGroup>

              {/* Loading Indicator */}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart/Table Display */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {chartType === 'table' ? 'Revenue Data Table' : 'Revenue Chart'}
            </Typography>
            {chartType === 'table' ? renderTable() : renderChart()}
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Statistics */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Summary Statistics
            </Typography>
            {tableData.length > 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="primary.contrastText">
                      {formatCurrency(tableData.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0))}
                       
                      
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Total Revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.contrastText">
                      {formatCurrency(tableData.reduce((sum, item) => sum + parseFloat(item.profit || 0), 0))}
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Total Profit
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="warning.contrastText">
                      {tableData.reduce((sum, item) => sum + item.sales_count, 0)}
                    </Typography>
                    <Typography variant="body2" color="warning.contrastText">
                      Total Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="info.contrastText">
                      {tableData.length > 0 
                        ? ((tableData.reduce((sum, item) => sum + parseFloat(item.profit || 0), 0) / 
                            tableData.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0)) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                    <Typography variant="body2" color="info.contrastText">
                      Avg Profit Margin
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">
                No data available for summary statistics
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RevenueChart;
import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/formatUtils';

const PerformanceMetrics = ({ selectedYear, selectedMonth }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [topPerformingData, setTopPerformingData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const { loading, error, getPerformanceMetrics, getTopPerformingPeriods } = useReports();

  useEffect(() => {
    loadPerformanceData();
    loadTopPerforming();
  }, [selectedYear, selectedMonth, selectedMetric, selectedPeriod]);

  const loadPerformanceData = async () => {
    try {
      const filters = {
        period_type: selectedPeriod,
        year: selectedYear,
        month: selectedPeriod === 'monthly' ? selectedMonth : undefined,
        compare_previous: true
      };

      const data = await getPerformanceMetrics(filters);
      setPerformanceData(data);
    } catch (err) {
      console.error('Failed to load performance data:', err);
    }
  };

  const loadTopPerforming = async () => {
    try {
      const data = await getTopPerformingPeriods(selectedPeriod, selectedMetric, {
        year: selectedYear,
        limit: 10
      });
      setTopPerformingData(data || []);
    } catch (err) {
      console.error('Failed to load top performing data:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading performance metrics: {error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Controls */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  label="Metric"
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="profit">Profit</MenuItem>
                  <MenuItem value="sales_count">Sales Count</MenuItem>
                  <MenuItem value="profit_margin">Profit Margin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Current Performance */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Performance
            </Typography>
            {performanceData?.current_period ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="h5" color="primary.contrastText">
                        {formatCurrency(performanceData.current_period.total_revenue || 0)}
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="h5" color="success.contrastText">
                        {formatCurrency(performanceData.current_period.total_profit || 0)}
                      </Typography>
                      <Typography variant="body2" color="success.contrastText">
                        Profit
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="h5" color="info.contrastText">
                        {performanceData.current_period.total_sales_count || 0}
                      </Typography>
                      <Typography variant="body2" color="info.contrastText">
                        Sales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                      <Typography variant="h5" color="warning.contrastText">
                        {performanceData.current_period.total_revenue > 0 
                          ? ((performanceData.current_period.total_profit / performanceData.current_period.total_revenue) * 100).toFixed(1)
                          : 0}%
                      </Typography>
                      <Typography variant="body2" color="warning.contrastText">
                        Margin
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  No current performance data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Comparison */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Period Comparison
            </Typography>
            {performanceData?.comparison ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  vs Previous Period
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Revenue Change: 
                    <Chip 
                      label={`${performanceData.comparison.revenue_change > 0 ? '+' : ''}${performanceData.comparison.revenue_change}%`}
                      color={performanceData.comparison.revenue_change > 0 ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Profit Change: 
                    <Chip 
                      label={`${performanceData.comparison.profit_change > 0 ? '+' : ''}${performanceData.comparison.profit_change}%`}
                      color={performanceData.comparison.profit_change > 0 ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  No comparison data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Top Performing Periods */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Periods ({selectedMetric.replace('_', ' ').toUpperCase()})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Profit</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Profit Margin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPerformingData.slice(0, 10).map((period, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`#${index + 1}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          {period.period_identifier || `${period.year}-${period.month || ''}`}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(period.total_revenue || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(period.total_profit || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {period.total_sales_count || 0}
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${period.avg_profit_margin || 0}%`}
                          color={
                            (period.avg_profit_margin || 0) > 20 ? 'success' : 
                            (period.avg_profit_margin || 0) > 10 ? 'warning' : 'error'
                          }
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {topPerformingData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          No performance data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PerformanceMetrics;
import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/currencyFormat';

const BreakdownAnalysis = ({ selectedYear, selectedMonth }) => {
  const [paymentMethodsData, setPaymentMethodsData] = useState({});
  const [customerTypesData, setCustomerTypesData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const { loading, error, getPaymentMethodsBreakdown, getCustomerTypesBreakdown } = useReports();

  useEffect(() => {
    loadBreakdownData();
  }, [selectedYear, selectedMonth, selectedPeriod]);

  const loadBreakdownData = async () => {
    try {
      const filters = {
        period_type: selectedPeriod,
        year: selectedYear,
        month: selectedPeriod === 'monthly' ? selectedMonth : undefined
      };

      const [paymentData, customerData] = await Promise.all([
        getPaymentMethodsBreakdown(filters),
        getCustomerTypesBreakdown(filters)
      ]);

      setPaymentMethodsData(paymentData || {});
      setCustomerTypesData(customerData || {});
    } catch (err) {
      console.error('Failed to load breakdown data:', err);
    }
  };

  // Format data for charts
  const formatChartData = (data, label) => {
    const labels = Object.keys(data);
    const values = Object.values(data).map(item => item.total);
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)'
    ];

    return {
      labels: labels.map(l => l.replace('_', ' ').toUpperCase()),
      datasets: [{
        label,
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading breakdown analysis: {error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Controls */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Methods Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Methods Breakdown
            </Typography>
            {Object.keys(paymentMethodsData).length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Pie 
                  data={formatChartData(paymentMethodsData, 'Revenue by Payment Method')}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
            ) : (
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  No payment methods data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Customer Types Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Types Breakdown
            </Typography>
            {Object.keys(customerTypesData).length > 0 ? (
              <Box sx={{ height: 300 }}>
                <Pie 
                  data={formatChartData(customerTypesData, 'Revenue by Customer Type')}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
            ) : (
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  No customer types data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Methods Table */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Methods Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(paymentMethodsData).map(([method, data]) => (
                    <TableRow key={method}>
                      <TableCell>{method.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell align="right">{data.count}</TableCell>
                      <TableCell align="right">{formatCurrency(data.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Customer Types Table */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Types Details
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(customerTypesData).map(([type, data]) => (
                    <TableRow key={type}>
                      <TableCell>{type.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell align="right">{data.count}</TableCell>
                      <TableCell align="right">{formatCurrency(data.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BreakdownAnalysis;
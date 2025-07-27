import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { Doughnut, Line } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/formatUtils';

const ProfitAnalysis = ({ selectedYear, selectedMonth }) => {
  const [profitData, setProfitData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const { loading, error, getMonthlyReport, getYearlyReport } = useReports();

  useEffect(() => {
    loadProfitData();
  }, [selectedYear, selectedMonth, selectedPeriod]);

  const loadProfitData = async () => {
    try {
      let data;
      if (selectedPeriod === 'monthly') {
        data = await getMonthlyReport(selectedYear);
      } else {
        data = await getYearlyReport(selectedYear - 2, selectedYear);
      }
      setProfitData(data);
    } catch (err) {
      console.error('Failed to load profit data:', err);
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
    return <Alert severity="error">Error loading profit analysis: {error}</Alert>;
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
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      {/* Profit Margin Analysis */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profit Margin Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary">
                Profit margin chart will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Profit Trends */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profit Trends Over Time
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary">
                Profit trends chart will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Profit Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profit Summary
            </Typography>
            <Typography color="text.secondary">
              Detailed profit analysis and insights will be displayed here
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfitAnalysis;
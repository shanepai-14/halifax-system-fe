import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress, Chip
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/formatUtils';

const TrendsAnalysis = ({ selectedYear, selectedMonth }) => {
  const [trendsData, setTrendsData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [compareType, setCompareType] = useState('month_over_month');

  const { loading, error, getProfitTrends, getForecastData } = useReports();

  useEffect(() => {
    loadTrendsData();
    loadForecastData();
  }, [selectedYear, selectedMonth, compareType]);

  const loadTrendsData = async () => {
    try {
      const data = await getProfitTrends(compareType, { 
        year: selectedYear, 
        periods: 12 
      });
      setTrendsData(data);
    } catch (err) {
      console.error('Failed to load trends data:', err);
    }
  };

  const loadForecastData = async () => {
    try {
      const data = await getForecastData('monthly', { 
        periods_ahead: 3 
      });
      setForecastData(data.forecast || []);
    } catch (err) {
      console.error('Failed to load forecast data:', err);
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
    return <Alert severity="error">Error loading trends analysis: {error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Controls */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Comparison Type</InputLabel>
              <Select
                value={compareType}
                onChange={(e) => setCompareType(e.target.value)}
                label="Comparison Type"
              >
                <MenuItem value="month_over_month">Month over Month</MenuItem>
                <MenuItem value="year_over_year">Year over Year</MenuItem>
                <MenuItem value="quarter_over_quarter">Quarter over Quarter</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      {/* Trends Chart */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue & Profit Trends
            </Typography>
            <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary">
                Trends chart will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Forecast Panel */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              3-Month Forecast
            </Typography>
            {forecastData.length > 0 ? (
              <Box>
                {forecastData.map((forecast, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {forecast.period_identifier}
                    </Typography>
                    <Typography variant="body2">
                      Revenue: {formatCurrency(forecast.forecasted_revenue)}
                    </Typography>
                    <Typography variant="body2">
                      Profit: {formatCurrency(forecast.forecasted_profit)}
                    </Typography>
                    <Chip 
                      label={`${(forecast.confidence_level * 100).toFixed(0)}% confidence`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No forecast data available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Growth Analysis */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Growth Analysis
            </Typography>
            <Typography color="text.secondary">
              Detailed growth trends and analysis will be displayed here
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TrendsAnalysis;
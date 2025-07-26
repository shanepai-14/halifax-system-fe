import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress, Slider, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction, Chip
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/utils/formatUtils';

const ForecastingPanel = ({ selectedYear, selectedMonth }) => {
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastPeriods, setForecastPeriods] = useState(3);
  const [periodType, setPeriodType] = useState('monthly');
  const [chartData, setChartData] = useState(null);

  const { loading, error, getForecastData } = useReports();

  useEffect(() => {
    loadForecastData();
  }, [selectedYear, selectedMonth, forecastPeriods, periodType]);

  const loadForecastData = async () => {
    try {
      const data = await getForecastData(periodType, {
        periods_ahead: forecastPeriods,
        year: selectedYear
      });
      
      if (data) {
        setForecastData(data.forecast || []);
        setHistoricalData(data.historical_data || []);
        generateChartData(data.historical_data || [], data.forecast || []);
      }
    } catch (err) {
      console.error('Failed to load forecast data:', err);
    }
  };

  const generateChartData = (historical, forecast) => {
    if (!historical.length && !forecast.length) return;

    // Combine historical and forecast labels
    const historicalLabels = historical.map(item => {
      if (periodType === 'monthly') {
        return `${item.year}-${String(item.month).padStart(2, '0')}`;
      } else {
        return item.year.toString();
      }
    });

    const forecastLabels = forecast.map(item => item.period_identifier);
    const allLabels = [...historicalLabels, ...forecastLabels];

    // Combine historical and forecast data
    const historicalRevenue = historical.map(item => item.total_revenue || 0);
    const historicalProfit = historical.map(item => item.total_profit || 0);

    const forecastRevenue = forecast.map(item => item.forecasted_revenue || 0);
    const forecastProfit = forecast.map(item => item.forecasted_profit || 0);

    // Add null values to separate historical from forecast
    const revenueData = [...historicalRevenue, null, ...forecastRevenue];
    const profitData = [...historicalProfit, null, ...forecastProfit];

    setChartData({
      labels: allLabels,
      datasets: [
        {
          label: 'Historical Revenue',
          data: [...historicalRevenue, ...Array(forecastRevenue.length + 1).fill(null)],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Forecasted Revenue',
          data: [...Array(historicalRevenue.length).fill(null), ...historicalRevenue.slice(-1), ...forecastRevenue],
          borderColor: 'rgba(54, 162, 235, 0.5)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        },
        {
          label: 'Historical Profit',
          data: [...historicalProfit, ...Array(forecastProfit.length + 1).fill(null)],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Forecasted Profit',
          data: [...Array(historicalProfit.length).fill(null), ...historicalProfit.slice(-1), ...forecastProfit],
          borderColor: 'rgba(75, 192, 192, 0.5)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
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
    return <Alert severity="error">Error loading forecast data: {error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Controls */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Period Type</InputLabel>
                  <Select
                    value={periodType}
                    onChange={(e) => setPeriodType(e.target.value)}
                    label="Period Type"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Forecast Periods: {forecastPeriods} {periodType.slice(0, -2)}(s)
                </Typography>
                <Slider
                  value={forecastPeriods}
                  onChange={(e, value) => setForecastPeriods(value)}
                  min={1}
                  max={12}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  onClick={loadForecastData}
                  disabled={loading}
                  fullWidth
                >
                  Refresh Forecast
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Forecast Chart */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: 500 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue & Profit Forecast
            </Typography>
            {chartData ? (
              <Box sx={{ height: 420 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            ) : (
              <Box sx={{ height: 420, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  No forecast data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Forecast Details */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: 500 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Forecast Details
            </Typography>
            {forecastData.length > 0 ? (
              <List dense>
                {forecastData.map((forecast, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={forecast.period_identifier}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Revenue: {formatCurrency(forecast.forecasted_revenue)}
                          </Typography>
                          <Typography variant="body2">
                            Profit: {formatCurrency(forecast.forecasted_profit)}
                          </Typography>
                          <Typography variant="body2">
                            Sales: {forecast.forecasted_sales_count}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={`${(forecast.confidence_level * 100).toFixed(0)}%`}
                        size="small"
                        color={
                          forecast.confidence_level > 0.8 ? 'success' :
                          forecast.confidence_level > 0.6 ? 'warning' : 'error'
                        }
                        variant="outlined"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No forecast details available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Forecast Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Forecast Summary
            </Typography>
            {forecastData.length > 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="primary.contrastText">
                      {formatCurrency(forecastData.reduce((sum, f) => sum + f.forecasted_revenue, 0))}
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Total Forecasted Revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="success.contrastText">
                      {formatCurrency(forecastData.reduce((sum, f) => sum + f.forecasted_profit, 0))}
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Total Forecasted Profit
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="info.contrastText">
                      {forecastData.reduce((sum, f) => sum + f.forecasted_sales_count, 0)}
                    </Typography>
                    <Typography variant="body2" color="info.contrastText">
                      Total Forecasted Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="warning.contrastText">
                      {forecastData.length > 0 
                        ? ((forecastData.reduce((sum, f) => sum + f.confidence_level, 0) / forecastData.length) * 100).toFixed(0)
                        : 0}%
                    </Typography>
                    <Typography variant="body2" color="warning.contrastText">
                      Average Confidence
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">
                No forecast summary available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForecastingPanel;
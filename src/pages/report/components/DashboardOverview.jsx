import React, { useMemo } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, LinearProgress,
  Chip, IconButton, Divider, List, ListItem, ListItemText,
  ListItemSecondaryAction, Avatar, Paper
} from '@mui/material';
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ReconciliationOutlined ,
  CalendarOutlined,
  ArrowsAltOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '@/utils/currencyFormat';

const DashboardOverview = ({ dashboardData, selectedYear, selectedMonth }) => {
  // Memoized calculations
  const kpiData = useMemo(() => {
    if (!dashboardData) return [];

    const { current_month, current_year, yesterday, today } = dashboardData;

    return [
      {
        title: 'Monthly Revenue',
        value: current_month?.total_revenue || 0,
        change: current_month?.total_revenue && current_year?.total_revenue 
          ? ((current_month.total_revenue / (current_year.total_revenue / 12)) - 1) * 100 
          : 0,
        icon: <DollarOutlined />,
        color: 'primary',
        subtitle: `${new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      },
      {
        title: 'Monthly Profit',
        value: current_month?.total_profit || 0,
        change: current_month?.total_profit && current_year?.total_profit 
          ? ((current_month.total_profit / (current_year.total_profit / 12)) - 1) * 100 
          : 0,
        icon: <RiseOutlined />,
        color: 'success',
        subtitle: `Margin: ${current_month?.total_revenue > 0 ? ((current_month.total_profit / current_month.total_revenue) * 100).toFixed(1) : 0}%`
      },
      {
        title: 'Monthly Sales',
        value: current_month?.total_sales_count || 0,
        change: current_month?.total_sales_count && current_year?.total_sales_count 
          ? ((current_month.total_sales_count / (current_year.total_sales_count / 12)) - 1) * 100 
          : 0,
        icon: <ShoppingCartOutlined />,
        color: 'info',
        subtitle: `Avg: ${formatCurrency(current_month?.avg_sale_value || 0)}`
      },
      {
        title: 'Year-to-Date Revenue',
        value: current_year?.total_revenue || 0,
        change: 0, // Would need previous year data for comparison
        icon: <ReconciliationOutlined  />,
        color: 'warning',
        subtitle: `${selectedYear} Total`
      }
    ];
  }, [dashboardData, selectedYear, selectedMonth]);

  // Daily comparison data
  const dailyComparison = useMemo(() => {
    if (!dashboardData?.yesterday || !dashboardData?.today) return null;

    const { yesterday, today } = dashboardData;
    
    return {
      yesterday: {
        revenue: yesterday.total_revenue || 0,
        profit: yesterday.total_profit || 0,
        sales: yesterday.total_sales_count || 0
      },
      today: {
        revenue: today.total_revenue || 0,
        profit: today.total_profit || 0,
        sales: today.total_sales_count || 0
      },
      changes: {
        revenue: yesterday.total_revenue > 0 
          ? (((today.total_revenue || 0) - yesterday.total_revenue) / yesterday.total_revenue) * 100 
          : 0,
        profit: yesterday.total_profit > 0 
          ? (((today.total_profit || 0) - yesterday.total_profit) / yesterday.total_profit) * 100 
          : 0,
        sales: yesterday.total_sales_count > 0 
          ? (((today.total_sales_count || 0) - yesterday.total_sales_count) / yesterday.total_sales_count) * 100 
          : 0
      }
    };
  }, [dashboardData]);

  // Trend chart data
  const trendChartData = useMemo(() => {
    if (!dashboardData?.trends) return null;

    const { monthly_revenue_trend, monthly_profit_trend, monthly_labels } = dashboardData.trends;

    return {
      labels: monthly_labels || [],
      datasets: [
        {
          label: 'Revenue',
          data: monthly_revenue_trend || [],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Profit',
          data: monthly_profit_trend || [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [dashboardData]);

  // Chart options
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

  // Helper function to get trend icon and color
  const getTrendIndicator = (change) => {
    if (change > 0) {
      return { icon: <RiseOutlined />, color: 'success.main', text: 'increase' };
    } else if (change < 0) {
      return { icon: <FallOutlined />, color: 'error.main', text: 'decrease' };
    } else {
      return { icon: <ArrowsAltOutlined />, color: 'text.secondary', text: 'no change' };
    }
  };

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography variant="h6" color="text.secondary">
          No dashboard data available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      {kpiData.map((kpi, index) => {
        const trend = getTrendIndicator(kpi.change);
        
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${kpi.color}.main`, mr: 2 }}>
                    {kpi.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {formatCurrency(kpi.value)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.title}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  {kpi.subtitle}
                </Typography>
                
                {kpi.change !== 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ color: trend.color, mr: 0.5 }}>
                      {trend.icon}
                    </Box>
                    <Typography variant="body2" sx={{ color: trend.color }}>
                      {Math.abs(kpi.change).toFixed(1)}% {trend.text}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}

      {/* 12-Month Trend Chart */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              12-Month Revenue & Profit Trend
            </Typography>
            {trendChartData ? (
              <Box sx={{ height: 320 }}>
                <Line data={trendChartData} options={chartOptions} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
                <Typography color="text.secondary">No trend data available</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Comparison */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Comparison
            </Typography>
            {dailyComparison ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Today vs Yesterday
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Revenue</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {formatCurrency(dailyComparison.today.revenue)}
                        </Typography>
                        {dailyComparison.changes.revenue !== 0 && (
                          <Chip
                            size="small"
                            label={`${dailyComparison.changes.revenue > 0 ? '+' : ''}${dailyComparison.changes.revenue.toFixed(1)}%`}
                            color={dailyComparison.changes.revenue > 0 ? 'success' : 'error'}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (dailyComparison.today.revenue / Math.max(dailyComparison.yesterday.revenue, dailyComparison.today.revenue)) * 100)}
                      color="primary"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Profit</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {formatCurrency(dailyComparison.today.profit)}
                        </Typography>
                        {dailyComparison.changes.profit !== 0 && (
                          <Chip
                            size="small"
                            label={`${dailyComparison.changes.profit > 0 ? '+' : ''}${dailyComparison.changes.profit.toFixed(1)}%`}
                            color={dailyComparison.changes.profit > 0 ? 'success' : 'error'}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (dailyComparison.today.profit / Math.max(dailyComparison.yesterday.profit, dailyComparison.today.profit)) * 100)}
                      color="success"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Sales Count</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {dailyComparison.today.sales}
                        </Typography>
                        {dailyComparison.changes.sales !== 0 && (
                          <Chip
                            size="small"
                            label={`${dailyComparison.changes.sales > 0 ? '+' : ''}${dailyComparison.changes.sales.toFixed(1)}%`}
                            color={dailyComparison.changes.sales > 0 ? 'success' : 'error'}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (dailyComparison.today.sales / Math.max(dailyComparison.yesterday.sales, dailyComparison.today.sales)) * 100)}
                      color="info"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Yesterday's Performance
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Revenue" />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">
                          {formatCurrency(dailyComparison.yesterday.revenue)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Profit" />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">
                          {formatCurrency(dailyComparison.yesterday.profit)}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Sales" />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">
                          {dailyComparison.yesterday.sales}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
                <Typography color="text.secondary">No daily comparison data available</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Insights */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Monthly Performance
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData.current_month?.total_revenue > 0 
                      ? `Current month revenue is ${formatCurrency(dashboardData.current_month.total_revenue)}`
                      : 'No revenue data for current month'
                    }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Profit Margin
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData.current_month?.total_revenue > 0 
                      ? `Current profit margin is ${((dashboardData.current_month.total_profit / dashboardData.current_month.total_revenue) * 100).toFixed(1)}%`
                      : 'No profit data available'
                    }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Year Progress
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData.current_year?.total_sales_count > 0 
                      ? `${dashboardData.current_year.total_sales_count} sales completed this year`
                      : 'No sales data for current year'
                    }
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
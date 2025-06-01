import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    current_month: null,
    current_year: null,
    last_12_months: [],
    yesterday: null,
    today: null,
    trends: {
      monthly_revenue_trend: [],
      monthly_profit_trend: [],
      monthly_labels: []
    }
  });

  // Charts and analytics state
  const [chartData, setChartData] = useState({
    labels: [],
    revenue: [],
    cogs: [],
    profit: []
  });

  const [forecastData, setForecastData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(null);

  // Utility function to handle API calls
  const handleApiCall = useCallback(async (apiCall, errorMessage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || errorMessage;
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Dashboard data
  const getDashboardData = useCallback(async (year = null, month = null) => {
    const data = await handleApiCall(
      () => api.get('/reports/dashboard', { 
        params: { year, month } 
      }),
      'Failed to fetch dashboard data'
    );
    
    setDashboardData(data);
    return data;
  }, [handleApiCall]);

  // Chart data for different period types
  const getChartData = useCallback(async (periodType, filters = {}) => {
    const data = await handleApiCall(
      () => api.get('/reports/chart-data', { 
        params: { period_type: periodType, ...filters } 
      }),
      'Failed to fetch chart data'
    );
    
    setChartData(data);
    return data;
  }, [handleApiCall]);

  // Monthly report
  const getMonthlyReport = useCallback(async (year = null) => {
    return await handleApiCall(
      () => api.get('/reports/monthly', { 
        params: { year } 
      }),
      'Failed to fetch monthly report'
    );
  }, [handleApiCall]);

  // Yearly report
  const getYearlyReport = useCallback(async (startYear = null, endYear = null) => {
    return await handleApiCall(
      () => api.get('/reports/yearly', { 
        params: { start_year: startYear, end_year: endYear } 
      }),
      'Failed to fetch yearly report'
    );
  }, [handleApiCall]);

  // Daily report
  const getDailyReport = useCallback(async (year = null, month = null) => {
    return await handleApiCall(
      () => api.get('/reports/daily', { 
        params: { year, month } 
      }),
      'Failed to fetch daily report'
    );
  }, [handleApiCall]);

  // Payment methods breakdown
  const getPaymentMethodsBreakdown = useCallback(async (filters = {}) => {
    return await handleApiCall(
      () => api.get('/reports/payment-methods', { 
        params: filters 
      }),
      'Failed to fetch payment methods breakdown'
    );
  }, [handleApiCall]);

  // Customer types breakdown
  const getCustomerTypesBreakdown = useCallback(async (filters = {}) => {
    return await handleApiCall(
      () => api.get('/reports/customer-types', { 
        params: filters 
      }),
      'Failed to fetch customer types breakdown'
    );
  }, [handleApiCall]);

  // Profit trends
  const getProfitTrends = useCallback(async (compareType, filters = {}) => {
    return await handleApiCall(
      () => api.get('/reports/profit-trends', { 
        params: { compare_type: compareType, ...filters } 
      }),
      'Failed to fetch profit trends'
    );
  }, [handleApiCall]);

  // Performance metrics
  const getPerformanceMetrics = useCallback(async (filters = {}) => {
    const data = await handleApiCall(
      () => api.get('/reports/performance-metrics', { 
        params: filters 
      }),
      'Failed to fetch performance metrics'
    );
    
    setPerformanceMetrics(data);
    return data;
  }, [handleApiCall]);

  // Forecast data
  const getForecastData = useCallback(async (periodType, filters = {}) => {
    const data = await handleApiCall(
      () => api.get('/reports/forecast', { 
        params: { period_type: periodType, ...filters } 
      }),
      'Failed to fetch forecast data'
    );
    
    setForecastData(data.forecast || []);
    return data;
  }, [handleApiCall]);

  // Advanced analytics
  const getAdvancedAnalytics = useCallback(async (filters = {}) => {
    const data = await handleApiCall(
      () => api.get('/reports/advanced-analytics', { 
        params: filters 
      }),
      'Failed to fetch advanced analytics'
    );
    
    setAdvancedAnalytics(data);
    return data;
  }, [handleApiCall]);

  // Top performing periods
  const getTopPerformingPeriods = useCallback(async (periodType, metric, filters = {}) => {
    return await handleApiCall(
      () => api.get('/reports/top-performing', { 
        params: { period_type: periodType, metric, ...filters } 
      }),
      'Failed to fetch top performing periods'
    );
  }, [handleApiCall]);

  // Summary statistics
  const getSummaryStatistics = useCallback(async (startDate, endDate, periodType = null) => {
    return await handleApiCall(
      () => api.get('/reports/summary-statistics', { 
        params: { start_date: startDate, end_date: endDate, period_type: periodType } 
      }),
      'Failed to fetch summary statistics'
    );
  }, [handleApiCall]);

  // Export functionality
  const exportSummaryData = useCallback(async (filters = {}) => {
    return await handleApiCall(
      () => api.get('/reports/export', { 
        params: filters 
      }),
      'Failed to export summary data'
    );
  }, [handleApiCall]);

  // Admin functions
  const rebuildSummaries = useCallback(async () => {
    return await handleApiCall(
      () => api.post('/reports/rebuild-summaries'),
      'Failed to rebuild summaries'
    );
  }, [handleApiCall]);

  const getHealthCheck = useCallback(async () => {
    return await handleApiCall(
      () => api.get('/reports/health-check'),
      'Failed to get health check'
    );
  }, [handleApiCall]);

  // Utility functions for chart formatting
  const formatChartData = useCallback((data, type = 'line') => {
    if (!data || !data.labels || !Array.isArray(data.labels)) {
      return {
        labels: [],
        datasets: []
      };
    }

    const datasets = [];
    
    if (data.revenue && Array.isArray(data.revenue)) {
      datasets.push({
        label: 'Revenue',
        data: data.revenue,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: type === 'bar' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(54, 162, 235, 0.1)',
        fill: type === 'area',
        tension: 0.4
      });
    }

    if (data.profit && Array.isArray(data.profit)) {
      datasets.push({
        label: 'Profit',
        data: data.profit,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: type === 'bar' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.1)',
        fill: type === 'area',
        tension: 0.4
      });
    }

    if (data.cogs && Array.isArray(data.cogs)) {
      datasets.push({
        label: 'COGS',
        data: data.cogs,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: type === 'bar' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 99, 132, 0.1)',
        fill: type === 'area',
        tension: 0.4
      });
    }

    return {
      labels: data.labels,
      datasets
    };
  }, []);

  // Memoized chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Period'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount (PHP)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }), []);

  return {
    // State
    loading,
    error,
    dashboardData,
    chartData,
    forecastData,
    performanceMetrics,
    advancedAnalytics,

    // Core functions
    getDashboardData,
    getChartData,
    getMonthlyReport,
    getYearlyReport,
    getDailyReport,

    // Breakdown functions
    getPaymentMethodsBreakdown,
    getCustomerTypesBreakdown,

    // Analysis functions
    getProfitTrends,
    getPerformanceMetrics,
    getForecastData,
    getAdvancedAnalytics,
    getTopPerformingPeriods,
    getSummaryStatistics,

    // Utility functions
    exportSummaryData,
    rebuildSummaries,
    getHealthCheck,
    formatChartData,
    chartOptions,

    // Helper functions
    clearError: () => setError(null),
    clearData: () => {
      setDashboardData({
        current_month: null,
        current_year: null,
        last_12_months: [],
        yesterday: null,
        today: null,
        trends: {
          monthly_revenue_trend: [],
          monthly_profit_trend: [],
          monthly_labels: []
        }
      });
      setChartData({ labels: [], revenue: [], cogs: [], profit: [] });
      setForecastData([]);
      setPerformanceMetrics(null);
      setAdvancedAnalytics(null);
    }
  };
};
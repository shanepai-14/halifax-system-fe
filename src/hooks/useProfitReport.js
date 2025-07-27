import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/formatUtils';

export const useProfitReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profitData, setProfitData] = useState({
    summary: {
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      totalProfit: 0,
      totalRevenue: 0,
      averageMargin: 0
    },
    sales: []
  });

  // Helper function to calculate date ranges
  const getDateRange = (range) => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    
    switch(range) {
      case 'week': {
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        return {
          from: startOfWeek.toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        };
      }
      case 'month': {
        const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
        return {
          from: startOfMonth.toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        };
      }
      case 'year': {
        const startOfYear = new Date(startOfToday.getFullYear(), 0, 1);
        return {
          from: startOfYear.toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        };
      }
      default:
        return { from: '', to: '' };
    }
  };

  // Fetch profits for a specific date range
  const fetchProfitsByDateRange = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/sales', { 
        params: { 
          date_from: startDate, 
          date_to: endDate,
          status: 'all_except_cancelled' // Use the special filter to exclude cancelled sales
        } 
      });
      
      // No need to filter here since the API already excludes cancelled sales
      return response.data.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch profit data');
      toast.error(err.response?.data?.message || 'Error fetching profit data');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Calculate profit statistics
  const calculateProfitStatistics = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return {
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        totalProfit: 0,
        totalRevenue: 0,
        averageMargin: 0
      };
    }
    
    const weekRange = getDateRange('week');
    const monthRange = getDateRange('month');
    const yearRange = getDateRange('year');
    
    const thisWeekProfit = salesData
      .filter(sale => {
        const orderDate = new Date(sale.order_date).toISOString().split('T')[0];
        return orderDate >= weekRange.from && orderDate <= weekRange.to;
      })
      .reduce((total, sale) => total + (sale.profit || 0), 0);
      
    const thisMonthProfit = salesData
      .filter(sale => {
        const orderDate = new Date(sale.order_date).toISOString().split('T')[0];
        return orderDate >= monthRange.from && orderDate <= monthRange.to;
      })
      .reduce((total, sale) => total + (sale.profit || 0), 0);
      
    const thisYearProfit = salesData
      .filter(sale => {
        const orderDate = new Date(sale.order_date).toISOString().split('T')[0];
        return orderDate >= yearRange.from && orderDate <= yearRange.to;
      })
      .reduce((total, sale) => total + (sale.profit || 0), 0);
    
    const totalProfit = salesData.reduce((total, sale) => total + (sale.profit || 0), 0);
    const totalRevenue = salesData.reduce((total, sale) => total + (sale.total || 0), 0);
    
    // Calculate average profit margin
    const averageMargin = totalRevenue > 0 
      ? (totalProfit / totalRevenue) * 100 
      : 0;
      
    return {
      thisWeek: thisWeekProfit,
      thisMonth: thisMonthProfit,
      thisYear: thisYearProfit,
      totalProfit,
      totalRevenue,
      averageMargin
    };
  };

  // Generate chart data
  const generateChartData = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return {
        dailyData: { labels: [], datasets: [] },
        monthlyData: { labels: [], datasets: [] }
      };
    }
    
    // Group by date and month
    const dailySales = {};
    const monthlySales = {};
    
    salesData.forEach(sale => {
      if (!sale.order_date) return;
      
      // Daily aggregation
      const day = new Date(sale.order_date).toISOString().split('T')[0];
      if (!dailySales[day]) {
        dailySales[day] = {
          revenue: 0,
          profit: 0,
          cogs: 0,
          count: 0
        };
      }
      dailySales[day].revenue += sale.total || 0;
      dailySales[day].profit += sale.profit || 0;
      dailySales[day].cogs += sale.cogs || 0;
      dailySales[day].count += 1;
      
      // Monthly aggregation
      const month = new Date(sale.order_date).toISOString().slice(0, 7); // Format: YYYY-MM
      if (!monthlySales[month]) {
        monthlySales[month] = {
          revenue: 0,
          profit: 0,
          cogs: 0,
          count: 0
        };
      }
      monthlySales[month].revenue += sale.total || 0;
      monthlySales[month].profit += sale.profit || 0;
      monthlySales[month].cogs += sale.cogs || 0;
      monthlySales[month].count += 1;
    });
    
    // Sort dates for proper display
    const sortedDailyDates = Object.keys(dailySales).sort();
    const sortedMonthlyDates = Object.keys(monthlySales).sort();
    
    // Format for Chart.js
    const dailyChartData = {
      labels: sortedDailyDates.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [
        {
          label: 'Profit',
          data: sortedDailyDates.map(date => dailySales[date].profit),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'COGS',
          data: sortedDailyDates.map(date => dailySales[date].cogs),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Revenue',
          data: sortedDailyDates.map(date => dailySales[date].revenue),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
    
    const monthlyChartData = {
      labels: sortedMonthlyDates.map(month => {
        const [year, monthNum] = month.split('-');
        return `${monthNum}/${year.slice(2)}`;
      }),
      datasets: [
        {
          label: 'Profit',
          data: sortedMonthlyDates.map(month => monthlySales[month].profit),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          type: 'line',
        },
        {
          label: 'COGS',
          data: sortedMonthlyDates.map(month => monthlySales[month].cogs),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1
        },
        {
          label: 'Revenue',
          data: sortedMonthlyDates.map(month => monthlySales[month].revenue),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1
        }
      ]
    };
    
    return {
      dailyData: dailyChartData,
      monthlyData: monthlyChartData
    };
  };

  // Fetch profit by payment method
  const getPaymentMethodBreakdown = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return [];
    }
    
    const methodTotals = {
      cash: { profit: 0, revenue: 0, count: 0 },
      cod: { profit: 0, revenue: 0, count: 0 },
      term: { profit: 0, revenue: 0, count: 0 },
      cheque: { profit: 0, revenue: 0, count: 0 },
      online: { profit: 0, revenue: 0, count: 0 }
    };
    
    salesData.forEach(sale => {
      const method = sale.payment_method || 'cash';
      
      if (!methodTotals[method]) {
        methodTotals[method] = { profit: 0, revenue: 0, count: 0 };
      }
      
      methodTotals[method].profit += sale.profit || 0;
      methodTotals[method].revenue += sale.total || 0;
      methodTotals[method].count += 1;
    });
    
    return Object.keys(methodTotals).map(method => ({
      method,
      profit: methodTotals[method].profit,
      revenue: methodTotals[method].revenue,
      count: methodTotals[method].count,
      margin: methodTotals[method].revenue > 0 
        ? (methodTotals[method].profit / methodTotals[method].revenue) * 100 
        : 0
    }));
  };

  // Fetch all profit data with one call
  const fetchAllProfitData = async () => {
    setLoading(true);
    
    try {
      // Get all sales for the year
      const yearRange = getDateRange('year');
      const salesData = await fetchProfitsByDateRange(yearRange.from, yearRange.to);
      
      if (salesData.length > 0) {
        // Calculate summary statistics
        const summaryStats = calculateProfitStatistics(salesData);
        
        // Update state with all data
        setProfitData({
          summary: summaryStats,
          sales: salesData
        });
        
        return {
          summary: summaryStats,
          sales: salesData,
          charts: generateChartData(salesData),
          paymentMethods: getPaymentMethodBreakdown(salesData)
        };
      }
      
      return null;
    } catch (err) {
      setError(err.message || 'Failed to fetch profit data');
      toast.error('Error fetching profit report data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter sales by custom date range
  const filterSalesByDateRange = async (startDate, endDate) => {
    setLoading(true);
    
    try {
      const salesData = await fetchProfitsByDateRange(startDate, endDate);
      
      if (salesData.length > 0) {
        // Calculate summary statistics
        const summaryStats = calculateProfitStatistics(salesData);
        
        // Update state with filtered data
        setProfitData({
          summary: summaryStats,
          sales: salesData
        });
        
        return {
          summary: summaryStats,
          sales: salesData,
          charts: generateChartData(salesData),
          paymentMethods: getPaymentMethodBreakdown(salesData)
        };
      }
      
      return {
        summary: {
          thisWeek: 0,
          thisMonth: 0,
          thisYear: 0,
          totalProfit: 0,
          totalRevenue: 0,
          averageMargin: 0
        },
        sales: [],
        charts: {
          dailyData: { labels: [], datasets: [] },
          monthlyData: { labels: [], datasets: [] }
        },
        paymentMethods: []
      };
    } catch (err) {
      setError(err.message || 'Failed to filter profit data');
      toast.error('Error filtering profit data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    profitData,
    fetchAllProfitData,
    filterSalesByDateRange,
    calculateProfitStatistics,
    generateChartData,
    getPaymentMethodBreakdown
  };
};
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockMovementChart = ({ 
  stockHistoryData, 
  isLoading, 
  chartPeriod,
  onPeriodChange 
}) => {
  // Determine data based on period
  const chartData = 
    chartPeriod === 'month' ? stockHistoryData.slice(-30) :
    chartPeriod === 'quarter' ? stockHistoryData.slice(-90) :
    stockHistoryData;

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          Stock Movement Over Time
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ mr: 1 }}
            onClick={() => onPeriodChange('month')}
            color={chartPeriod === 'month' ? 'primary' : 'inherit'}
          >
            30 Days
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ mr: 1 }}
            onClick={() => onPeriodChange('quarter')}
            color={chartPeriod === 'quarter' ? 'primary' : 'inherit'}
          >
            90 Days
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => onPeriodChange('year')}
            color={chartPeriod === 'year' ? 'primary' : 'inherit'}
          >
            1 Year
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      ) : stockHistoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="quantity" 
              stroke="#8884d8" 
              name="Stock Level"
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="text.secondary">
            No stock movement data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StockMovementChart;
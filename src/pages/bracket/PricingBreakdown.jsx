import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useBracketPricing } from '@/hooks/useBracketPricing';
import { formatCurrency } from '@/utils/formatUtils';

const PricingBreakdown = ({ productId }) => {
  const { getPricingBreakdown, calculatePrice, loading } = useBracketPricing();
  
  const [priceType, setPriceType] = useState('regular');
  const [customQuantities, setCustomQuantities] = useState('1,5,10,25,50,100');
  const [breakdown, setBreakdown] = useState(null);
  const [singleCalculation, setSingleCalculation] = useState({
    quantity: '',
    result: null
  });

  const defaultQuantities = [1, 5, 10, 25, 50, 100];

  useEffect(() => {
    if (productId) {
      loadBreakdown();
    }
  }, [productId, priceType]);

  const loadBreakdown = async () => {
    if (!productId) return;

    try {
      const quantities = parseQuantities(customQuantities);
      const result = await getPricingBreakdown(productId, priceType, quantities);
      setBreakdown(result);
    } catch (error) {
      console.error('Error loading breakdown:', error);
    }
  };

  const parseQuantities = (quantityString) => {
    try {
      return quantityString
        .split(',')
        .map(q => parseInt(q.trim()))
        .filter(q => !isNaN(q) && q > 0)
        .sort((a, b) => a - b);
    } catch {
      return defaultQuantities;
    }
  };

  const handleCalculateSingle = async () => {
    if (!singleCalculation.quantity || !productId) return;

    try {
      const result = await calculatePrice(productId, parseInt(singleCalculation.quantity), priceType);
      setSingleCalculation(prev => ({
        ...prev,
        result
      }));
    } catch (error) {
      console.error('Error calculating single price:', error);
    }
  };

  const handleCustomQuantitiesChange = (value) => {
    setCustomQuantities(value);
    
    // Auto-refresh if the input looks valid
    const quantities = parseQuantities(value);
    if (quantities.length > 0) {
      setTimeout(() => loadBreakdown(), 500);
    }
  };

  const getBracketIndicator = (breakdown) => {
    if (!breakdown) return null;

    if (breakdown.use_bracket_pricing && breakdown.active_bracket_id) {
      return <Chip label="Bracket Pricing" color="primary" size="small" />;
    } else if (breakdown.use_bracket_pricing) {
      return <Chip label="No Active Bracket" color="warning" size="small" />;
    } else {
      return <Chip label="Traditional Pricing" color="default" size="small" />;
    }
  };

  const getMaxSavings = (breakdown) => {
    if (!breakdown?.breakdown || breakdown.breakdown.length < 2) return 0;
    
    const firstPrice = breakdown.breakdown[0]?.price || 0;
    const lowestPrice = Math.min(...breakdown.breakdown.map(item => item.price || Infinity));
    
    return firstPrice - lowestPrice;
  };

  return (
    <Box>
      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Price Type</InputLabel>
            <Select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              label="Price Type"
            >
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="wholesale">Wholesale</MenuItem>
              <MenuItem value="walk_in">Walk-in</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Quantities (comma-separated)"
            value={customQuantities}
            onChange={(e) => handleCustomQuantitiesChange(e.target.value)}
            placeholder="1,5,10,25,50,100"
            helperText="Enter quantities separated by commas to see pricing breakdown"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="outlined"
            onClick={loadBreakdown}
            disabled={loading}
            sx={{ height: '56px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Refresh'}
          </Button>
        </Grid>
      </Grid>

      {/* Pricing Status */}
      {breakdown && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            Pricing Status:
          </Typography>
          {getBracketIndicator(breakdown)}
          {breakdown.use_bracket_pricing && getMaxSavings(breakdown) > 0 && (
            <Chip 
              label={`Max Savings: ${formatCurrency(getMaxSavings(breakdown))}`} 
              color="success" 
              size="small" 
            />
          )}
        </Box>
      )}

      {/* Error Message */}
      {breakdown?.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {breakdown.error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Breakdown Table */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pricing Breakdown
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : breakdown?.breakdown ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        {breakdown.use_bracket_pricing && (
                          <>
                            <TableCell align="right">Unit Savings</TableCell>
                            <TableCell align="right">Total Savings</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {breakdown.breakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {item.quantity.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {item.price ? formatCurrency(item.price) : 'N/A'}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {item.total ? formatCurrency(item.total) : 'N/A'}
                            </Typography>
                          </TableCell>
                          {breakdown.use_bracket_pricing && (
                            <>
                              <TableCell align="right">
                                {item.unit_savings > 0 ? (
                                  <Typography variant="body2" color="success.main">
                                    -{formatCurrency(item.unit_savings)}
                                  </Typography>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {item.total_savings > 0 ? (
                                  <Typography variant="body2" color="success.main">
                                    -{formatCurrency(item.total_savings)}
                                  </Typography>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No pricing data available. Please ensure the product has valid pricing configuration.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Single Calculation */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Calculate Specific Quantity
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={singleCalculation.quantity}
                  onChange={(e) => setSingleCalculation(prev => ({
                    ...prev,
                    quantity: e.target.value,
                    result: null
                  }))}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCalculateSingle}
                  disabled={!singleCalculation.quantity || loading}
                  sx={{ mb: 2 }}
                >
                  Calculate Price
                </Button>
                
                {singleCalculation.result && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Result for {singleCalculation.result.quantity} units:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(singleCalculation.result.price)} per unit
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Total: {formatCurrency(singleCalculation.result.total)}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Summary Card */}
          {breakdown && breakdown.breakdown && breakdown.breakdown.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Summary
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Price Type:
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {priceType}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Lowest Price:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(Math.min(...breakdown.breakdown.map(item => item.price || Infinity)))}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Highest Price:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(Math.max(...breakdown.breakdown.map(item => item.price || 0)))}
                    </Typography>
                  </Box>
                  
                  {breakdown.use_bracket_pricing && getMaxSavings(breakdown) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Max Savings:
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {formatCurrency(getMaxSavings(breakdown))}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Price Tiers:
                    </Typography>
                    <Typography variant="body2">
                      {breakdown.breakdown.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingBreakdown;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Slider,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  AutoFixHigh as SuggestionsIcon,
  ContentCopy as CopyIcon,
  TrendingUp as ProfitIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useBracketPricing } from '@/hooks/useBracketPricing';
import { formatCurrency } from '@/utils/currencyFormat';

const OptimalPricingSuggestions = ({ productId }) => {
  const { getOptimalPricingSuggestions, loading } = useBracketPricing();
  
  const [targetMargin, setTargetMargin] = useState(30); // 30%
  const [customQuantities, setCustomQuantities] = useState('1,10,25,50');
  const [suggestions, setSuggestions] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (productId) {
      loadSuggestions();
    }
  }, [productId]);

  const loadSuggestions = async () => {
    if (!productId) return;

    try {
      const quantities = parseQuantities(customQuantities);
      const targetMarginDecimal = targetMargin / 100;
      const result = await getOptimalPricingSuggestions(productId, targetMarginDecimal, quantities);
      setSuggestions(result);
    } catch (error) {
      console.error('Error loading suggestions:', error);
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
      return [1, 10, 25, 50];
    }
  };

  const handleMarginChange = (event, newValue) => {
    setTargetMargin(newValue);
  };

  const handleQuantitiesChange = (value) => {
    setCustomQuantities(value);
  };

  const handleApplySuggestions = () => {
    loadSuggestions();
  };

  const handleCopySuggestion = (suggestion, index) => {
    const bracketItem = {
      min_quantity: suggestion.min_quantity,
      max_quantity: suggestion.max_quantity,
      price: suggestion.suggested_price,
      price_type: 'regular',
      is_active: true
    };

    navigator.clipboard.writeText(JSON.stringify(bracketItem, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTotalProfitProjection = () => {
    if (!suggestions?.suggestions) return 0;
    
    return suggestions.suggestions.reduce((total, suggestion) => {
      // Assume average quantity sold per tier for projection
      const avgQuantity = suggestion.min_quantity + 10;
      return total + (suggestion.profit_per_unit * avgQuantity);
    }, 0);
  };

  const getMarginColor = (marginPercentage) => {
    if (marginPercentage >= 25) return 'success';
    if (marginPercentage >= 15) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Target Margin
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={targetMargin}
                  onChange={handleMarginChange}
                  aria-labelledby="target-margin-slider"
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  step={1}
                  marks={[
                    { value: 10, label: '10%' },
                    { value: 20, label: '20%' },
                    { value: 30, label: '30%' },
                    { value: 40, label: '40%' },
                    { value: 50, label: '50%' }
                  ]}
                  min={5}
                  max={60}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Current: {targetMargin}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quantity Tiers
              </Typography>
              <TextField
                fullWidth
                label="Quantities (comma-separated)"
                value={customQuantities}
                onChange={(e) => handleQuantitiesChange(e.target.value)}
                placeholder="1,10,25,50"
                helperText="Define quantity breakpoints for pricing tiers"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplySuggestions}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SuggestionsIcon />}
              >
                {loading ? 'Calculating...' : 'Get Suggestions'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cost Information */}
      {suggestions && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InfoIcon />
            <Typography variant="body2">
              <strong>Current Cost Price:</strong> {formatCurrency(suggestions.cost_price)}
              <br />
              <strong>Target Margin:</strong> {targetMargin}% 
              <strong style={{ marginLeft: 16 }}>Base Price:</strong> {formatCurrency(suggestions.cost_price / (1 - (targetMargin / 100)))}
            </Typography>
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Suggestions Table */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Optimal Pricing Suggestions
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : suggestions?.suggestions ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Quantity Range</TableCell>
                        <TableCell align="right">Suggested Price</TableCell>
                        <TableCell align="right">Margin %</TableCell>
                        <TableCell align="right">Profit per Unit</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {suggestions.suggestions.map((suggestion, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {suggestion.min_quantity}
                              {suggestion.max_quantity ? ` - ${suggestion.max_quantity}` : '+'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(suggestion.suggested_price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${suggestion.margin_percentage}%`}
                              color={getMarginColor(suggestion.margin_percentage)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="success.main">
                              {formatCurrency(suggestion.profit_per_unit)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title={copiedIndex === index ? "Copied!" : "Copy to clipboard"}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopySuggestion(suggestion, index)}
                                color={copiedIndex === index ? "success" : "default"}
                              >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No suggestions available. Click "Get Suggestions" to generate optimal pricing recommendations.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Summary and Tips */}
        <Grid item xs={12} md={4}>
          {suggestions && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ProfitIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Profit Projection
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cost Price:
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(suggestions.cost_price)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Target Margin:
                    </Typography>
                    <Typography variant="body2">
                      {targetMargin}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Price Tiers:
                    </Typography>
                    <Typography variant="body2">
                      {suggestions.suggestions?.length || 0}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Total Profit:
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      {formatCurrency(getTotalProfitProjection())}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing Tips
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Higher quantities should have lower unit prices to encourage bulk purchases
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Maintain at least 10-15% margin for sustainable business
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Consider market competition when setting final prices
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Review and adjust pricing regularly based on cost changes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OptimalPricingSuggestions;
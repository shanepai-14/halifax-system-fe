import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Paper, Typography, TextField, InputAdornment, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, Card, CardContent, CardMedia, 
  Grid, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Tooltip, Zoom, Fade
} from '@mui/material';
import { getFileUrl } from '@/utils/formatUtils';
import { 
  SearchOutlined, 
  PlusOutlined, 
  UnorderedListOutlined,  
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

// Separate memoized search input component
const SearchInput = memo(({ value, onChange, onMinimize, showMinimize }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or code"
        size="small"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />
      {showMinimize && (
        <Tooltip title="Minimize">
          <IconButton onClick={onMinimize} color="primary">
            <MenuFoldOutlined />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
});

// Separate memoized category filters
const CategoryFilters = memo(({ categories, selectedCategory, onCategoryChange, viewMode, onViewModeChange }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip 
            key={category.name}
            label={category.name}
            onClick={() => onCategoryChange(selectedCategory === category.name ? null : category.name)}
            color={selectedCategory === category.name ? "primary" : "default"}
            variant={selectedCategory === category.name ? "filled" : "outlined"}
          />
        ))}
      </Box>
      <Box>
        <IconButton 
          onClick={() => onViewModeChange('table')}
          color={viewMode === 'table' ? 'primary' : 'default'}
        >
          <UnorderedListOutlined />
        </IconButton>
        <IconButton 
          onClick={() => onViewModeChange('card')} 
          color={viewMode === 'card' ? 'primary' : 'default'}
        >
          <AppstoreOutlined />
        </IconButton>
      </Box>
    </Box>
  );
});

// Separate memoized product row
const ProductRow = memo(({ product, onAddProduct, onShowBracket }) => {
  const handleAdd = useCallback(() => {
    onAddProduct(product);
  }, [product, onAddProduct]);

  const handleShowBracket = useCallback(() => {
    onShowBracket(product);
  }, [product, onShowBracket]);

  return (
    <TableRow>
      <TableCell sx={{padding:"0px!important"}}>{product.code}</TableCell>
      <TableCell sx={{padding:"0px!important"}}>
        {product.price_bracket ? (
          <Typography 
            variant="h6" 
            sx={{ 
              cursor: 'pointer', 
              color: 'primary.main',
              textDecoration: 'underline',
              '&:hover': { color: 'primary.dark' }
            }}
            onClick={handleShowBracket}
            title="Click to view pricing brackets"
          >
            {product.name} 📊
          </Typography>
        ) : (
          <Typography variant="h6">
            {product.name}
          </Typography>
        )}
      </TableCell>
      <TableCell align="right" sx={{padding:"0px!important"}}>₱{product.walk_in_price}</TableCell>
      <TableCell align="right" sx={{padding:"0px!important"}}>{parseInt(product.quantity, 10)}</TableCell>
      <TableCell align="right" sx={{padding:"0px!important"}}>
        <IconButton 
          color="success" 
          onClick={handleAdd}
          disabled={product.quantity === 0}
        >
          <PlusOutlined />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

// Separate memoized product card
const ProductCard = memo(({ product, onAddProduct }) => {
  const handleAdd = useCallback(() => {
    onAddProduct(product);
  }, [product, onAddProduct]);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {product.product_image ? (
          <CardMedia
            component="img"
            image={getFileUrl(product.product_image)} 
            sx={{
              height: 100,
              bgcolor: product.quantity > 0 ? 'primary.white' : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          />
        ) : (
          <CardMedia
            component="div"
            sx={{
              height: 100,
              bgcolor: product.quantity > 0 ? 'primary.light' : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
            <Typography variant="h6">{product.code}</Typography>
          </CardMedia>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="subtitle1" component="div">
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Price: ₱{product.regular_price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock: {product.quantity}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<PlusOutlined />}
              onClick={handleAdd}
              disabled={product.quantity === 0}
            >
              Add to Order
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
});

// Main optimized ProductList component
const ProductList = memo(({ 
  products, 
  categories, 
  onAddProduct, 
  dialogOpen, 
  selectedProduct, 
  onCloseDialog, 
  onMinimize, 
  isMinimized,
  isInModal = false
}) => {
  // Local state - isolated from parent re-renders
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bracketModalOpen, setBracketModalOpen] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState(null);

  // Memoized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleMinimize = useCallback(() => {
    if (onMinimize) onMinimize();
  }, [onMinimize]);

  const handleCloseDialog = useCallback(() => {
    if (onCloseDialog) onCloseDialog();
  }, [onCloseDialog]);

  const handleShowBracket = useCallback((product) => {
    setSelectedBracket(product.price_bracket);
    setBracketModalOpen(true);
  }, []);

  // Memoized filtered products - only recalculates when dependencies change
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.code.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Memoized table view
  const TableView = useMemo(() => (
    <TableContainer sx={{ maxHeight:'800px', overflowY: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Walk In ₱</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <ProductRow 
              key={product.id} 
              product={product} 
              onAddProduct={onAddProduct}
              onShowBracket={handleShowBracket}
            />
          ))}
          {filteredProducts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="textSecondary">
                  No products found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ), [filteredProducts, onAddProduct]);

  // Memoized card view
  const CardView = useMemo(() => (
    <Box sx={{ height: 'calc(100vh - 100px)', overflowY: 'auto', p: 1 }}>
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddProduct={onAddProduct}
          />
        ))}
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" align="center">
              No products found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  ), [filteredProducts, onAddProduct]);

  // Minimized view
  if (isMinimized) {
    return (
      <Zoom in={isMinimized}>
        <Paper 
          elevation={6}
          sx={{
            position: 'absolute',
            top: 25,
            left: 35,
            zIndex: 20,
            borderRadius: '50%',
            overflow: 'visible',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              opacity: 0.9,
            }
          }}
        >
          <Tooltip title="Expand Products">
            <IconButton 
              onClick={handleMinimize}
              color="inherit"
              sx={{ width: '100%', height: '100%' }}
            >
              <MenuUnfoldOutlined />
            </IconButton>
          </Tooltip>
        </Paper>
      </Zoom>
    );
  }

  // Full view
  return (
    <Fade in={!isMinimized}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            onMinimize={handleMinimize}
            showMinimize={!isInModal}
          />
          
          <CategoryFilters
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
          
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {viewMode === 'table' ? TableView : CardView}
          </Box>
          
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Product Out of Stock</DialogTitle>
            <DialogContent>
              The product "{selectedProduct?.name}" is currently out of stock.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>OK</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={bracketModalOpen} onClose={() => setBracketModalOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              Pricing Brackets - {selectedBracket && products.find(p => p.price_bracket?.id === selectedBracket.id)?.name}
            </DialogTitle>
            <DialogContent>
              {selectedBracket && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Quantity Range</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBracket.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.min_quantity} - {item.max_quantity || '∞'}
                          </TableCell>
                          <TableCell align="right">₱{Number(item.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.is_active ? 'Active' : 'Inactive'} 
                              size="small"
                              color={item.is_active ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Fade>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;
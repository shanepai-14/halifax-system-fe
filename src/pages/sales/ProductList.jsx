import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, InputAdornment, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, Card, CardContent, CardMedia, 
  Grid, Chip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Tooltip, Zoom, Fade
} from '@mui/material';
import { getFileUrl } from '@/utils/fileHelper';
import { 
  SearchOutlined, 
  PlusOutlined, 
  UnorderedListOutlined,  
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const ProductList = ({ products, categories, onAddProduct, dialogOpen, selectedProduct, onCloseDialog, onMinimize, isMinimized }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Filter products based on search term and selected category
    let filtered = products;

    // Apply category filter if a category is selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory]);

  const TableView = () => (
    <TableContainer sx={{ maxHeight:'800px', overflowY: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Regular $</TableCell>
            <TableCell align="right">Walk In $</TableCell>
            <TableCell align="right">Whole sale $</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}  >
              <TableCell sx={{padding:"0px!important"}}>{product.code}</TableCell>
              <TableCell sx={{padding:"0px!important"}}>{product.name}</TableCell>
              <TableCell align="right" sx={{padding:"0px!important"}}>₱{product.regular_price}</TableCell>
              <TableCell align="right" sx={{padding:"0px!important"}}>₱{product.walk_in_price}</TableCell>
              <TableCell align="right" sx={{padding:"0px!important"}}>₱{product.wholesale_price}</TableCell>
              <TableCell align="right" sx={{padding:"0px!important"}}>{parseInt(product.quantity, 10)}</TableCell>
              <TableCell align="right" sx={{padding:"0px!important"}}>
                <IconButton 
                  color="success" 
                  onClick={() => onAddProduct(product)} 
                  disabled={product.quantity === 0}
                >
                  <PlusOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
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
  );

  const CardView = () => (
    <Box sx={{ height: 'calc(100vh - 100px)', overflowY: 'auto', p: 1 }}>
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                    onClick={() => onAddProduct(product)}
                    disabled={product.quantity === 0}
                  >
                    Add to Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
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
  );

  // Main component to render when not minimized
  const FullProductList = () => (
    <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or code"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Minimize">
          <IconButton onClick={onMinimize} color="primary">
            <MenuFoldOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip 
              key={category.name}
              label={`${category.name}`}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              color={selectedCategory === category.name ? "primary" : "default"}
              variant={selectedCategory === category.name ? "filled" : "outlined"}
            />
          ))}
        </Box>
        <Box>
          <IconButton 
            onClick={() => setViewMode('table')}
            color={viewMode === 'table' ? 'primary' : 'default'}
          >
            <UnorderedListOutlined />
          </IconButton>
          <IconButton 
            onClick={() => setViewMode('card')} 
            color={viewMode === 'card' ? 'primary' : 'default'}
          >
            <AppstoreOutlined />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {viewMode === 'table' ? <TableView /> : <CardView />}
      </Box>
      
      <Dialog open={dialogOpen} onClose={onCloseDialog}>
        <DialogTitle>Product Out of Stock</DialogTitle>
        <DialogContent>
          The product "{selectedProduct?.name}" is currently out of stock.
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return isMinimized ? (
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
            onClick={onMinimize} 
            color="inherit"
            sx={{ width: '100%', height: '100%' }}
          >
            <MenuUnfoldOutlined />
          </IconButton>
        </Tooltip>
      </Paper>
    </Zoom>
  ) : (
    <Fade in={!isMinimized}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <FullProductList />
      </Paper>
    </Fade>
  );
};

export default ProductList;
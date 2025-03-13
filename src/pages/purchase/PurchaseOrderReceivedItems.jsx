import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Autocomplete,
  IconButton,
  Button,
  Typography
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// Create a memoized row component to prevent unnecessary re-renders
const ReceivedItemRow = React.memo(({
  item,
  index,
  products,
  errors,
  onItemChange,
  onRemoveItem,
  disabled,
  isCompleted,
  isCancelled,
  distributionCostPerUnit
}) => {
  // Calculate the distribution cost display value
  const distributionCostDisplay = useMemo(() => {
    if (!item.received_quantity || !item.cost_price) return '₱0.00';
    const totalUnitCost = parseFloat(item.cost_price || 0) + distributionCostPerUnit;
    return `₱${totalUnitCost.toFixed(2)}`;
  }, [item.cost_price, item.received_quantity, distributionCostPerUnit]);

  // Calculate total display value
  const totalDisplay = useMemo(() => {
    return `₱${(item.cost_price * item.received_quantity).toFixed(2)}`;
  }, [item.cost_price, item.received_quantity]);

  // Handle product change
  const handleProductChange = useCallback((e, newValue) => {
    onItemChange(index, "product_id", newValue ? newValue.id : "");
  }, [index, onItemChange]);

  // Handle quantity change
  const handleQuantityChange = useCallback((e) => {
    onItemChange(index, "received_quantity", e.target.value);
  }, [index, onItemChange]);

  // Handle cost price change
  const handleCostPriceChange = useCallback((e) => {
    onItemChange(index, "cost_price", e.target.value);
  }, [index, onItemChange]);

  // Handle walk-in price change
  const handleWalkInPriceChange = useCallback((e) => {
    onItemChange(index, "walk_in_price", e.target.value);
  }, [index, onItemChange]);

  // Handle wholesale price change
  const handleWholesalePriceChange = useCallback((e) => {
    onItemChange(index, "wholesale_price", e.target.value);
  }, [index, onItemChange]);

  // Handle regular price change
  const handleRegularPriceChange = useCallback((e) => {
    onItemChange(index, "regular_price", e.target.value);
  }, [index, onItemChange]);

  // Handle remove item
  const handleRemoveItem = useCallback(() => {
    onRemoveItem(index);
  }, [index, onRemoveItem]);

  // Filter available products (memoized)
  const availableProducts = useMemo(() => {
    return products?.filter(
      (product) => !products.some(
        (p, i) => i !== index && p.product_id === product.id
      )
    ) || [];
  }, [products, index]);

  // Get selected product (memoized)
  const selectedProduct = useMemo(() => {
    return products?.find(product => product.id === item.product_id) || null;
  }, [products, item.product_id]);

  // Update distribution_price whenever needed
  useEffect(() => {
    if (item.received_quantity && item.cost_price && distributionCostPerUnit > 0) {
      const totalUnitCost = parseFloat(item.cost_price || 0) + distributionCostPerUnit;
      // Only update if the value has actually changed
      if (item.distribution_price !== totalUnitCost.toFixed(2)) {
        onItemChange(index, "distribution_price", totalUnitCost.toFixed(2));
      }
    }
  }, [item.cost_price, item.received_quantity, distributionCostPerUnit, index, onItemChange, item.distribution_price]);

  return (
    <TableRow>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <Autocomplete
            value={selectedProduct}
            onChange={handleProductChange}
            options={availableProducts}
            size="small"
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.product_name || ""}
            isOptionEqualToValue={(option, value) => option.id === value}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    padding: "4px 8px",
                  },
                  "& .MuiFormLabel-root": {
                    fontSize: "0.875rem",
                  },
                }}
                error={!!errors[`received_items.${index}.product_id`]}
                helperText={
                  errors[`received_items.${index}.product_id`] ||
                  "Required"
                }
              />
            )}
          />
        ) : (
          selectedProduct?.product_name || ""
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <TextField
            type="number"
            value={item.received_quantity}
            onChange={handleQuantityChange}
            error={!!errors[`received_items.${index}.received_quantity`]}
            helperText={
              errors[`received_items.${index}.received_quantity`] ||
              "Required"
            }
            inputProps={{ min: 0, step: "0.01" }}
            disabled={disabled}
            size="small"
          />
        ) : (
          item.received_quantity
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <TextField
            type="number"
            value={item.cost_price}
            onChange={handleCostPriceChange}
            error={!!errors[`received_items.${index}.cost_price`]}
            helperText={
              errors[`received_items.${index}.cost_price`] ||
              "Required"
            }
            inputProps={{ min: 0, step: "0.01" }}
            disabled={disabled}
            size="small"
          />
        ) : (
          `₱${item.cost_price}`
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        <TextField
          type="text"
          value={distributionCostDisplay}
          readOnly={true}
          size="small"
          sx={{
            "& .MuiInputBase-input": {
              color: "rgba(0, 0, 0, 0.87)"
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)"
            }
          }}
        />
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <TextField
            type="number"
            value={item.walk_in_price}
            onChange={handleWalkInPriceChange}
            error={!!errors[`received_items.${index}.walk_in_price`]}
            helperText={
              errors[`received_items.${index}.walk_in_price`] ||
              "Required"
            }
            inputProps={{ min: 0, step: "0.01" }}
            disabled={disabled}
            size="small"
          />
        ) : (
          `₱${item.walk_in_price}`
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <TextField
            type="number"
            value={item.wholesale_price}
            onChange={handleWholesalePriceChange}
            error={!!errors[`received_items.${index}.wholesale_price`]}
            helperText={
              errors[`received_items.${index}.wholesale_price`] ||
              "Required"
            }
            inputProps={{ min: 0, step: "0.01" }}
            disabled={disabled}
            size="small"
          />
        ) : (
          `₱${item.wholesale_price}`
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {!isCompleted && !isCancelled ? (
          <TextField
            type="number"
            value={item.regular_price}
            onChange={handleRegularPriceChange}
            error={!!errors[`received_items.${index}.regular_price`]}
            helperText={
              errors[`received_items.${index}.regular_price`] ||
              "Required"
            }
            inputProps={{ min: 0, step: "0.01" }}
            disabled={disabled}
            size="small"
          />
        ) : (
          `₱${item.regular_price}`
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        {totalDisplay}
      </TableCell>
      {!disabled && !isCompleted && !isCancelled && (
        <TableCell sx={{ verticalAlign: "top" }}>
          <IconButton
            size="large"
            onClick={handleRemoveItem}
            disabled={disabled || item.isLastItem}
          >
            <DeleteOutlined />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
});

// Main component
const PurchaseOrderReceivedItems = ({ 
  products, 
  attributes, 
  receivedItems, 
  onItemChange, 
  onAddItem, 
  onRemoveItem, 
  errors = {},
  disabled = false,
  status,
  totalAdditonalCost
}) => {
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  // Memoize total calculation to prevent unnecessary recalculation
  const total = useMemo(() => {
    return receivedItems.reduce((sum, item) => 
      sum + (parseFloat(item.cost_price || 0) * parseFloat(item.received_quantity || 0)), 0
    );
  }, [receivedItems]);

  // Memoize distribution cost calculation
  const distributionCostPerUnit = useMemo(() => {
    if (!totalAdditonalCost || totalAdditonalCost <= 0 || receivedItems.length === 0) {
      return 0;
    }

    // Calculate total quantity of all items
    const totalQuantity = receivedItems.reduce((sum, item) => 
      sum + parseFloat(item.received_quantity || 0), 0
    );

    if (totalQuantity <= 0) {
      return 0;
    }

    // Distribution cost per unit is the same for all items
    return parseFloat(totalAdditonalCost) / totalQuantity;
  }, [totalAdditonalCost, receivedItems]);

  // Handle add item with useCallback
  const handleAddItem = useCallback(() => {
    onAddItem();
  }, [onAddItem]);

  return (
    <TableContainer sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={isCompleted ? 8 : 9}>
              <Typography variant="h5">Received Items</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Received Qty</TableCell>
            <TableCell>Cost Price</TableCell>
            <TableCell>Distribution Cost</TableCell>
            <TableCell>Walk-in Price</TableCell>
            <TableCell>Wholesale Price</TableCell>
            <TableCell>Regular Price</TableCell>
            <TableCell>Total</TableCell>
            {!disabled && <TableCell width={50} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {receivedItems.map((item, index) => (
            <ReceivedItemRow
              key={`${item.product_id || 'new'}-${index}`}
              item={item}
              index={index}
              products={products}
              errors={errors}
              onItemChange={onItemChange}
              onRemoveItem={onRemoveItem}
              disabled={disabled}
              isCompleted={isCompleted}
              isCancelled={isCancelled}
              distributionCostPerUnit={distributionCostPerUnit}
              isLastItem={receivedItems.length === 1}
            />
          ))}
          <TableRow>
            <TableCell colSpan={5} sx={{ border: "none" }}>
              <Button
                startIcon={<PlusOutlined />}
                onClick={handleAddItem}
                sx={{
                  visibility:
                    !disabled && !isCompleted && !isCancelled ? "visible" : "hidden",
                }}
              >
                Add Received Item
              </Button>
            </TableCell>
            <TableCell>
              <Typography variant="h5">Total Received:</Typography>
            </TableCell>
            <TableCell>₱{total.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(PurchaseOrderReceivedItems);
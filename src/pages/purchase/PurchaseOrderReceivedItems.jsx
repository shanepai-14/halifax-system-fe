import React from 'react';
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
  Box,
  Typography
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const PurchaseOrderReceivedItems = ({ 
  products, 
  attributes, 
  receivedItems, 
  onItemChange, 
  onAddItem, 
  onRemoveItem, 
  errors = {},
  disabled = false,
  status
}) => {

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  const calculateTotal = () => {
    return receivedItems.reduce((sum, item) => 
      sum + (item.cost_price * item.received_quantity), 0
    );
  };

  return (
    <>
      <TableContainer sx={{ mt: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={isCompleted ? 7 : 8}>
                <Typography variant="h5">Received Items</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Received Qty</TableCell>
              <TableCell>Cost Price</TableCell>
              <TableCell>Walk-in Price</TableCell>
              <TableCell>Wholesale Price</TableCell>
              <TableCell>Regular Price</TableCell>
              <TableCell>Total</TableCell>
              {!disabled && <TableCell width={50} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {receivedItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ verticalAlign: "top" }}>
                  {!isCompleted && !isCancelled ? (
                    <Autocomplete
                      value={
                        products?.find(
                          (product) => product.id === item.product_id
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        onItemChange(
                          index,
                          "product_id",
                          newValue ? newValue.id : ""
                        )
                      }
                      options={
                        products?.filter(
                          (product) =>
                            !receivedItems.some(
                              (ri, i) =>
                                i !== index && ri.product_id === product.id
                            )
                        ) || []
                      }
                      size="small"
                      sx={{ width: 300 }}
                      getOptionLabel={(option) => option.product_name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value
                      }
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
                    products?.find((product) => product.id === item.product_id)
                      ?.product_name || ""
                  )}
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  {!isCompleted  && !isCancelled ? (
                    <TextField
                      type="number"
                      value={item.received_quantity}
                      onChange={(e) =>
                        onItemChange(index, "received_quantity", e.target.value)
                      }
                      error={
                        !!errors[`received_items.${index}.received_quantity`]
                      }
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
                  {!isCompleted  && !isCancelled ? (
                    <TextField
                      type="number"
                      value={item.cost_price}
                      onChange={(e) =>
                        onItemChange(index, "cost_price", e.target.value)
                      }
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
                  {!isCompleted && !isCancelled ? (
                    <TextField
                      type="number"
                      value={item.walk_in_price}
                      onChange={(e) =>
                        onItemChange(index, "walk_in_price", e.target.value)
                      }
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
                      onChange={(e) =>
                        onItemChange(index, "wholesale_price", e.target.value)
                      }
                      error={
                        !!errors[`received_items.${index}.wholesale_price`]
                      }
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
                      onChange={(e) =>
                        onItemChange(index, "regular_price", e.target.value)
                      }
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
                  ₱{(item.cost_price * item.received_quantity).toFixed(2)}
                </TableCell>
                {!disabled && !isCompleted && !isCancelled && (
                  <TableCell sx={{ verticalAlign: "top" }}>
                    <IconButton
                      size="large"
                      onClick={() => onRemoveItem(index)}
                      disabled={receivedItems.length === 1}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow >
              <TableCell colSpan={5} sx={{border:"none"}}>
                <Button
                  startIcon={<PlusOutlined />}
                  onClick={onAddItem}
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
              <TableCell>₱{calculateTotal().toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PurchaseOrderReceivedItems;
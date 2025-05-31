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

/**
 * Component to handle additional costs for purchase orders and receiving reports
 * @param {Object} props
 * @param {Array} props.costTypes - Array of available cost types 
 * @param {Array} props.additionalCosts - Array of additional cost items
 * @param {Function} props.onCostChange - Handler for changing cost item fields
 * @param {Function} props.onAddCost - Handler for adding a new cost item
 * @param {Function} props.onRemoveCost - Handler for removing a cost item
 * @param {Object} props.errors - Validation errors object
 * @param {Boolean} props.disabled - Whether the component is in read-only mode
 * @param {String} props.status - Current status of the purchase order
 * @param {Boolean} props.showTotals - Whether to show total calculations
 * @param {Function} props.calculateTotalCosts - Function to calculate total costs (if showTotals is true)
 * @param {Function} props.onAddCostType - Optional handler for adding a new cost type 
 */
const PurchaseOrderAdditionalCosts = ({
  costTypes = [],
  additionalCosts = [],
  onCostChange,
  onAddCost,
  onRemoveCost,
  errors = {},
  disabled = false,
  status,
  showTotals = false,
  calculateTotalCosts = () => 0,
  onAddCostType
}) => {

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isReadOnly = disabled || isCompleted || isCancelled;

  return (
    <>
      <TableContainer sx={{ mt: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={isReadOnly ? 3 : 4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" >
                    Additional Costs
                  </Typography>
                  {onAddCostType && !isReadOnly && (
                    <IconButton
                      sx={{ marginLeft: "8px !important" }}
                      onClick={onAddCostType}
                    >
                      <PlusOutlined />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cost Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Remarks</TableCell>
              {!isReadOnly && <TableCell width={50} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {additionalCosts.map((cost, index) => (
              <TableRow key={index}>
                <TableCell>
                  {!isReadOnly ? (
                    <Autocomplete
                      size="small"
                      value={
                        costTypes?.find(
                          (type) => type.cost_type_id === cost.cost_type_id
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        onCostChange(
                          index,
                          "cost_type_id",
                          newValue ? newValue.cost_type_id : ""
                        )
                      }
                      options={
                        costTypes?.filter(
                          (type) =>
                            type.is_active &&
                            !additionalCosts.some(
                              (c, i) =>
                                i !== index && c.cost_type_id === type.cost_type_id
                            )
                        ) || []
                      }
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.cost_type_id === value
                      }
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
                          error={!!errors[`additional_costs.${index}.cost_type_id`]}
                          helperText={
                            errors[`additional_costs.${index}.cost_type_id`] ||
                            "Required"
                          }
                        />
                      )}
                    />
                  ) : (
                    costTypes?.find(
                      (type) => type.cost_type_id === cost.cost_type_id
                    )?.name || ""
                  )}
                </TableCell>
                <TableCell>
                  {!isReadOnly ? (
                    <TextField
                      size="small"
                      type="number"
                      value={cost.amount}
                      onChange={(e) =>
                        onCostChange(index, "amount", e.target.value)
                      }
                      error={!!errors[`additional_costs.${index}.amount`]}
                      helperText={
                        errors[`additional_costs.${index}.amount`] ||
                        "Required"
                      }
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  ) : (
                    `₱${parseFloat(cost.amount).toFixed(2)}`
                  )}
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  {!isReadOnly ? (
                    <TextField
                      size="small"
                      value={cost.remarks || ""}
                      onChange={(e) =>
                        onCostChange(index, "remarks", e.target.value)
                      }
                      fullWidth
                    />
                  ) : (
                    cost.remarks || ""
                  )}
                </TableCell>
                {!isReadOnly && (
                  <TableCell sx={{ verticalAlign: "top" }}>
                    <IconButton
                      size="large"
                      onClick={() => onRemoveCost(index)}
                      disabled={additionalCosts.length === 0}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {/* No costs message */}
            {additionalCosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={isReadOnly ? 3 : 4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No additional costs
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Add Cost button */}
            <TableRow>
              <TableCell sx={{ border: "none" }} colSpan={isReadOnly ? 2 : 3}>
                <Button
                  startIcon={<PlusOutlined />}
                  onClick={onAddCost}
                  sx={{ visibility: isReadOnly ? "hidden" : "visible" }}
                >
                  Add Additional Cost
                </Button>
              </TableCell>
              
              {showTotals && (
                <TableCell>
                  <Typography variant="h6">
                    ₱{calculateTotalCosts().toFixed(2)}
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PurchaseOrderAdditionalCosts;
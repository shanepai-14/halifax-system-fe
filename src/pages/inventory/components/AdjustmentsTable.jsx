import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';

const AdjustmentsTable = ({ 
  adjustments, 
  isLoading, 
  onNewAdjustment 
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Inventory Adjustments
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PlusOutlined />}
          onClick={onNewAdjustment}
        >
          New Adjustment
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Adjustment Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Before</TableCell>
              <TableCell>After</TableCell>
              <TableCell>Performed By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : adjustments?.length > 0 ? (
              adjustments.map((adjustment) => (
                <TableRow key={adjustment.id} hover>
                  <TableCell>
                    {new Date(adjustment.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={adjustment.adjustment_type.charAt(0).toUpperCase() + adjustment.adjustment_type.slice(1)} 
                      color={
                        adjustment.adjustment_type === 'addition' || adjustment.adjustment_type === 'return' 
                          ? 'success' 
                          : adjustment.adjustment_type === 'correction' 
                            ? 'info' 
                            : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {adjustment.adjustment_type === 'addition' || adjustment.adjustment_type === 'return' 
                      ? `+${parseInt(adjustment.quantity)}` 
                      : `-${parseInt(adjustment.quantity)}`}
                  </TableCell>
                  <TableCell>{adjustment.reason}</TableCell>
                  <TableCell>{parseInt(adjustment.quantity_before)}</TableCell>
                  <TableCell>{parseInt(adjustment.quantity_after)}</TableCell>
                  <TableCell>{adjustment.user?.name || 'System'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No adjustment records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdjustmentsTable;
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
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';

const TransactionHistoryTable = ({ 
  transactions, 
  isLoading, 
  searchTerm,
  onSearchChange,
  showSearch = true 
}) => {
  // Filter transactions by search
  const filteredTransactions = transactions?.filter(transaction => {
    if (!searchTerm) return true;
    return (
      transaction.reference_id?.toString().includes(searchTerm) ||
      transaction.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box>
      {showSearch && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Transaction History
          </Typography>
          <TextField
            placeholder="Search transactions..."
            size="small"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Before</TableCell>
              <TableCell>After</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : filteredTransactions?.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.transaction_type.replace('_', ' ')} 
                      color={
                        transaction.transaction_type === 'purchase' || transaction.transaction_type === 'adjustment_in'
                          ? 'success' 
                          : transaction.transaction_type === 'sales' || transaction.transaction_type === 'adjustment_out'
                            ? 'error' 
                            : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {transaction.transaction_type === 'purchase' || transaction.transaction_type === 'adjustment_in' || transaction.transaction_type === 'return'
                      ? `+${transaction.quantity}` 
                      : `-${transaction.quantity}`}
                  </TableCell>
                  <TableCell>{transaction.quantity_before}</TableCell>
                  <TableCell>{transaction.quantity_after}</TableCell>
                  <TableCell>
                    {transaction.reference_type === 'purchase_order' 
                      ? `PO-${transaction.reference_id}` 
                      : transaction.reference_type === 'sales_order'
                        ? `SO-${transaction.reference_id}`
                        : transaction.reference_type === 'adjustment'
                          ? `ADJ-${transaction.reference_id}`
                          : transaction.reference_id}
                  </TableCell>
                  <TableCell>
                    {transaction.notes || 'No details'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transaction history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistoryTable;
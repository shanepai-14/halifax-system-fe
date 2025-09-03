import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OverviewTabContent = ({ 
  product, 
  inventoryLogs, 
  isLoadingLogs, 
  productTransactions, 
  isLoadingTransactions, 
  status 
}) => {
  // Prepare stock history data for chart
  const stockHistoryData = inventoryLogs?.map(log => ({
    date: new Date(log.created_at).toLocaleDateString(),
    quantity: log.quantity_after,
    transaction: log.transaction_type,
  })) || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Inventory Overview
      </Typography>

      {status === 'low' && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          icon={<WarningOutlined />}
        >
          This product is below its reorder level ({product.reorder_level}). Consider restocking soon.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {isLoadingLogs ? (
                  <ListItem>
                    <ListItemText primary={<CircularProgress size={20} />} />
                  </ListItem>
                ) : inventoryLogs?.length > 0 ? (
                  inventoryLogs.slice(0, 5).map((log) => (
                    <ListItem key={log.id}>
                      <ListItemText
                        primary={
                          <span>
                            {log.transaction_type === 'purchase' || log.transaction_type === 'adjustment_in' || log.transaction_type === 'transfer_in' || log.transaction_type === 'return'
                              ? `+${parseInt(log.quantity)}` 
                              : `-${parseInt(log.quantity)}`} {log.transaction_type.replace('_', ' ')}
                          </span>
                        }
                        secondary={new Date(log.created_at).toLocaleString()}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent activity" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Stock Movement (30 Days)
              </Typography>
              {isLoadingLogs ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : stockHistoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stockHistoryData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No stock movement data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Latest Transactions
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingTransactions ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : productTransactions?.length > 0 ? (
                productTransactions.slice(0, 10).map((transaction) => (
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
                      {transaction.transaction_type === 'purchase' || transaction.transaction_type === 'adjustment_in' || transaction.transaction_type === 'transfer_in' || transaction.transaction_type === 'return'
                        ? `+${parseInt(transaction.quantity)}` 
                        : `-${parseInt(transaction.quantity)}`}
                    </TableCell>
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
                  <TableCell colSpan={5} align="center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default OverviewTabContent;
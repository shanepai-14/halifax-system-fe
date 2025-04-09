import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  DollarCircleOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { formatCurrency } from '@/utils/currencyFormat';



const StatisticsTab = ({ pettyCashStats, employeeStats, balance }) => {
  return (
    <Box>
      <Grid container spacing={3} mb={2}>
        {/* Fund Usage Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">Fund Usage Rate</Typography>
              <Typography variant="h4">
                {pettyCashStats?.total_funds > 0 
                  ? Math.round(
                      ((pettyCashStats.total_funds - pettyCashStats.available_balance) / pettyCashStats.total_funds) * 100
                    ) 
                  : 0}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowUpOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                <Typography variant="body2" color="error">
                  Used: {formatCurrency(pettyCashStats?.total_funds - pettyCashStats?.available_balance || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Transaction Success Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">Transaction Success Rate</Typography>
              <Typography variant="h4">
                {pettyCashStats?.total_transactions > 0 
                  ? Math.round(
                      (pettyCashStats.approved_transactions / pettyCashStats.total_transactions) * 100
                    ) 
                  : 0}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Typography variant="body2" color="success.main">
                  Approved: {pettyCashStats?.approved_transactions || 0} of {pettyCashStats?.total_transactions || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pending Transactions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">Pending Actions</Typography>
              <Typography variant="h4">
                {(pettyCashStats?.pending_transactions || 0) + (pettyCashStats?.settled_transactions || 0)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                <Typography variant="body2" color="warning.main">
                  {pettyCashStats?.pending_transactions || 0} pending, {pettyCashStats?.settled_transactions || 0} to approve
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Employee Activity */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">Employee Engagement</Typography>
              <Typography variant="h4">
                {employeeStats?.active_employees ? 
                  Math.round((pettyCashStats?.total_transactions || 0) / employeeStats.active_employees) : 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Typography variant="body2" color="primary">
                  Avg. transactions per employee
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Petty Cash Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <DollarCircleOutlined style={{ fontSize: 24 }} />
                <Typography variant="h6">Petty Cash Statistics</Typography>
              </Stack>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Available Balance</Typography>
                  <Typography variant="h5">{formatCurrency(balance || 0)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Funds</Typography>
                  <Typography variant="h5">
                    {formatCurrency(pettyCashStats?.total_funds || 0)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Issued</Typography>
                  <Typography variant="h5" color="error">
                    {formatCurrency(pettyCashStats?.total_issued || 0)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Spent</Typography>
                  <Typography variant="h5" color="warning.main">
                    {formatCurrency(pettyCashStats?.total_spent || 0)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Returned</Typography>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(pettyCashStats?.total_returned || 0)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Pending Funds</Typography>
                  <Typography variant="h5" color="info.main">
                    {formatCurrency(pettyCashStats?.pending_funds || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Employee Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <TeamOutlined style={{ fontSize: 24 }} />
                <Typography variant="h6">Employee Statistics</Typography>
              </Stack>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Employees</Typography>
                  <Typography variant="h5">{employeeStats?.total_employees || 0}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Active Employees</Typography>
                  <Typography variant="h5" color="success.main">
                    {employeeStats?.active_employees || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Inactive Employees</Typography>
                  <Typography variant="h5" color="error">
                    {employeeStats?.inactive_employees || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Departments</Typography>
                  <Typography variant="h5">
                    {employeeStats?.departments?.length || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Active Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <LinearProgress 
                        variant="determinate" 
                        value={
                            employeeStats?.total_employees 
                            ? (employeeStats.active_employees / employeeStats.total_employees) * 100 
                            : 0
                        } 
                        sx={{ height: 10, borderRadius: 5 }}
                        color="success"
                        />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
                        {employeeStats?.total_employees 
                        ? Math.round((employeeStats.active_employees / employeeStats.total_employees) * 100) 
                        : 0}%
                    </Typography>
                    </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Status Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Transaction Status</Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="Pending" color="warning" size="small" />
                      </TableCell>
                      <TableCell align="right">{pettyCashStats?.pending_transactions || 0}</TableCell>
                      <TableCell align="right">
                        {pettyCashStats?.total_transactions > 0 
                          ? ((pettyCashStats?.pending_transactions / pettyCashStats?.total_transactions) * 100).toFixed(1) 
                          : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Settled" color="info" size="small" />
                      </TableCell>
                      <TableCell align="right">{pettyCashStats?.settled_transactions || 0}</TableCell>
                      <TableCell align="right">
                        {pettyCashStats?.total_transactions > 0 
                          ? ((pettyCashStats?.settled_transactions / pettyCashStats?.total_transactions) * 100).toFixed(1) 
                          : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Approved" color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">{pettyCashStats?.approved_transactions || 0}</TableCell>
                      <TableCell align="right">
                        {pettyCashStats?.total_transactions > 0 
                          ? ((pettyCashStats?.approved_transactions / pettyCashStats?.total_transactions) * 100).toFixed(1) 
                          : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Cancelled" color="error" size="small" />
                      </TableCell>
                      <TableCell align="right">{pettyCashStats?.cancelled_transactions || 0}</TableCell>
                      <TableCell align="right">
                        {pettyCashStats?.total_transactions > 0 
                          ? ((pettyCashStats?.cancelled_transactions / pettyCashStats?.total_transactions) * 100).toFixed(1) 
                          : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{pettyCashStats?.total_transactions || 0}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Department Breakdown</Typography>
              
              {employeeStats?.departments && employeeStats.departments.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell align="right">Employees</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employeeStats.departments.map((department) => (
                        <TableRow key={department}>
                          <TableCell>{department}</TableCell>
                          <TableCell align="right">
                            {/* This would ideally come from a more detailed stats object */}
                            -
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                  No department data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      

    </Box>
  );
};

export default StatisticsTab;
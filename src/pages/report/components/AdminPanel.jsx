import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Card, CardContent, Grid, Alert, Chip,
  CircularProgress, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, Divider, LinearProgress,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  ToolOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoOutlined,
  BuildOutlined,
  ExpandOutlined ,
  SaveOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useReports } from '@/hooks/useReports';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatUtils';

const AdminPanel = ({ open, onClose }) => {
  const [healthCheck, setHealthCheck] = useState(null);
  const [rebuildProgress, setRebuildProgress] = useState(0);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [systemStats, setSystemStats] = useState(null);

  const { 
    getHealthCheck, 
    rebuildSummaries, 
    getDashboardData,
    loading 
  } = useReports();

  // Load health check data when dialog opens
  useEffect(() => {
    if (open) {
      loadHealthCheck();
      loadSystemStats();
    }
  }, [open]);

  const loadHealthCheck = async () => {
    try {
      const data = await getHealthCheck();
      setHealthCheck(data);
    } catch (error) {
      console.error('Failed to load health check:', error);
    }
  };

  const loadSystemStats = async () => {
    try {
      const dashboardData = await getDashboardData();
      if (dashboardData) {
        setSystemStats({
          currentYear: dashboardData.current_year,
          currentMonth: dashboardData.current_month,
          last12Months: dashboardData.last_12_months
        });
      }
    } catch (error) {
      console.error('Failed to load system stats:', error);
    }
  };

  // Handle rebuild summaries
  const handleRebuildSummaries = async () => {
    if (!window.confirm('This will rebuild all sales summaries. This process may take several minutes. Continue?')) {
      return;
    }

    setIsRebuilding(true);
    setRebuildProgress(0);

    // Simulate progress (since we don't have real-time progress from API)
    const progressInterval = setInterval(() => {
      setRebuildProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      await rebuildSummaries();
      setRebuildProgress(100);
      clearInterval(progressInterval);
      
      // Reload health check after rebuild
      setTimeout(() => {
        loadHealthCheck();
        loadSystemStats();
      }, 1000);
      
      toast.success('Sales summaries rebuilt successfully!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Failed to rebuild summaries:', error);
      toast.error('Failed to rebuild summaries. Please try again.');
    } finally {
      setTimeout(() => {
        setIsRebuilding(false);
        setRebuildProgress(0);
      }, 2000);
    }
  };

  // Get status color and icon
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'success', icon: <CheckCircleOutlined />, label: 'Healthy' };
      case 'warning':
        return { color: 'warning', icon: <WarningOutlined />, label: 'Warning' };
      case 'error':
        return { color: 'error', icon: <WarningOutlined />, label: 'Error' };
      default:
        return { color: 'default', icon: <InfoOutlined />, label: 'Unknown' };
    }
  };

  const renderHealthStatus = () => {
    if (!healthCheck) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    const statusInfo = getStatusIndicator(healthCheck.status);

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ color: `${statusInfo.color}.main`, mr: 1 }}>
              {statusInfo.icon}
            </Box>
            <Typography variant="h6">
              System Health: 
              <Chip 
                label={statusInfo.label}
                color={statusInfo.color}
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          {/* Summary Counts */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.contrastText">
                  {healthCheck.summary_counts?.daily || 0}
                </Typography>
                <Typography variant="caption" color="primary.contrastText">
                  Daily Summaries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="h6" color="success.contrastText">
                  {healthCheck.summary_counts?.monthly || 0}
                </Typography>
                <Typography variant="caption" color="success.contrastText">
                  Monthly Summaries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="h6" color="info.contrastText">
                  {healthCheck.summary_counts?.yearly || 0}
                </Typography>
                <Typography variant="caption" color="info.contrastText">
                  Yearly Summaries
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Data Coverage */}
          {healthCheck.data_coverage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Data Coverage: {healthCheck.data_coverage.percentage}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={healthCheck.data_coverage.percentage}
                color={healthCheck.data_coverage.percentage > 80 ? 'success' : 'warning'}
              />
              <Typography variant="caption" color="text.secondary">
                {healthCheck.data_coverage.actual_months} of {healthCheck.data_coverage.expected_months} expected months
              </Typography>
            </Box>
          )}

          {/* Issues List */}
          {healthCheck.issues && healthCheck.issues.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Issues Found:
              </Typography>
              <List dense>
                {healthCheck.issues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <WarningOutlined color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={issue} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Last Updated */}
          {healthCheck.last_updated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(healthCheck.last_updated).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSystemStats = () => {
    if (!systemStats) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
          No system statistics available
        </Typography>
      );
    }

    return (
      <Grid container spacing={2}>
        {/* Current Year Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Current Year Performance
              </Typography>
              {systemStats.currentYear ? (
                <List dense>
                  <ListItem>
                    <ListItemText primary="Total Revenue" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {formatCurrency(systemStats.currentYear.total_revenue || 0)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Total Profit" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {formatCurrency(systemStats.currentYear.total_profit || 0)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Total Sales" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {systemStats.currentYear.total_sales_count || 0}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              ) : (
                <Typography color="text.secondary">No current year data</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Current Month Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Current Month Performance
              </Typography>
              {systemStats.currentMonth ? (
                <List dense>
                  <ListItem>
                    <ListItemText primary="Revenue" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {formatCurrency(systemStats.currentMonth.total_revenue || 0)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Profit" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {formatCurrency(systemStats.currentMonth.total_profit || 0)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Sales" />
                    <ListItemSecondaryAction>
                      <Typography variant="body2">
                        {systemStats.currentMonth.total_sales_count || 0}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              ) : (
                <Typography color="text.secondary">No current month data</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToolOutlined />
          <Typography variant="h6">Admin Panel - Reports System</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Health Check Section */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandOutlined  />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SaveOutlined />
                  <Typography variant="h6">System Health Check</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {renderHealthStatus()}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* System Statistics */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandOutlined  />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LineChartOutlined />
                  <Typography variant="h6">System Statistics</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {renderSystemStats()}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Maintenance Tools */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandOutlined  />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildOutlined />
                  <Typography variant="h6">Maintenance Tools</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Rebuild Sales Summaries
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      This will recalculate all sales summaries from scratch. Use this if you notice 
                      inconsistencies in the reports data or after major data changes.
                    </Typography>
                    
                    {isRebuilding && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Rebuilding summaries... {Math.round(rebuildProgress)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={rebuildProgress}
                          color="primary"
                        />
                      </Box>
                    )}
                    
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Warning:</strong> This process may take several minutes and should not be interrupted.
                        Ensure no other users are currently generating reports.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handleRebuildSummaries}
                        disabled={isRebuilding || loading}
                        startIcon={isRebuilding ? <CircularProgress size={20} /> : <ReloadOutlined />}
                      >
                        {isRebuilding ? 'Rebuilding...' : 'Rebuild Summaries'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={loadHealthCheck}
                        disabled={loading}
                        startIcon={<ReloadOutlined />}
                      >
                        Refresh Health Check
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* System Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  System Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Reports System Version" 
                      secondary="v2.1.0 - Advanced Analytics & Forecasting"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Last System Update" 
                      secondary={new Date().toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Summary Update Frequency" 
                      secondary="Real-time (triggered by sales events)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Data Retention Policy" 
                      secondary="All historical data retained permanently"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isRebuilding}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanel;
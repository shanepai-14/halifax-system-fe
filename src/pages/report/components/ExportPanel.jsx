import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, Select, MenuItem, TextField, Box,
  Typography, Grid, Card, CardContent, Chip, Alert,
  CircularProgress, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useReports } from '@/hooks/useReports';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const ExportPanel = ({ open, onClose, selectedYear, selectedMonth }) => {
  const [exportConfig, setExportConfig] = useState({
    periodType: 'monthly',
    format: 'excel',
    startDate: '',
    endDate: '',
    includeBreakdowns: true,
    includeTrends: false
  });
  const [exporting, setExporting] = useState(false);

  const { exportSummaryData } = useReports();

  // Export format options
  const exportFormats = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: <FileExcelOutlined />, color: 'success' },
    { value: 'csv', label: 'CSV (.csv)', icon: <FileTextOutlined />, color: 'info' },
    { value: 'json', label: 'JSON (.json)', icon: <DatabaseOutlined />, color: 'primary' }
  ];

  // Period type options
  const periodTypes = [
    { value: 'daily', label: 'Daily Reports' },
    { value: 'monthly', label: 'Monthly Reports' },
    { value: 'yearly', label: 'Yearly Reports' }
  ];

  // Handle export configuration change
  const handleConfigChange = (field, value) => {
    setExportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate export configuration
  const validateConfig = () => {
    if (!exportConfig.startDate || !exportConfig.endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    if (new Date(exportConfig.startDate) > new Date(exportConfig.endDate)) {
      toast.error('Start date must be before end date');
      return false;
    }

    return true;
  };

  // Handle export
  const handleExport = async () => {
    if (!validateConfig()) return;

    setExporting(true);
    try {
      const exportData = await exportSummaryData({
        period_type: exportConfig.periodType,
        start_date: exportConfig.startDate,
        end_date: exportConfig.endDate,
        format: exportConfig.format,
        include_breakdowns: exportConfig.includeBreakdowns,
        include_trends: exportConfig.includeTrends
      });

      if (exportData && exportData.length > 0) {
        downloadFile(exportData, exportConfig.format);
        toast.success('Export completed successfully!');
        onClose();
      } else {
        toast.error('No data available for the selected criteria');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Download file based on format
  const downloadFile = (data, format) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `reports_export_${timestamp}`;

    switch (format) {
      case 'excel':
        downloadExcel(data, filename);
        break;
      case 'csv':
        downloadCSV(data, filename);
        break;
      case 'json':
        downloadJSON(data, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  // Download Excel file
  const downloadExcel = (data, filename) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-width columns
    const cols = Object.keys(data[0] || {}).map(key => ({ width: 15 }));
    worksheet['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // Download CSV file
  const downloadCSV = (data, filename) => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Download JSON file
  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Set default dates
  React.useEffect(() => {
    if (open && !exportConfig.startDate) {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      setExportConfig(prev => ({
        ...prev,
        startDate: lastMonth.toISOString().split('T')[0],
        endDate: endOfLastMonth.toISOString().split('T')[0]
      }));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DownloadOutlined />
          <Typography variant="h6">Export Reports Data</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Export Format Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Export Format
            </Typography>
            <Grid container spacing={2}>
              {exportFormats.map(format => (
                <Grid item xs={12} sm={4} key={format.value}>
                  <Card
                    sx={{ 
                      cursor: 'pointer',
                      border: exportConfig.format === format.value ? 2 : 1,
                      borderColor: exportConfig.format === format.value ? 'primary.main' : 'divider'
                    }}
                    onClick={() => handleConfigChange('format', format.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ color: `${format.color}.main`, mb: 1 }}>
                        {format.icon}
                      </Box>
                      <Typography variant="body2">
                        {format.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Period Type Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Period Type</InputLabel>
              <Select
                value={exportConfig.periodType}
                onChange={(e) => handleConfigChange('periodType', e.target.value)}
                label="Period Type"
              >
                {periodTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Range */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={exportConfig.startDate}
              onChange={(e) => handleConfigChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={exportConfig.endDate}
              onChange={(e) => handleConfigChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: exportConfig.startDate }}
            />
          </Grid>

          {/* Export Options */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Export Options
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <input
                    type="checkbox"
                    checked={exportConfig.includeBreakdowns}
                    onChange={(e) => handleConfigChange('includeBreakdowns', e.target.checked)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Include Breakdown Analysis"
                  secondary="Payment methods and customer types breakdowns"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <input
                    type="checkbox"
                    checked={exportConfig.includeTrends}
                    onChange={(e) => handleConfigChange('includeTrends', e.target.checked)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Include Trend Analysis"
                  secondary="Historical trends and growth calculations"
                />
              </ListItem>
            </List>
          </Grid>

          {/* Export Preview */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Export Preview:</strong><br />
                • Format: {exportFormats.find(f => f.value === exportConfig.format)?.label}<br />
                • Period: {periodTypes.find(p => p.value === exportConfig.periodType)?.label}<br />
                • Date Range: {exportConfig.startDate} to {exportConfig.endDate}<br />
                • Include Breakdowns: {exportConfig.includeBreakdowns ? 'Yes' : 'No'}<br />
                • Include Trends: {exportConfig.includeTrends ? 'Yes' : 'No'}
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={exporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={exporting || !exportConfig.startDate || !exportConfig.endDate}
          startIcon={exporting ? <CircularProgress size={20} /> : <DownloadOutlined />}
        >
          {exporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportPanel;
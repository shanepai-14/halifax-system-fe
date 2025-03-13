import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  LinearProgress,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  ShoppingCartOutlined, 
  WarningOutlined, 
  MoneyCollectOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const InventorySummaryCards = ({ inventoryData = [], stats = {} }) => {
  // Using sample data if none is provided
  const sampleStats = {
    totalItems: stats.totalItems || 1254,
    totalValue: stats.totalValue || 187650.75,
    lowStockItems: stats.lowStockItems || 23,
    topSellingItems: stats.topSellingItems || 5,
    reorderNeeded: stats.reorderNeeded || 18,
    incomingStock: stats.incomingStock || 42,
    inventoryTurnover: stats.inventoryTurnover || 4.2,
    stockAccuracy: stats.stockAccuracy || 98.3
  };

  // Card definitions
  const summaryCards = [
    {
      title: 'Total Inventory',
      value: sampleStats.totalItems,
      icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
      color: '#1976d2',
      secondaryValue: `$${sampleStats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      secondaryLabel: 'Total Value'
    },
    {
      title: 'Low Stock Items',
      value: sampleStats.lowStockItems,
      icon: <WarningOutlined style={{ fontSize: 24 }} />,
      color: '#f44336',
      secondaryValue: sampleStats.reorderNeeded,
      secondaryLabel: 'Require Immediate Reorder',
      chip: {
        label: `${sampleStats.lowStockItems} items below threshold`,
        color: 'error'
      }
    },
    {
      title: 'Inventory Performance',
      value: `${sampleStats.stockAccuracy}%`,
      icon: <InfoCircleOutlined style={{ fontSize: 24 }} />,
      color: '#4caf50',
      progress: sampleStats.stockAccuracy,
      secondaryValue: sampleStats.inventoryTurnover,
      secondaryLabel: 'Turnover Rate'
    },
    {
      title: 'Stock Movement',
      value: sampleStats.topSellingItems,
      icon: <MoneyCollectOutlined style={{ fontSize: 24 }} />,
      color: '#ff9800',
      secondaryValue: sampleStats.incomingStock,
      secondaryLabel: 'Incoming Stock',
      stats: [
        { label: 'Outgoing', value: 28, icon: <VerticalAlignTopOutlined /> },
        { label: 'Incoming', value: 42, icon: <VerticalAlignBottomOutlined /> }
      ]
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: `4px solid ${card.color}`,
                borderRadius: '4px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 3
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: `${card.color}20`
                }}>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color, mb: 1 }}>
                {card.value}
              </Typography>
              
              {card.chip && (
                <Chip 
                  label={card.chip.label} 
                  color={card.chip.color} 
                  size="small" 
                  sx={{ my: 1 }} 
                />
              )}
              
              {card.progress && (
                <Box sx={{ mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={card.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: `${card.color}30`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color
                      }
                    }} 
                  />
                </Box>
              )}
              
              {card.stats ? (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    {card.stats.map((stat, i) => (
                      <Tooltip title={stat.label} key={i}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 0.5, color: 'text.secondary' }}>{stat.icon}</Box>
                          <Typography variant="body2">{stat.value}</Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {card.secondaryLabel}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {card.secondaryValue}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InventorySummaryCards;
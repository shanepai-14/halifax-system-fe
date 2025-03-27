import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Box, Breadcrumbs, Link, Typography, Paper, 
  CircularProgress, Backdrop, Button
} from '@mui/material';
import { HomeOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import DeliveryReportView from './DeliveryReportView';
import DeliveryReportSkeleton from '@/components/loader/DeliveryReportSkeleton';

const DeliveryReportPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  
  const { getSaleById } = useSales();
  
// Define the fetch function outside of useEffect
const fetchReportData = async (reportId) => {
  setIsLoading(true)
  try {
    const data = await getSaleById(reportId);
    if (data) {
      setReportData(data);
    } else {
      console.error('Delivery report not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching delivery report:', error);
    return null;
  }
  setIsLoading(false);
};

// In your component:
useEffect(() => {
  const loadData = async () => {

    if (location.state?.reportData) {
      setReportData(location.state.reportData);
      setIsLoading(false);
      return;
    }
    
    // Otherwise fetch the data
    if (id) {
      fetchReportData(id);
    }
    
  };
  
  loadData();
}, [id, location.state]);

  const handleBackToSales = () => {
    navigate('/app/sales-list');
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/app/dashboard')}
        >
          <HomeOutlined style={{ marginRight: 8 }} />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/app/sales-list')}
        >
          <FileTextOutlined style={{ marginRight: 8 }} />
          Sales
        </Link>
        <Typography color="text.primary">Delivery Report</Typography>
      </Breadcrumbs>
      
      {/* Main Content */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeftOutlined />}
          onClick={handleBackToSales}
        >
          Back to Sales
        </Button>
      </Box>
      
      {isLoading ? (
         <DeliveryReportSkeleton />
      ) : reportData ? (
        <DeliveryReportView refresh={fetchReportData} report={reportData} />
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Delivery report not found or could not be loaded
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleBackToSales}
          >
            Go to Sales List
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default DeliveryReportPage;
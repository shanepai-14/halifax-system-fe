import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Box, Breadcrumbs, Link, Typography, Paper, 
  CircularProgress, Backdrop, Button
} from '@mui/material';
import { HomeOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import DeliveryReportView from './DeliveryReportView';

const DeliveryReportPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  
  const { getSaleById } = useSales();
  
  // Try to get report data from location state (passed from the new order page)
  useEffect(() => {
    const fetchData = async () => {
      // If data was passed via navigation state
      if (location.state?.reportData) {
        setReportData(location.state.reportData);
        setIsLoading(false);
        return;
      }
      
      // Otherwise fetch the data
      if (id) {
        try {
          const data = await getSaleById(id);
          if (data) {
            setReportData(data);
          } else {
            // Handle case where report wasn't found
            console.error('Delivery report not found');
          }
        } catch (error) {
          console.error('Error fetching delivery report:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, location.state]);

  const handleBackToSales = () => {
    navigate('/app/sales');
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
          onClick={() => navigate('/app/sales')}
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
        <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: 9999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : reportData ? (
        <DeliveryReportView report={reportData} />
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
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from '@menu-items';
import Loader from '@components/Loader';
import Breadcrumbs from '@components/@extended/Breadcrumbs';
import {  useSelector , useDispatch } from 'react-redux';
import {
  setProducts,
  setCategories,
  setAttributes,
  setSuppliers,
  setCostTypes
} from '@/store/slices/productsSlice';
import { useProducts, useCategories , useAttributes } from '@/hooks/useProducts';
import { useCostTypes } from '@/hooks/useCostTypes';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Toaster } from 'sonner'
import { handlerDrawerOpen, useGetMenuMaster } from '@api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const dispatch = useDispatch(); 
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const { data: products, refetch: refetchProducts } = useProducts();
  const { data: categories, refetch: refetchCategories } = useCategories();
  const { data: attributes, refetch: refetchAttributes } = useAttributes();
  const { data: suppliers, refetch: refetchSuppliers } = useSuppliers();
  const { data: costTypes, refetch: refetchCostTypes } = useCostTypes();
  
  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      await Promise.all([
        refetchProducts(),
        refetchCategories(),
        refetchAttributes(),
        refetchSuppliers(),
        refetchCostTypes()
      ]);
    };
  
    fetchData();
  }, []); // Empty dependency array since we only want to fetch once on mount
  
  // Separate effect for updating store
  useEffect(() => {
    if (products) dispatch(setProducts(products));
    if (categories) dispatch(setCategories(categories));
    if (attributes) dispatch(setAttributes(attributes));
    if (suppliers) dispatch(setSuppliers(suppliers));
    if (costTypes) dispatch(setCostTypes(costTypes));
  }, [products, categories, attributes, suppliers, costTypes]);


  useEffect(() => {
    handlerDrawerOpen(!downXL);

  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Toaster richColors position="top-right" closeButton/>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
}

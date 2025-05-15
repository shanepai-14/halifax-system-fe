// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';


import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import InventoryNotification from './InventoryNotification';
import MobileSection from './MobileSection';


// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <InventoryNotification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}

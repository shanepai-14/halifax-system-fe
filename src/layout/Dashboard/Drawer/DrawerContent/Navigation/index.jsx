// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

// project import
import NavGroup from './NavGroup';
import menuItem from '@menu-items';
import { selectCurrentUser } from '@/store/slices/authSlice';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role || 'guest'; // Default to 'guest' if no role is found


  const filteredItems = menuItem.items.map((group) => {

    if (group.roles && !group.roles.includes(userRole)) {
      return null; 
    }

    const filteredGroup = { ...group };

    if (filteredGroup.children) {
      filteredGroup.children = filteredGroup.children.filter((child) => {

        if (!child.roles) return true;
        
        return child.roles.includes(userRole);
      });


      if (filteredGroup.children.length === 0) {
        return null;
      }
    }

    return filteredGroup;
  }).filter(Boolean); 

  const navGroups = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
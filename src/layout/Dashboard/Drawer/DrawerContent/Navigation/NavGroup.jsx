import PropTypes from 'prop-types';
import { useState } from 'react';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from '@api/menu';

// ==============================|| NAV COLLAPSE ||============================== //

function NavCollapse({ item, level }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: '1rem' }} /> : null;

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: level * 3.5,
          py: 1,
          mb: 0.5,
          '&:hover': {
            bgcolor: 'primary.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            '&:hover': {
              bgcolor: 'primary.lighter'
            }
          }
        }}
      >
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: 'text.primary'
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={
            <Typography variant="body1" color="text.primary">
              {item.title}
            </Typography>
          }
        />
        {open ? (
          <UpOutlined style={{ fontSize: '0.75rem', marginLeft: 'auto' }} />
        ) : (
          <DownOutlined style={{ fontSize: '0.75rem', marginLeft: 'auto' }} />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children?.map((child) => {
            switch (child.type) {
              case 'item':
                return <NavItem key={child.id} item={child} level={level + 1} />;
              case 'collapse':
                return <NavCollapse key={child.id} item={child} level={level + 1} />;
              default:
                return (
                  <Typography key={child.id} variant="h6" color="error" align="center">
                    Fix - Menu Items
                  </Typography>
                );
            }
          })}
        </List>
      </Collapse>
    </>
  );
}

NavCollapse.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

// ==============================|| NAV GROUP ||============================== //

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} level={1} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };
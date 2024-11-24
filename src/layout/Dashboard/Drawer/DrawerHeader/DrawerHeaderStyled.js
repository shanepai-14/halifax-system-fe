// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const DrawerHeaderStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => {
  const toolbarStyles = { ...theme.mixins.toolbar };
  
  return {
    ...toolbarStyles,
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'flex-start' : 'center',
    paddingLeft: theme.spacing(open ? 3 : 0),
  };
});

export default DrawerHeaderStyled;
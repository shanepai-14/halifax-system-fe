import PropTypes from 'prop-types';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from '@components/logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  return (
    <DrawerHeaderStyled open={!!open}>
      <Logo 
        isIcon={!open} 
        sx={{ 
          width: open ? 'auto' : 35, 
          height: 35,
          transition: 'width 0.25s ease-in-out'
        }} 
      />
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
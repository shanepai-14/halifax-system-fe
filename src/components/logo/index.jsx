import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import Logo from './LogoMain';
import config from '@config';

const LogoSection = ({ sx, to }) => {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
        <Typography variant="h3" fontWeight={'bold'} color="error">
          HALIFAX
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;

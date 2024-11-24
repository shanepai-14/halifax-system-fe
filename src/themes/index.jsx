import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

// project import
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import ComponentsOverrides from './overrides';

export default function ThemeCustomization({ children }) {
  const theme = useMemo(() => Palette('light', 'default'), []);
  
  const themeTypography = useMemo(() => Typography(`'Public Sans', sans-serif`), []);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: 'ltr',
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
          '@media (min-width:0px) and (orientation: landscape)': {
            minHeight: 48
          },
          '@media (min-width:600px)': {
            minHeight: 64
          }
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes = useMemo(() => {
    // First create a base theme with the options
    const baseTheme = createTheme(themeOptions);
    
    // Get component overrides with the base theme
    const overrides = ComponentsOverrides(baseTheme);
    
    // Create final theme with overrides
    return createTheme(deepmerge(baseTheme, { components: overrides }));
  }, [themeOptions]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node
};
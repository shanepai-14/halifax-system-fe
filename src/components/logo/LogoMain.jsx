// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
      <svg version="1.1" viewBox="0 0 820 820" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <path
          transform="translate(407,74)"
          d="m0 0 7 1 24 14 21 12 24 14 28 16 24 14 28 16 48 28 26 15 24 14 25 14 13 8 3 4v335l-8 6-28 16-17 10-14 8-24 14-52 30-24 14-123 71-7-1-24-14-26-15-24-14-28-16-26-15-15-9-23-13-27-16-27-15-25-15-28-16-13-8-2-2v-333l2-5 9-6 18-10 24-14 23-13 48-28 21-12 24-14 26-15 21-12 24-14 26-15 17-10zm1 46-21 12-15 9-11 6-27 16-28 16-24 14-28 16-24 14-26 15-24 14-20 11-2 2v156l5 3 19 9 26 13h3l1-148 4-4 16-9 17-10 24-14 21-12 24-14 26-15 23-13 22-13 15-9 6-2 14 7 41 24 28 16 26 15 48 28 26 15 13 8 1 2 1 33 16 8 24 13 11 6 3-1-1-92-8-5-28-16-27-16-25-14-22-13-28-16-48-28-26-15-24-14-14-8zm201 262-1 1-1 142-13 8-48 28-52 30-24 14-28 16-26 15-4 2h-6l-22-13-28-16-26-15-17-10-26-15-24-14-23-13-22-13-6-4-1-28-14-8-11-6-26-14-2 1v87l8 5 28 16 26 15 17 10 26 15 24 14 28 16 26 15 24 14 26 15 17 10 5-1 26-15 24-14 52-30 24-14 26-15 17-10 16-9 27-16 23-13 12-7 1-1v-147l-10-6-28-15-12-7z"
          fill="#FC0001"
        />
        <path
          transform="translate(423,222)"
          d="m0 0 6 2 17 11 28 17 89 55 19 12 1 1v56l-4-1-49-28-24-14-23-13-11-7-3-1 1 136v70l6-1 13-8 38-22 14-8h2l-1-22-43-1v-43h84l1 57v36l-4 4-22 13-21 12-15 9-14 8-24 14-14 8-38 22-6 4h-3z"
          fill="#FEFE1D"
        />
        <path
          transform="translate(395,224)"
          d="m0 0h3v374l-4 1-14-9-23-13-5-3v-151l-71 1v111l-5-2-22-12-16-9-2-1v-197l23-13 19-11h3l1 91 70 1v-133l21-12 18-10z"
          fill="#FEFE9F"
        />
        <path
          transform="translate(423,222)"
          d="m0 0 6 2 17 11 28 17 89 55 19 12 1 1v56l-4-1-49-28-24-14-23-13-11-7-3-1v117h-1l-1-7-3-3-3-1v-2h-17l-5-1-9 4-4 5-1 15h-1l-1-86z"
          fill="#FEFE9F"
        />
        <path transform="translate(388,415)" d="m0 0 7 1 2 2 1 34v146l-4 1-14-9-23-13-5-3v-126l1-24-1-4 2-3 3-1z" fill="#FEFE1D" />
        <path transform="translate(248,415)" d="m0 0h6l7 2h9l7 2 3 3 1 7v106l-5-2-22-12-16-9-2-1v-74l1-16 3-3z" fill="#FEFE1D" />
        <path
          transform="translate(424,223)"
          d="m0 0 5 1 17 11 28 17 84 52v2l-12-3-8-4-20-6h-16l-2 1-15 1-8 2h-15l-7-1-4 1-17 1-2 4-3 4-2 7h-2l-1 2z"
          fill="#FDFDFB"
        />
        <path transform="translate(395,224)" d="m0 0h3l-1 79-4-2v-2h-2l-2-4h-9l-16 3-5 5-3 9-2 4h-1l-1-6v-61l21-12 18-10z" fill="#FDFDFB" />
        <path
          transform="translate(456,283)"
          d="m0 0h54l13 5 8 4 1-3 5 2 21 13v2l-12-3-8-4-20-6h-16l-2 1-15 1-8 2h-15l-7-1-4 1-17 1-2 4-3 4-2 7h-2l-1 2v-22l5-2 5-5 4-1h12z"
          fill="#FEFEE6"
        />
        <path
          transform="translate(382,282)"
          d="m0 0 7 1 3 4 4 1 1-4v19l-4-2v-2h-2l-2-4h-9l-16 3-5 5-3 9-2 4h-1l-1-6v-8l1-5h3l1-4 7-7 11-2z"
          fill="#FEFEE8"
        />
        <path transform="translate(499,413)" d="m0 0h84v16h-1l-1-8-7-2-16-1-8-1-13 1h-17l-5-1h-8l-4 5-2 7-1 19h-1z" fill="#FEFE9F" />
        <path transform="translate(276,291)" d="m0 0h4v14l-3-2h-9l-13 5-1-4z" fill="#FEFEE0" />
      </svg>
    </>
  );
};

export default Logo;

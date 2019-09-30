export type Theme = {
  largeDevices: string;

  primaryLight: string;
  primary: string;
  primaryDark: string;

  secondaryLight: string;
  secondary: string;
  secondaryDark: string;
};

// http://paletton.com/#uid=34y0u0kn5sr5XTpg7ACsGlQGgbR
const theme: Theme = {
  largeDevices: '@media all and (min-width: 800px)',

  primaryLight: '#D7C3EB',
  primary: '#653399', // almost rebeccapurple
  primaryDark: '#210340',

  secondaryLight: '#FFF4D0',
  secondary: '#E3BE3F',
  secondaryDark: '#5E4900',
};

export default theme;

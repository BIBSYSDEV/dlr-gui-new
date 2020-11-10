import { createMuiTheme } from '@material-ui/core';
import { merriweatherRegular, barlowRegular } from './fonts';

// Extend Palette type to allow custom colors
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    separator: PaletteColor;
    box: PaletteColor;
    danger: PaletteColor;
  }
  interface PaletteOptions {
    separator?: PaletteColorOptions;
    box?: PaletteColorOptions;
    danger?: PaletteColorOptions;
  }
}

enum Colors {
  Primary = '#284B63',
  Secondary = '#ff5555',
  Background = '#fff',
  Box = '#f5f5f5',
  Link = '#06f',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0, 0, 0, 0.87)',
  SecondaryText = '#44515d',
  Panel = '#A9D8B8',
  Disabled = '#bbb',
  Danger = '#ff5555',
  DangerLight = '#ffbbbb',
  Indicator = '#FFB546',
}

export default createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: Colors.Primary,
    },
    secondary: {
      main: Colors.Secondary,
    },
    separator: { main: Colors.Separator },
    box: {
      main: Colors.Box,
    },
    danger: { main: Colors.Danger, light: Colors.DangerLight },
    text: {
      primary: Colors.PrimaryText,
      secondary: Colors.SecondaryText,
      disabled: Colors.Disabled,
    },
    background: {
      default: Colors.Background,
    },
  },
  typography: {
    fontFamily: 'Barlow,  sans-serif',
    h1: {
      fontFamily: 'Merriweather, serif',
      fontSize: '2.1rem',
    },
    h2: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.8rem',
    },
    h3: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.6rem',
    },
    h4: {
      fontFamily: 'Merriweather, serif',
      fontSize: '1.4rem',
    },
  },
  overrides: {
    MuiAccordion: {
      root: {
        border: '3px solid black',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiCard: {
      root: {
        backgroundColor: Colors.Box,
      },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [merriweatherRegular, barlowRegular],
      },
    },
    MuiInputBase: {
      root: {
        background: Colors.Background,
      },
    },
    MuiLink: {
      root: {
        color: Colors.Link,
      },
    },
    MuiTab: {
      wrapper: {
        flexDirection: 'row-reverse',
      },
      labelIcon: {
        minHeight: undefined,
        paddingTop: undefined,
      },
      textColorPrimary: {
        '&$selected': {
          color: Colors.PrimaryText,
          fontWeight: 'bold',
        },
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: Colors.Indicator,
      },
    },
    MuiTextField: {
      root: {
        marginTop: '1rem',
      },
    },
  },
});

import { createMuiTheme } from '@material-ui/core';
import { barlowRegular, LibreFranklinRegular, CrimsonTextRegular } from './fonts';

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

export enum Colors {
  Primary = 'rgba(99, 34, 107, 1)',
  Secondary = '#ff5555',
  Background = '#fff',
  Box = '#f5f5f5',
  Link = '#06f',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0,0,0,0.87)',
  InitialText = 'rgba(0, 0, 0, 1)',
  SecondaryText = '#44515d',
  LightHeaderText = 'rgba(0,0,0,0.29)',
  Panel = '#A9D8B8',
  Disabled = '#bbb',
  Danger = '#ff5555',
  Warning = 'rgba(147, 10, 10, 1)',
  DangerLight = '#ffbbbb',
  Indicator = '#FFB546',
  HeaderBackground = 'rgba(99,34,107, 0.15)',
  HeaderText = 'rgba(0,0,0, 1)',
  StepperSelected = 'rgba(99, 34, 107, 1)',
  DescriptionPageGradientColor1 = 'rgba(66, 127, 140,0.10)',
  DescriptionPageGradientColor2 = 'rgba(66,127,140,0.20)',
  DescriptionPageGradientColor3 = 'rgba(66,127,140,0.30)',
  ContributorsPageGradientColor1 = 'rgba(242,229,189,0.25)',
  ContributorsPageGradientColor2 = 'rgba(242,229,189,0.50)',
  ContentsPageGradientColor1 = 'rgba(42,191,164,0.10)',
  ContentsPageGradientColor2 = 'rgba(42,191,164,0.25)',
  LicenseAccessPageGradientColor1 = 'rgba(68,242,193,0.10)',
  LicenseAccessPageGradientColor2 = 'rgba(68,242,193,0.25)',
  LicenseAccessPageGradientColor3 = 'rgba(68,242,193,0.50)',
}

export enum StyleWidths {
  width1 = '21rem',
  width2 = '29rem',
  width3 = '37rem',
  width4 = '52rem',
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
      fontFamily: 'Crimson Text, serif',
      fontSize: '3rem',
      lineHeight: '4.125rem',
      color: Colors.InitialText,
    },
    h2: {
      fontFamily: 'Crimson Text, serif',
      fontSize: '2.25rem',
      lineHeight: '3rem',
      letterSpacing: '0.0025em',
      color: Colors.InitialText,
    },
    h3: {
      fontFamily: 'Crimson Text, serif',
      fontSize: '1.5rem',
      lineHeight: '2.0625rem',
      color: Colors.InitialText,
    },
    h4: {
      fontFamily: 'Barlow, serif',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      lineHeight: '1.5rem',
      letterSpacing: '0.0015em',
      color: Colors.InitialText,
    },
    h5: {
      color: Colors.InitialText,
    },
    h6: {
      color: Colors.InitialText,
    },
    subtitle1: {
      fontFamily: 'Barlow, serif',
      fontSize: '1rem',
      lineHeight: '1.1875rem',
      letterSpacing: '0.0015em',
      color: Colors.InitialText,
    },
    subtitle2: {
      fontFamily: 'Barlow, serif',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      lineHeight: '1.0625rem',
      color: Colors.InitialText,
    },
    body1: {
      fontFamily: 'Barlow, serif',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      letterSpacing: '0.005em',
      color: Colors.InitialText,
    },
    body2: {
      fontFamily: 'Barlow, serif',
      fontSize: '0.875rem',
      lineHeight: '1.0625rem',
      letterSpacing: '0.0025em',
      color: Colors.InitialText,
    },
    button: {
      fontFamily: 'Barlow, serif',
      fontSize: '0.875rem',
      lineHeight: '1.0625rem',
      letterSpacing: '0.02em',
      fontWeight: 500,
      color: Colors.InitialText,
    },
    caption: {
      fontFamily: 'Barlow, serif',
      fontSize: '0.75rem',
      lineHeight: '0.875rem',
      letterSpacing: '0.004em',
      color: Colors.InitialText,
    },
    overline: {
      fontFamily: 'Barlow, serif',
      fontSize: '0.75rem',
      lineHeight: '0.875rem',
      letterSpacing: '0.015em',
      color: Colors.InitialText,
      textTransform: 'none',
    },
  },
  overrides: {
    MuiAccordion: {
      root: {
        border: '3px solid #427F8C',
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
        '@font-face': [barlowRegular, LibreFranklinRegular, CrimsonTextRegular],
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
    MuiFilledInput: {
      root: {
        backgroundColor: Colors.Background,
        '&:hover': {
          backgroundColor: '#F5F5F5',
        },
        '&$focused': {
          backgroundColor: '#F5F5F5',
        },
        '&$disabled': {
          backgroundColor: Colors.Background,
        },
      },
    },
    MuiStepLabel: {
      label: {
        width: 'fit-content',
        fontSize: '1rem',
        '@media (max-width:600px)': {
          visibility: 'collapse',
        },
        '&$active': {
          fontWeight: '600',
          color: Colors.StepperSelected,
          visibility: 'visible',
        },
      },
    },
  },
});

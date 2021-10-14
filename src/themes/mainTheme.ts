import { alpha, createTheme, emphasize } from '@mui/material';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

// Extend Palette type to allow custom colors
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    separator: PaletteColor;
    box: PaletteColor;
    danger: PaletteColor;
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    separator?: PaletteColorOptions;
    box?: PaletteColorOptions;
    danger?: PaletteColorOptions;
    neutral?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export enum Colors {
  Primary = 'rgba(99, 34, 107, 1)',
  PrimaryOpaque20 = 'rgba(99, 34, 107, 0.20)',
  Secondary = 'rgba(147, 10, 10, 1)',
  Background = '#ffffff',
  Box = '#f5f5f5',
  Darken10Percent = 'rgba(0, 0, 0, 0.1)',
  Brighten50Percent = 'rgba(255, 255, 255, 0.5)',
  HoverTextFieldFilled = '#F5F5F5',
  Link = 'rgba(99, 34, 107, 1)',
  Separator = '#3d4349',
  PrimaryText = 'rgba(0,0,0,0.87)',
  InitialText = 'rgba(0, 0, 0, 1)',
  BlackOpaque25 = 'rgba(0, 0, 0, 0.25)',
  WhiteOpaque1 = 'rgba(255, 255, 255, 0.01)',
  SecondaryText = '#44515d',
  PageHeaderSubtitle = '#737373',
  LightHeaderText = 'rgba(0,0,0,0.29)',
  Panel = '#A9D8B8',
  Disabled = '#bbbbbb',
  Danger = '#ff5555',
  Warning = 'rgba(147, 10, 10, 1)',
  DangerLight = '#ffbbbb',
  HeaderBackground = 'rgba(99,34,107, 0.15)',
  HeaderText = 'rgba(0,0,0, 1)',
  StepperSelected = 'rgba(99, 34, 107, 1)',
  DescriptionPageGradientColor1 = 'rgba(66, 127, 140,0.10)',
  DescriptionPageGradientColor2 = 'rgba(66,127,140,0.20)',
  DescriptionPageGradientColor3 = 'rgba(66,127,140,0.30)',
  DLRGray = 'rgba(242, 242, 242, 1)',
  DLRBlue1 = 'rgba(52, 127, 181, 0.1)',
  DLRBlue2 = 'rgba(52, 127, 181, 0.2)',
  DLRYellow1 = 'rgba(242,229,189,0.2)',
  DLRYellow2 = 'rgba(242,229,189,0.3)',
  DLRYellow3 = 'rgba(242,229,189,0.4)',
  DLRYellow4 = 'rgba(242,229,189,0.5)',
  DLRColdGreen1 = 'rgba(42,191,164,0.10)',
  DLRColdGreen2 = 'rgba(42,191,164,0.25)',
  LicenseAccessPageGradientColor1 = 'rgba(68,242,193,0.10)',
  LicenseAccessPageGradientColor2 = 'rgba(68,242,193,0.25)',
  LicenseAccessPageGradientColor3 = 'rgba(68,242,193,0.50)',
  ChipBackground = 'rgba(66, 127, 140, 1)',
  ChipBackgroundFocus = 'hsl(191, 37%, 80%)',
  ChipIconBackground = 'hsl(191, 37%, 60%)',
  ChipAccessBackground = 'rgb(0, 54, 23)',
  ChipAccessBackgroundFocus = 'rgb(0, 213, 166)',
  ChipAccessIconBackground = 'rgb(0, 157, 114)',
  ChipAccessIconHoverBackground = 'rgb(0, 185, 139)',
  AuthorityBadge = 'rgb(11, 55, 26)',
  UnitGrey2_10percent = 'rgb(151,151, 151,0.1)',
  UnitTurquoise_20percent = 'rgba(121,203,220,0.2)',
  UnitTurquoise_30percent = 'rgba(121,203,220,0.3)',
}

export enum StyleWidths {
  width1 = '21rem', // 336px
  width2 = '29rem', // 464px
  width3 = '37rem', // 592px
  width4 = '52rem', // 832px
  width5 = '75rem', //1200px
}

export enum DeviceWidths {
  xs = 0,
  sm = 600,
  md = 960,
  lg = 1280,
  xl = 1920,
}

enum Fonts {
  Crimson = 'Crimson Text, serif',
  Barlow = 'Barlow, sans-serif',
}

export default createTheme({
  breakpoints: {
    values: {
      xs: DeviceWidths.xs,
      sm: DeviceWidths.sm,
      md: DeviceWidths.md,
      lg: DeviceWidths.lg,
      xl: DeviceWidths.xl,
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
    error: { main: Colors.Warning },
    text: {
      primary: Colors.PrimaryText,
      secondary: Colors.SecondaryText,
      disabled: Colors.Disabled,
    },
    background: {
      default: Colors.Background,
    },
    neutral: {
      main: Colors.PrimaryText,
      contrastText: Colors.Background,
    },
  },
  typography: {
    fontFamily: Fonts.Barlow,
    h1: {
      fontFamily: Fonts.Crimson,
      fontSize: '3rem',
      lineHeight: '4.125rem',
      color: Colors.InitialText,
    },
    h2: {
      fontFamily: Fonts.Crimson,
      fontSize: '2.25rem',
      lineHeight: '3rem',
      letterSpacing: '0.0025em',
      color: Colors.InitialText,
    },
    h3: {
      fontFamily: Fonts.Crimson,
      fontSize: '1.5rem',
      lineHeight: '2.0625rem',
      color: Colors.InitialText,
    },
    h4: {
      fontFamily: Fonts.Barlow,
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
      fontFamily: Fonts.Barlow,
      fontSize: '1rem',
      lineHeight: '1.1875rem',
      letterSpacing: '0.0015em',
      color: Colors.InitialText,
    },
    subtitle2: {
      fontFamily: Fonts.Barlow,
      fontSize: '0.875rem',
      fontWeight: 'bold',
      lineHeight: '1.0625rem',
      color: Colors.InitialText,
    },
    body1: {
      fontFamily: Fonts.Barlow,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      letterSpacing: '0.005em',
      color: Colors.InitialText,
    },
    body2: {
      fontFamily: Fonts.Barlow,
      fontSize: '0.875rem',
      lineHeight: '1.0625rem',
      letterSpacing: '0.0025em',
      color: Colors.InitialText,
    },
    button: {
      fontFamily: Fonts.Barlow,
      fontSize: '0.875rem',
      lineHeight: '1.0625rem',
      letterSpacing: '0.02em',
      fontWeight: 500,
      color: Colors.InitialText,
    },
    caption: {
      fontFamily: Fonts.Barlow,
      fontSize: '0.75rem',
      lineHeight: '0.875rem',
      letterSpacing: '0.004em',
      color: Colors.InitialText,
    },
    overline: {
      fontFamily: Fonts.Barlow,
      fontSize: '0.75rem',
      lineHeight: '0.875rem',
      letterSpacing: '0.015em',
      color: Colors.InitialText,
      textTransform: 'none',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '3px solid #427F8C',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          minHeight: '2.25rem',
        },
        text: {
          height: '100%',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: Colors.Box,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 'auto',
          fontSize: '1rem',
        },
        colorPrimary: {
          backgroundColor: Colors.ChipBackground,
          color: Colors.Background,
        },
        label: {
          whiteSpace: 'normal',
          color: 'inherit',
          paddingTop: '0.2rem',
          paddingBottom: '0.4rem',
        },
        clickableColorPrimary: {
          '&:hover, &:focus': {
            backgroundColor: emphasize(Colors.ChipBackground, 0.2),
          },
        },
        deletableColorPrimary: {
          '&:focus': {
            backgroundColor: emphasize(Colors.ChipBackground, 0.3),
          },
        },
        deleteIconColorPrimary: {
          color: alpha(Colors.Background, 0.7),
          '&:hover, &:active': {
            color: Colors.Background,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: Colors.Background,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: Colors.Link,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          '&$selected': {
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '1rem',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: Colors.Background,
          '&:hover': {
            backgroundColor: Colors.HoverTextFieldFilled,
          },
          '&$focused': {
            backgroundColor: Colors.HoverTextFieldFilled,
          },
          '&$disabled': {
            backgroundColor: Colors.Background,
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          width: 'fit-content',
          fontSize: '1rem',
          '@media (max-width:600px)': {
            visibility: 'collapse',
          },
          '&.Mui-active': {
            fontWeight: '600',
            color: Colors.StepperSelected,
            visibility: 'visible',
          },
          '&.Mui-active.Mui-error': {
            fontWeight: '600',
            color: Colors.Warning,
            visibility: 'visible',
          },
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          marginBottom: '2rem',
        },
      },
    },
  },
});

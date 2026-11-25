import { createTheme } from '@mui/material/styles';

/**
 * Product direction: calm “urban explorer” — ink navy + soft mist,
 * map as the hero surface, UI stays quiet so search + map lead.
 */
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f4b63', light: '#3a6f8c', dark: '#123344' },
    secondary: { main: '#c45c26' },
    success: { main: '#2f6f4e' },
    warning: { main: '#c45c26' },
    background: { default: '#eef2f4', paper: '#ffffff' },
    text: {
      primary: '#15202b',
      secondary: '#5b6b78',
    },
    divider: 'rgba(21, 32, 43, 0.08)',
  },
  typography: {
    fontFamily: '"Outfit", "Segoe UI", sans-serif',
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
    },
    h5: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: '0.02em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#eef2f4',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'background-color 160ms ease, transform 160ms ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(31, 75, 99, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(31, 75, 99, 0.14)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
            transition: 'box-shadow 180ms ease, border-color 180ms ease',
            '&:hover fieldset': {
              borderColor: 'rgba(31, 75, 99, 0.35)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(31, 75, 99, 0.14)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 140ms ease, background-color 140ms ease',
          '&:hover': { transform: 'scale(1.06)' },
        },
      },
    },
  },
});

'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Fallback
      // In a real professional setup, we can use the CSS variables here if we use MUI's experimental css variables support,
      // but for standard MUI, we'll keep the JS values in sync with the root variables.
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: 'var(--font-main)',
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 700 },
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 700 },
    h3: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    h4: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    h5: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius)',
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;

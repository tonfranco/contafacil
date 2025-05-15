import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppContext } from './AppContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useAppContext();

  const appTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: theme === 'light' ? '#f50057' : '#f48fb1',
      },
      background: {
        default: theme === 'light' ? '#f5f5f5' : '#121212',
        paper: theme === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: theme === 'light' 
              ? '0px 2px 4px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

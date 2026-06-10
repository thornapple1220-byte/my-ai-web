import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E88E5',
      light: '#64B5F6',
      dark: '#1565C0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#29B6F6',
      light: '#81D4FA',
      dark: '#0277BD',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0F7FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  spacing: 8,
  shape: { borderRadius: 8 },
});

export default theme;

import { Box } from '@mui/material';
import TopBar from './TopBar';
import BottomBar from './BottomBar';

function MainLayout({ children }) {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <TopBar />
      <Box
        sx={{
          pt: '56px',
          pb: '60px',
          maxWidth: 600,
          mx: 'auto',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
      <BottomBar />
    </Box>
  );
}

export default MainLayout;

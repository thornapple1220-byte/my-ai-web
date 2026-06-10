import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useNavigate } from 'react-router-dom';

function TopBar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #29B6F6 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            '&:hover': { opacity: 0.85 },
            transition: 'opacity 0.15s',
          }}
        >
          <FlightTakeoffIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: 'white',
              fontStyle: 'italic',
              letterSpacing: '-0.3px',
              fontSize: '1.1rem',
              userSelect: 'none',
            }}
          >
            여행스타그램
          </Typography>
        </Box>

        <Badge badgeContent={3} color="error">
          <IconButton sx={{ color: 'white' }} size="small">
            <NotificationsIcon />
          </IconButton>
        </Badge>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;

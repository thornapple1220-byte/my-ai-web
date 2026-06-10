import { Box, IconButton, Paper, Fab, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useNavigate, useLocation } from 'react-router-dom';

function NavItem({ icon, activeIcon, label, path, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        flex: 1,
        py: 0.5,
        color: isActive ? 'primary.main' : 'text.secondary',
      }}
    >
      {isActive ? activeIcon : icon}
      <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.25, fontWeight: isActive ? 600 : 400 }}>
        {label}
      </Typography>
    </Box>
  );
}

function BottomBar() {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 60,
          bgcolor: 'background.paper',
          px: 1,
        }}
      >
        <NavItem
          path="/"
          icon={<HomeOutlinedIcon />}
          activeIcon={<HomeIcon color="primary" />}
          label="홈"
          onClick={() => navigate('/')}
        />
        <NavItem
          path="/meetup"
          icon={<GroupsOutlinedIcon />}
          activeIcon={<GroupsIcon color="primary" />}
          label="모임"
          onClick={() => navigate('/meetup')}
        />

        {/* 중앙 게시물 작성 버튼 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -3 }}>
          <Fab
            size="medium"
            color="primary"
            onClick={() => navigate('/create')}
            sx={{ boxShadow: 3 }}
          >
            <AddIcon />
          </Fab>
        </Box>

        <NavItem
          path="/chat"
          icon={<ChatOutlinedIcon />}
          activeIcon={<ChatIcon color="primary" />}
          label="채팅"
          onClick={() => navigate('/chat')}
        />
        <NavItem
          path="/mypage"
          icon={<PersonOutlinedIcon />}
          activeIcon={<PersonIcon color="primary" />}
          label="내 정보"
          onClick={() => navigate('/mypage')}
        />
      </Box>
    </Paper>
  );
}

export default BottomBar;

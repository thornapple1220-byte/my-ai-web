import { useState } from 'react';
import {
  Box, Typography, Button, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';

const menuItems = [
  { value: 'home', label: '홈', icon: <HomeIcon fontSize="small" /> },
  { value: 'profile', label: '프로필', icon: <PersonIcon fontSize="small" /> },
  { value: 'notifications', label: '알림', icon: <NotificationsIcon fontSize="small" /> },
  { value: 'settings', label: '설정', icon: <SettingsIcon fontSize="small" /> },
  { value: 'help', label: '도움말', icon: <HelpIcon fontSize="small" /> },
  { value: 'logout', label: '로그아웃', icon: <LogoutIcon fontSize="small" color="error" /> },
];

function MenuSection() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState('');

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value) => {
    setSelected(value);
    handleClose();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Menu 섹션
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        메뉴 열기
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems.map((item) => (
          <MenuItem key={item.value} onClick={() => handleSelect(item.value)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
      {selected && (
        <Typography variant="body1" sx={{ mt: 2, color: 'primary.main' }}>
          선택된 메뉴: <strong>{menuItems.find((i) => i.value === selected)?.label}</strong>
        </Typography>
      )}
    </Box>
  );
}

export default MenuSection;

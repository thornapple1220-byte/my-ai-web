import { useState } from 'react';
import {
  Box, Typography, Button, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider, Stack, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

const menuItems = [
  { label: '홈', icon: <HomeIcon /> },
  { label: '프로필', icon: <PersonIcon /> },
  { label: '게시글', icon: <ArticleIcon /> },
  { label: '설정', icon: <SettingsIcon /> },
  { label: '도움말', icon: <HelpIcon /> },
];

function SidebarSection() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState('left');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Sidebar 섹션
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">위치:</Typography>
        <ToggleButtonGroup
          value={anchor}
          exclusive
          onChange={(_, val) => val && setAnchor(val)}
          size="small"
        >
          {['left', 'right', 'top', 'bottom'].map((pos) => (
            <ToggleButton key={pos} value={pos}>{pos}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Button variant="contained" onClick={() => setOpen(true)}>
        사이드바 열기
      </Button>

      <Drawer anchor={anchor} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 240 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600}>메뉴</Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => setOpen(false)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SidebarSection;

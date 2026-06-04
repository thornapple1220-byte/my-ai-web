import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const menuItems = ['홈', '소개', '서비스', '연락처'];

function NavigationSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (menu) => {
    alert(`"${menu}" 메뉴를 클릭했습니다.`);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>

          {/* 데스크탑 메뉴 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {menuItems.map((menu) => (
              <Button
                key={menu}
                color="inherit"
                onClick={() => handleMenuClick(menu)}
              >
                {menu}
              </Button>
            ))}
          </Box>

          {/* 모바일 햄버거 버튼 */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 200 }}>
          {menuItems.map((menu) => (
            <ListItem key={menu} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleMenuClick(menu);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={menu} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default NavigationSection;

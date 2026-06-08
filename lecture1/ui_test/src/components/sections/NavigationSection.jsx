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
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const menuItems = ['홈', '소개', '서비스', '연락처'];

// ── 1. MUI AppBar 네비게이션 ───────────────────────────────────────
function AppBarNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (menu) => {
    alert(`"${menu}" 메뉴를 클릭했습니다.`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {menuItems.map((menu) => (
              <Button key={menu} color="inherit" onClick={() => handleMenuClick(menu)}>
                {menu}
              </Button>
            ))}
          </Box>

          <IconButton
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
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
    </>
  );
}

// ── 2. Flexbox 네비게이션 ─────────────────────────────────────────
function FlexNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('홈');

  return (
    <Box>
      {/* 네비게이션 바 */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 1.5,
          bgcolor: '#1e1e2e',
          boxShadow: 3,
        }}
      >
        {/* 로고 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
              L
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            Loki UI
          </Typography>
        </Box>

        {/* 데스크탑 메뉴 */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {menuItems.map((menu) => (
            <Button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              sx={{
                color: activeMenu === menu ? 'primary.light' : '#ccc',
                fontWeight: activeMenu === menu ? 700 : 400,
                borderBottom: activeMenu === menu ? '2px solid' : '2px solid transparent',
                borderRadius: 0,
                px: 2,
                '&:hover': { color: '#fff', bgcolor: 'transparent' },
              }}
            >
              {menu}
            </Button>
          ))}
        </Box>

        {/* 우측 액션 버튼 */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button variant="outlined" size="small" sx={{ color: '#ccc', borderColor: '#555' }}>
            로그인
          </Button>
          <Button variant="contained" size="small">
            시작하기
          </Button>
        </Box>

        {/* 모바일 햄버거 */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, color: '#fff' }}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            bgcolor: '#2a2a3e',
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          {menuItems.map((menu) => (
            <Button
              key={menu}
              fullWidth
              onClick={() => {
                setActiveMenu(menu);
                setMobileOpen(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: activeMenu === menu ? 'primary.light' : '#ccc',
                fontWeight: activeMenu === menu ? 700 : 400,
              }}
            >
              {menu}
            </Button>
          ))}
          <Divider sx={{ borderColor: '#444', my: 1 }} />
          <Button variant="contained" fullWidth>
            시작하기
          </Button>
        </Box>
      )}
    </Box>
  );
}

// ── 메인 섹션 ────────────────────────────────────────────────────
function NavigationSection() {
  return (
    <Box sx={{ mb: 4 }}>
      {/* MUI AppBar */}
      <Typography variant="h6" sx={{ px: 3, pt: 3, pb: 1, fontWeight: 600 }}>
        1. MUI AppBar 네비게이션
      </Typography>
      <AppBarNav />

      {/* Flexbox 네비게이션 */}
      <Typography variant="h6" sx={{ px: 3, pt: 4, pb: 1, fontWeight: 600 }}>
        2. Flexbox 네비게이션
      </Typography>
      <FlexNav />
    </Box>
  );
}

export default NavigationSection;

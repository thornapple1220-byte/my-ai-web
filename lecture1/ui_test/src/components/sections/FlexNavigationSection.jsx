import { Box, Typography } from '@mui/material';

const menuItems = ['홈', '소개', '상품', '연락처', '설정'];

function FlexNavigationSection() {
  return (
    <Box sx={{ mb: 4, px: 3 }}>
      <Typography variant="h6" sx={{ pt: 3, pb: 2, fontWeight: 600 }}>
        Flex Navigation
      </Typography>

      {/* 네비게이션 바 */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '60px',
          bgcolor: '#2d3748',
          px: 3,
          boxSizing: 'border-box',
        }}
      >
        {/* 로고 박스 */}
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            MyWebsite
          </Typography>
        </Box>

        {/* 메뉴 박스 */}
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
          }}
        >
          {menuItems.map((menu) => (
            <Typography
              key={menu}
              sx={{
                color: '#a0aec0',
                fontSize: '16px',
                cursor: 'pointer',
                '&:hover': { color: '#ffffff' },
              }}
            >
              {menu}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default FlexNavigationSection;

import { Box, Typography, Paper, Divider } from '@mui/material';

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `아이템 ${i + 1}`,
  description: `스크롤 가능한 영역의 ${i + 1}번째 항목입니다.`,
}));

function ScrollSection() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Scroll 섹션
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        아래 영역은 고정 높이(300px)의 스크롤 컨테이너입니다.
      </Typography>
      <Paper
        elevation={2}
        sx={{
          height: 300,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {items.map((item, index) => (
          <Box key={item.id}>
            <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {item.id}
              </Typography>
              <Box>
                <Typography variant="body1" fontWeight={500}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              </Box>
            </Box>
            {index < items.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default ScrollSection;

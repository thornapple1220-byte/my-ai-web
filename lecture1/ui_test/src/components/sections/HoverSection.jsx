import { Box, Typography, Grid, Paper } from '@mui/material';

const hoverItems = [
  {
    label: '색상 변화',
    desc: '배경색이 바뀝니다',
    sx: {
      bgcolor: 'primary.main',
      color: 'white',
      transition: 'background-color 0.3s',
      '&:hover': { bgcolor: 'secondary.main' },
    },
  },
  {
    label: '크기 변화',
    desc: '크기가 커집니다',
    sx: {
      bgcolor: 'background.paper',
      border: '2px solid',
      borderColor: 'primary.main',
      transition: 'transform 0.3s',
      '&:hover': { transform: 'scale(1.08)' },
    },
  },
  {
    label: '그림자 효과',
    desc: '그림자가 생깁니다',
    sx: {
      bgcolor: 'background.paper',
      boxShadow: 1,
      transition: 'box-shadow 0.3s',
      '&:hover': { boxShadow: 10 },
    },
  },
  {
    label: '밝기 변화',
    desc: '밝아집니다',
    sx: {
      bgcolor: 'grey.700',
      color: 'white',
      transition: 'filter 0.3s',
      '&:hover': { filter: 'brightness(1.5)' },
    },
  },
  {
    label: '테두리 효과',
    desc: '테두리가 나타납니다',
    sx: {
      bgcolor: 'background.paper',
      border: '2px solid transparent',
      transition: 'border-color 0.3s, color 0.3s',
      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
    },
  },
  {
    label: '위로 이동',
    desc: '위로 올라갑니다',
    sx: {
      bgcolor: 'success.main',
      color: 'white',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
    },
  },
];

function HoverSection() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Hover 섹션
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        각 카드에 마우스를 올려보세요.
      </Typography>
      <Grid container spacing={3}>
        {hoverItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.label}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                ...item.sx,
              }}
            >
              <Typography variant="h6" fontWeight={600}>{item.label}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>{item.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HoverSection;

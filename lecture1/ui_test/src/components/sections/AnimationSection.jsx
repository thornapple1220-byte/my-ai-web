import { useState } from 'react';
import { Box, Typography, Button, Stack, Paper, Fade, Grow, Slide } from '@mui/material';

function AnimationSection() {
  const [fadeIn, setFadeIn] = useState(false);
  const [growIn, setGrowIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const toggle = (setter) => (prev) => setter(!prev);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Animation 섹션
      </Typography>
      <Stack spacing={4}>

        {/* Fade */}
        <Box>
          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>Fade</Typography>
          <Button variant="contained" onClick={() => setFadeIn((p) => !p)} sx={{ mb: 2 }}>
            {fadeIn ? 'Fade Out' : 'Fade In'}
          </Button>
          <Box sx={{ minHeight: 80 }}>
            <Fade in={fadeIn} timeout={600}>
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white', display: 'inline-block' }}>
                Fade 트랜지션 효과입니다.
              </Paper>
            </Fade>
          </Box>
        </Box>

        {/* Grow */}
        <Box>
          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>Grow</Typography>
          <Button variant="contained" color="secondary" onClick={() => setGrowIn((p) => !p)} sx={{ mb: 2 }}>
            {growIn ? 'Grow Out' : 'Grow In'}
          </Button>
          <Box sx={{ minHeight: 80 }}>
            <Grow in={growIn} timeout={600}>
              <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', display: 'inline-block' }}>
                Grow 트랜지션 효과입니다.
              </Paper>
            </Grow>
          </Box>
        </Box>

        {/* Slide */}
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>Slide</Typography>
          <Button variant="contained" color="success" onClick={() => setSlideIn((p) => !p)} sx={{ mb: 2 }}>
            {slideIn ? 'Slide Out' : 'Slide In'}
          </Button>
          <Box sx={{ minHeight: 80 }}>
            <Slide in={slideIn} direction="right" timeout={500}>
              <Paper sx={{ p: 2, bgcolor: 'success.main', color: 'white', display: 'inline-block' }}>
                Slide 트랜지션 효과입니다.
              </Paper>
            </Slide>
          </Box>
        </Box>

      </Stack>
    </Box>
  );
}

export default AnimationSection;

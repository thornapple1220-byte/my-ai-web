import { useState } from 'react';
import { Box, Typography, Slider } from '@mui/material';

function SliderSection() {
  const [value, setValue] = useState(50);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Slider 섹션
      </Typography>
      <Box sx={{ px: 2, maxWidth: 480 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
          현재 값: <strong style={{ color: '#1976d2' }}>{value}</strong>
        </Typography>
        <Slider
          value={value}
          min={0}
          max={100}
          onChange={(_, newValue) => setValue(newValue)}
          valueLabelDisplay="auto"
          color="primary"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">0</Typography>
          <Typography variant="caption" color="text.secondary">100</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SliderSection;

import { Box, Typography, TextField, Stack } from '@mui/material';
import { useState } from 'react';

function InputSection() {
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: '',
  });

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }));
  };

  const variants = ['standard', 'outlined', 'filled'];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Input 섹션
      </Typography>
      <Stack spacing={4}>
        {variants.map((variant) => (
          <Box key={variant}>
            <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>
              variant: {variant}
            </Typography>
            <TextField
              variant={variant}
              label={`${variant} 입력`}
              placeholder={`${variant} 텍스트를 입력하세요`}
              value={values[variant]}
              onChange={handleChange(variant)}
              fullWidth
            />
            {values[variant] && (
              <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                입력값: {values[variant]}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default InputSection;

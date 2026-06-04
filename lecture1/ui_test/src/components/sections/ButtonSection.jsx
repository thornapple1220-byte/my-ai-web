import { Box, Typography, Button, Stack } from '@mui/material';

function ButtonSection() {
  const handleClick = (variant, color) => {
    alert(`클릭! variant: ${variant}, color: ${color}`);
  };

  const variants = ['contained', 'outlined', 'text'];
  const colors = ['primary', 'secondary', 'error'];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Button 섹션
      </Typography>
      {variants.map((variant) => (
        <Box key={variant} sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>
            variant: {variant}
          </Typography>
          <Stack direction="row" spacing={2}>
            {colors.map((color) => (
              <Button
                key={color}
                variant={variant}
                color={color}
                onClick={() => handleClick(variant, color)}
              >
                {color}
              </Button>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

export default ButtonSection;

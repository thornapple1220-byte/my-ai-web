import { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
];

function DropdownSection() {
  const [selected, setSelected] = useState('');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Dropdown 섹션
      </Typography>
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel>프레임워크 선택</InputLabel>
        <Select
          value={selected}
          label="프레임워크 선택"
          onChange={(e) => setSelected(e.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selected && (
        <Typography variant="body1" sx={{ mt: 2, color: 'primary.main' }}>
          선택된 값: <strong>{options.find((o) => o.value === selected)?.label}</strong>
        </Typography>
      )}
    </Box>
  );
}

export default DropdownSection;

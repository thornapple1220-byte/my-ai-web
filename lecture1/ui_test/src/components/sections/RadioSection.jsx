import { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

const options = [
  { value: 'beginner', label: '입문자' },
  { value: 'junior', label: '주니어 (1~3년)' },
  { value: 'mid', label: '미드레벨 (3~5년)' },
  { value: 'senior', label: '시니어 (5년 이상)' },
];

function RadioSection() {
  const [selected, setSelected] = useState('');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Radio 섹션
      </Typography>
      <FormControl>
        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>개발 경력을 선택하세요</FormLabel>
        <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              label={option.label}
              control={<Radio color="primary" />}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {selected && (
        <Typography variant="body1" sx={{ mt: 2, color: 'primary.main' }}>
          선택된 옵션: <strong>{options.find((o) => o.value === selected)?.label}</strong>
        </Typography>
      )}
    </Box>
  );
}

export default RadioSection;

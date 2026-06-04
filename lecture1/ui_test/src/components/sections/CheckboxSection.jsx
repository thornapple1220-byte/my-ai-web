import { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from '@mui/material';

const items = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
];

function CheckboxSection() {
  const [checked, setChecked] = useState([]);

  const isAllChecked = checked.length === items.length;
  const isIndeterminate = checked.length > 0 && checked.length < items.length;

  const handleAll = () => {
    setChecked(isAllChecked ? [] : items.map((item) => item.value));
  };

  const handleItem = (value) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Checkbox 섹션
      </Typography>
      <FormGroup>
        <FormControlLabel
          label={<Typography fontWeight={600}>전체 선택</Typography>}
          control={
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleAll}
              color="primary"
            />
          }
        />
        <Divider sx={{ my: 1 }} />
        {items.map((item) => (
          <FormControlLabel
            key={item.value}
            label={item.label}
            control={
              <Checkbox
                checked={checked.includes(item.value)}
                onChange={() => handleItem(item.value)}
                color="primary"
              />
            }
          />
        ))}
      </FormGroup>
      {checked.length > 0 && (
        <Typography variant="body1" sx={{ mt: 2, color: 'primary.main' }}>
          선택된 항목: <strong>{checked.map((v) => items.find((i) => i.value === v)?.label).join(', ')}</strong>
        </Typography>
      )}
    </Box>
  );
}

export default CheckboxSection;

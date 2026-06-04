import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

function ModalSection() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Modal 섹션
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        모달 열기
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>모달 제목</DialogTitle>
        <DialogContent>
          <DialogContentText>
            MUI Dialog 컴포넌트를 사용한 모달입니다. 확인 또는 취소 버튼을 눌러 닫을 수 있습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={() => setOpen(false)} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ModalSection;

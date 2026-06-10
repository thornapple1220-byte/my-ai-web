import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, AppBar, Toolbar, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username.trim() || !password || !nickname.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (username.trim().length < 4) {
      setError('아이디는 4자 이상이어야 합니다.');
      return;
    }
    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    const result = await signup(username.trim(), password, nickname.trim());
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 상단 AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1565C0, #1E88E5)',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/login')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, justifyContent: 'center' }}>
            <FlightTakeoffIcon sx={{ fontSize: '1.3rem' }} />
            <Typography variant="h6" fontWeight={800} sx={{ fontStyle: 'italic' }}>
              여행스타그램
            </Typography>
          </Box>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 3, py: 4, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ mb: 0.5 }}>
          회원가입
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3.5 }}>
          여행 이야기를 함께 나눠요 ✈️
        </Typography>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="아이디"
            variant="outlined"
            sx={{ mb: 2 }}
            value={username}
            onChange={e => setUsername(e.target.value)}
            helperText="영문, 숫자 포함 4자 이상"
            autoComplete="username"
          />

          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            sx={{ mb: 2 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
            helperText="4자 이상 입력"
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            label="닉네임"
            variant="outlined"
            sx={{ mb: 3 }}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            helperText="다른 사용자에게 보이는 이름"
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSignup}
            sx={{ mb: 1.5, borderRadius: 3, fontWeight: 700, py: 1.3 }}
          >
            회원가입 완료
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 3, color: 'text.secondary' }}
          >
            이미 계정이 있으신가요? 로그인
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SignupPage;

import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, Divider,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, loginAsGuest } = useApp();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/', { replace: true });
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    const result = await login(username.trim(), password);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #1565C0 0%, #1E88E5 40%, #64B5F6 70%, #E3F2FD 100%)',
        px: 3,
      }}
    >
      {/* 로고 영역 */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <FlightTakeoffIcon sx={{ fontSize: '2.8rem', color: 'white' }} />
        </Box>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            color: 'white',
            fontStyle: 'italic',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          여행스타그램
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.75 }}>
          당신의 여행을 세상과 공유하세요 ✈️
        </Typography>
      </Box>

      {/* 로그인 폼 카드 */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 4,
          p: 3,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: '#f0f7ff',
            borderRadius: 2,
            border: '1px solid #bbdefb',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.25}>
            테스트 계정 안내
          </Typography>
          <Typography variant="caption" color="text.secondary">
            아이디 <strong>test</strong> · 비밀번호 <strong>test</strong>
          </Typography>
        </Box>

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
          autoComplete="username"
        />

        <TextField
          fullWidth
          label="비밀번호"
          type={showPw ? 'text' : 'password'}
          variant="outlined"
          sx={{ mb: 2.5 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoComplete="current-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{ mb: 1.5, borderRadius: 3, fontWeight: 700, py: 1.3 }}
        >
          로그인
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => navigate('/signup')}
          sx={{ borderRadius: 3, fontWeight: 600, py: 1.3 }}
        >
          회원가입
        </Button>

        <Divider sx={{ my: 2, color: 'text.disabled', fontSize: '0.8rem' }}>또는</Divider>

        <Button
          fullWidth
          variant="text"
          size="large"
          onClick={handleGuestLogin}
          startIcon={<ExploreOutlinedIcon />}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            py: 1.3,
            color: 'text.secondary',
            border: '1.5px dashed',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
              borderColor: 'text.disabled',
            },
          }}
        >
          로그인 없이 둘러보기
        </Button>

        <Typography
          variant="caption"
          color="text.disabled"
          textAlign="center"
          display="block"
          mt={1}
        >
          좋아요·댓글·게시물 작성은 로그인 후 이용 가능해요
        </Typography>

      </Box>
    </Box>
  );
}

export default LoginPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button,
  FormControlLabel, Checkbox, Alert, Stack, Divider,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { useAuth } from '../store/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f8 0%, #fce4ec 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: 4,
            boxShadow: '0 8px 32px rgba(233,30,140,0.12)',
            textAlign: 'center',
          }}
        >
          {/* 로고 영역 */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e91e8c, #f48fb1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 16px rgba(233,30,140,0.3)',
              }}
            >
              <LocalCafeIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #e91e8c, #c2185b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              AWESOME CAFÉ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              예쁜 카페 공유 커뮤니티
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: 'text.primary' }}>
            로그인
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="아이디"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField
                label="비밀번호"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: 'primary.main' }}
                  />
                }
                label={<Typography variant="caption" color="text.secondary">로그인 정보 저장</Typography>}
                sx={{ alignSelf: 'flex-start', ml: 0 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem', borderRadius: 3 }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            component={Link}
            to="/register"
            variant="outlined"
            fullWidth
            size="large"
            sx={{ borderRadius: 3, py: 1.5 }}
          >
            회원가입
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;

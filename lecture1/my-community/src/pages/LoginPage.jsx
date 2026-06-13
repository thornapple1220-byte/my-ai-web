import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  FormControlLabel, Checkbox, Alert, Stack, Divider,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { useAuth } from '../store/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
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
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f8 0%, #fce4ec 100%)',
        px: 2,
        py: 4,
        boxSizing: 'border-box',
      }}
    >
      {/* 카드 */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 440 },
          bgcolor: 'background.paper',
          borderRadius: { xs: 3, sm: 4 },
          p: { xs: 3, sm: 4 },
          boxShadow: '0 8px 40px rgba(233,30,140,0.13)',
          textAlign: 'center',
        }}
      >
        {/* 로고 */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: { xs: 68, sm: 80 },
              height: { xs: 68, sm: 80 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e91e8c, #f48fb1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 4px 16px rgba(233,30,140,0.3)',
            }}
          >
            <LocalCafeIcon sx={{ fontSize: { xs: 34, sm: 40 }, color: 'white' }} />
          </Box>
          <Typography
            fontWeight={800}
            sx={{
              background: 'linear-gradient(135deg, #e91e8c, #c2185b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
            }}
          >
            AWESOME CAFÉ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            예쁜 카페 공유 커뮤니티
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          로그인
        </Typography>

        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: '#fff0f6',
            borderRadius: 2,
            border: '1px solid #f8bbd0',
            textAlign: 'left',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.25}>
            테스트 계정 안내
          </Typography>
          <Typography variant="caption" color="text.secondary">
            아이디 <strong>test2</strong> · 비밀번호 <strong>test1234!</strong>
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }}>{error}</Alert>}

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

        <Divider sx={{ my: 2, color: 'text.disabled', fontSize: '0.8rem' }}>또는</Divider>

        <Button
          fullWidth
          variant="text"
          size="large"
          onClick={handleGuestLogin}
          startIcon={<ExploreOutlinedIcon />}
          sx={{
            borderRadius: 3,
            py: 1.3,
            color: 'text.secondary',
            border: '1.5px dashed',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: 'text.disabled' },
          }}
        >
          로그인 없이 둘러보기
        </Button>

        <Typography variant="caption" color="text.disabled" textAlign="center" display="block" mt={1}>
          게시글 작성은 로그인 후 이용 가능해요
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;

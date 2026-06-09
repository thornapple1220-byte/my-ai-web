import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  Alert, Stack, IconButton, InputAdornment,
  List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';

const PW_RULES = [
  { label: '8자 이상', test: (pw) => pw.length >= 8 },
  { label: '영문 포함', test: (pw) => /[a-zA-Z]/.test(pw) },
  { label: '숫자 포함', test: (pw) => /[0-9]/.test(pw) },
  { label: '특수문자 포함 (!@#$%)', test: (pw) => /[!@#$%^&*]/.test(pw) },
];

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const pwFilled = password.length > 0;

  const handleCheckUsername = async () => {
    if (!username) return;
    const { data } = await supabase.from('users').select('id').eq('username', username).maybeSingle();
    setUsernameChecked(data === null);
  };

  const allPwRulesPassed = PW_RULES.every((r) => r.test(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !nickname || !password) { setError('모든 항목을 입력해주세요.'); return; }
    if (usernameChecked === false) { setError('이미 사용 중인 아이디입니다.'); return; }
    if (usernameChecked === null) { setError('아이디 중복 확인을 해주세요.'); return; }
    if (!allPwRulesPassed) { setError('비밀번호 규칙을 모두 충족해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await register(username, nickname, password);
      navigate('/');
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
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
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 480 },
          bgcolor: 'background.paper',
          borderRadius: { xs: 3, sm: 4 },
          p: { xs: 3, sm: 4 },
          boxShadow: '0 8px 40px rgba(233,30,140,0.13)',
        }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton component={Link} to="/login" size="small" sx={{ mr: 1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <LocalCafeIcon sx={{ color: 'primary.main', mr: 0.5 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            회원가입
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* 아이디 + 중복확인 */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="아이디"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameChecked(null); }}
                error={usernameChecked === false}
                helperText={
                  usernameChecked === true ? '✅ 사용 가능합니다.' :
                  usernameChecked === false ? '❌ 이미 사용 중입니다.' : ' '
                }
                FormHelperTextProps={{ sx: { color: usernameChecked === true ? 'success.main' : 'error.main' } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button
                variant="outlined"
                onClick={handleCheckUsername}
                disabled={!username}
                sx={{ whiteSpace: 'nowrap', minWidth: 76, borderRadius: 3, height: 56, flexShrink: 0 }}
              >
                중복확인
              </Button>
            </Box>

            <TextField
              label="닉네임"
              variant="outlined"
              fullWidth
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            {/* 비밀번호 규칙 */}
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 3, p: 1.5, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                비밀번호 규칙
              </Typography>
              <List dense disablePadding>
                {PW_RULES.map((rule) => {
                  const passed = pwFilled && rule.test(password);
                  const failed = pwFilled && !rule.test(password);
                  return (
                    <ListItem key={rule.label} disableGutters sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        {passed
                          ? <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          : failed
                            ? <CancelIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            : <CheckCircleIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={rule.label}
                        primaryTypographyProps={{
                          variant: 'caption',
                          color: passed ? 'success.main' : failed ? 'error.main' : 'text.disabled',
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: 3 }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;

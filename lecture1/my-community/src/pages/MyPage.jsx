import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Button, AppBar, Toolbar,
  Card, CardMedia, CardContent, CardActionArea, Stack, CircularProgress,
  Chip, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';
import { formatDistanceToNow } from '../utils/formatDate';

function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [{ data: profileData }, { data: postsData }] = await Promise.all([
        supabase.from('users').select('nickname, username').eq('id', user.id).single(),
        supabase
          .from('posts')
          .select(`id, title, image_url, video_url, rating, created_at, post_likes(count), comments(count)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      setProfile(profileData);
      setPosts(postsData || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            홈
          </Button>
          <Typography fontWeight={800} sx={{ flex: 1, textAlign: 'center', color: 'primary.main', letterSpacing: '-0.5px' }}>
            마이페이지
          </Typography>
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'error.main' } }}
          >
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 4, pb: 6, px: { xs: 2, sm: 3 } }}>
        {/* 프로필 섹션 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80, height: 80, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #e91e8c, #f48fb1)',
              fontSize: '2rem', fontWeight: 700,
            }}
          >
            {profile?.nickname?.[0] ?? '?'}
          </Avatar>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            {profile?.nickname ?? ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{profile?.username ?? ''}
          </Typography>
          <Chip
            label={`게시물 ${posts.length}개`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 1.5, fontWeight: 600 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 내 게시물 */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          내가 올린 카페
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalCafeIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
            <Typography color="text.secondary" variant="body2">
              아직 올린 카페가 없어요. 첫 카페를 공유해보세요!
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 20, fontWeight: 700 }}
              onClick={() => navigate('/posts/new')}
            >
              카페 공유하기
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: { xs: '12px', sm: '16px' },
            }}
          >
            {posts.map((post) => (
              <Card
                key={post.id}
                elevation={0}
                sx={{
                  border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 28px rgba(233,30,140,0.18)' },
                }}
              >
                <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                  <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                    {post.image_url ? (
                      <CardMedia
                        component="img"
                        image={post.image_url}
                        alt={post.title}
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        bgcolor: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <LocalCafeIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.35 }} />
                      </Box>
                    )}
                    {post.rating && (
                      <Chip
                        label={`⭐ ${post.rating}`}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.93)', fontSize: '0.72rem', height: 22, fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography fontWeight={700} noWrap sx={{ fontSize: { xs: '0.82rem', sm: '0.95rem' }, mb: 0.5 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
                      {formatDistanceToNow(post.created_at)}
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FavoriteIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">{post.post_likes?.[0]?.count ?? 0}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CommentIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{post.comments?.[0]?.count ?? 0}</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MyPage;

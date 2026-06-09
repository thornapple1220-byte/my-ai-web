import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card,
  CardMedia, CardContent, CardActionArea, Stack, Chip,
  Avatar, IconButton, CircularProgress, AppBar, Toolbar,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';
import { formatDistanceToNow } from '../utils/formatDate';

const REGION_FILTERS = ['전체', '강남', '홍대', '이태원', '성수', '기타'];
const TAG_FILTERS = ['전체', '커피가 맛있는', '디저트가 맛있는', '반려견 동반', '뷰 맛집', '인스타 감성'];

function PostListPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('전체');
  const [tagFilter, setTagFilter] = useState('전체');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      supabase.from('users').select('nickname').eq('id', user.id).single()
        .then(({ data }) => setUserProfile(data));
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [regionFilter, tagFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select(`
        id, title, content, image_url, video_url, rating, region, tags, created_at,
        users!user_id(nickname),
        post_likes(count),
        comments(count)
      `)
      .order('created_at', { ascending: false });

    if (regionFilter !== '전체') query = query.eq('region', regionFilter);
    if (tagFilter !== '전체') query = query.contains('tags', [tagFilter]);

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 상단 앱바 */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <LocalCafeIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1, color: 'primary.main', letterSpacing: '-0.5px' }}>
            AWESOME CAFÉ
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/posts/new')}
            size="small"
            sx={{ mr: 1, borderRadius: 20 }}
          >
            게시물 추가
          </Button>
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.secondary' }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 환영 메시지 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {userProfile?.nickname || '카페 러버'}님 환영해요! ☕
          </Typography>
          <Typography variant="body2" color="text.secondary">
            오늘은 어떤 예쁜 카페를 발견하셨나요?
          </Typography>
        </Box>

        {/* 지역 필터 */}
        <Box sx={{ mb: 2, overflowX: 'auto' }}>
          <ToggleButtonGroup
            value={regionFilter}
            exclusive
            onChange={(_, v) => { if (v) setRegionFilter(v); }}
            size="small"
          >
            {REGION_FILTERS.map((r) => (
              <ToggleButton
                key={r} value={r}
                sx={{ borderRadius: '20px !important', mx: 0.5, border: '1px solid !important', px: 2,
                  '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main !important' } }}
              >
                {r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* 태그 필터 */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {TAG_FILTERS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => setTagFilter(tag)}
              color={tagFilter === tag ? 'primary' : 'default'}
              variant={tagFilter === tag ? 'filled' : 'outlined'}
              size="small"
              sx={{ borderRadius: 20, cursor: 'pointer' }}
            />
          ))}
        </Box>

        {/* 게시물 그리드 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <LocalCafeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">아직 게시물이 없어요. 첫 카페를 공유해보세요!</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {posts.map((post) => (
              <Grid item xs={6} sm={4} md={3} key={post.id}>
                <Card
                  elevation={0}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(233,30,140,0.15)' } }}
                >
                  <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                    {/* 정사각형 썸네일 */}
                    <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                      {post.image_url ? (
                        <CardMedia
                          component="img"
                          image={post.image_url}
                          alt={post.title}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : post.video_url ? (
                        <Box
                          component="video"
                          src={post.video_url}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                          bgcolor: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LocalCafeIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.4 }} />
                        </Box>
                      )}
                      {/* 별점 배지 */}
                      {post.rating && (
                        <Chip
                          label={`⭐ ${post.rating}`}
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {post.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Avatar sx={{ width: 16, height: 16, fontSize: '0.5rem', bgcolor: 'primary.light' }}>
                            {post.users?.nickname?.[0]}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {post.users?.nickname}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.disabled">
                          {formatDistanceToNow(post.created_at)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <FavoriteIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                          <Typography variant="caption" color="text.secondary">
                            {post.post_likes?.[0]?.count ?? 0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CommentIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">
                            {post.comments?.[0]?.count ?? 0}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default PostListPage;

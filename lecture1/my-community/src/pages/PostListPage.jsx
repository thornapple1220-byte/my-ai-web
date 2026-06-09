import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Card,
  CardMedia, CardContent, CardActionArea, Chip,
  Avatar, CircularProgress, AppBar, Toolbar,
  Fab, BottomNavigation, BottomNavigationAction,
  Paper, useMediaQuery, useTheme, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';
import { formatDistanceToNow } from '../utils/formatDate';

const REGION_FILTERS = ['전체', '강남', '홍대', '이태원', '성수', '건대', '기타'];
const TAG_FILTERS = ['전체', '커피가 맛있는', '디저트가 맛있는', '반려견 동반', '뷰 맛집', '인스타 감성'];

function PostListPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        id, title, image_url, video_url, rating, region, created_at,
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
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: 'background.default', pb: { xs: 8, sm: 4 }, boxSizing: 'border-box' }}>

      {/* 상단 앱바 */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <LocalCafeIcon sx={{ color: 'primary.main', mr: { xs: 0.5, sm: 1 }, fontSize: { xs: 22, sm: 26 } }} />
          <Typography
            fontWeight={800}
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            AWESOME CAFÉ
          </Typography>

          {/* 데스크탑: 버튼 텍스트 표시 */}
          {!isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${userProfile?.nickname || '카페러버'}님`}
                avatar={<Avatar sx={{ bgcolor: 'primary.light' }}><PersonIcon sx={{ fontSize: 14 }} /></Avatar>}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Fab
                size="small"
                color="primary"
                onClick={() => navigate('/posts/new')}
                sx={{ boxShadow: 2, width: 36, height: 36, minHeight: 36 }}
              >
                <AddIcon fontSize="small" />
              </Fab>
              <Fab
                size="small"
                onClick={handleLogout}
                sx={{ boxShadow: 1, width: 36, height: 36, minHeight: 36, bgcolor: 'grey.100', color: 'text.secondary' }}
              >
                <LogoutIcon fontSize="small" />
              </Fab>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>

        {/* 환영 메시지 */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            fontWeight={700}
            color="primary.main"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
          >
            {userProfile?.nickname || '카페 러버'}님 환영해요! ☕
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            오늘은 어떤 예쁜 카페를 발견하셨나요?
          </Typography>
        </Box>

        {/* 지역 필터 (수평 스크롤) */}
        <Box
          sx={{
            mb: 1.5,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ width: 'max-content', pb: 0.5 }}>
            {REGION_FILTERS.map((r) => (
              <Chip
                key={r}
                label={r}
                onClick={() => setRegionFilter(r)}
                color={regionFilter === r ? 'primary' : 'default'}
                variant={regionFilter === r ? 'filled' : 'outlined'}
                size={isMobile ? 'small' : 'medium'}
                sx={{ borderRadius: 20, cursor: 'pointer', fontWeight: regionFilter === r ? 700 : 400, whiteSpace: 'nowrap' }}
              />
            ))}
          </Stack>
        </Box>

        {/* 태그 필터 (수평 스크롤) */}
        <Box
          sx={{
            mb: { xs: 2, sm: 3 },
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ width: 'max-content', pb: 0.5 }}>
            {TAG_FILTERS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setTagFilter(tag)}
                color={tagFilter === tag ? 'secondary' : 'default'}
                variant={tagFilter === tag ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  borderRadius: 20,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: tagFilter === tag ? 700 : 400,
                  color: tagFilter === tag ? 'primary.dark' : 'text.secondary',
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* 게시물 그리드 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <LocalCafeIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" variant={isMobile ? 'body2' : 'body1'}>
              아직 게시물이 없어요. 첫 카페를 공유해보세요!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(180px, 1fr))',
                md: 'repeat(4, minmax(180px, 1fr))',
              },
              gap: { xs: '12px', sm: '16px' },
            }}
          >
            {posts.map((post) => (
              <Card
                key={post.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 28px rgba(233,30,140,0.18)',
                  },
                }}
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
                      <Box sx={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        bgcolor: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <LocalCafeIcon sx={{ fontSize: 56, color: 'primary.main', opacity: 0.35 }} />
                      </Box>
                    )}
                    {post.rating && (
                      <Chip
                        label={`⭐ ${post.rating}`}
                        size="small"
                        sx={{
                          position: 'absolute', top: 8, right: 8,
                          bgcolor: 'rgba(255,255,255,0.93)',
                          fontSize: '0.72rem', height: 22, fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography fontWeight={700} noWrap sx={{ fontSize: { xs: '0.82rem', sm: '0.95rem' }, mb: 0.5 }}>
                      {post.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Avatar sx={{ width: 18, height: 18, fontSize: '0.55rem', bgcolor: 'primary.light' }}>
                          {post.users?.nickname?.[0]}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: { xs: 60, sm: 90 } }}>
                          {post.users?.nickname}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                        {formatDistanceToNow(post.created_at)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.75 }}>
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

      {/* 모바일: FAB (게시물 추가) */}
      {isMobile && (
        <Fab
          color="primary"
          onClick={() => navigate('/posts/new')}
          sx={{
            position: 'fixed',
            bottom: 72,
            right: 16,
            boxShadow: '0 4px 16px rgba(233,30,140,0.4)',
            zIndex: 100,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* 모바일: 하단 네비게이션 */}
      {isMobile && (
        <Paper
          elevation={4}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99 }}
        >
          <BottomNavigation showLabels value={0}>
            <BottomNavigationAction label="홈" icon={<HomeIcon />} sx={{ color: 'primary.main' }} />
            <BottomNavigationAction
              label="로그아웃"
              icon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: 'text.secondary' }}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}

export default PostListPage;

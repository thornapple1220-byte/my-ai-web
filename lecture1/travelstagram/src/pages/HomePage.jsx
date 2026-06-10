import { Box, Typography, CircularProgress } from '@mui/material';
import PostCard from '../components/common/PostCard';
import { useApp } from '../store/AppContext';

function HomePage() {
  const { posts, loading } = useApp();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (sortedPosts.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 1,
        }}
      >
        <Typography variant="h2" textAlign="center">✈️</Typography>
        <Typography variant="h6" fontWeight={600} color="text.secondary">
          아직 게시물이 없어요
        </Typography>
        <Typography variant="body2" color="text.disabled">
          첫 여행 이야기를 올려보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}

export default HomePage;

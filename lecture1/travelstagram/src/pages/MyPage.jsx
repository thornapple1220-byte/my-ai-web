import { useState } from 'react';
import {
  Box, Typography, Avatar, Button, Dialog, IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import PostCard from '../components/common/PostCard';

function StatItem({ value, label }) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center' }}>
      <Typography variant="h6" fontWeight={800} color="primary.dark">
        {value.toLocaleString()}
      </Typography>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
    </Box>
  );
}

function MyPage() {
  const { user, posts, logout, loading } = useApp();
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const myPosts = posts.filter(p => p.userId === user.id);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 프로필 영역 */}
      <Box sx={{ bgcolor: 'background.paper', px: 2, pt: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.profileImage}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid',
              borderColor: 'primary.light',
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {user.nickname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              @{user.username}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              여행을 사랑하는 사람 ✈️
            </Typography>
          </Box>
        </Box>

        {/* 통계 */}
        <Box
          sx={{
            display: 'flex',
            py: 1.5,
            mb: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: '#F0F7FF',
          }}
        >
          <StatItem value={myPosts.length} label="게시물" />
          <Divider orientation="vertical" flexItem />
          <StatItem value={user.followers} label="팔로워" />
          <Divider orientation="vertical" flexItem />
          <StatItem value={user.following} label="팔로잉" />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ borderRadius: 2.5, fontWeight: 600 }}
        >
          로그아웃
        </Button>
      </Box>

      {/* 그리드 탭 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          py: 1.25,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: '2px',
        }}
      >
        <GridViewIcon fontSize="small" color="primary" />
        <Typography variant="body2" fontWeight={700} color="primary.main">
          게시물
        </Typography>
      </Box>

      {/* 3열 그리드 썸네일 */}
      {myPosts.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
            gap: 1,
          }}
        >
          <Typography variant="h2">📷</Typography>
          <Typography variant="body1" fontWeight={600} color="text.secondary">
            아직 게시물이 없어요
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/create')}
            sx={{ mt: 1, borderRadius: 3 }}
          >
            첫 게시물 올리기
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', mt: '2px' }}>
          {myPosts.map(post => (
            <Box
              key={post.id}
              onClick={() => setSelectedPost(post)}
              sx={{
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: 'grey.200',
                border: '1px solid white',
                '&:hover': { opacity: 0.85 },
                transition: 'opacity 0.2s',
              }}
            >
              <img
                src={post.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* 게시물 상세 전체화면 모달 */}
      <Dialog
        fullScreen
        open={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        PaperProps={{
          sx: { bgcolor: 'rgba(0,0,0,0.88)' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={() => setSelectedPost(null)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'white',
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 게시물 카드 */}
          {selectedPost && (
            <Box
              sx={{
                width: '100%',
                maxWidth: 480,
                maxHeight: '92vh',
                overflowY: 'auto',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: 24,
                mx: 2,
              }}
            >
              <PostCard post={selectedPost} />
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default MyPage;

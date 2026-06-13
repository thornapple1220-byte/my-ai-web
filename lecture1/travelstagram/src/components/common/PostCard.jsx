import { useState } from 'react';
import {
  Box, Typography, Avatar, IconButton, TextField, Button,
  Drawer, Divider, Snackbar, Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

function PostCard({ post }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [guestSnack, setGuestSnack] = useState(false);
  const { toggleLike, addComment, user, isGuest } = useApp();
  const navigate = useNavigate();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleLikeClick = () => {
    if (isGuest) { setGuestSnack(true); return; }
    toggleLike(post.id);
  };

  const handleCommentOpen = () => {
    if (isGuest) { setGuestSnack(true); return; }
    setCommentOpen(true);
  };

  const recentComments = post.comments.slice(-2);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '8px solid',
        borderColor: 'background.default',
      }}
    >
      {/* 헤더: 프로필 + 닉네임 + 위치 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 1.25 }}>
        <Avatar
          src={post.profileImage}
          sx={{
            width: 40,
            height: 40,
            mr: 1.5,
            border: '2px solid',
            borderColor: 'primary.light',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={700}>
            {post.nickname}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <LocationOnIcon sx={{ fontSize: '0.7rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {post.location}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 이미지 (정방형) */}
      <Box sx={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        <img
          src={post.image}
          alt="게시물 이미지"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* 좋아요 + 댓글 아이콘 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5, pt: 0.5 }}>
        <IconButton
          onClick={handleLikeClick}
          sx={{ color: post.liked ? 'error.main' : 'text.primary' }}
        >
          {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={handleCommentOpen} sx={{ color: 'text.primary' }}>
          <ModeCommentOutlinedIcon />
        </IconButton>
      </Box>

      {/* 좋아요 수 */}
      <Box sx={{ px: 2, pb: 0.5 }}>
        <Typography variant="body2" fontWeight={700}>
          좋아요 {post.likes.toLocaleString()}개
        </Typography>
      </Box>

      {/* 본문 내용 */}
      <Box sx={{ px: 2, pb: 0.5 }}>
        <Typography variant="body2" component="span">
          <strong>{post.nickname}</strong>{' '}
        </Typography>
        <Typography variant="body2" component="span">
          {post.content}
        </Typography>
      </Box>

      {/* 해시태그 */}
      {post.hashtags?.length > 0 && (
        <Box sx={{ px: 2, pb: 0.5 }}>
          <Typography variant="body2" color="primary.main" sx={{ fontSize: '0.8rem' }}>
            {post.hashtags.join(' ')}
          </Typography>
        </Box>
      )}

      {/* 최근 댓글 2개 미리보기 */}
      {recentComments.length > 0 && (
        <Box sx={{ px: 2, pb: 0.5 }}>
          {post.comments.length > 2 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ cursor: 'pointer', mb: 0.5, display: 'block' }}
              onClick={() => setCommentOpen(true)}
            >
              댓글 {post.comments.length}개 모두 보기
            </Typography>
          )}
          {recentComments.map(c => (
            <Typography key={c.id} variant="body2" sx={{ lineHeight: 1.6 }}>
              <strong>{c.nickname}</strong>{' '}
              <Typography variant="body2" component="span" color="text.secondary">
                {c.text}
              </Typography>
            </Typography>
          ))}
        </Box>
      )}

      {/* 작성 시간 */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Typography variant="caption" color="text.disabled">
          {formatTime(post.createdAt)}
        </Typography>
      </Box>

      {/* 게스트 로그인 유도 Snackbar */}
      <Snackbar
        open={guestSnack}
        autoHideDuration={3000}
        onClose={() => setGuestSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 80 }}
      >
        <Alert
          severity="info"
          onClose={() => setGuestSnack(false)}
          action={
            <Button
              color="inherit"
              size="small"
              fontWeight={700}
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          }
          sx={{ borderRadius: 3, fontWeight: 500 }}
        >
          로그인 후 이용할 수 있어요 ✈️
        </Alert>
      </Snackbar>

      {/* 댓글 Drawer (아래에서 올라오는 모달) */}
      <Drawer
        anchor="bottom"
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px 20px 0 0',
            maxHeight: '72vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        BackdropProps={{
          sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
      >
        {/* 드래그 핸들 */}
        <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: 36, height: 4, bgcolor: 'grey.300', borderRadius: 2 }} />
        </Box>

        {/* 헤더 */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontWeight={700}>댓글</Typography>
          <IconButton size="small" onClick={() => setCommentOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        {/* 댓글 목록 (스크롤) */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
          {post.comments.length === 0 ? (
            <Typography
              color="text.secondary"
              textAlign="center"
              py={4}
              variant="body2"
            >
              첫 댓글을 남겨보세요! 💬
            </Typography>
          ) : (
            post.comments.map(c => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <Avatar src={c.profileImage} sx={{ width: 32, height: 32, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    <strong>{c.nickname}</strong>{' '}
                    {c.text}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatTime(c.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* 댓글 입력 */}
        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Avatar src={user?.profileImage} sx={{ width: 32, height: 32, flexShrink: 0 }} />
          <TextField
            fullWidth
            size="small"
            placeholder="댓글 달기..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 4, fontSize: '0.875rem' },
            }}
          />
          <Button
            variant="text"
            color="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            sx={{ fontWeight: 700, flexShrink: 0, minWidth: 0 }}
          >
            게시
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default PostCard;

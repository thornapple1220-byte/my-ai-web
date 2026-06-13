import { useMemo } from 'react';
import {
  Drawer, Box, Typography, Avatar, Divider, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useApp } from '../../store/AppContext';

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function NotificationDrawer({ open, onClose }) {
  const { user, posts } = useApp();

  const notifications = useMemo(() => {
    if (!user || !posts) return [];
    const result = [];
    posts.forEach(post => {
      if (post.userId === user.id) {
        post.comments.forEach(comment => {
          if (comment.nickname !== user.nickname) {
            result.push({
              id: comment.id,
              type: 'comment',
              avatar: comment.profileImage,
              nickname: comment.nickname,
              text: comment.text,
              createdAt: comment.createdAt,
              postImage: post.image,
            });
          }
        });
      }
    });
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [user, posts]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '66vw', sm: '55vw', md: '50vw' }, maxWidth: 630 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 헤더 */}
        <Box
          sx={{
            px: 2.5, py: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid', borderColor: 'divider',
            background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #29B6F6 100%)',
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
            알림
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 알림 목록 */}
        {notifications.length === 0 ? (
          <Box
            sx={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1.5,
              color: 'text.disabled',
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 52 }} />
            <Typography variant="body2">아직 알림이 없어요</Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {notifications.map((notif, idx) => (
              <Box key={notif.id}>
                <Box sx={{ px: 2.5, py: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  {/* 프로필 이미지 */}
                  <Avatar src={notif.avatar} sx={{ width: 44, height: 44, flexShrink: 0 }} />

                  {/* 텍스트 영역 */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.3 }}>
                      {notif.nickname}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: 'primary.main', mt: '3px', flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.85rem', lineHeight: 1.5, wordBreak: 'break-word' }}
                      >
                        {notif.text}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      {formatTimeAgo(notif.createdAt)}
                    </Typography>
                  </Box>

                  {/* 게시물 썸네일 */}
                  {notif.postImage && (
                    <Box
                      component="img"
                      src={notif.postImage}
                      alt=""
                      sx={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 1.5, flexShrink: 0 }}
                    />
                  )}
                </Box>
                {idx < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default NotificationDrawer;

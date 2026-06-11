import { useMemo } from 'react';
import {
  Drawer, Box, Typography, List, ListItem, ListItemAvatar,
  Avatar, ListItemText, Divider, IconButton,
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
      PaperProps={{ sx: { width: { xs: 300, sm: 340 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 헤더 */}
        <Box
          sx={{
            px: 2, py: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid', borderColor: 'divider',
            background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #29B6F6 100%)',
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
          <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
            {notifications.map((notif, idx) => (
              <Box key={notif.id}>
                <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
                  <ListItemAvatar sx={{ minWidth: 52 }}>
                    <Avatar src={notif.avatar} sx={{ width: 42, height: 42 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                        {notif.nickname}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.3 }}>
                          <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: 'primary.main', mt: '2px', flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}
                          >
                            {notif.text.length > 30
                              ? `${notif.text.slice(0, 30)}…`
                              : notif.text}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.3, display: 'block' }}>
                          {formatTimeAgo(notif.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  {notif.postImage && (
                    <Box
                      component="img"
                      src={notif.postImage}
                      alt=""
                      sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, ml: 1, flexShrink: 0 }}
                    />
                  )}
                </ListItem>
                {idx < notifications.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}

export default NotificationDrawer;

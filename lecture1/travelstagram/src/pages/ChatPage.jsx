import {
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Badge, Chip, Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MOCK_CHATS = [
  {
    id: 'chat1',
    type: '1:1',
    name: '하늘길',
    participants: 2,
    lastMessage: '제주도 여행 어떠셨어요? 😊',
    lastTime: '방금 전',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'meetup_m1',
    type: '단체',
    name: '제주도 오름 트레킹 모임',
    participants: 4,
    lastMessage: '내일 아침 9시에 1100고지 입구에서 만나요!',
    lastTime: '5분 전',
    unread: 7,
    avatar: 'https://picsum.photos/seed/meetup1/100/100',
  },
  {
    id: 'chat2',
    type: '1:1',
    name: '바다소녀',
    participants: 2,
    lastMessage: '발리 다음엔 어디 가세요?',
    lastTime: '23분 전',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 'meetup_m3',
    type: '단체',
    name: '서울 한옥마을 골목 탐방',
    participants: 3,
    lastMessage: '저 길 못 찾겠어요 ㅠㅠ 사진 보내주실 수 있나요?',
    lastTime: '1시간 전',
    unread: 0,
    avatar: 'https://picsum.photos/seed/meetup3/100/100',
  },
  {
    id: 'chat3',
    type: '1:1',
    name: '서울러',
    participants: 2,
    lastMessage: '남산 카페 추천해드릴게요 ☕',
    lastTime: '어제',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
];

function ChatPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
      {/* 헤더 */}
      <Box sx={{ px: 2, pt: 2, pb: 1, bgcolor: 'background.paper' }}>
        <Typography variant="h6" fontWeight={800}>
          채팅
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {MOCK_CHATS.filter(c => c.unread > 0).length}개의 읽지 않은 메시지
        </Typography>
      </Box>

      {/* 목업 안내 */}
      <Box
        sx={{
          mx: 2,
          mt: 1,
          bgcolor: '#E3F2FD',
          border: '1px dashed',
          borderColor: 'primary.light',
          borderRadius: 2,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography variant="caption" color="primary.dark" fontWeight={600}>
          💬 채팅 기능 (목업)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
          1:1 채팅 및 친구 모임 단체 채팅을 지원합니다.
        </Typography>
      </Box>

      {/* 채팅방 목록 */}
      <List sx={{ bgcolor: 'background.paper', mt: 1 }}>
        {MOCK_CHATS.map((chat, idx) => (
          <Box key={chat.id}>
            <ListItem
              onClick={() => navigate(`/chat/${chat.id}`)}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: '#F0F7FF' },
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={chat.unread > 0 ? chat.unread : null}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 18, height: 18 },
                  }}
                >
                  <Avatar
                    src={chat.avatar}
                    sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'grey.100' }}
                  />
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="body2" fontWeight={chat.unread > 0 ? 700 : 500}>
                        {chat.name}
                      </Typography>
                      <Chip
                        label={chat.type}
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: '0.6rem',
                          bgcolor: chat.type === '단체' ? '#E3F2FD' : '#F3E5F5',
                          color: chat.type === '단체' ? 'primary.dark' : '#6A1B9A',
                          fontWeight: 600,
                        }}
                      />
                      {chat.type === '단체' && (
                        <Typography variant="caption" color="text.disabled">
                          {chat.participants}명
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.disabled">
                      {chat.lastTime}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color={chat.unread > 0 ? 'text.primary' : 'text.secondary'}
                    fontWeight={chat.unread > 0 ? 500 : 400}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {chat.lastMessage}
                  </Typography>
                }
              />
            </ListItem>
            {idx < MOCK_CHATS.length - 1 && (
              <Divider sx={{ ml: '80px' }} />
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
}

export default ChatPage;

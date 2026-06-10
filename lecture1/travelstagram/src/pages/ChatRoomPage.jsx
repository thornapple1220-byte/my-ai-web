import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, Avatar,
  AppBar, Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const CHAT_META = {
  chat1: { name: '하늘길', avatar: 'https://i.pravatar.cc/150?img=5', type: '1:1' },
  chat2: { name: '바다소녀', avatar: 'https://i.pravatar.cc/150?img=20', type: '1:1' },
  chat3: { name: '서울러', avatar: 'https://i.pravatar.cc/150?img=10', type: '1:1' },
  'meetup_m1': { name: '제주도 오름 트레킹 모임', avatar: 'https://picsum.photos/seed/meetup1/100/100', type: '단체' },
  'meetup_m2': { name: '부산 야경 사진 투어', avatar: 'https://picsum.photos/seed/meetup2/100/100', type: '단체' },
  'meetup_m3': { name: '서울 한옥마을 골목 탐방', avatar: 'https://picsum.photos/seed/meetup3/100/100', type: '단체' },
  'meetup_m4': { name: '경복궁 새벽 산책 모임', avatar: 'https://picsum.photos/seed/meetup4/100/100', type: '단체' },
};

const INITIAL_MESSAGES = {
  chat1: [
    { id: 1, senderId: 'user2', text: '안녕하세요! 피드에서 봤는데 제주도 진짜 예쁘더라고요 😍', time: '오후 2:00' },
    { id: 2, senderId: 'user1', text: '감사해요 ㅎㅎ 정말 좋았어요!', time: '오후 2:01' },
    { id: 3, senderId: 'user2', text: '제주도 여행 어떠셨어요? 😊', time: '오후 2:02' },
  ],
  'meetup_m1': [
    { id: 1, senderId: 'user1', text: '안녕하세요 모임장입니다! 내일 트레킹 기대되죠? 🏔️', time: '오후 7:00' },
    { id: 2, senderId: 'user3', text: '넵! 완전 설레요!!', time: '오후 7:03' },
    { id: 3, senderId: 'user4', text: '저도 처음이라 긴장되는데 잘 부탁드려요 ㅎㅎ', time: '오후 7:05' },
    { id: 4, senderId: 'user1', text: '내일 아침 9시에 1100고지 입구에서 만나요!', time: '오후 7:10' },
  ],
};

function ChatRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [messages, setMessages] = useState(INITIAL_MESSAGES[id] || []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const meta = CHAT_META[id] || { name: '채팅방', avatar: '', type: '1:1' };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    setMessages(prev => [
      ...prev,
      { id: Date.now(), senderId: user.id, text: input.trim(), time },
    ]);
    setInput('');
  };

  const isMe = (senderId) => senderId === user.id;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 600, mx: 'auto' }}>
      {/* 채팅방 헤더 */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar src={meta.avatar} sx={{ width: 36, height: 36, mx: 1.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {meta.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {meta.type === '단체' ? '단체 채팅' : '1:1 채팅'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메시지 영역 */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          bgcolor: '#F0F7FF',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: isMe(msg.senderId) ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {/* 상대방 아바타 */}
            {!isMe(msg.senderId) && (
              <Avatar src={meta.avatar} sx={{ width: 30, height: 30, flexShrink: 0, mb: 0.5 }} />
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: isMe(msg.senderId) ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  maxWidth: '66vw',
                  px: 1.5,
                  py: 1,
                  borderRadius: isMe(msg.senderId)
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  bgcolor: isMe(msg.senderId) ? 'primary.main' : 'white',
                  color: isMe(msg.senderId) ? 'white' : 'text.primary',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {msg.text}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ flexShrink: 0, fontSize: '0.65rem', mb: 0.5 }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* 입력 영역 */}
      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="메시지 입력..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              bgcolor: '#F5F5F5',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            flexShrink: 0,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'grey.200', color: 'grey.400' },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatRoomPage;

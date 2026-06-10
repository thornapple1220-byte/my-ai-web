import {
  Box, Typography, Card, CardContent, Avatar, Button, Chip,
  LinearProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';

const MOCK_MEETUPS = [
  {
    id: 'm1',
    name: '제주도 오름 트레킹 모임',
    host: '여행러버',
    time: '2024-06-15 오전 9:00',
    location: '제주시, 제주도',
    distance: 1.2,
    current: 4,
    max: 8,
    image: 'https://picsum.photos/seed/meetup1/100/100',
    tags: ['#트레킹', '#제주도'],
  },
  {
    id: 'm2',
    name: '부산 야경 사진 투어',
    host: '바다소녀',
    time: '2024-06-14 오후 7:00',
    location: '광안리, 부산',
    distance: 2.5,
    current: 6,
    max: 6,
    image: 'https://picsum.photos/seed/meetup2/100/100',
    tags: ['#야경', '#사진', '#부산'],
  },
  {
    id: 'm3',
    name: '서울 한옥마을 골목 탐방',
    host: '하늘길',
    time: '2024-06-16 오후 2:00',
    location: '북촌, 서울',
    distance: 0.8,
    current: 3,
    max: 10,
    image: 'https://picsum.photos/seed/meetup3/100/100',
    tags: ['#한옥마을', '#서울', '#문화'],
  },
  {
    id: 'm4',
    name: '경복궁 새벽 산책 모임',
    host: '서울러',
    time: '2024-06-17 오전 6:30',
    location: '경복궁, 서울',
    distance: 3.1,
    current: 5,
    max: 12,
    image: 'https://picsum.photos/seed/meetup4/100/100',
    tags: ['#경복궁', '#새벽', '#산책'],
  },
];

function MeetupCard({ meetup }) {
  const navigate = useNavigate();
  const isFull = meetup.current >= meetup.max;
  const fillRate = (meetup.current / meetup.max) * 100;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ pb: '12px !important' }}>
        {/* 상단: 이미지 + 정보 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          <Avatar
            src={meetup.image}
            variant="rounded"
            sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} noWrap>
              {meetup.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {meetup.time}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <LocationOnIcon sx={{ fontSize: '0.8rem', color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary">
                {meetup.location} · {meetup.distance}km
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 태그 */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {meetup.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#E3F2FD', color: 'primary.dark' }}
            />
          ))}
        </Box>

        {/* 모집 현황 */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GroupsIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                모집 현황
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={700} color={isFull ? 'error.main' : 'primary.main'}>
              {meetup.current}/{meetup.max}명 {isFull ? '(마감)' : ''}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={fillRate}
            sx={{
              borderRadius: 1,
              height: 6,
              bgcolor: 'grey.100',
              '& .MuiLinearProgress-bar': {
                bgcolor: isFull ? 'error.main' : 'primary.main',
              },
            }}
          />
        </Box>

        {/* 참가 버튼 */}
        <Button
          fullWidth
          variant={isFull ? 'outlined' : 'contained'}
          size="small"
          disabled={isFull}
          onClick={() => navigate(`/chat/meetup_${meetup.id}`)}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          {isFull ? '모집 마감' : '참가하기 → 단체 채팅방'}
        </Button>
      </CardContent>
    </Card>
  );
}

function MeetupPage() {
  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          📍 내 주변 모임
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: '0.85rem', color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            현재 위치 5km 이내 · {MOCK_MEETUPS.length}개 모임
          </Typography>
        </Box>
      </Box>

      {/* 목업 안내 배너 */}
      <Box
        sx={{
          bgcolor: '#E3F2FD',
          border: '1px dashed',
          borderColor: 'primary.light',
          borderRadius: 2,
          px: 2,
          py: 1.25,
          mb: 2,
        }}
      >
        <Typography variant="caption" color="primary.dark" fontWeight={600}>
          📱 위치 기반 모임 찾기 기능 (목업)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
          실제 서비스에서는 GPS를 활용하여 주변 모임을 실시간으로 보여드립니다.
        </Typography>
      </Box>

      {MOCK_MEETUPS.map(meetup => (
        <MeetupCard key={meetup.id} meetup={meetup} />
      ))}
    </Box>
  );
}

export default MeetupPage;

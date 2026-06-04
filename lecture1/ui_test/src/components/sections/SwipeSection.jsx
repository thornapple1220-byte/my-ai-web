import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const slides = [
  { id: 1, image: 'https://picsum.photos/seed/slide1/600/300', title: '슬라이드 1' },
  { id: 2, image: 'https://picsum.photos/seed/slide2/600/300', title: '슬라이드 2' },
  { id: 3, image: 'https://picsum.photos/seed/slide3/600/300', title: '슬라이드 3' },
  { id: 4, image: 'https://picsum.photos/seed/slide4/600/300', title: '슬라이드 4' },
  { id: 5, image: 'https://picsum.photos/seed/slide5/600/300', title: '슬라이드 5' },
];

function SwipeSection() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Swipe 섹션
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        마우스 드래그 또는 터치로 슬라이드를 넘겨보세요.
      </Typography>

      <Paper
        elevation={3}
        sx={{ maxWidth: 600, mx: 'auto', borderRadius: 3, overflow: 'hidden', userSelect: 'none' }}
      >
        {/* 이미지 */}
        <Box {...handlers} sx={{ position: 'relative', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <Box
            component="img"
            src={slides[index].image}
            alt={slides[index].title}
            sx={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
          />

          {/* 좌우 버튼 */}
          <IconButton
            onClick={prev}
            sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={next}
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 제목 & 인덱스 */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{slides[index].title}</Typography>
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {slides.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: i === index ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: i === index ? 'primary.main' : 'grey.400',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default SwipeSection;

import { useState, useCallback } from 'react';
import {
  Box, TextField, Button, Typography, AppBar, Toolbar, IconButton,
  InputAdornment, CircularProgress, Alert, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TagIcon from '@mui/icons-material/Tag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const TRAVEL_KEYWORDS = [
  'travel', 'nature', 'landscape', 'city', 'beach',
  'mountain', 'architecture', 'food', 'street', 'sunset',
];

function generateImageUrls(count = 6) {
  const keyword = TRAVEL_KEYWORDS[Math.floor(Math.random() * TRAVEL_KEYWORDS.length)];
  return Array.from({ length: count }, (_, i) => {
    const seed = `${keyword}_${Date.now()}_${i}`;
    return `https://picsum.photos/seed/${seed}/400/400`;
  });
}

function ImageCard({ url, selected, onSelect }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      onClick={onSelect}
      sx={{
        position: 'relative',
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: selected ? '3px solid' : '2px solid transparent',
        borderColor: selected ? 'primary.main' : 'transparent',
        boxShadow: selected ? 3 : 0,
        transition: 'all 0.15s',
        bgcolor: 'grey.100',
      }}
    >
      {!loaded && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      <img
        src={url}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(30,136,229,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: '2rem', color: 'primary.main', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }} />
        </Box>
      )}
    </Box>
  );
}

function CreatePostPage() {
  const [step, setStep] = useState(1);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');

  const [imageUrls, setImageUrls] = useState(() => generateImageUrls(6));
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { addPost } = useApp();
  const navigate = useNavigate();

  const handleRefreshImages = useCallback(() => {
    setRefreshing(true);
    setSelectedImage(null);
    setImageUrls(generateImageUrls(6));
    setTimeout(() => setRefreshing(false), 300);
  }, []);

  const handleSubmit = async () => {
    if (!caption.trim()) {
      setError('게시물 내용을 입력해주세요.');
      return;
    }
    if (!selectedImage) {
      setError('이미지를 선택해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    const hashtagList = hashtags
      .split(/\s+/)
      .map(h => (h.startsWith('#') ? h : `#${h}`))
      .filter(h => h.length > 1);

    const result = await addPost({
      image_url: selectedImage,
      caption: caption.trim(),
      hashtags: hashtagList,
      location: location.trim() || '위치 없음',
    });

    if (result?.success === false) {
      setError(`게시물 등록 실패: ${result.message}`);
      setSubmitting(false);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 헤더 */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1, textAlign: 'center' }}>
            새 게시물
          </Typography>
          <Button
            color="primary"
            variant="text"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? <CircularProgress size={18} /> : '게시'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, py: 2 }}>
        {error && (
          <Alert severity="warning" onClose={() => setError('')} sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* ── STEP 1: 내용 입력 ── */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip label="1" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 24 }} />
            <Typography variant="body2" fontWeight={700}>
              여행 이야기를 적어보세요
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="오늘의 여행은 어떠셨나요? ✈️"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Box>

        {/* ── STEP 2: 이미지 선택 ── */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="2" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 24 }} />
              <Typography variant="body2" fontWeight={700}>
                이미지 선택
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshImages}
              disabled={refreshing}
              sx={{ fontSize: '0.75rem' }}
            >
              새로운 이미지 불러오기
            </Button>
          </Box>

          {/* 3×2 이미지 그리드 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              opacity: refreshing ? 0.4 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {imageUrls.map(url => (
              <ImageCard
                key={url}
                url={url}
                selected={selectedImage === url}
                onSelect={() => setSelectedImage(prev => prev === url ? null : url)}
              />
            ))}
          </Box>

          {/* 선택된 이미지 미리보기 */}
          {selectedImage && (
            <Box
              sx={{
                mt: 1.5,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.light',
                position: 'relative',
              }}
            >
              <img
                src={selectedImage}
                alt="선택된 이미지"
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 1,
                  px: 1,
                  py: 0.25,
                }}
              >
                <Typography variant="caption" fontWeight={700}>
                  ✓ 선택됨
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* ── STEP 3: 해시태그 + 위치 ── */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Chip label="3" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 24 }} />
            <Typography variant="body2" fontWeight={700}>
              태그 &amp; 위치 (선택)
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="해시태그"
            placeholder="#여행 #서울 #힐링"
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
            sx={{ mb: 1.5, bgcolor: 'background.paper' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            helperText="공백으로 구분하여 입력"
          />

          <TextField
            fullWidth
            label="위치"
            placeholder="서울, 한국"
            value={location}
            onChange={e => setLocation(e.target.value)}
            sx={{ bgcolor: 'background.paper' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ borderRadius: 3, fontWeight: 700, py: 1.4, mb: 2 }}
        >
          {submitting ? '등록 중...' : '게시물 등록'}
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePostPage;

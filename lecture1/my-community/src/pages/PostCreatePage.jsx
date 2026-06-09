import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Stack,
  IconButton, Rating, Chip, Alert, AppBar, Toolbar,
  CircularProgress, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';

const REGION_OPTIONS = ['강남', '홍대', '이태원', '성수', '신촌', '건대', '혜화', '연남', '기타'];
const TAG_OPTIONS = ['커피가 맛있는', '디저트가 맛있는', '반려견 동반', '뷰 맛집', '인스타 감성', '조용한', '작업하기 좋은', '데이트 코스'];

function PostCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [region, setRegion] = useState('');
  const [tags, setTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setVideoPreview(null);
    setVideoFile(null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setImagePreview(null);
    setImageFile(null);
  };

  const handleRandomImage = async () => {
    setRandomLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 1000);
      const url = `https://picsum.photos/seed/${randomId}/600/600`;
      setImagePreview(url);
      setImageFile(null);
      setVideoPreview(null);
      setVideoFile(null);
    } finally {
      setRandomLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) { setError('제목을 입력해주세요.'); return; }
    if (!rating) { setError('별점을 선택해주세요.'); return; }

    setLoading(true);
    setError('');

    try {
      let imageUrl = null;
      let videoUrl = null;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('post-media')
          .upload(fileName, imageFile);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from('post-media').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      } else if (imagePreview && imagePreview.includes('picsum')) {
        imageUrl = imagePreview;
      }

      if (videoFile) {
        const ext = videoFile.name.split('.').pop();
        const fileName = `${user.id}/videos/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('post-media')
          .upload(fileName, videoFile);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from('post-media').getPublicUrl(fileName);
        videoUrl = data.publicUrl;
      }

      const { error: insertErr } = await supabase.from('posts').insert({
        title,
        content,
        user_id: user.id,
        image_url: imageUrl,
        video_url: videoUrl,
        rating,
        region: region || null,
        tags,
      });

      if (insertErr) throw insertErr;
      navigate('/');
    } catch (err) {
      setError(err.message || '게시물 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton onClick={() => navigate(-1)} edge="start" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ flexGrow: 1 }}>
            카페 리뷰 작성
          </Typography>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ borderRadius: 20 }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : '등록'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Stack spacing={3}>
          {/* 미디어 업로드 영역 */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              사진 / 동영상
            </Typography>

            {/* 미디어 프리뷰 */}
            <Box
              sx={{
                width: '100%',
                paddingTop: '100%',
                position: 'relative',
                bgcolor: 'grey.100',
                borderRadius: 3,
                overflow: 'hidden',
                border: '2px dashed',
                borderColor: imagePreview || videoPreview ? 'primary.main' : 'divider',
              }}
            >
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : videoPreview ? (
                <Box
                  component="video"
                  src={videoPreview}
                  controls
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="caption" color="text.disabled">사진 또는 동영상을 추가하세요</Typography>
                </Box>
              )}
              {(imagePreview || videoPreview) && (
                <IconButton
                  size="small"
                  onClick={() => { setImagePreview(null); setImageFile(null); setVideoPreview(null); setVideoFile(null); }}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* 업로드 버튼들 */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => fileInputRef.current?.click()}
                size="small"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                앨범에서 선택
              </Button>
              <Button
                variant="outlined"
                startIcon={<VideoCallIcon />}
                onClick={() => videoInputRef.current?.click()}
                size="small"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                동영상 선택
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={randomLoading ? <CircularProgress size={14} /> : <ShuffleIcon />}
                onClick={handleRandomImage}
                disabled={randomLoading}
                size="small"
                fullWidth
                sx={{ borderRadius: 2, color: 'primary.dark' }}
              >
                랜덤 이미지
              </Button>
            </Stack>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            <input type="file" ref={videoInputRef} accept="video/*" style={{ display: 'none' }} onChange={handleVideoChange} />
          </Box>

          {/* 제목 */}
          <TextField
            label="카페 이름 / 제목"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          {/* 내용 */}
          <TextField
            label="리뷰 내용"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="카페에 대한 솔직한 리뷰를 남겨주세요 ☕"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          {/* 별점 */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              별점 *
            </Typography>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v)}
              size="large"
              sx={{ color: 'primary.main' }}
            />
          </Box>

          {/* 지역 선택 */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              지역
            </Typography>
            <Grid container spacing={1}>
              {REGION_OPTIONS.map((r) => (
                <Grid item key={r}>
                  <Chip
                    label={r}
                    onClick={() => setRegion(region === r ? '' : r)}
                    color={region === r ? 'primary' : 'default'}
                    variant={region === r ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 20, cursor: 'pointer' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 태그 선택 */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              태그 (복수 선택 가능)
            </Typography>
            <Grid container spacing={1}>
              {TAG_OPTIONS.map((tag) => (
                <Grid item key={tag}>
                  <Chip
                    label={tag}
                    onClick={() => handleTagToggle(tag)}
                    color={tags.includes(tag) ? 'primary' : 'default'}
                    variant={tags.includes(tag) ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 20, cursor: 'pointer' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 3, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '게시물 등록'}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default PostCreatePage;

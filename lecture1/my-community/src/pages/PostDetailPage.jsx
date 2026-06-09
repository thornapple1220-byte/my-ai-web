import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Container, Typography, IconButton, Avatar, Stack,
  Chip, TextField, Button, Divider, CircularProgress,
  AppBar, Toolbar, Rating,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../utils/supabase';
import { formatDistanceToNow, formatDateTime } from '../utils/formatDate';

function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikeStatus();
  }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, users!user_id(nickname, id)')
      .eq('id', id)
      .single();
    setPost(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users!user_id(nickname)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data || []);

    if (data && user) {
      const commentIds = data.map((c) => c.id);
      if (commentIds.length > 0) {
        const { data: likes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds);
        const likedMap = {};
        (likes || []).forEach((l) => { likedMap[l.comment_id] = true; });
        setCommentLikes(likedMap);
      }
    }
  };

  const fetchLikeStatus = async () => {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id);
    setLikeCount(count || 0);

    if (user) {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from('post_likes').insert({ post_id: id, user_id: user.id });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user) return;
    if (commentLikes[commentId]) {
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id);
      setCommentLikes((prev) => ({ ...prev, [commentId]: false }));
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
      setCommentLikes((prev) => ({ ...prev, [commentId]: true }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    await supabase.from('comments').insert({ content: newComment.trim(), user_id: user.id, post_id: id });
    setNewComment('');
    await fetchComments();
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!post) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton onClick={() => navigate(-1)} edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ flexGrow: 1, ml: 1 }}>
            카페 리뷰
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 6 }}>
        {/* 작성자 프로필 */}
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', fontWeight: 700 }}>
            {post.users?.nickname?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={700}>{post.users?.nickname}</Typography>
            {post.region && (
              <Typography variant="caption" color="text.secondary">{post.region}</Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.disabled">{formatDistanceToNow(post.created_at)}</Typography>
        </Box>

        {/* 메인 미디어 (정사각형) */}
        <Box sx={{ width: '100%', paddingTop: '100%', position: 'relative', bgcolor: 'grey.100', borderRadius: 3, overflow: 'hidden' }}>
          {post.image_url ? (
            <Box
              component="img"
              src={post.image_url}
              alt={post.title}
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : post.video_url ? (
            <Box
              component="video"
              src={post.video_url}
              controls
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              bgcolor: 'secondary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="primary.main" fontWeight={700}>☕</Typography>
            </Box>
          )}
        </Box>

        {/* 좋아요 / 별점 */}
        <Box sx={{ py: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={handleLike} sx={{ color: liked ? 'primary.main' : 'text.disabled', p: 0.5 }}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" fontWeight={600}>{likeCount}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            {post.rating && <Rating value={post.rating} readOnly size="small" sx={{ color: 'primary.main' }} />}
          </Stack>

          {/* 제목 / 내용 */}
          <Typography variant="body1" fontWeight={700} sx={{ mt: 1 }}>{post.title}</Typography>
          {post.content && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
          )}

          {/* 태그 */}
          {post.tags?.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" color="primary"
                  sx={{ borderRadius: 20, fontSize: '0.7rem' }} />
              ))}
            </Stack>
          )}

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
            {formatDateTime(post.created_at)}
          </Typography>
        </Box>

        <Divider />

        {/* 댓글 목록 */}
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            댓글 {comments.length}개
          </Typography>

          {comments.length === 0 ? (
            <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ py: 3 }}>
              첫 댓글을 남겨보세요 💬
            </Typography>
          ) : (
            <Stack spacing={2}>
              {comments.map((comment) => (
                <Box key={comment.id}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'secondary.main', color: 'primary.dark' }}>
                      {comment.users?.nickname?.[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" fontWeight={700}>{comment.users?.nickname}</Typography>
                        <Typography variant="caption" color="text.disabled">{formatDistanceToNow(comment.created_at)}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>{comment.content}</Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleCommentLike(comment.id)}
                      sx={{ color: commentLikes[comment.id] ? 'primary.main' : 'text.disabled', p: 0.5 }}
                    >
                      {commentLikes[comment.id] ? <FavoriteIcon sx={{ fontSize: 14 }} /> : <FavoriteBorderIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        <Divider />

        {/* 댓글 작성 */}
        <Box sx={{ pt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.8rem' }}>
              {user?.user_metadata?.nickname?.[0]}
            </Avatar>
            <TextField
              variant="outlined"
              placeholder="댓글 달기..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmit(); } }}
              multiline
              maxRows={4}
              fullWidth
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton
              color="primary"
              onClick={handleCommentSubmit}
              disabled={submitting || !newComment.trim()}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'grey.200' } }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default PostDetailPage;

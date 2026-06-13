import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

function buildPostShape(postRow, commentsMap, likedSet) {
  return {
    id: postRow.id,
    userId: postRow.user_id,
    nickname: postRow.users?.nickname ?? '알 수 없음',
    profileImage:
      postRow.users?.profile_image_url ||
      `https://i.pravatar.cc/150?u=${postRow.user_id}`,
    location: postRow.location || '위치 없음',
    image: postRow.image_url || '',
    content: postRow.caption || postRow.content || '',
    hashtags: postRow.tags || [],
    createdAt: postRow.created_at,
    likes: postRow.likes_count ?? 0,
    liked: likedSet.has(postRow.id),
    comments: (commentsMap[postRow.id] || []).map(c => ({
      id: c.id,
      nickname: c.users?.nickname ?? '알 수 없음',
      profileImage:
        c.users?.profile_image_url ||
        `https://i.pravatar.cc/150?u=${c.user_id}`,
      text: c.content,
      createdAt: c.created_at,
    })),
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('travelstagram_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('travelstagram_guest') === 'true';
  });

  const loginAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('travelstagram_guest', 'true');
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLikedSet = useCallback(
    async (userId) => {
      if (!userId) return new Set();
      const { data } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId);
      return new Set((data || []).map(r => r.post_id));
    },
    []
  );

  const fetchPosts = useCallback(async (currentUserId) => {
    setLoading(true);
    try {
      const [{ data: postsData }, { data: commentsData }] = await Promise.all([
        supabase
          .from('posts')
          .select('*, users:user_id (nickname, profile_image_url)')
          .order('created_at', { ascending: false }),
        supabase
          .from('comments')
          .select('*, users:user_id (nickname, profile_image_url)')
          .order('created_at', { ascending: true }),
      ]);

      const likedSet = await getLikedSet(currentUserId);

      const commentsMap = {};
      for (const c of commentsData || []) {
        if (!commentsMap[c.post_id]) commentsMap[c.post_id] = [];
        commentsMap[c.post_id].push(c);
      }

      setPosts(
        (postsData || []).map(p => buildPostShape(p, commentsMap, likedSet))
      );
    } catch (err) {
      console.error('fetchPosts error:', err);
    } finally {
      setLoading(false);
    }
  }, [getLikedSet]);

  useEffect(() => {
    fetchPosts(user?.id ?? null);
  }, []);

  const login = async (username, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, nickname, profile_image_url')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }

    const userObj = {
      id: data.id,
      username: data.username,
      nickname: data.nickname,
      profileImage:
        data.profile_image_url || `https://i.pravatar.cc/150?u=${data.username}`,
      following: 0,
      followers: 0,
    };
    setUser(userObj);
    localStorage.setItem('travelstagram_user', JSON.stringify(userObj));

    await fetchPosts(data.id);
    return { success: true };
  };

  const signup = async (username, password, nickname) => {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return { success: false, message: '이미 사용 중인 아이디입니다.' };
    }

    const profileImage = `https://i.pravatar.cc/150?u=${username}_${Date.now()}`;

    const { data, error } = await supabase
      .from('users')
      .insert({ username, password, nickname, profile_image_url: profileImage })
      .select()
      .single();

    if (error || !data) {
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }

    const userObj = {
      id: data.id,
      username: data.username,
      nickname: data.nickname,
      profileImage,
      following: 0,
      followers: 0,
    };
    setUser(userObj);
    localStorage.setItem('travelstagram_user', JSON.stringify(userObj));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('travelstagram_user');
    localStorage.removeItem('travelstagram_guest');
    fetchPosts(null);
  };

  const addPost = async ({ image_url, caption, hashtags, location }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        caption,
        image_url,
        tags: hashtags,
        location,
        likes_count: 0,
      })
      .select('*, users:user_id (nickname, profile_image_url)')
      .single();

    if (error || !data) return;

    const newPost = buildPostShape(data, {}, new Set());
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = async (postId) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.liked;
    const newCount = isLiked ? post.likes - 1 : post.likes + 1;

    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, liked: !isLiked, likes: newCount } : p
      )
    );

    if (isLiked) {
      await Promise.all([
        supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id),
        supabase.from('posts').update({ likes_count: newCount }).eq('id', postId),
      ]);
    } else {
      await Promise.all([
        supabase.from('post_likes').insert({ post_id: postId, user_id: user.id }),
        supabase.from('posts').update({ likes_count: newCount }).eq('id', postId),
      ]);
    }
  };

  const addComment = async (postId, content) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content })
      .select('*, users:user_id (nickname, profile_image_url)')
      .single();

    if (error || !data) return;

    const comment = {
      id: data.id,
      nickname: data.users?.nickname ?? user.nickname,
      profileImage: data.users?.profile_image_url ?? user.profileImage,
      text: content,
      createdAt: data.created_at,
    };

    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  return (
    <AppContext.Provider
      value={{ user, isGuest, posts, loading, login, logout, signup, loginAsGuest, addPost, toggleLike, addComment, fetchPosts }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

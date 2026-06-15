import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Plus, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function CommunityPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nickname, avatar_url)')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function toggleLike(postId, liked) {
    if (!user) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
      await supabase.from('posts').update({ like_count: posts.find(p => p.id === postId).like_count - 1 }).eq('id', postId)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
      await supabase.from('posts').update({ like_count: posts.find(p => p.id === postId).like_count + 1 }).eq('id', postId)
    }
    fetchPosts()
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">커뮤니티</h2>
        <Link
          to="/community/write"
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-[0_0_10px_rgba(168,85,247,0.3)] transition"
        >
          <Plus className="w-4 h-4" />글쓰기
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>첫 번째 게시글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} currentUser={user} onLike={toggleLike} />
          ))}
        </div>
      )}
    </div>
  )
}

function PostCard({ post, currentUser, onLike }) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    supabase
      .from('likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', currentUser.id)
      .single()
      .then(({ data }) => setLiked(!!data))
  }, [post.id, currentUser])

  return (
    <div className="bg-[#13131f] rounded-2xl border border-purple-900/20 overflow-hidden">
      {/* 게시글 이미지 */}
      {post.image_urls?.[0] && (
        <Link to={`/community/post/${post.id}`}>
          <img src={post.image_urls[0]} alt="" className="w-full h-48 object-cover" />
        </Link>
      )}

      <div className="p-4">
        {/* 작성자 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-purple-900/60 flex items-center justify-center">
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-gray-400 text-sm">{post.profiles?.nickname || '익명'}</span>
          <span className="text-gray-600 text-xs ml-auto">{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
        </div>

        {/* 제목 & 내용 */}
        <Link to={`/community/post/${post.id}`}>
          <h3 className="text-white font-bold mb-1 hover:text-purple-300 transition">{post.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{post.content}</p>
        </Link>

        {/* 좋아요, 댓글 */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
          <button
            onClick={() => { setLiked(!liked); onLike(post.id, liked) }}
            className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-400'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500' : ''}`} />
            {post.like_count}
          </button>
          <Link
            to={`/community/post/${post.id}`}
            className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-purple-400"
          >
            <MessageCircle className="w-4 h-4" />
            {post.comment_count}
          </Link>
        </div>
      </div>
    </div>
  )
}

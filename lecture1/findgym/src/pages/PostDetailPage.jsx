import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Send, User, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    fetchComments()
    checkLiked()
  }, [id])

  async function fetchPost() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nickname)')
      .eq('id', id)
      .single()
    setPost(data)
    setLoading(false)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(nickname)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  async function checkLiked() {
    if (!user) return
    const { data } = await supabase.from('likes').select('id').eq('post_id', id).eq('user_id', user.id).single()
    setLiked(!!data)
  }

  async function toggleLike() {
    if (!user || !post) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id)
      await supabase.from('posts').update({ like_count: post.like_count - 1 }).eq('id', id)
      setPost(p => ({ ...p, like_count: p.like_count - 1 }))
    } else {
      await supabase.from('likes').insert({ post_id: id, user_id: user.id })
      await supabase.from('posts').update({ like_count: post.like_count + 1 }).eq('id', id)
      setPost(p => ({ ...p, like_count: p.like_count + 1 }))
    }
    setLiked(!liked)
  }

  async function submitComment(e) {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    await supabase.from('comments').insert({ post_id: id, user_id: user.id, content: commentText.trim() })
    await supabase.from('posts').update({ comment_count: post.comment_count + 1 }).eq('id', id)
    setCommentText('')
    setPost(p => ({ ...p, comment_count: p.comment_count + 1 }))
    fetchComments()
  }

  async function deleteComment(commentId) {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-5">
        <ArrowLeft className="w-5 h-5" />
      </button>

      {post && (
        <>
          {/* 작성자 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-900/60 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-200 text-sm font-semibold">{post.profiles?.nickname || '익명'}</p>
              <p className="text-gray-600 text-xs">{new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
            </div>
          </div>

          <h1 className="text-white text-xl font-black mb-4">{post.title}</h1>

          {post.image_urls?.[0] && (
            <img src={post.image_urls[0]} alt="" className="w-full rounded-2xl mb-4 h-auto" />
          )}

          <p className="text-gray-300 leading-relaxed mb-5">{post.content}</p>

          {/* 좋아요 */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-800 mb-6">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 font-semibold transition ${liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-400'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-pink-500' : ''}`} />
              좋아요 {post.like_count}
            </button>
            <span className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              댓글 {post.comment_count}
            </span>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-3 mb-6">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-purple-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="flex-1 bg-[#13131f] rounded-xl px-3 py-2.5 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm font-semibold">{c.profiles?.nickname || '익명'}</span>
                    {user?.id === c.user_id && (
                      <button onClick={() => deleteComment(c.id)} className="text-gray-600 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-600 py-4 text-sm">첫 댓글을 남겨보세요!</p>
            )}
          </div>

          {/* 댓글 입력 */}
          <form onSubmit={submitComment} className="flex gap-2 sticky bottom-20">
            <input
              type="text"
              placeholder="댓글 입력..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-[#13131f] border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </>
      )}
    </div>
  )
}

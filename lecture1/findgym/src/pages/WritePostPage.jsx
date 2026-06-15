import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function WritePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      image_urls: imageUrl ? [imageUrl] : [],
    })
    if (!error) navigate('/community')
    setLoading(false)
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white">게시글 작성</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full bg-[#13131f] border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
        />
        <textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={8}
          className="w-full bg-[#13131f] border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500 transition"
        />

        {/* 이미지 URL 입력 */}
        <div>
          <label className="text-gray-400 text-sm mb-1.5 flex items-center gap-1.5">
            <Image className="w-4 h-4" />이미지 URL (선택)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="flex-1 bg-[#13131f] border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition"
            />
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl('')} className="text-gray-500 hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {imageUrl && (
            <img src={imageUrl} alt="" className="mt-2 w-full h-48 object-cover rounded-xl" onError={() => setImageUrl('')} />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition disabled:opacity-50"
        >
          {loading ? '등록 중...' : '게시글 등록'}
        </button>
      </form>
    </div>
  )
}

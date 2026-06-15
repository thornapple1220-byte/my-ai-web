import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function WritePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('이미지는 5MB 이하만 업로드 가능해요')
      return
    }
    setUploadError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadImage() {
    if (!imageFile) return null
    const ext = imageFile.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setUploadError('')
    try {
      const imageUrl = await uploadImage()
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        image_urls: imageUrl ? [imageUrl] : [],
      })
      if (error) throw error
      navigate('/community')
    } catch (err) {
      setUploadError('업로드 중 오류가 발생했어요: ' + err.message)
    }
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

        {/* 이미지 업로드 */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="미리보기" className="w-full h-52 object-cover rounded-xl" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-purple-900/40 hover:border-purple-600/60 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-purple-400 transition"
            >
              <ImagePlus className="w-7 h-7" />
              <span className="text-sm">이미지 추가 (선택 · 5MB 이하)</span>
            </button>
          )}
          {uploadError && <p className="text-red-400 text-sm mt-2">{uploadError}</p>}
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

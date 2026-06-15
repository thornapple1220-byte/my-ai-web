import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Edit3, LogOut, Heart, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function MyPage() {
  const { profile, signOut, updateProfile, user } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({ nickname, avatar_url: avatarUrl || null })
    if (!error) { setEditMode(false); setMessage('프로필이 저장되었습니다!') }
    else setMessage('저장 실패: ' + error.message)
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="px-4 py-6">
      {/* 프로필 카드 */}
      <div className="bg-[#13131f] rounded-2xl border border-purple-900/30 p-6 mb-6">
        <div className="flex flex-col items-center">
          {/* 아바타 */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-900/50 border-2 border-purple-600 flex items-center justify-center">
              {(editMode ? avatarUrl : profile?.avatar_url) ? (
                <img
                  src={editMode ? avatarUrl : profile.avatar_url}
                  alt="프로필"
                  className="w-full h-full object-cover"
                  onError={e => e.target.style.display = 'none'}
                />
              ) : (
                <User className="w-12 h-12 text-purple-400" />
              )}
            </div>
            {editMode && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {editMode ? (
            <div className="w-full space-y-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 text-center"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">프로필 사진 URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 text-center"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setEditMode(false)}
                  className="py-2 rounded-xl text-gray-400 border border-gray-700 text-sm"
                >취소</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="py-2 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 text-sm transition disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-white text-xl font-black mb-0.5">{profile?.nickname}</h2>
              <p className="text-gray-600 text-sm">@{profile?.username}</p>
              {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 flex items-center gap-1.5 text-purple-400 text-sm font-semibold hover:text-purple-300 transition"
              >
                <Edit3 className="w-4 h-4" />프로필 편집
              </button>
            </>
          )}
        </div>
      </div>

      {/* 메뉴 */}
      <div className="bg-[#13131f] rounded-2xl border border-purple-900/20 overflow-hidden mb-4">
        <Link
          to="/reservations"
          className="flex items-center justify-between px-5 py-4 border-b border-gray-800/50 hover:bg-purple-900/10 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-gray-200 font-semibold">내 예약 목록</span>
          </div>
          <span className="text-gray-600">›</span>
        </Link>
      </div>

      {/* 로그아웃 */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-xl text-gray-500 border border-gray-800 hover:border-red-900/50 hover:text-red-400 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  )
}

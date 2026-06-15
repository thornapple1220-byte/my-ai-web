import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, enterGuestMode } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn({ username, password })
    if (error) setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    else navigate('/')
    setLoading(false)
  }

  function handleGuest() {
    enterGuestMode()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <Dumbbell className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            파인드짐
          </h1>
          <p className="text-xs text-gray-500">내 주변 운동 공간을 찾아봐</p>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition"
          />
        </div>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* 테스트 계정 안내 */}
      <div className="mt-6 w-full max-w-sm">
        <button
          type="button"
          onClick={() => { setUsername('test'); setPassword('test123') }}
          className="w-full bg-purple-900/20 border border-purple-800/40 rounded-xl px-4 py-3 text-left hover:bg-purple-900/30 transition"
        >
          <p className="text-purple-400 text-xs font-bold mb-1">🧪 테스트 계정</p>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-400">아이디 <span className="text-white font-semibold">test</span></span>
            <span className="text-gray-400">비밀번호 <span className="text-white font-semibold">test123</span></span>
          </div>
          <p className="text-gray-600 text-xs mt-1">클릭하면 자동 입력돼요</p>
        </button>
      </div>

      {/* 하단 버튼들 */}
      <div className="mt-3 w-full max-w-sm space-y-3">
        <button
          onClick={handleGuest}
          className="w-full py-3 rounded-xl font-semibold text-gray-400 border border-gray-700/50 hover:border-purple-700/50 hover:text-gray-200 transition"
        >
          둘러보기 (게스트)
        </button>
        <p className="text-center text-gray-600 text-sm">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

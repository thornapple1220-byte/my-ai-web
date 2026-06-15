import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', confirmPw: '', nickname: '' })
  const [usernameCheck, setUsernameCheck] = useState(null) // null | 'available' | 'taken'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, checkUsername } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'username') setUsernameCheck(null)
  }

  async function handleCheckUsername() {
    if (!form.username) return
    const taken = await checkUsername(form.username)
    setUsernameCheck(taken ? 'taken' : 'available')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (usernameCheck !== 'available') return setError('아이디 중복확인을 해주세요.')
    if (form.password !== form.confirmPw) return setError('비밀번호가 일치하지 않습니다.')
    if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.')
    setLoading(true)
    const { error } = await signUp({ username: form.username, password: form.password, nickname: form.nickname })
    if (error) setError(error.message)
    else navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-3 mb-8">
        <Dumbbell className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          회원가입
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {/* 아이디 + 중복확인 */}
        <div className="flex gap-2">
          <input
            name="username"
            type="text"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            required
            className="flex-1 bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="button"
            onClick={handleCheckUsername}
            className="px-4 py-3 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-300 text-sm font-semibold hover:bg-purple-800/40 transition whitespace-nowrap"
          >
            중복확인
          </button>
        </div>
        {usernameCheck === 'available' && (
          <p className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> 사용 가능한 아이디입니다
          </p>
        )}
        {usernameCheck === 'taken' && (
          <p className="flex items-center gap-1 text-red-400 text-sm">
            <XCircle className="w-4 h-4" /> 이미 사용 중인 아이디입니다
          </p>
        )}

        <input
          name="nickname"
          type="text"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          required
          className="w-full bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
        />
        <input
          name="confirmPw"
          type="password"
          placeholder="비밀번호 확인"
          value={form.confirmPw}
          onChange={handleChange}
          required
          className="w-full bg-[#13131f] border border-purple-900/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition disabled:opacity-50"
        >
          {loading ? '가입 중...' : '가입하기'}
        </button>
      </form>

      <p className="mt-6 text-gray-600 text-sm">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">로그인</Link>
      </p>
    </div>
  )
}

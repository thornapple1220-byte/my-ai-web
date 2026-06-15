import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dumbbell, Home, Users, Calendar, User, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', icon: Home, label: '홈' },
  { path: '/community', icon: Users, label: '커뮤니티' },
  { path: '/reservations', icon: Calendar, label: '예약' },
  { path: '/mypage', icon: User, label: '마이페이지' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()

  if (!user && !isGuest) return null

  function handleGuestNav(path) {
    // 게스트는 예약·마이페이지 접근 시 로그인 페이지로
    if (isGuest && (path === '/reservations' || path === '/mypage')) {
      navigate('/login')
      return
    }
    navigate(path)
  }

  return (
    <>
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-900/40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              파인드짐
            </span>
          </Link>
          {isGuest && (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm text-purple-400 border border-purple-700/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/30 transition"
            >
              <LogIn className="w-4 h-4" />로그인
            </Link>
          )}
        </div>
      </header>

      {/* 하단 탭 바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/95 backdrop-blur-md border-t border-purple-900/40">
        <div className="max-w-lg mx-auto flex">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            const guestLocked = isGuest && (path === '/reservations' || path === '/mypage')
            return (
              <button
                key={path}
                onClick={() => handleGuestNav(path)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                  active ? 'text-purple-400' : guestLocked ? 'text-gray-700' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

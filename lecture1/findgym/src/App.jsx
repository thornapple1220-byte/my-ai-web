import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import GymDetailPage from './pages/GymDetailPage'
import CommunityPage from './pages/CommunityPage'
import PostDetailPage from './pages/PostDetailPage'
import WritePostPage from './pages/WritePostPage'
import ReservationsPage from './pages/ReservationsPage'
import MyPage from './pages/MyPage'

// 로그인 또는 게스트 모두 접근 가능
function BrowseRoute({ children }) {
  const { user, isGuest, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return (user || isGuest) ? children : <Navigate to="/login" replace />
}

// 로그인한 사용자만 접근 가능 (예약, 마이페이지 등)
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

function AppRoutes() {
  const { user, isGuest } = useAuth()
  const showNav = user || isGuest
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {showNav && <Navbar />}
      <main className={showNav ? 'pt-14 pb-16' : ''}>
        <div className="max-w-lg mx-auto">
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<BrowseRoute><HomePage /></BrowseRoute>} />
            <Route path="/gym/:id" element={<BrowseRoute><GymDetailPage /></BrowseRoute>} />
            <Route path="/community" element={<BrowseRoute><CommunityPage /></BrowseRoute>} />
            <Route path="/community/post/:id" element={<BrowseRoute><PostDetailPage /></BrowseRoute>} />
            <Route path="/community/write" element={<PrivateRoute><WritePostPage /></PrivateRoute>} />
            <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
            <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

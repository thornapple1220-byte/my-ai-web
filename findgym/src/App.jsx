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
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {user && <Navbar />}
      <main className={user ? 'pt-14 pb-16' : ''}>
        <div className="max-w-lg mx-auto">
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/gym/:id" element={<PrivateRoute><GymDetailPage /></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
            <Route path="/community/post/:id" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
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
    <BrowserRouter basename="/findgym">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

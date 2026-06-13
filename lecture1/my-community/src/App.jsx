import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostListPage from './pages/PostListPage';
import PostCreatePage from './pages/PostCreatePage';
import PostDetailPage from './pages/PostDetailPage';
import MyPage from './pages/MyPage';
import { CircularProgress, Box } from '@mui/material';

function GuestOrUserRoute({ children }) {
  const { user, loading, isGuest } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (user || isGuest) ? children : <Navigate to="/login" replace />;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading, isGuest } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (user || isGuest) ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<GuestOrUserRoute><PostListPage /></GuestOrUserRoute>} />
        <Route path="/posts/new" element={<PrivateRoute><PostCreatePage /></PrivateRoute>} />
        <Route path="/posts/:id" element={<GuestOrUserRoute><PostDetailPage /></GuestOrUserRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

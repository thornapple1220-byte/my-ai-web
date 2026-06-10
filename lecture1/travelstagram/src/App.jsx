import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './store/AppContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import MyPage from './pages/MyPage';
import MeetupPage from './pages/MeetupPage';
import ChatPage from './pages/ChatPage';
import ChatRoomPage from './pages/ChatRoomPage';
import MainLayout from './components/layout/MainLayout';

function PrivateRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        {/* 비인증 페이지 */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignupPage />}
        />

        {/* 인증 필요 페이지 - 레이아웃 포함 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/meetup"
          element={
            <PrivateRoute>
              <MainLayout>
                <MeetupPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 전체화면 페이지 (레이아웃 없음) */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <ChatRoomPage />
            </PrivateRoute>
          }
        />

        {/* 기타 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

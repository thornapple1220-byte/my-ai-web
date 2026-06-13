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
  const { user, isGuest } = useApp();
  return (user || isGuest) ? children : <Navigate to="/login" replace />;
}

function LoginRequiredRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user, isGuest } = useApp();

  return (
    <BrowserRouter basename="/my-ai-web">
      <Routes>
        {/* 비인증 페이지 */}
        <Route
          path="/login"
          element={(user || isGuest) ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignupPage />}
        />

        {/* 게스트도 접근 가능한 페이지 */}
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

        {/* 로그인 필수 페이지 */}
        <Route
          path="/chat"
          element={
            <LoginRequiredRoute>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </LoginRequiredRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <LoginRequiredRoute>
              <MainLayout>
                <MyPage />
              </MainLayout>
            </LoginRequiredRoute>
          }
        />

        {/* 전체화면 페이지 (로그인 필수) */}
        <Route
          path="/create"
          element={
            <LoginRequiredRoute>
              <CreatePostPage />
            </LoginRequiredRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <LoginRequiredRoute>
              <ChatRoomPage />
            </LoginRequiredRoute>
          }
        />

        {/* 기타 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

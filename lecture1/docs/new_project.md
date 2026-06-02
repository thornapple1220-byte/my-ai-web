# New Project Guide

## 새 프로젝트 시작하기

### 1. 템플릿 복사
`_template_settings` 디렉토리를 복사하여 새 프로젝트를 시작합니다.

```bash
# lecture1 디렉토리에서
cp -r _template_settings my-new-project
cd my-new-project
```

Windows PowerShell:
```powershell
Copy-Item -Path "_template_settings" -Destination "my-new-project" -Recurse
Set-Location "my-new-project"
```

---

### 2. package.json 프로젝트명 변경
```json
{
  "name": "my-new-project",
  ...
}
```

---

### 3. 의존성 재설치
```bash
npm install
```

---

### 4. 기본 디렉토리 구조 생성
```bash
mkdir src/components
mkdir src/components/common
mkdir src/components/layout
mkdir src/pages
mkdir src/hooks
mkdir src/utils
mkdir src/constants
```

Windows PowerShell:
```powershell
New-Item -ItemType Directory src/components/common, src/components/layout, src/pages, src/hooks, src/utils, src/constants -Force
```

---

### 5. App.jsx 라우터 설정

`src/App.jsx`를 다음과 같이 교체:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### 6. 첫 페이지 생성

`src/pages/HomePage.jsx` 생성:
```jsx
import { Box, Typography, Container } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom>
          홈 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary">
          새 프로젝트가 시작되었습니다.
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;
```

---

### 7. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

---

## 자주 쓰는 컴포넌트 패턴

### 레이아웃 컴포넌트
`src/components/layout/PageLayout.jsx`:
```jsx
import { Box, Container } from '@mui/material';

function PageLayout({ children, maxWidth = 'lg' }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default PageLayout;
```

### 로딩 스피너
```jsx
import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );
}
```

### 에러 메시지
```jsx
import { Alert } from '@mui/material';

function ErrorMessage({ message }) {
  if (!message) return null;
  return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>;
}
```

---

## 상태 관리 패턴

### Context API (전역 상태)
`src/store/AuthContext.jsx`:
```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

`src/main.jsx`에 AuthProvider 추가:
```jsx
import { AuthProvider } from './store/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
```

---

## 자주 쓰는 유틸리티 함수

`src/utils/formatDate.js`:
```js
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR');
}
```

`src/utils/validators.js`:
```js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^01[0-9]-\d{3,4}-\d{4}$/.test(phone);
}
```

---

## 빌드 & 배포

### 프로덕션 빌드
```bash
npm run build
# dist/ 폴더에 빌드 결과물 생성
```

### 빌드 미리보기
```bash
npm run preview
```

### Vercel 배포 (권장)
1. [vercel.com](https://vercel.com) 가입
2. GitHub 저장소 연결
3. 자동 배포 설정

### Netlify 배포
1. [netlify.com](https://netlify.com) 가입
2. `dist/` 폴더 드래그 앤 드롭 또는 GitHub 연결

---

## 체크리스트

새 프로젝트 시작 전 확인:
- [ ] `_template_settings` 복사 완료
- [ ] `package.json` name 변경
- [ ] `npm install` 실행
- [ ] 디렉토리 구조 생성
- [ ] `App.jsx` 라우터 설정
- [ ] 첫 페이지 생성
- [ ] 개발 서버 정상 실행 확인
- [ ] 테마 색상이 적용되는지 확인

# Code Convention

## 파일 & 디렉토리 구조

### 디렉토리 구조
```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 가능한 공통 컴포넌트
│   ├── common/      # 버튼, 입력창 등 기본 UI
│   └── layout/      # Header, Footer, Sidebar 등 레이아웃
├── pages/           # 라우트별 페이지 컴포넌트
├── hooks/           # 커스텀 훅
├── store/           # 상태 관리 (Context, Zustand 등)
├── utils/           # 유틸리티 함수
├── constants/       # 상수 정의
├── theme.js         # MUI 테마 설정
├── App.jsx          # 앱 루트, 라우터 설정
└── main.jsx         # 진입점
```

### 파일 명명 규칙
| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `UserCard.jsx` |
| 훅 파일 | camelCase, use 접두어 | `useAuth.js` |
| 유틸리티 파일 | camelCase | `formatDate.js` |
| 상수 파일 | camelCase | `apiEndpoints.js` |
| 페이지 파일 | PascalCase + Page | `HomePage.jsx` |

---

## 컴포넌트 작성 규칙

### 기본 구조
```jsx
// 1. import 순서: React → 외부 라이브러리 → 내부 모듈
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';
import { formatDate } from '../utils/formatDate';

// 2. 컴포넌트 이름은 PascalCase
function UserProfile({ userId, onUpdate }) {
  // 3. state는 최상단
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 4. hooks
  const navigate = useNavigate();

  // 5. 이펙트
  useEffect(() => {
    // 로직
  }, [userId]);

  // 6. 이벤트 핸들러 (handle 접두어)
  const handleUpdate = () => {
    onUpdate(user);
  };

  // 7. 조기 반환 (early return)
  if (loading) return <CircularProgress />;
  if (!user) return null;

  // 8. JSX 반환
  return (
    <Box>
      <Typography variant="h5">{user.name}</Typography>
      <Button onClick={handleUpdate}>수정</Button>
    </Box>
  );
}

export default UserProfile;
```

### Props 규칙
```jsx
// Props는 구조분해할당으로 받기
function Card({ title, description, onClick, disabled = false }) {
  return (/* ... */);
}

// 이벤트 핸들러 props는 on 접두어
<Card
  title="제목"
  onClick={handleClick}
  onDelete={handleDelete}
/>
```

### 조건부 렌더링
```jsx
// 단순 조건: && 사용
{isLoggedIn && <UserMenu />}

// 값이 있을 때: 옵셔널 체이닝
{user?.name && <Typography>{user.name}</Typography>}

// 두 가지 경우: 삼항 연산자
{isLoading ? <CircularProgress /> : <Content />}

// 복잡한 조건: 변수로 추출
const content = isLoading ? <CircularProgress /> : <Content />;
return <Box>{content}</Box>;
```

---

## MUI 사용 규칙

### sx prop 우선 사용
```jsx
// 좋음: sx prop으로 스타일링
<Box sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
  <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
    제목
  </Typography>
</Box>

// 피할 것: 인라인 style 객체
<Box style={{ padding: '16px', marginBottom: '24px' }}>
```

### 테마 값 참조
```jsx
// 좋음: 테마 토큰 사용
sx={{ color: 'primary.main', bgcolor: 'background.paper' }}

// 피할 것: 하드코딩된 색상값
sx={{ color: '#1976d2', bgcolor: '#ffffff' }}
```

### 반응형 스타일
```jsx
// breakpoint 객체 문법 사용
sx={{
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 1, md: 2 },
}}
```

---

## 라우팅 규칙

### App.jsx 라우터 구조
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 페이지 이동
```jsx
// 링크 컴포넌트 사용
import { Link } from 'react-router-dom';
<Link to="/about">소개</Link>

// 프로그래밍 방식 이동
const navigate = useNavigate();
navigate('/home');
navigate(-1); // 뒤로가기

// URL 파라미터 읽기
const { id } = useParams();

// 쿼리 스트링
const [searchParams] = useSearchParams();
const keyword = searchParams.get('q');
```

---

## 커스텀 훅 규칙

```jsx
// hooks/useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
```

---

## 상수 관리

```jsx
// constants/routes.js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
};

// constants/messages.js
export const MESSAGES = {
  SAVE_SUCCESS: '저장되었습니다.',
  DELETE_CONFIRM: '정말 삭제하시겠습니까?',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
};
```

---

## 네이밍 규칙 요약

| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserCard`, `NavBar` |
| 변수/함수 | camelCase | `userName`, `getData` |
| 이벤트 핸들러 | handle + 동작 | `handleClick`, `handleSubmit` |
| 이벤트 Props | on + 동작 | `onClick`, `onSubmit` |
| 불리언 변수 | is/has/can 접두어 | `isLoading`, `hasError` |
| 상수 | UPPER_SNAKE_CASE | `MAX_COUNT`, `API_URL` |
| 커스텀 훅 | use 접두어 | `useAuth`, `useFetch` |
| CSS 클래스 | kebab-case (비MUI) | `user-card`, `nav-bar` |

---

## import 순서

```jsx
// 1. React 및 내장 훅
import React, { useState, useEffect, useCallback } from 'react';

// 2. 라우팅
import { useNavigate, useParams } from 'react-router-dom';

// 3. MUI 컴포넌트
import { Box, Typography, Button, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

// 4. 외부 라이브러리
import axios from 'axios';

// 5. 내부 컴포넌트
import Header from '../components/layout/Header';
import UserCard from '../components/common/UserCard';

// 6. 훅, 유틸, 상수
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';
import { ROUTES } from '../constants/routes';
```

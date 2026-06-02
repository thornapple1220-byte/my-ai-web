# Design System

## 색상 시스템 (Color System)

### Primary Colors
| 이름 | 값 | 용도 |
|------|-----|------|
| primary.main | `#1976d2` | 주요 버튼, 링크, 강조 요소 |
| primary.light | `#42a5f5` | hover 상태, 배경 강조 |
| primary.dark | `#1565c0` | active 상태, 진한 강조 |
| primary.contrastText | `#ffffff` | primary 배경 위 텍스트 |

### Secondary Colors
| 이름 | 값 | 용도 |
|------|-----|------|
| secondary.main | `#dc004e` | 보조 액션, 태그, 뱃지 |
| secondary.light | `#ff5983` | hover 상태 |
| secondary.dark | `#9a0036` | active 상태 |
| secondary.contrastText | `#ffffff` | secondary 배경 위 텍스트 |

### Neutral Colors
| 이름 | 값 | 용도 |
|------|-----|------|
| text.primary | `#212121` | 본문 텍스트 |
| text.secondary | `#757575` | 보조 텍스트, 설명 |
| text.disabled | `#bdbdbd` | 비활성화 텍스트 |
| background.default | `#fafafa` | 페이지 기본 배경 |
| background.paper | `#ffffff` | 카드, 모달 배경 |
| divider | `rgba(0,0,0,0.12)` | 구분선 |

### 상태 색상
| 이름 | 값 | 용도 |
|------|-----|------|
| error.main | `#d32f2f` | 에러, 유효성 실패 |
| warning.main | `#ed6c02` | 경고, 주의 |
| info.main | `#0288d1` | 정보, 알림 |
| success.main | `#2e7d32` | 성공, 완료 |

---

## 타이포그래피 (Typography)

### 폰트
- **기본 폰트**: Roboto (`@fontsource/roboto`)
- **폴백**: Helvetica, Arial, sans-serif

### 타이포그래피 스케일
| variant | fontSize | fontWeight | 용도 |
|---------|----------|------------|------|
| h1 | 2.125rem (34px) | 500 | 페이지 제목 |
| h2 | 1.5rem (24px) | 500 | 섹션 제목 |
| h3 | 1.25rem (20px) | 500 | 서브 섹션 제목 |
| h4 | 1.125rem (18px) | 500 | 카드 제목 |
| h5 | 1rem (16px) | 500 | 소제목 |
| h6 | 0.875rem (14px) | 500 | 작은 제목 |
| body1 | 1rem (16px) | 400 | 본문 기본 |
| body2 | 0.875rem (14px) | 400 | 본문 보조 |
| caption | 0.75rem (12px) | 400 | 캡션, 메모 |
| button | 0.875rem (14px) | 500 | 버튼 텍스트 |

---

## 간격 시스템 (Spacing)

기본 단위: **8px** (`theme.spacing(1) = 8px`)

| spacing | px | 사용 예 |
|---------|-----|--------|
| 0.5 | 4px | 아이콘-텍스트 간격 |
| 1 | 8px | 기본 내부 여백 |
| 2 | 16px | 컴포넌트 내부 패딩 |
| 3 | 24px | 섹션 내 요소 간격 |
| 4 | 32px | 카드 패딩 |
| 6 | 48px | 섹션 간격 |
| 8 | 64px | 큰 섹션 간격 |

---

## 컴포넌트 가이드

### Button
```jsx
// Primary 액션
<Button variant="contained" color="primary">저장</Button>

// Secondary 액션
<Button variant="outlined" color="primary">취소</Button>

// 위험 액션
<Button variant="contained" color="error">삭제</Button>

// 텍스트 버튼
<Button variant="text">더 보기</Button>

// 아이콘 포함
<Button variant="contained" startIcon={<SaveIcon />}>저장</Button>
```

### TextField
```jsx
// 기본
<TextField label="이름" variant="outlined" fullWidth />

// 필수 입력
<TextField label="이메일" required variant="outlined" />

// 에러 상태
<TextField label="비밀번호" error helperText="비밀번호를 입력하세요" />
```

### Card
```jsx
<Card sx={{ p: 2, borderRadius: 2 }}>
  <CardContent>
    <Typography variant="h5" gutterBottom>카드 제목</Typography>
    <Typography variant="body2" color="text.secondary">카드 내용</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">자세히 보기</Button>
  </CardActions>
</Card>
```

### Grid 레이아웃
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* 컨텐츠 */}
  </Grid>
</Grid>
```

### Stack (간격 정렬)
```jsx
// 수직 스택
<Stack spacing={2}>
  <item1 />
  <item2 />
</Stack>

// 수평 스택
<Stack direction="row" spacing={1} alignItems="center">
  <Icon />
  <Typography>텍스트</Typography>
</Stack>
```

---

## 반응형 브레이크포인트

| 이름 | 최소 너비 | 대상 디바이스 |
|------|----------|-------------|
| xs | 0px | 모바일 (세로) |
| sm | 600px | 모바일 (가로), 태블릿 |
| md | 900px | 태블릿 (가로), 소형 노트북 |
| lg | 1200px | 데스크탑 |
| xl | 1536px | 대형 화면 |

```jsx
// sx prop 반응형 예시
<Box sx={{
  width: { xs: '100%', sm: '50%', md: '33%' },
  fontSize: { xs: '0.875rem', md: '1rem' },
  display: { xs: 'none', md: 'block' },
}} />
```

---

## 그림자 (Elevation)

MUI 기본 elevation 시스템 사용:
- `elevation={0}`: 그림자 없음 (테두리로 구분)
- `elevation={1}`: 기본 카드
- `elevation={4}`: 드롭다운, 팝오버
- `elevation={8}`: 다이얼로그, 모달
- `elevation={16}`: 드로어

---

## 아이콘 사용 규칙

```jsx
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

// 크기 조절
<SaveIcon fontSize="small" />   // 20px
<SaveIcon fontSize="medium" />  // 24px (기본)
<SaveIcon fontSize="large" />   // 35px

// 색상
<DeleteIcon color="error" />
<SaveIcon color="primary" />
```

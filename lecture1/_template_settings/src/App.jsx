import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Grid, Card, CardContent, Stack, Chip, IconButton,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import SpeedIcon from '@mui/icons-material/Speed';
import GitHubIcon from '@mui/icons-material/GitHub';

const features = [
  {
    icon: <RocketLaunchIcon fontSize="large" color="primary" />,
    title: '빠른 개발',
    desc: 'Vite 기반의 HMR로 저장 즉시 브라우저에 반영됩니다. 개발 생산성을 극대화하세요.',
  },
  {
    icon: <BrushIcon fontSize="large" color="secondary" />,
    title: '아름다운 UI',
    desc: 'Material UI 컴포넌트로 일관된 디자인 시스템을 손쉽게 구축할 수 있습니다.',
  },
  {
    icon: <CodeIcon fontSize="large" sx={{ color: 'success.main' }} />,
    title: '깔끔한 코드',
    desc: '코드 컨벤션과 디렉토리 구조 가이드로 유지보수하기 좋은 코드를 작성하세요.',
  },
  {
    icon: <SpeedIcon fontSize="large" sx={{ color: 'warning.main' }} />,
    title: '최적화된 성능',
    desc: '프로덕션 빌드 시 자동으로 코드 스플리팅과 트리쉐이킹이 적용됩니다.',
  },
];

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* 네비게이션 바 */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <RocketLaunchIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            MyApp
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit">소개</Button>
            <Button color="inherit">기능</Button>
            <Button color="inherit">문서</Button>
            <Button variant="outlined" color="inherit" size="small">
              시작하기
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 히어로 섹션 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="v1.0 출시"
            size="small"
            sx={{ mb: 3, bgcolor: 'primary.light', color: 'white' }}
          />
          <Typography variant="h2" fontWeight={700} gutterBottom>
            React + MUI로 <br />빠르게 시작하세요
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 5 }}>
            Vite, React Router, Material UI가 모두 세팅된 템플릿으로
            <br />
            아이디어를 바로 코드로 옮겨보세요.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" color="secondary" size="large" startIcon={<RocketLaunchIcon />}>
              지금 시작하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)' }}
            >
              GitHub
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 기능 카드 섹션 */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          주요 기능
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          개발에 필요한 모든 것이 준비되어 있습니다.
        </Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 1,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA 섹션 */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            지금 바로 시작해보세요
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            템플릿을 복사하고 나만의 프로젝트를 만들어보세요.
          </Typography>
          <Button variant="contained" size="large" startIcon={<RocketLaunchIcon />}>
            무료로 시작하기
          </Button>
        </Container>
      </Box>

      {/* 푸터 */}
      <Box
        component="footer"
        sx={{ mt: 'auto', py: 3, bgcolor: 'grey.900', color: 'grey.400', textAlign: 'center' }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <RocketLaunchIcon fontSize="small" />
          <Typography variant="body2">
            © 2026 MyApp. React + MUI 템플릿으로 제작.
          </Typography>
          <IconButton size="small" sx={{ color: 'grey.400' }}>
            <GitHubIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

    </Box>
  );
}

export default App;

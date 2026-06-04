import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material';

const cards = [
  {
    id: 1,
    title: 'React',
    description: '컴포넌트 기반의 UI 라이브러리. Facebook에서 개발하였으며 빠른 렌더링이 특징입니다.',
    image: 'https://picsum.photos/seed/react/400/200',
  },
  {
    id: 2,
    title: 'TypeScript',
    description: 'JavaScript의 슈퍼셋 언어로 정적 타입을 지원하여 안정적인 코드 작성이 가능합니다.',
    image: 'https://picsum.photos/seed/typescript/400/200',
  },
  {
    id: 3,
    title: 'MUI',
    description: 'Google Material Design을 기반으로 한 React UI 컴포넌트 라이브러리입니다.',
    image: 'https://picsum.photos/seed/mui/400/200',
  },
];

function CardSection() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Card 섹션
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="160"
                image={card.image}
                alt={card.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained">자세히 보기</Button>
                <Button size="small" variant="outlined">공유</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CardSection;

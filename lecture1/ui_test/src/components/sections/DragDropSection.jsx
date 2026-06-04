import { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

const initialItems = [
  { id: 1, label: 'React' },
  { id: 2, label: 'TypeScript' },
  { id: 3, label: 'MUI' },
  { id: 4, label: 'Vite' },
  { id: 5, label: 'Node.js' },
];

function DragDropSection() {
  const [sourceItems, setSourceItems] = useState(initialItems);
  const [droppedItems, setDroppedItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDropToTarget = (e) => {
    e.preventDefault();
    const item = sourceItems.find((i) => i.id === draggingId);
    if (item) {
      setSourceItems((prev) => prev.filter((i) => i.id !== draggingId));
      setDroppedItems((prev) => [...prev, item]);
    }
    setDraggingId(null);
  };

  const handleDropToSource = (e) => {
    e.preventDefault();
    const item = droppedItems.find((i) => i.id === draggingId);
    if (item) {
      setDroppedItems((prev) => prev.filter((i) => i.id !== draggingId));
      setSourceItems((prev) => [...prev, item]);
    }
    setDraggingId(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Drag & Drop 섹션
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        아이템을 드래그하여 오른쪽 드롭 영역으로 이동하세요.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* 소스 영역 */}
        <Paper
          onDragOver={handleDragOver}
          onDrop={handleDropToSource}
          sx={{
            flex: 1,
            minWidth: 200,
            minHeight: 160,
            p: 2,
            bgcolor: 'background.paper',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            아이템 목록
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {sourceItems.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                color="primary"
                sx={{ cursor: 'grab', opacity: draggingId === item.id ? 0.4 : 1 }}
              />
            ))}
            {sourceItems.length === 0 && (
              <Typography variant="body2" color="text.disabled">
                모든 아이템이 이동됐습니다.
              </Typography>
            )}
          </Box>
        </Paper>

        {/* 드롭 영역 */}
        <Paper
          onDragOver={handleDragOver}
          onDrop={handleDropToTarget}
          sx={{
            flex: 1,
            minWidth: 200,
            minHeight: 160,
            p: 2,
            bgcolor: 'primary.main',
            opacity: 0.9,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.contrastText' }}>
            드롭 영역
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {droppedItems.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                sx={{
                  cursor: 'grab',
                  bgcolor: 'white',
                  opacity: draggingId === item.id ? 0.4 : 1,
                }}
              />
            ))}
            {droppedItems.length === 0 && (
              <Typography variant="body2" sx={{ color: 'primary.contrastText', opacity: 0.7 }}>
                여기에 드롭하세요.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default DragDropSection;

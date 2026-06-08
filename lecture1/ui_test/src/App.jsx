import { Box } from '@mui/material';
import NavigationSection from './components/sections/NavigationSection';
import FlexNavigationSection from './components/sections/FlexNavigationSection';
import ButtonSection from './components/sections/ButtonSection';
import InputSection from './components/sections/InputSection';
import DropdownSection from './components/sections/DropdownSection';
import CheckboxSection from './components/sections/CheckboxSection';
import RadioSection from './components/sections/RadioSection';
import SliderSection from './components/sections/SliderSection';
import ModalSection from './components/sections/ModalSection';
import CardSection from './components/sections/CardSection';
import DragDropSection from './components/sections/DragDropSection';
import ScrollSection from './components/sections/ScrollSection';
import AnimationSection from './components/sections/AnimationSection';
import MenuSection from './components/sections/MenuSection';
import SidebarSection from './components/sections/SidebarSection';
import HoverSection from './components/sections/HoverSection';
import SwipeSection from './components/sections/SwipeSection';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavigationSection />
      <FlexNavigationSection />
      <ButtonSection />
      <InputSection />
      <DropdownSection />
      <CheckboxSection />
      <RadioSection />
      <SliderSection />
      <ModalSection />
      <CardSection />
      <DragDropSection />
      <ScrollSection />
      <AnimationSection />
      <MenuSection />
      <SidebarSection />
      <HoverSection />
      <SwipeSection />
    </Box>
  );
}

export default App;

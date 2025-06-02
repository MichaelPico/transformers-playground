import DashboardIcon from '@mui/icons-material/Dashboard';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CategoryIcon from '@mui/icons-material/Category';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    segment: '',
  },
  {
    segment: 'name-entity-recognition',
    title: 'Name Entity Recognition',
    icon: <PsychologyIcon />,
  },
  {
    segment: 'sentence-similarity',
    title: 'Sentence Similarity',
    icon: <CompareArrowsIcon />,
  },
  {
    segment: 'zero-shoot-classification',
    title: 'Text Classification',
    icon: <CategoryIcon />,
  },
];

const BRANDING = {
  title: ' Transformers Playground',
  logo: <img src="/transformers-playground/src/assets/MP.svg" alt="Michael Pico Logo" width="32" height="32" />,
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
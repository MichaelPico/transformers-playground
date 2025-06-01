import DashboardIcon from '@mui/icons-material/Dashboard';
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
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
  },
  {
    segment: 'ner',
    title: 'Name Entity Recognition',
    icon: <SafetyDividerIcon />,
  },
];

const BRANDING = {
  title: 'Michael Pico | Transformers Playground',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
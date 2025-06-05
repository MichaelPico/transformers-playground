import DashboardIcon from '@mui/icons-material/Dashboard';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CategoryIcon from '@mui/icons-material/Category';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import { useTranslation } from 'react-i18next';
import './i18n';
import type { ReactElement } from 'react';
import Logo from "./assets/MP.svg"

interface Branding {
  title: string;
  logo: ReactElement;
}

const BRANDING: Branding = {
  title: 'Transformers Playground',
  logo: <img src={Logo} alt="Michael Pico Logo" width="32" height="32" />,
};

export default function App() {
  const { t } = useTranslation();

  const NAVIGATION: Navigation = [
    {
      kind: 'header',
      title: t('nav.mainItems'),
    },
    {
      title: t('nav.dashboard'),
      icon: <DashboardIcon />,
      segment: '',
    },
    {
      segment: 'name-entity-recognition',
      title: t('nav.ner'),
      icon: <PsychologyIcon />,
    },
    {
      segment: 'sentence-similarity',
      title: t('nav.similarity'),
      icon: <CompareArrowsIcon />,
    },
    {
      segment: 'zero-shoot-classification',
      title: t('nav.classification'),
      icon: <CategoryIcon />,
    },
    {
      segment: 'summarization',
      title: t('nav.summarization'),
      icon: <SummarizeIcon />,
    },
  ];

  BRANDING.title = t('app.title');

  return (
    <ReactRouterAppProvider 
      navigation={NAVIGATION} 
      branding={BRANDING}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
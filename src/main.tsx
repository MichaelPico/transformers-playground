import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import NerPage from './pages/nameEntityRecognition';
import SentenceSimilarityPage from './pages/sentenceSimilarity';
import ZeroShotClassificationPage from './pages/zeroShotClassification';
import SummarizationPage from './pages/summarization';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'name-entity-recognition',
            Component: NerPage,
          },
          {
            path: 'sentence-similarity',
            Component: SentenceSimilarityPage,
          },
          {
            path: 'zero-shoot-classification',
            Component: ZeroShotClassificationPage,
          },
          {
            path: 'summarization',
            Component: SummarizationPage,
          },
        ],
      },
    ],
  },
], {
  basename: '/transformers-playground'
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
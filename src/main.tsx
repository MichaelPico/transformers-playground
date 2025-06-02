import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import NerPage from './pages/nameEntityRecognition';
import SentenceSimilarityPage from './pages/sentenceSimilarity';

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
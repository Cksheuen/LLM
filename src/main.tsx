import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import 'virtual:uno.css';
import router from './routers';
import './i18n';
import LoadingAnimation from './components/LoadingAnimation';

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<LoadingAnimation />}>
    <RouterProvider router={router} />
  </Suspense>,
);

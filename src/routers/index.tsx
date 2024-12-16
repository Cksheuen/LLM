import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
/* import Home from '@/pages/index';
import Conversation from '@/pages/conversation'; */

const Home = lazy(() => import('@/pages/index'));
const Conversation = lazy(() => import('@/pages/conversation'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: ':conversation',
        element: <Conversation />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;

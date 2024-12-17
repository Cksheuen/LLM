import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
/* import Home from '@/pages/index';*/
import NewConversation from '@/pages/conversation/new';
import Conversation from '@/pages/conversation/details';

const Home = lazy(() => import('@/pages/index'));
// const NewConversation = lazy(() => import('@/pages/conversation/new'));
// const Conversation = lazy(() => import('@/pages/conversation/details'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '',
        element: <NewConversation />,
      },
      {
        path: ':conversation',
        element: <Conversation />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;

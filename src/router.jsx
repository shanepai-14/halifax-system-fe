
import Dashboard from './layout/Dashboard';
import { lazy } from 'react';
import Loadable from '@components/Loadable';

const AuthLogin = Loadable(lazy(() => import('@pages/authentication/login')));

const router = [   // Changed from object to array
    {
      path: '/',
      element:<AuthLogin />,
    },
    {
        path: '/dashboard',
        element:<Dashboard />,

    },
  ];

export default router;
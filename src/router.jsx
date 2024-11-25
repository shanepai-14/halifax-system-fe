
import Dashboard from './layout/Dashboard';
import { lazy } from 'react';
import Loadable from '@components/Loadable';

const ProductPage = Loadable(lazy(() => import('@pages/product/index')));
const Product = Loadable(lazy(() => import('@pages/product/product')));
const AuthLogin = Loadable(lazy(() => import('@pages/authentication/login')));

const router = [   // Changed from object to array
    {
      path: '/',
      element:<AuthLogin />,
    },
    {
        path: '/app',
        element:<Dashboard />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'product',
            element: <ProductPage />,
            children: [
              {
                index: true,
                element: <Product />
              },
            ]
          }
        ]  
    },
  ];

export default router;

import Dashboard from './layout/Dashboard';
import { lazy } from 'react';
import Loadable from '@components/Loadable';

const ProductPage = Loadable(lazy(() => import('@pages/product/index')));
const Product = Loadable(lazy(() => import('@pages/product/product')));
const SupplierPage = Loadable(lazy(() => import('@pages/supplier/index')));
const Supplier = Loadable(lazy(() => import('@pages/supplier/supplier')));
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
          },
          {
            path: 'supplier',
            element: <SupplierPage />,
            children: [
              {
                index: true,
                element: <Supplier />
              },
            ]
          }
        ]  
    },
  ];

export default router;
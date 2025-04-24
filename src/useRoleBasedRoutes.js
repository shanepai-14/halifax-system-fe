import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import Loadable from '@components/Loadable';
import Dashboard from './layout/Dashboard';

// Auth login page is always available
const AuthLogin = Loadable(lazy(() => import('@pages/authentication/login')));

// Define components and their roles
const routeConfig = [
  {
    path: '/app/account',
    roles: ['admin'],
    component: Loadable(lazy(() => import('@pages/users/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/users/UserManagement')))
      }
    ]
  },
  {
    path: '/app/product',
    roles: ['admin', 'cashier', 'sales', 'staff'],
    component: Loadable(lazy(() => import('@pages/product/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/product/product')))
      }
    ]
  },
  {
    path: '/app/supplier',
    roles: ['admin', 'cashier', 'sales', 'staff'],
    component: Loadable(lazy(() => import('@pages/supplier/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/supplier/supplier')))
      }
    ]
  },
  {
    path: '/app/purchase',
    roles: ['admin'],
    component: Loadable(lazy(() => import('@pages/purchase/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/purchase/purchase')))
      },
      {
        path: 'create',
        component: Loadable(lazy(() => import('@pages/purchase/purchaseForm')))
      },
      {
        path: ':id/edit',
        component: Loadable(lazy(() => import('@pages/purchase/updatePurchase')))
      }
    ]
  },
  {
    path: '/app/receiving-report',
    roles: ['admin'],
    component: Loadable(lazy(() => import('@pages/receiving/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/receiving/ReceivingReport')))
      }
    ]
  },
  {
    path: '/app/inventory',
    roles: ['admin'],
    component: Loadable(lazy(() => import('@pages/inventory/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/inventory/InventoryManagement')))
      },
      {
        path: ':id',
        component: Loadable(lazy(() => import('@pages/inventory/InventoryProductDetail')))
      }
    ]
  },
  {
    path: '/app/customer',
    roles: ['admin', 'cashier', 'sales', 'staff'],
    component: Loadable(lazy(() => import('@pages/customer/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@pages/customer/customers')))
      }
    ]
  },
  {
    path: '/app/sales-list',
    roles: ['admin', 'cashier', 'sales', 'staff'],
    component: Loadable(lazy(() => import('@/pages/sales/SalesTablePage')))
  },
  {
    path: '/app/sales',
    roles: ['admin', 'cashier', 'sales'],
    component: Loadable(lazy(() => import('@/pages/sales/NewOrderPage')))
  },
  {
    path: '/app/delivery-report/:id',
    roles: ['admin', 'cashier', 'sales'],
    component: Loadable(lazy(() => import('@pages/sales/DeliveryReportPage')))
  },
  {
    path: '/app/payments',
    roles: ['admin', 'cashier'],
    component: Loadable(lazy(() => import('@/pages/payments/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@/pages/payments/PaymentsPage')))
      }
    ]
  },
  {
    path: '/app/petty-cash',
    roles: ['admin', 'cashier'],
    component: Loadable(lazy(() => import('@/pages/pettyCash/index'))),
    children: [
      {
        index: true,
        component: Loadable(lazy(() => import('@/pages/pettyCash/PettyCashManagement')))
      }
    ]
  }
];

/**
 * Generate routes based on user role with array structure
 * @returns {Array} Array of route objects
 */
export const useRoleBasedRoutes = () => {
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role || 'guest';
  
  // Create base router structure
  const router = [
    {
      path: '/',
      element: <AuthLogin />,
    }
  ];
  
  // Create the dashboard route with children based on user's role
  const dashboardRoute = {
    path: '/app',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Dashboard />
      }
    ]
  };
  
  // Filter route config based on user role and add to dashboard children
  routeConfig.forEach(route => {
    if (route.roles.includes(userRole)) {
      // Create the route object
      const routeObj = {
        path: route.path.replace('/app/', ''), // Remove /app/ prefix
        element: route.component,
      };
      
      // Add children if they exist
      if (route.children && route.children.length > 0) {
        routeObj.children = route.children.map(child => ({
          index: child.index || false,
          path: child.path || undefined,
          element: child.component
        }));
      }
      
      // Add to dashboard children
      dashboardRoute.children.push(routeObj);
    }
  });
  
  // Add dashboard route to router
  router.push(dashboardRoute);
  
  return router;
};

export default useRoleBasedRoutes;
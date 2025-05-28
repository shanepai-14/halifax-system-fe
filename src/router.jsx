
import Dashboard from './layout/Dashboard';
import { lazy } from 'react';
import Loadable from '@components/Loadable';
import ProtectedRoute from './ProtectedRoute';

const ProductPage = Loadable(lazy(() => import('@pages/product/index')));
const Product = Loadable(lazy(() => import('@pages/product/product')));
const SupplierPage = Loadable(lazy(() => import('@pages/supplier/index')));
const Supplier = Loadable(lazy(() => import('@pages/supplier/supplier')));
const SupplierPurchaseHistory = Loadable(lazy(() => import('@pages/supplier/SupplierPurchaseHistory')));
const PurchasePage = Loadable(lazy(() => import('@pages/purchase/index')));
const Purchase = Loadable(lazy(() => import('@pages/purchase/purchase')));
const PurchaseForm = Loadable(lazy(() => import('@pages/purchase/purchaseForm')));
const PurchaseUpdate = Loadable(lazy(() => import('@pages/purchase/updatePurchase')));
const ReceivingReportPage = Loadable(lazy(() => import('@pages/receiving/index')));
const ReceivingReport = Loadable(lazy(() => import('@pages/receiving/ReceivingReport')));
const InventoryPage = Loadable(lazy(() => import('@pages/inventory/index')));
const Inventory = Loadable(lazy(() => import('@pages/inventory/InventoryManagement')));
const CustomerIndex = Loadable(lazy(() => import('@pages/customer/index')));
const CustomerPage = Loadable(lazy(() => import('@pages/customer/customers')));
const CustomerPurchaseHistory = Loadable(lazy(() => import('@pages/customer/CustomerPurchaseHistory')));
const SalesPage = Loadable(lazy(() => import('@/pages/sales/NewOrderPage')));
const SalesTablePage = Loadable(lazy(() => import('@/pages/sales/SalesTablePage')));
const InventoryProductDetail = Loadable(lazy(() => import('@pages/inventory/InventoryProductDetail')));
const DeliveryReportPage = Loadable(lazy(() => import('@pages/sales/DeliveryReportPage')));
const PaymentsIndex = Loadable(lazy(() => import('@/pages/payments/index')));
const PaymentsPage = Loadable(lazy(() => import('@/pages/payments/PaymentsPage')));
const PettyCashManagement = Loadable(lazy(() => import('@/pages/pettyCash/PettyCashManagement')));
const PettyCashIndex = Loadable(lazy(() => import('@/pages/pettyCash/index')));
const AuthLogin = Loadable(lazy(() => import('@pages/authentication/login')));
const UserIndex = Loadable(lazy(() => import('@/pages/users/index')));
const UserManagement = Loadable(lazy(() => import('@/pages/users/UserManagement')));
const ReportPage = Loadable(lazy(() => import('@/pages/report/ReportPage')));
const BracketPricingManagement = Loadable(lazy(() => import('@/pages/bracket/BracketPricingManagement')));


const router = [
  {
    path: '/',
    element: <AuthLogin />,
  },
  {
    path: '/app',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      // Protected Admin-only route
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'account',
            element: <UserIndex />,
            children: [
              {
                index: true,
                element: <UserManagement />
              },
            ]
          },
          {
            path: 'purchase',
            element: <PurchasePage />,
            children: [
              {
                index: true,
                element: <Purchase />
              },
              {
                path: 'create',
                element: <PurchaseForm />
              },
              {
                path: ':id/edit',
                element: <PurchaseUpdate />
              }
            ]
          },
          {
            path: 'receiving-report',
            element: <ReceivingReportPage />,
            children: [
              {
                index: true,
                element: <ReceivingReport />
              },
            ]
          },
          {
            path: 'inventory',
            element: <InventoryPage />,
            children: [
              {
                index: true,
                element: <Inventory />
              },
              {
                path: ':id',
                element: <InventoryProductDetail />
              }
            ]
          },
            {
            path: 'bracket',
            element: <BracketPricingManagement />,

          },
        ]
      },
      // Routes accessible by admin, cashier, sales, and staff
      {
        element: <ProtectedRoute allowedRoles={['admin', 'cashier', 'sales', 'staff']} />,
        children: [
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
              {
              path: ':supplierId/purchase-history',
              element: <SupplierPurchaseHistory />
            }
            ]
          },
          {
            path: 'customer',
            element: <CustomerIndex />,
            children: [
              {
                index: true,
                element: <CustomerPage />,
              },
              {
                path: ':customerId/purchase-history',
                element: <CustomerPurchaseHistory />
              }
            ]
          },
          
          {
            path: 'sales-list',
            element: <SalesTablePage />,
          },
          {
            path: 'sales',
            element: <SalesPage />,
          },
          {
            path: 'delivery-report/:id',
            element: <DeliveryReportPage />,
          },
          // Other shared routes
        ]
      },
      // Routes accessible by admin and cashier only
      {
        element: <ProtectedRoute allowedRoles={['admin', 'cashier']} />,
        children: [
          {
            path: 'payments',
            element: <PaymentsIndex />,
            children: [
              {
                index: true,
                element: <PaymentsPage />
              },
            ]
          },
          {
            path: 'petty-cash',
            element: <PettyCashIndex />,
            children: [
              {
                index: true,
                element: <PettyCashManagement />,
              }
            ]
          },
                    {
            path: 'report',
            element: <ReportPage/>,
          }
        ]
      }
    ]
  },
];

export default router;
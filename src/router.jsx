
import Dashboard from './layout/Dashboard';
import { lazy } from 'react';
import Loadable from '@components/Loadable';

const ProductPage = Loadable(lazy(() => import('@pages/product/index')));
const Product = Loadable(lazy(() => import('@pages/product/product')));
const SupplierPage = Loadable(lazy(() => import('@pages/supplier/index')));
const Supplier = Loadable(lazy(() => import('@pages/supplier/supplier')));
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
const SalesPage = Loadable(lazy(() => import('@/pages/sales/NewOrderPage')));
const SalesTablePage = Loadable(lazy(() => import('@/pages/sales/SalesTablePage')));
const InventoryProductDetail = Loadable(lazy(() => import('@pages/inventory/InventoryProductDetail')));
const DeliveryReportPage = Loadable(lazy(() => import('@pages/sales/DeliveryReportPage')));
const PaymentsIndex = Loadable(lazy(() => import('@/pages/payments/index')));
const PaymentsPage = Loadable(lazy(() => import('@/pages/payments/PaymentsPage')));
const PettyCashManagement = Loadable(lazy(() => import('@/pages/pettyCash/PettyCashManagement')));
const PettyCashIndex = Loadable(lazy(() => import('@/pages/pettyCash/index')));
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
            path: 'customer',
            element: <CustomerIndex />,
            children: [
              {
                index: true,
                element: <CustomerPage />
              },
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
            element : <PettyCashIndex />,
            children :[
              {
                index:true,
                element: <PettyCashManagement />,
              }
            ]
          }

          
        ]  
    },
  ];

export default router;
// assets
import { DashboardOutlined ,SmileOutlined , ShoppingCartOutlined ,DropboxOutlined ,AreaChartOutlined ,UserOutlined ,ProductOutlined ,ShoppingOutlined , AuditOutlined ,RedEnvelopeOutlined , AccountBookOutlined  } from '@ant-design/icons';




// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'account',
      title: 'Account',
      type: 'item',
      url: '/app/account',
      icon: UserOutlined  ,
      breadcrumbs: false
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/app/dashboard',
      icon: DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customer',
      type: 'item',
      url: '/app/customer',
      icon: SmileOutlined  ,
      breadcrumbs: false
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/app/product',
      icon: ProductOutlined  ,
      breadcrumbs: false
    },
    {
      id: 'sales',
      title: 'Sales',
      type: 'item',
      url: '/app/sales-list',
      icon: ShoppingCartOutlined ,
      breadcrumbs: false
    },
    {
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/app/payments',
      icon: AccountBookOutlined  ,
      breadcrumbs: false
    },
    {
      id: 'supplier',
      title: 'Supplier',
      type: 'item',
      url: '/app/supplier',
      icon: AreaChartOutlined ,
      breadcrumbs: false
    },
    {
      id: 'purchase',
      title: 'Purchase Order',
      type: 'item',
      url: '/app/purchase',
      icon: ShoppingOutlined ,
      breadcrumbs: false
    },
    {
      id: 'receiving',
      title: 'Receiving Report',
      type: 'item',
      url: '/app/receiving-report',
      icon: AuditOutlined ,
      breadcrumbs: false
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/app/inventory',
      icon: DropboxOutlined ,
      breadcrumbs: false
    },
    {
      id: 'pettyCash',
      title: 'Petty Cash',
      type: 'item',
      url: '/app/petty-cash',
      icon: RedEnvelopeOutlined  ,
      breadcrumbs: false
    },
 
   

  ]
};

export default dashboard;

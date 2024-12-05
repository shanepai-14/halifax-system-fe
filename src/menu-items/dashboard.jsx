// assets
import { DashboardOutlined ,ShoppingCartOutlined ,DropboxOutlined ,AreaChartOutlined ,UserOutlined ,ProductOutlined ,ShoppingOutlined } from '@ant-design/icons';




// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'account',
    //   title: 'Account',
    //   type: 'item',
    //   url: '/app/account',
    //   icon: UserOutlined  ,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/app/dashboard',
    //   icon: DashboardOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'inventory',
    //   title: 'Inventory',
    //   type: 'item',
    //   url: '/app/inventory',
    //   icon: DropboxOutlined ,
    //   breadcrumbs: false
    // },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/app/product',
      icon: ProductOutlined  ,
      breadcrumbs: false
    },
    // {
    //   id: 'sales',
    //   title: 'Sales',
    //   type: 'item',
    //   url: '/app/sales',
    //   icon: ShoppingCartOutlined ,
    //   breadcrumbs: false
    // },
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
 
   

  ]
};

export default dashboard;

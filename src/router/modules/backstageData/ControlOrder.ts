import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/ControlOrder',
  component: Layout,
  redirect: '/backstageData/ControlOrder/orderList',
  name: 'ControlOrder',
  meta: {
    title: '订单管理',
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',
    sidebar:false
  },
  children: [
    {
      path: 'orderList',
      name: 'orderList',
      component: () => import('@/views/backstageData/ControlOrder/orderList.vue'),
      meta: {
        title: '订单列表',sidebar: false,
      },
      children:[
        {
          path: 'detail/:id',
          name: 'oderDetail',
          component: () => import('@/views/backstageData/ControlOrder/orderDetails.vue'),
          meta: {
            title: '订单详情',
            sidebar: false,
            activeMenu: '/backstageData/ControlOrder/orderList',
          },
        },
      ]
    },
    {
      path: 'statementCount',
      name: 'statementCount',
      component: () => import('@/views/backstageData/ControlOrder/statementCount.vue'),
      meta: {
        title: '报表统计',
        sidebar: false,
      },
    },
    {
      path: 'deriveRecord',
      name: 'deriveRecord',
      component: () => import('@/views/backstageData/ControlOrder/deriveRecord.vue'),
      meta: {
        title: '导出记录',
        sidebar: false,
      },
    },
    {
      path: 'refundSale',
      name: 'refundSale',
      component: () => import('@/views/backstageData/ControlOrder/refundSale.vue'),
      meta: {
        title: '退款售后',
        sidebar: false,
      },
    },

  ],
}

export default routes

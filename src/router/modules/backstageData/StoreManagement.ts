import type { RouteRecordRaw } from 'vue-router'

// const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/StoreManagement',
  component:() => import('@/layouts/index.vue'),
  redirect: '/backstageData/StoreManagement/businessPlug/135/:admin',
  name: 'StoreManagement',
  meta: {
    title: '店铺管理',
    sidebar:false
  },
  children: [
    {
      path: 'businessPlug/135/:admin',
      name: 'businessPlug',
      component: () => import('@/views/backstageData/plugins/businessPlug/businessPlug.vue'),
      meta: {
        title: '店铺列表',
        sidebar:false,
      },
  },
    {
      path: 'subaccount',
      name: 'subaccount',
      component: () => import('@/views/backstageData/StoreManagement/subaccount.vue'),
      meta: {
        title: '店铺账号',
        sidebar:false,
      },
    },
    {
        path: 'Withdrawalrecords',
        name: 'Withdrawalrecords',
        component: () => import('@/views/backstageData/StoreManagement/Withdrawalrecords.vue'),
        meta: {
          title: '提现记录',
          sidebar:false,
        },
    },

  ],
}

export default routes

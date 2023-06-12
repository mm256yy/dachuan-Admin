import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/ControlMember',
  component: Layout,
  redirect: '/backstageData/ControlMember/memberList',
  name: 'ControlMember',
  meta: {
    title: '用户管理',
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',
    sidebar:false
  },
  children: [
    {
      path: 'memberList',
      name: 'memberList',
      component: () => import('@/views/backstageData/ControlMember/memberList.vue'),
      meta: {
        title: '用户列表',sidebar: false,
      },
    },
    {
      path: 'menberGrade',
      name: 'menberGrade',
      component: () => import('@/views/backstageData/ControlMember/menberGrade.vue'),
      meta: {
        title: '会员等级',
        sidebar: false,
      },
    },
    {
      path: 'memberLaber',
      name: 'memberLaber',
      component: () => import('@/views/backstageData/ControlMember/memberLaber.vue'),
      meta: {
        title: '会员标签',
        sidebar: false,
      },
    },
    {
      path: 'memberAddress',
      name: 'memberAddress',
      component: () => import('@/views/backstageData/ControlMember/memberAddress.vue'),
      meta: {
        title: '收货地址',
        sidebar: false,
      },
    },

  ],
}

export default routes

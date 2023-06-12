import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/Administrators',
  component: Layout,
  redirect: '/backstageData/Administrators/adminList',
  name: 'Administrators',
  meta: {
    title: '管理员设置',
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',
    sidebar:false
  },
  children: [
    {
      path: 'adminList',
      name: 'adminList',
      component: () => import('@/views/backstageData/Administrators/adminList.vue'),
      meta: {
        title: '管理员',sidebar: false,
      },
    },
    {
      path: 'addAdminlist',
      name: 'addAdminlist',
      component: () => import('@/views/backstageData/Administrators/addAdminlist.vue'),
      meta: {
        title: '新增管理员',sidebar: false,
      },
    },
    {
      path: 'addAdminlist/:id',
      name: 'editAdminlist',
      component: () => import('@/views/backstageData/Administrators/addAdminlist.vue'),
      meta: {
        title: '编辑管理员',sidebar: false,
      },
    },
    {
      path: 'AdminMenuList',
      name: 'AdminMenuList',
      component: () => import('@/views/backstageData/administrators/adminMenu.vue'),
      meta: {
        title: '菜单列表',sidebar:false
      },
    },
    {
      path: 'AdminRole',
      name: 'AdminRole',
      component: () => import('@/views/backstageData/administrators/AdminRole.vue'),
      meta: {
        title: '角色列表',sidebar: false,
      },
    },
    {
      path: 'AdminButton',
      name: 'AdminButton',
      component: () => import('@/views/backstageData/administrators/AdminButton.vue'),
      meta: {
        title: '菜单按钮',sidebar: false,
      },
    },


  ],
}

export default routes

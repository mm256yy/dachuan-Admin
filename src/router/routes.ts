import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import type { RouteRecordRaw } from 'vue-router'
// import MultilevelMenuExample from './modules/multilevel.menu.example'
// import BreadcrumbExample from './modules/breadcrumb.example'
// 用户路由
import ControlSys from './modules/backstageData/ControlSys'
import Administrators from './modules/backstageData/Administrators'
// // 首页路由
import Index from './modules/backstageData/Index'
// // 商品管理路由
import ShopManagement from './modules/backstageData/ShopManagement'
// // 订单管理
import ControlOrder from './modules/backstageData/ControlOrder'
// // 会员管理
import ControlMember from './modules/backstageData/ControlMember'
import StoreManagement from './modules/backstageData/StoreManagement'
// 插件中心
import MyPlugins from './modules/plugins'
import type { Route } from '#/global'
import useSettingsStore from '@/store/modules/settings'
import ExamQuestionBank from './modules/backstageData/ExamQuestionBank'
import Template from './modules/template/index'
import models from './modules/template/models'

import FileManagement from './modules/backstageData/FileManagement'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      whiteList: true,
      title: '登录',
      i18n: 'route.login',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().settings.home.title,
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/index.vue'),
        meta: {
          title: () => useSettingsStore().settings.home.title,
          i18n: 'route.home',
          icon: 'ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
      {
        path: 'personal/setting',
        name: 'personalSetting',
        component: () => import('@/views/personal/setting.vue'),
        meta: {
          title: '个人设置',
          i18n: 'route.personal.setting',
          cache: 'personalEditPassword',
        },
      },
      {
        path: 'personal/edit/password',
        name: 'personalEditPassword',
        component: () => import('@/views/personal/edit.password.vue'),
        meta: {
          title: '修改密码',
          i18n: 'route.personal.editpassword',
        },
      },
      {
        path: 'personal/notification',
        name: 'personalNotification',
        component: () => import('@/views/personal/notification.vue'),
        meta: {
          title: '通知中心',
          i18n: 'route.personal.notification',
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '后台数据',
      icon: 'uim:box',
    },
    children: [
      Index,
      ControlSys,
      FileManagement,
      StoreManagement,
      ShopManagement,
      ControlOrder,
      MyPlugins,
      ControlMember,
      ExamQuestionBank,
      Administrators,

    ],
  },
  {
    meta: {
      title: '模板中心',
      icon: 'ant-design:appstore-outlined',
    },
    children: [
      Template,
      models
    ],
  },
  // {
  //   meta: {
  //     title: '模板中心',
  //     icon: 'uim:box',
  //   },
  //   children: [
  //     Index,
  //     // MultilevelMenuExample,
  //     // BreadcrumbExample,
  //   ],
  // },

  // {
  //   meta: {
  //     title: '插件中心',
  //     icon: 'uim:box',
  //   },
  //   children: [
  //     MyPlugins,

  //   ],
  // },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
}))

export {
  constantRoutes,
  systemRoutes,
  asyncRoutes,
  constantRoutesByFilesystem,
  asyncRoutesByFilesystem,
}

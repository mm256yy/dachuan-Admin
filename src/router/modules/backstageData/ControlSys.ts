import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/ControlSys',
  component: Layout,
  redirect: '/backstageData/ControlSys/shopManagement',
  name: 'ControlSys',
  meta: {
    title: '系统设置',
    sidebar: false,
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',

  },
  children: [
    {
      path: 'shopManagement',
      name: 'shopManagement',
      component: () => import('@/views/backstageData/ControlSys/shopManagement.vue'),
      meta: {
        title: '店铺设置',
        sidebar: false,
      },
    },
    {
      path: 'savesSetting',
      name: 'savesSetting',
      component: () => import('@/views/backstageData/ControlSys/savesSetting.vue'),
      meta: {
        title: '存储设置',
        sidebar: false,
      },
    },
    {
      path: 'weChatSettings',
      name: 'weChatSettings',
      component: () => import('@/views/backstageData/ControlSys/weChatSettings.vue'),
      meta: {
        title: '微信设置',
        sidebar: false,
      },
    },
    {
      path: 'freightTemplate',
      name: 'freightTemplate',
      component: () => import('@/views/backstageData/ControlSys/freightTemplate.vue'),
      meta: {
        title: '运费模板',
        sidebar: false,

      },
    },
    {
      path: 'ThemeSettings',
      name: 'ThemeSettings',
      component: () => import('@/views/backstageData/ControlSys/ThemeSettings.vue'),
      meta: {
        title: '主题设置',
        sidebar: false,

      },
    },

  ],
}

export default routes

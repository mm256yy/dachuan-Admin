import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/backstageData/Index',
  component:() => import('@/layouts/index.vue'),
  redirect: '/backstageData/Index/homes',
  name: 'Index',
  meta: {
    title: '后台数据',
    i18n: 'route.multimenu.root',
    icon: 'ep:box',
    sidebar:false
  },
  children: [
    {
      path: 'homes',
      name: 'homes',
      component: () => import('@/views/index.vue'),
      meta: {
        title: '首页',
        sidebar:false

      },
    },

  ],
}

export default routes

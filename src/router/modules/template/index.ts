import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/template/Index',
  component:() => import('@/layouts/index.vue'),
  redirect: '/template/Index/homes',
  name: 'TemplateIndex',
  meta: {
    title: '小程序管理',
    i18n: 'route.multimenu.root',
    icon: 'ep:box',
    sidebar:false
  },
  children: [
    {
      path: 'homes',
      name: 'TemplateHomes',
      component: () => import('@/views/template/index.vue'),
      meta: {
        title: '小程序授权',
        sidebar:false
      },
    },

  ],
}

export default routes

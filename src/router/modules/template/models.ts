import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/template/models',
  component:() => import('@/layouts/index.vue'),
  redirect: '/template/models/modelsList',
  name: 'templateModels',
  meta: {
    title: '模板管理',

    sidebar:false
  },
  children: [
    {
      path: 'modelsList',
      name: 'modelsList',
      component: () => import('@/views/template/model/models.vue'),
      meta: {
        title: '模板列表',
        sidebar:false

      },
    },

    {
      path: 'mymodels',
      name: 'mymodels',
      component: () => import('@/views/template/model/mymodels.vue'),
      meta: {
        title: '我的模板',
        sidebar:false

      },
    },
    {
      path: 'modelsAdd',
      name: 'modelsAdd',
      component: () => import('@/views/template/model/addmodels.vue'),
      meta: {
        title: '添加模板',
        sidebar:false,
        branch:true

      },
    },
    {
      path: 'model_details',
      name: 'model_details',
      component: () => import('@/views/template/model/model_details.vue'),
      meta: {
        title: '添加模板',
        sidebar:false,
        branch:true

      },
    }

  ],
}

export default routes

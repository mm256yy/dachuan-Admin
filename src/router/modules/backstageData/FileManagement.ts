import type { RouteRecordRaw } from 'vue-router'

// const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/FileManagement/File',
  component:() => import('@/layouts/index.vue'),
  redirect: '/FileManagement/File/files',
  name: 'FileManagement',
  meta: {
    title: '文件管理',
    sidebar:false
  },
  children: [
    {
      path: 'files',
      name: 'files',
      component: () => import('@/views/backstageData/FileManagement/index.vue'),
      meta: {
        title: '文件',
        sidebar:false,
      },
    },

  ],
}

export default routes

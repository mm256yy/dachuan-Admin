import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/ShopManagement',
  component: Layout,
  redirect: '/backstageData/ShopManagement/goodsList/141/:admin',
  name: 'ShopManagement',
  meta: {
    title: '商品管理',
    i18n: 'route.multimenu.root',
    sidebar: false,
    icon: 'heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: 'homeGet',
      name: 'homeGet',
      component: () => import('@/views/backstageData/ShopManagement/shopGet.vue'),
      meta: {
        title: '商品采集',
        sidebar: false,
      },
    },
    {
      path: 'goodsList/141/:admin',
      name: 'goodsList',
      component: () => import('@/views/backstageData/plugins/goodsList/goodsList.vue'),
      meta: {
        title: '商品列表',
        sidebar: false,
        // branch:true

      },
    },
    {
      path: 'addGoods/141',
      name: 'addGoods',
      component: () => import('@/views/backstageData/plugins/goodsList/addGoods.vue'),
      meta: {
        title: '新增商品',
        sidebar: false,
        // branch:true

      },
    },

    {
      path: 'shopcCategory/143/:admin',
      name: 'shopcCategory',
      component: () => import('@/views/backstageData/plugins/shopcCategory/shopcCategory.vue'),
      meta: {
        title: '商品分类',
        i18n: 'route.general.menu.edit',
        sidebar: false,

      },
    },








  ],
}

export default routes

import path from 'path-browserify'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/backstageData/plugins',
  component: Layout,
  redirect: '/backstageData/plugins/myPlugins',
  name: 'Plugins',
  meta: {
    title: '插件中心',
    i18n: 'route.multimenu.root',
    icon: 'heroicons-solid:menu-alt-3',
    sidebar: false,
  },
  children: [
    {
      path: 'pluginList',
      name: 'plugins_pluginList',
      component: () => import('@/views/backstageData/plugins/pluginList.vue'),
      meta: {
        title: '插件列表',
        sidebar: false,

      },
    },
    {
      path: 'myPlugins',
      name: 'plugins_myPlugins',
      component: () => import('@/views/backstageData/plugins/myPlugins.vue'),
      meta: {
        title: '我的插件',
        sidebar: false,
      },
    },
    {
      path: 'businessPlug/:id/:admin',
      name: 'businessPlug',
      component: () => import('@/views/backstageData/plugins/businessPlug/businessPlug.vue'),
      meta: {
        title: '店铺插件',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addbusinessPlug/:plugsId',
      name: 'addbusinessPlug',
      component: () => import('@/views/backstageData/plugins/businessPlug/addbusinessPlug.vue'),
      meta: {
        title: '新增店铺插件',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addbusinessPlug/:id/:plugsId',
      name: 'editbusinessPlug',
      component: () => import('@/views/backstageData/plugins/businessPlug/addbusinessPlug.vue'),
      meta: {
        title: '修改店铺插件',
        sidebar: false,
        branch:true
      },
    },

    {
      path: 'mockData/:id/:admin',
      name: 'mockData',
      component: () => import('@/views/backstageData/plugins/mockData/mockData.vue'),
      meta: {
        title: 'Mock数据',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addMockData/:plugsId',
      name: 'addMockData',
      component: () => import('@/views/backstageData/plugins/mockData/addMockData.vue'),
      meta: {
        title: '新增Mock',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addMockData/:id/:plugsId',
      name: 'editMockData',
      component: () => import('@/views/backstageData/plugins/mockData/addMockData.vue'),
      meta: {
        title: '修改Mock',
        sidebar: false,
        branch:true
      },
    },

    {
      path: 'allPlugins',
      name: 'plugins_allPlugins',
      component: () => import('@/views/backstageData/plugins/allPlugins.vue'),
      meta: {
        title: '全部插件',
        sidebar: false,
        branch:true
      },
    },

    {
      path: 'homeRotation/:id/:admin',
      name: 'homeRotation',
      component: () => import('@/views/backstageData/plugins/homeRotation/homeRotation.vue'),
      meta: {
        title: '首页轮播',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'homeData/:id/:admin',
      name: 'homeData',
      component: () => import('@/views/backstageData/plugins/homeData/homeData.vue'),
      meta: {
        title: '首页数据',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addHomeData/:plugsId',
      name: 'addHomeData',
      component: () => import('@/views/backstageData/plugins/homeData/addHomeData.vue'),
      meta: {
        title: '新增首页',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'editHomeData/:id/:plugsId',
      name: 'editHomeData',
      component: () => import('@/views/backstageData/plugins/homeData/editHomeData.vue'),
      meta: {
        title: '修改首页',
        sidebar: false,
        branch:true
      },
    },
    // {
    //   path: 'goodsList/:id',
    //   name: 'goodsList',
    //   component: () => import('@/views/backstageData/plugins/goodsList/goodsList.vue'),
    //   meta: {
    //     title: '商品列表',
    //     sidebar: false,
    //     branch:true

    //   },
    // },
    {
      path: 'addGoods/:plugsId',
      name: 'addGoods',
      component: () => import('@/views/backstageData/plugins/goodsList/addGoods.vue'),
      meta: {
        title: '新增商品',
        sidebar: false,
        branch:true

      },
    },
    {
      path: 'addGoods/:id/:plugsId',
      name: 'editGoods',
      component: () => import('@/views/backstageData/plugins/goodsList/addGoods.vue'),
      meta: {
        title: '编辑商品',
        sidebar: false,
        branch:true


      },
    },


    // {
    //   path: 'shopcCategory/:id',
    //   name: 'shopcCategory',
    //   component: () => import('@/views/backstageData/plugins/shopcCategory/shopcCategory.vue'),
    //   meta: {
    //     title: '商品分类',
    //     i18n: 'route.general.menu.edit',
    //     sidebar: false,
    //     branch:true
    //   },
    // },

    {
      path: 'shoppingCart/:id/:admin',
      name: 'shoppingCart',
      component: () => import('@/views/backstageData/plugins/shoppingCart/shoppingCart.vue'),
      meta: {
        title: '购物车',
        sidebar: false,
        branch:true
      },
    },



    {
      path: 'contentlist/:id',
      name: 'contentlist',
      component: () => import('@/views/backstageData/plugins/pluginContent/contentlist.vue'),
      meta: {
        title: '配置信息',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addcontentlist/:plugsId',
      name: 'addcontentlist',
      component: () => import('@/views/backstageData/plugins/pluginContent/addcontentlist.vue'),
      meta: {
        title: '新增配置',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'addcontentlist/:id/:plugsId',
      name: 'editcontentlist',
      component: () => import('@/views/backstageData/plugins/pluginContent/addcontentlist.vue'),
      meta: {
        title: '修改配置',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'registerApplet/:id/:admin',
      name: 'registerApplet',
      component: () => import('@/views/backstageData/plugins/registerApplet/registerApplet.vue'),
      meta: {
        title: '注册小程序',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'expresswaySignPlacement/:id/:admin',
      name: 'expresswaySignPlacement',
      component: () => import('@/views/backstageData/plugins/expresswaySignPlacement/expresswaySignPlacement.vue'),
      meta: {
        title: '高速公路摆牌插件',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'petSteward/:id/:admin',
      name: 'petSteward',
      component: () => import('@/views/backstageData/plugins/petHousekeeper/petSteward.vue'),
      meta: {
        title: '宠物管家',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'petEntrust/:id/:admin',
      name: 'petEntrust',
      component: () => import('@/views/backstageData/plugins/petHousekeeper/petEntrust.vue'),
      meta: {
        title: '宠物寄养家庭',
        sidebar: false,
        branch:true
      },
    },
		{
		  path: 'petArchives/:id/:admin',
		  name: 'petArchives',
		  component: () => import('@/views/backstageData/plugins/petHousekeeper/petArchives.vue'),
		  meta: {
		    title: '宠物档案',
		    sidebar: false,
		    branch:true
		  },
		},
    {
      path: 'accompanyingDiagnosisHospital/:id/:admin',
      name: 'accompanyingDiagnosisHospital',
      component: () => import('@/views/backstageData/plugins/accompanyingDiagnosisHospital/index.vue'),
      meta: {
        title: '医院陪诊',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'companion/:id/:admin',
      name: 'companion',
      component: () => import('@/views/backstageData/plugins/companion/index.vue'),
      meta: {
        title: '医院陪诊',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'goodsDistribution/:id/:admin',
      name: 'goodsDistribution',
      component: () => import('@/views/backstageData/plugins/goodsDistribution/index.vue'),
      meta: {
        title: '分销返利',
        sidebar: false,
        branch:true
      },
    },

    {
      path: 'membershipLevel/:id/:admin',
      name: 'membershipLevel',
      component: () => import('@/views/backstageData/plugins/membershipLevel/index.vue'),
      meta: {
        title: '会员服务',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'coupon/:id/:admin',
      name: 'coupon',
      component: () => import('@/views/backstageData/plugins/coupon/coupon.vue'),
      meta: {
        title: '商品优惠券',
        sidebar: false,
        branch:true
      },
    },
{
      path: 'balanceRecharge/:id/:admin',
      name: 'balanceRecharge',
      component: () => import('@/views/backstageData/plugins/recharge/recharge.vue'),
      meta: {
        title: '余额充值',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'yiLianYunPrint/:id/:admin',
      name: 'yiLianYunPrint',
      component: () => import('@/views/backstageData/plugins/yiLianYunPrint/printerList.vue'),
      meta: {
        title: '易联云打印机',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'speakerBroadcasting/:id/:admin',
      name: 'speakerBroadcasting',
      component: () => import('@/views/backstageData/plugins/speakerBroadcasting/speakerList.vue'),
      meta: {
        title: '云喇叭播报',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'userWithdrawal/:id',
      name: 'userWithdrawal',
      component: () => import('@/views/backstageData/plugins/userWithdrawal/index.vue'),
      meta: {
        title: '用户提现',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'invoiceAssistant/:id',
      name: 'invoiceAssistant',
      component: () => import('@/views/backstageData/plugins/invoiceAssistant/invoiceAssistant.vue'),
      meta: {
        title: '发票助手',
        sidebar: false,
        branch:true
      },
    },
    {
      path: 'discountPurchaseOrder/:id',
      name: 'discountPurchaseOrder',
      component: () => import('@/views/backstageData/plugins/discountPurchaseOrder/discountPurchaseOrder.vue'),
      meta: {
        title: '优惠买单',
        sidebar: false,
        branch:true
      },
    },

  ],
}

export default routes

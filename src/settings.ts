import type { Settings } from '#/global'

const globalSettings: Settings.all = {

    "app": {
      "enablePermission": true,
      "enableDynamicTitle": true,
      "enableErrorLog": true,
      "theme": "default",
      "colorScheme": "light",
      "elementSize": "default",
      "defaultLang": "zh-cn",
      "enableProgress": true,
      "storagePrefix": "fa_",
      "enableWatermark": false,
      "routeBaseOn": "frontend"
    },
    "layout": {
      "enableMobileAdaptation": true,
      "widthMode": "adaption"
    },
    "menu": {
      "menuFillStyle": "radius",
      "menuActiveStyle": "dot",
      "enableSubMenuCollapseButton": true,
      "enableHotkeys": true,
      "baseOn": "frontend",
      "menuMode": "head",
      "switchMainMenuAndPageJump": false,
      "subMenuUniqueOpened": true,
      "subMenuCollapse": false,
      "subMenuOnlyOneHide": true
    },
    "topbar": {
      "mode": "fixed",
      "switchTabbarAndToolbar": false
    },
    "tabbar": {
      "enable": false,
      "enableIcon": true,
      "enableHotkeys": true,
      "style": "fashion",
      "mergeTabsBy": ""
    },
    "toolbar": {
      "enableNotification": true,
      "enableI18n": true,
      "enableFullscreen": true,
      "enablePageReload": true,
      "enableColorScheme": true,
      "enableAppSetting": true
    },
    "breadcrumb": {
      "style": "modern",
      "enableMainMenu": true,
      "enable": true
    },
    "mainPage": {
      "enableHotkeys": true,
      "iframeCacheMax": 9
    },
    "home": {
      "enable": true,
      "title": "主页"
    },
    "navSearch": {
      "enable": true,
      "enableHotkeys": true
    },
    "copyright": {
      "enable": true,
      "dates": "©2019-2023 ",
      "company": "杭州大川长风网络科技有限公司",
      "website": "",
      "beian": "浙ICP备15000106号"
    }

    // "app": {
    //   "enablePermission": true,
    //   "enableDynamicTitle": true,
    //   "enableErrorLog": true,
    //   "theme": "default",
    //   "colorScheme": "light",
    //   "elementSize": "default",
    //   "defaultLang": "zh-cn",
    //   "enableProgress": true,
    //   "storagePrefix": "fa_",
    //   "enableWatermark": false,
    //   "routeBaseOn": "frontend",
    //   // "routeBaseOn": 'backend'
    // },
    // "layout": {
    //   "enableMobileAdaptation": true,
    //   "widthMode": "adaption"
    // },
    // "menu": {
    //   "menuFillStyle": "radius",
    //   "menuActiveStyle": "dot",
    //   "enableSubMenuCollapseButton": true,
    //   "enableHotkeys": true,
    //   "baseOn": "frontend",
    //   "menuMode": "head",
    //   "switchMainMenuAndPageJump": false,
    //   "subMenuUniqueOpened": true,
    //   "subMenuCollapse": false,
    //   "subMenuOnlyOneHide": true,
    // },
    // "topbar": {
    //   "mode": "fixed",
    //   "switchTabbarAndToolbar": false
    // },
    // "tabbar": {
    //   "enable": true,
    //   "enableIcon": true,
    //   "enableHotkeys": true,
    //   "style": "fashion",
    //   "mergeTabsBy": ""
    // },
    // "toolbar": {
    //   "enableNotification": true,
    //   "enableI18n": true,
    //   "enableFullscreen": true,
    //   "enablePageReload": true,
    //   "enableColorScheme": true,
    //   "enableAppSetting": true
    // },
    // "breadcrumb": {
    //   "style": "modern",
    //   "enableMainMenu": true,
    //   "enable": true
    // },
    // "mainPage": {
    //   "enableHotkeys": true,
    //   "iframeCacheMax": 9
    // },
    // "home": {
    //   "enable": true,
    //   "title": "主页"
    // },
    // "navSearch": {
    //   "enable": true,
    //   "enableHotkeys": true
    // },
    // "copyright": {
    //   "enable": true,
    //   "dates": "©2019-2023 ",
    //   "company": "杭州大川长风网络科技有限公司",
    //   "website": "",
    //   "beian": "浙ICP备15000106号"
    // }

}

export default globalSettings

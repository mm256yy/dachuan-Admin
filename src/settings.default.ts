// 该文件为系统默认配置，请勿修改！！！

import type { RecursiveRequired, Settings } from '#/global'

const globalSettingsDefault: RecursiveRequired<Settings.all> = {
  app: {
    theme: 'default',
    colorScheme: 'light',
    elementSize: 'default',
    defaultLang: '',
    enablePermission: false,
    enableProgress: true,
    enableDynamicTitle: false,
    storagePrefix: 'fa_',
    enableWatermark: false,
    enableErrorLog: false,
    routeBaseOn: 'frontend',
  },
  home: {
    enable: true,
    title: '主页',
  },
  layout: {
    widthMode: 'adaption',
    enableMobileAdaptation: false,
  },
  menu: {
    baseOn: 'frontend',
    menuMode: 'side',
    menuFillStyle: '',
    menuActiveStyle: '',
    switchMainMenuAndPageJump: false,
    subMenuUniqueOpened: true,
    subMenuOnlyOneHide: false,
    subMenuCollapse: false,
    enableSubMenuCollapseButton: false,
    enableHotkeys: false,
  },
  topbar: {
    mode: 'static',
    switchTabbarAndToolbar: false,
  },
  tabbar: {
    enable: false,
    style: 'fashion',
    enableIcon: false,
    mergeTabsBy: '',
    enableHotkeys: false,
  },
  toolbar: {
    enableNotification: false,
    enableI18n: false,
    enableFullscreen: false,
    enablePageReload: false,
    enableColorScheme: false,
    enableAppSetting: false,
  },
  breadcrumb: {
    enable: true,
    style: '',
    enableMainMenu: false,
  },
  mainPage: {
    enableHotkeys: true,
    iframeCacheMax: 3,
  },
  navSearch: {
    enable: true,
    enableHotkeys: true,
  },
  copyright: {
    enable: true,
    dates: '2020-2023',
    company: 'Fantastic-admin',
    website: 'https://hooray.gitee.io/fantastic-admin/',
    beian: '',
  },
}

export default globalSettingsDefault

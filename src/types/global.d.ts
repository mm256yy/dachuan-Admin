import type { StyleValue } from "vue"
import type { RouteRecordRaw, RouteMeta, NavigationGuard } from 'vue-router'

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>
}
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

declare namespace Settings {
  interface app {
    /**
     * 主题
     * @默认值 `'default'` 默认主题
     * @可选值 `'sys_green'` 绿色主题
     * @可选值 `'sys_orange'` 橙色主题
     * @可选值 `'sys_pink'` 粉色主题
     * @可选值 `'sys_grey'` 灰色主题
     * @可选值 `'sys_yellow'` 黄色主题
     */
    theme?: 'default' | 'sys_green' | 'sys_orange' | 'sys_pink' | 'sys_grey' | 'sys_yellow'
    /**
     * 颜色方案
     * @默认值 `''` 跟随系统
     * @可选值 `'light'` 明亮模式
     * @可选值 `'dark'` 暗黑模式
     */
    colorScheme?: '' | 'light' | 'dark'
    /**
     * Element Plus 组件默认尺寸
     * @默认值 `'default'` 默认
     * @可选值 `'large'` 大号
     * @可选值 `'small'` 小号
     */
    elementSize?: 'default' | 'large' | 'small'
    /**
     * 默认语言
     * @默认值 `''` 跟随浏览器语言设置
     * @可选值 [查看 Element Plus 支持语言列表](https://github.com/element-plus/element-plus/tree/dev/packages/locale/lang)
     */
    defaultLang?: string
    /**
     * 是否开启权限功能
     * @默认值 `false`
     */
    enablePermission?: boolean
    /**
     * 是否开启载入进度条
     * @默认值 `true`
     */
    enableProgress?: boolean
    /**
     * 是否开启动态标题
     * @默认值 `false`
     */
    enableDynamicTitle?: boolean
    /**
     * localStorage/sessionStorage 前缀
     * @默认值 `'fa_'`
     */
    storagePrefix?: string
    /**
     * 是否开启页面水印
     * @默认值 `false`
     */
    enableWatermark?: boolean
    /**
     * 是否在非开发环境开启错误日志功能，具体业务代码在 ./utils/error.log.ts
     * @默认值 `false`
     */
    enableErrorLog?: boolean
    /**
     * 路由数据来源
     * @默认值 `'frontend'` 前端
     * @可选值 `'backend'` 后端
     * @可选值 `'filesystem'` 文件系统
     */
    routeBaseOn?: 'frontend' | 'backend' | 'filesystem'
  }
  interface home {
    /**
     * 是否开启主页
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 主页名称
     * @默认值 `'主页'`
     */
    title?: string
  }
  interface layout {
    /**
     * 页宽模式，当设置为非 `'adaption'` 时，可以去 ./src/assets/styles/layout.scss 里设置 `--g-app-width` 宽度变量
     * @默认值 `'adaption'` 自适应
     * @可选值 `'adaption-min-width'` 自适应（有最小宽度）
     * @可选值 `'center'` 定宽居中
     * @可选值 `'center-max-width'` 定宽居中（有最大宽度）
     */
    widthMode?: 'adaption' | 'adaption-min-width' | 'center' | 'center-max-width'
    /**
     * 是否开启移动端适配，开启后当页面宽度小于 992px 时自动切换为移动端展示
     * @默认值 `false`
     */
    enableMobileAdaptation?: boolean
  }
  interface menu {
    /**
     * 导航栏数据来源，当 `app.routeBaseOn: 'filesystem'` 时生效
     * @默认值 `'frontend'` 前端
     * @可选值 `'backend'` 后端
     */
    baseOn?: 'frontend' | 'backend'
    /**
     * 导航栏模式
     * @默认值 `'side'` 侧边栏模式（有主导航）
     * @可选值 `'head'` 顶部模式
     * @可选值 `'single'` 侧边栏模式（无主导航）
     * @可选值 `'only-side'` 侧边栏精简模式
     * @可选值 `'only-head'` 顶部精简模式
     */
    menuMode?: 'side' | 'head' | 'single' | 'only-side' | 'only-head'
    /**
     * 导航栏填充风格
     * @默认值 `''`
     * @可选值 `'radius'` 圆角
     */
    menuFillStyle?: '' | 'radius'
    /**
     * 导航栏激活风格
     * @默认值 `''`
     * @可选值 `'arrow'` 箭头
     * @可选值 `'line'` 线条
     * @可选值 `'dot'` 圆点
     */
    menuActiveStyle?: '' | 'arrow' | 'line' | 'dot'
    /**
     * 切换主导航是否跳转页面
     * @默认值 `false`
     */
    switchMainMenuAndPageJump?: boolean
    /**
     * 次导航是否只保持一个子项的展开
     * @默认值 `true`
     */
    subMenuUniqueOpened?: boolean
    /**
     * 次导航只有一个导航时是否自动隐藏
     * @默认值 `false`
     */
    subMenuOnlyOneHide?: boolean
    /**
     * 次导航是否收起
     * @默认值 `false`
     */
    subMenuCollapse?: boolean
    /**
     * 是否开启次导航的展开/收起按钮
     * @默认值 `false`
     */
    enableSubMenuCollapseButton?: boolean
    /**
     * 是否开启主导航切换快捷键
     * @默认值 `false`
     */
    enableHotkeys?: boolean
  }
  interface topbar {
    /**
     * 模式
     * @默认值 `'static'` 静止，跟随页面滚动
     * @可选值 `'fixed'` 固定，不跟随页面滚动，始终固定在顶部
     * @可选值 `'sticky'` 粘性，页面往下滚动时隐藏，往上滚动时显示
     */
    mode?: 'static' | 'fixed' | 'sticky'
    /**
     * 是否切换显示标签栏和工具栏的显示位置
     * @默认值 `false` 标签栏在工具栏上面
     * @可选值 `true` 工具栏在标签栏上面
     */
    switchTabbarAndToolbar?: boolean
  }
  interface tabbar {
    /**
     * 是否开启标签栏
     * @默认值 `false`
     */
    enable?: boolean
    /**
     * 标签栏风格
     * @默认值 `'fashion'` 时尚
     * @可选值 `'card'` 卡片
     * @可选值 `'square'` 方块
     */
    style?: 'fashion' | 'card' | 'square'
    /**
     * 是否开启标签栏图标显示
     * @默认值 `false`
     */
    enableIcon?: boolean
    /**
     * 标签页合并规则
     * @默认值 `''` 不合并
     * @可选值 `'routeName'` 根据路由名称，相同路由名称的路由合并
     * @可选值 `'activeMenu'` 根据路由的 `meta.activeMenu` 字段，与指向的目标路由合并
     */
    mergeTabsBy?: '' | 'routeName' | 'activeMenu'
    /**
     * 是否开启标签栏快捷键
     * @默认值 `false`
     */
    enableHotkeys?: boolean
  }
  interface toolbar {
    /**
     * 是否开启通知中心
     * @默认值 `false`
     */
    enableNotification?: boolean
    /**
     * 是否开启国际化
     * @默认值 `false`
     */
    enableI18n?: boolean
    /**
     * 是否开启全屏
     * @默认值 `false`
     */
    enableFullscreen?: boolean
    /**
     * 是否开启页面刷新
     * @默认值 `false`
     */
    enablePageReload?: boolean
    /**
     * 是否开启颜色主题
     * @默认值 `false`
     */
    enableColorScheme?: boolean
    /**
     * 是否开启应用配置，强烈建议在生产环境中关闭
     * @默认值 `false`
     */
    enableAppSetting?: boolean
  }
  interface breadcrumb {
    /**
     * 是否开启面包屑导航
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 面包屑导航风格
     * @默认值 `''` 默认
     * @默认值 `'modern'` 现代
     */
    style?: '' | 'modern'
    /**
     * 是否在面包屑导航里显示主导航
     * @默认值 `false`
     */
    enableMainMenu?: boolean
  }
  interface mainPage {
    /**
     * 是否开启页面快捷键
     * @默认值 `true`
     */
    enableHotkeys?: boolean
    /**
     * iframe 页面最大缓存数量
     * @默认值 `3`
     */
    iframeCacheMax?: number
  }
  interface navSearch {
    /**
     * 是否开启导航搜索
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 是否开启导航搜索快捷键
     * @默认值 `true`
     */
    enableHotkeys?: boolean
  }
  interface copyright {
    /**
     * 是否开启底部版权，同时在路由 meta 对象里可以单独设置某个路由是否显示底部版权信息
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 网站运行日期
     * @默认值 `'2020-2022'`
     */
    dates?: string
    /**
     * 公司名称
     * @默认值 `'Fantastic-admin'`
     */
    company?: string
    /**
     * 网站地址
     * @默认值 `'https://hooray.gitee.io/fantastic-admin/'`
     */
    website?: string
    /**
     * 网站备案号
     * @默认值 `''`
     */
    beian?: string
  }
  interface all {
    /** 应用设置 */
    app?: app
    /** 主页设置 */
    home?: home
    /** 布局设置 */
    layout?: layout
    /** 导航栏设置 */
    menu?: menu
    /** 顶栏设置 */
    topbar?: topbar
    /** 标签栏设置 */
    tabbar?: tabbar
    /** 工具栏设置 */
    toolbar?: toolbar
    /** 面包屑导航设置 */
    breadcrumb?: breadcrumb
    /** 页面设置 */
    mainPage?: mainPage
    /** 导航搜索设置 */
    navSearch?: navSearch
    /** 底部版权设置 */
    copyright?: copyright
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | Function
    i18n?: string
    icon?: string
    activeIcon?: string
    defaultOpened?: boolean
    permanent?: boolean
    auth?: string | string[]
    sidebar?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    cache?: boolean | string | string[]
    noCache?: string | string[]
    badge?: boolean | string | number | Function
    iframe?: string
    link?: string
    copyright?: boolean
    paddingBottom?: StyleValue
    whiteList?: boolean
    breadcrumbNeste?: Route.breadcrumb[]
  }
}

declare namespace Route {
  interface recordMainRaw {
    meta?: {
      title?: string | Function
      i18n?: string
      icon?: string
      activeIcon?: string
      auth?: string | string[]
    }
    children: RouteRecordRaw[]
  }
  interface breadcrumb {
    path: string
    title?: string | Function
    i18n?: string
    icon?: string
    activeIcon?: string
    hide: boolean
  }
}

declare namespace Menu {
  /** 原始 */
  interface recordRaw {
    path?: string
    meta?: {
      title?: string
      i18n?: string
      icon?: string
      activeIcon?: string
      defaultOpened?: boolean
      auth?: string | string[]
      sidebar?: boolean
      badge?: boolean | string | number | Function
      link?: string
    }
    children?: recordRaw[]
  }
  /** 主导航 */
  interface recordMainRaw {
    meta?: {
      title?: string
      i18n?: string
      icon?: string
      activeIcon?: string
      auth?: string | string[]
    }
    children: recordRaw[]
  }
}

declare namespace Tabbar {
  interface recordRaw {
    tabId: string
    fullPath: string
    routeName?: RouteRecordRaw.name
    activeMenu?: string
    title?: string | Function
    i18n?: string
    iframe?: string
    icon?: string
    activeIcon?: string
    name: string[]
    isPin: boolean
    isPermanent: boolean
  }
}

declare namespace Iframe {
  interface recordRaw {
    path: string
    src: string
    isOpen: boolean
    isLoading: boolean
  }
}

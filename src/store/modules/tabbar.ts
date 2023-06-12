import type { RouteLocationNormalized } from 'vue-router'
import useSettingsStore from './settings'
import useUserStore from './user'
import useRouteStore from './route'
import useKeepAliveStore from './keepAlive'
import useIframeStore from './iframe'
import storage from '@/utils/storage'
import type { Tabbar } from '#/global'

const useTabbarStore = defineStore(
  // 唯一ID
  'tabbar',
  () => {
    const settingsStore = useSettingsStore()
    const userStore = useUserStore()
    const routeStore = useRouteStore()
    const keepAliveStore = useKeepAliveStore()
    const iframeStore = useIframeStore()

    const list = ref<Tabbar.recordRaw[]>([])
    const leaveIndex = ref(-1)

    // 更新 localstorage 数据
    function updateStorage(list: Tabbar.recordRaw[], account: string) {
      const data = storage.local.has('tabbarPinData') ? JSON.parse(storage.local.get('tabbarPinData') as string) : {}
      data[account] = list.filter((item) => {
        return item.isPin
      })
      storage.local.set('tabbarPinData', JSON.stringify(data))
    }

    // 初始化常驻标签页
    function initPermanentTab() {
      const tabs: Tabbar.recordRaw[] = []
      routeStore.flatSystemRoutes.forEach((items) => {
        items.children && items.children.forEach((route) => {
          if (route.meta?.permanent && route.meta?.breadcrumbNeste) {
            const fullPath = route.meta.breadcrumbNeste.at(-1)?.path as string
            const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (route.meta.activeMenu || fullPath) : fullPath
            tabs.push({
              tabId,
              fullPath,
              routeName: route.name,
              activeMenu: route.meta.activeMenu,
              title: typeof route.meta.title === 'function' ? route.meta.title() : route.meta.title,
              i18n: route.meta.i18n,
              iframe: route.meta.iframe,
              name: route.name ? [route.name as string] : [],
              isPin: false,
              isPermanent: true,
            })
          }
        })
      })
      routeStore.flatRoutes.forEach((items) => {
        if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
          items.children && items.children.forEach((route) => {
            if (route.meta?.permanent && route.meta?.breadcrumbNeste) {
              const fullPath = route.meta.breadcrumbNeste.at(-1)?.path as string
              const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (route.meta.activeMenu || fullPath) : fullPath
              tabs.push({
                tabId,
                fullPath,
                routeName: route.name,
                activeMenu: route.meta.activeMenu,
                title: typeof route.meta.title === 'function' ? route.meta.title() : route.meta.title,
                i18n: route.meta.i18n,
                iframe: route.meta.iframe,
                name: route.name ? [route.name as string] : [],
                isPin: false,
                isPermanent: true,
              })
            }
          })
        }
        else {
          if (items.meta?.permanent) {
            const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (items.meta.activeMenu || items.path) : items.path
            tabs.push({
              tabId,
              fullPath: items.path,
              routeName: items.name,
              activeMenu: items.meta.activeMenu,
              title: typeof items.meta.title === 'function' ? items.meta.title() : items.meta.title,
              i18n: items.meta.i18n,
              iframe: items.meta.iframe,
              name: items.name ? [items.name as string] : [],
              isPin: false,
              isPermanent: true,
            })
          }
        }
      })
      // 常驻的标签页添加到标签栏开头
      tabs.length && list.value.unshift(...tabs)
    }
    // 添加标签页
    async function add(route: RouteLocationNormalized) {
      const names: string[] = []
      route.matched.forEach((v, i) => {
        if (i > 0) {
          v.components?.default.name && names.push(v.components.default.name)
        }
      })
      const meta = route.matched.at(-1)?.meta
      const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (meta?.activeMenu ?? route.fullPath) : route.fullPath
      if (route.name !== 'reload') {
        // 记录查找到的标签页
        const findTab = list.value.find((item) => {
          if (settingsStore.settings.tabbar.mergeTabsBy === 'routeName' && item.routeName) {
            return item.routeName === route.name
          }
          else {
            return item.tabId === tabId
          }
        })
        // 新增标签页
        if (!findTab) {
          const listItem = {
            tabId,
            fullPath: route.fullPath,
            routeName: route.name,
            activeMenu: meta?.activeMenu,
            title: meta?.title,
            i18n: meta?.i18n,
            iframe: meta?.iframe,
            // FIXME 这里其实可以用 findLast 函数，但由于该函数最低需要 chroumim 97，国产双核浏览器目前均不支持，所以另辟蹊径
            icon: meta?.icon ?? meta?.breadcrumbNeste?.filter(item => item.icon).at(-1)?.icon,
            activeIcon: meta?.activeIcon ?? meta?.breadcrumbNeste?.filter(item => item.activeIcon).at(-1)?.activeIcon,
            name: names,
            isPin: false,
            isPermanent: false,
          }
          if (leaveIndex.value >= 0) {
            list.value.splice(leaveIndex.value + 1, 0, listItem)
            leaveIndex.value = -1
          }
          else {
            list.value.push(listItem)
          }
        }
        // 更新标签页
        else {
          findTab.tabId = tabId
          findTab.fullPath = route.fullPath
          findTab.routeName = route.name
          findTab.activeMenu = meta?.activeMenu
          findTab.title = typeof meta?.title === 'function' ? meta.title() : meta?.title
          findTab.i18n = meta?.i18n
          findTab.iframe = meta?.iframe
          // FIXME 这里其实可以用 findLast 函数，但由于该函数最低需要 chroumim 97，国产双核浏览器目前均不支持，所以另辟蹊径
          findTab.icon = meta?.icon ?? meta?.breadcrumbNeste?.filter(item => item.icon).at(-1)?.icon
          findTab.activeIcon = meta?.activeIcon ?? meta?.breadcrumbNeste?.filter(item => item.activeIcon).at(-1)?.activeIcon
        }
      }
      // 更新固定标签页的数据，数据会记录在 localstorage 里
      updateStorage(list.value, userStore.account)
    }
    // 删除指定标签页
    function remove(tabId: Tabbar.recordRaw['tabId']) {
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v) => {
        if (v.tabId === tabId) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      // 如果是手动点击关闭 tab 标签页，则删除页面缓存
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item) => {
        return item.tabId !== tabId
      })
      updateStorage(list.value, userStore.account)
    }
    // 删除两侧非常驻和非固定标签页
    function removeOtherSide(tabId: Tabbar.recordRaw['tabId']) {
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v) => {
        if (v.tabId !== tabId && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item) => {
        return item.tabId === tabId || item.isPermanent || item.isPin
      })
      updateStorage(list.value, userStore.account)
    }
    // 删除左侧非常驻和非固定标签页
    function removeLeftSide(tabId: Tabbar.recordRaw['tabId']) {
      // 查找指定路由对应在标签页列表里的下标
      const index = list.value.findIndex(item => item.tabId === tabId)
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v, i) => {
        if (i < index && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item, i) => {
        return i >= index || item.isPermanent || item.isPin
      })
      updateStorage(list.value, userStore.account)
    }
    // 删除右侧非常驻和非固定标签页
    function removeRightSide(tabId: Tabbar.recordRaw['tabId']) {
      // 查找指定路由对应在标签页列表里的下标
      const index = list.value.findIndex(item => item.tabId === tabId)
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v, i) => {
        if (i > index && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item, i) => {
        return i <= index || item.isPermanent || item.isPin
      })
      updateStorage(list.value, userStore.account)
    }
    // 固定标签页（移动到最后一个常驻或固定标签页后面，如果没有则移动至第一个）
    function pin(tabId: Tabbar.recordRaw['tabId']) {
      const index = list.value.findIndex(item => item.tabId === tabId)
      let toIndex = -1
      list.value.forEach((item, index) => {
        if (item.isPermanent || item.isPin) {
          toIndex = index
        }
      })
      if (index > toIndex) {
        list.value.splice(toIndex + 1, 0, list.value[index])
        list.value.splice(index + 1, 1)
      }
      // 修改状态
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          item.isPin = true
        }
      })
      updateStorage(list.value, userStore.account)
    }
    // 取消固定标签页（移动到最后一个常驻或固定标签页后面）
    function unPin(tabId: Tabbar.recordRaw['tabId']) {
      const index = list.value.findIndex(item => item.tabId === tabId)
      let toIndex = -1
      list.value.forEach((item, index) => {
        if (item.isPermanent || item.isPin) {
          toIndex = index
        }
      })
      list.value.splice(toIndex + 1, 0, list.value[index])
      list.value.splice(index, 1)
      // 修改状态
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          item.isPin = false
        }
      })
      updateStorage(list.value, userStore.account)
    }
    // 清空所有标签页，登出的时候需要清空
    function clean() {
      list.value = []
    }
    // 拖拽排序
    function sort(data: Tabbar.recordRaw[]) {
      list.value = data
    }
    // 修改标签页标题
    function editTitle({ tabId, title }: {
      tabId: Tabbar.recordRaw['tabId']
      title: Tabbar.recordRaw['title']
    }) {
      list.value.forEach((item) => {
        if (item.tabId === tabId && item.title !== title) {
          item.title = title
        }
      })
    }
    // 根据 localstorage 数据复原当前帐号的固定标签页
    function recoveryStorage(account: string) {
      if (storage.local.has('tabbarPinData')) {
        list.value = JSON.parse(storage.local.get('tabbarPinData') as string)[account] || []
      }
    }

    return {
      list,
      leaveIndex,
      initPermanentTab,
      add,
      remove,
      removeOtherSide,
      removeLeftSide,
      removeRightSide,
      pin,
      unPin,
      clean,
      sort,
      editTitle,
      recoveryStorage,
    }
  },
)

export default useTabbarStore

<script lang="ts" setup name="Tabbar">
import Sortable from 'sortablejs'
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import { useI18n } from 'vue-i18n'
import hotkeys from 'hotkeys-js'
import { ElMessageBox } from 'element-plus'
import useSettingsStore from '@/store/modules/settings'
import useTabbarStore from '@/store/modules/tabbar'
import eventBus from '@/utils/eventBus'
import storage from '@/utils/storage'
import { InjectionI18nTitle } from '@/utils/injectionKeys'
import type { Tabbar } from '#/global'

const route = useRoute()
const router = useRouter()

const settingsStore = useSettingsStore()
const tabbarStore = useTabbarStore()

const tabbar = useTabbar()

const { t } = useI18n()

const generateI18nTitle = inject(InjectionI18nTitle) as Function

const activedTabId = computed(() => tabbar.getId())
const isShowMoreAction = computed(() => tabbarStore.list.length > 1 && (tabbar.checkCloseOtherSide() || tabbar.checkCloseLeftSide() || tabbar.checkCloseRightSide()))

const tabbarList = computed({
  get() {
    return tabbarStore.list
  },
  set(value) {
    tabbarStore.sort(value)
  },
})

const tabsRef = ref()
const tabContainerRef = ref()
const tabRef = ref<any>([])
const setTabRef = (el: any) => tabRef.value.push(el)
onBeforeUpdate(() => {
  tabRef.value = []
})
const dropdownTabContainerRef = ref()

const isDragging = ref(false)
let tabSortable: Sortable
// eslint-disable-next-line unused-imports/no-unused-vars
let dropdownTabSortable: Sortable
onMounted(() => {
  tabSortable = new Sortable(tabContainerRef.value.$el, {
    animation: 200,
    ghostClass: 'tab-ghost',
    draggable: '.tab',
    handle: '.drag-handle',
    filter: '.no-drag',
    onStart: () => {
      isDragging.value = true
    },
    onEnd: () => {
      isDragging.value = false
    },
    onUpdate: (e) => {
      if (e.newIndex !== undefined && e.oldIndex !== undefined) {
        tabbarList.value.splice(e.newIndex, 0, tabbarList.value.splice(e.oldIndex, 1)[0])
      }
    },
  })
})
watch(() => dropdownTabContainerRef.value, (val) => {
  if (val) {
    dropdownTabSortable = new Sortable(dropdownTabContainerRef.value.$el, {
      animation: 200,
      ghostClass: 'ghost',
      draggable: '.tab',
      filter: '.no-drag',
      onStart: () => {
        isDragging.value = true
      },
      onEnd: () => {
        isDragging.value = false
      },
      onUpdate: (e) => {
        if (e.newIndex !== undefined && e.oldIndex !== undefined) {
          tabbarList.value.splice(e.newIndex, 0, tabbarList.value.splice(e.oldIndex, 1)[0])
        }
      },
    })
  }
})
watch(() => settingsStore.mode, (val) => {
  nextTick(() => {
    tabSortable?.option('disabled', val === 'mobile')
  })
}, {
  immediate: true,
})

watch(() => route, (val) => {
  if (settingsStore.settings.tabbar.enable) {
    tabbarStore.add(val).then(() => {
      const index = tabbarList.value.findIndex(item => item.tabId === activedTabId.value)
      index !== -1 && scrollTo(tabRef.value[index].offsetLeft)
      tabbarScrollTip()
    })
  }
}, {
  immediate: true,
  deep: true,
})

function tabbarScrollTip() {
  if (tabContainerRef.value.$el.clientWidth > tabsRef.value.clientWidth && !storage.local.has('tabbarScrollTip')) {
    ElMessageBox.confirm('顶部标签栏数量超过展示区域范围，你可以将鼠标移到标签栏上，然后通过鼠标滚轮滑动浏览', '温馨提示', {
      confirmButtonText: '知道了',
      showCancelButton: false,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: 'info',
      center: true,
    }).then(() => {
      storage.local.set('tabbarScrollTip', '')
    })
  }
}
function tabbarMaximizeTip() {
  if (!storage.local.has('tabbarMaximizeTip')) {
    ElMessageBox.confirm('你也可以通过双击标签栏进行最大化操作', '温馨提示', {
      confirmButtonText: '知道了',
      showCancelButton: false,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      type: 'info',
      center: true,
    }).then(() => {
      storage.local.set('tabbarMaximizeTip', '')
    })
  }
}
function handlerMouserScroll(event: WheelEvent) {
  tabsRef.value.scrollBy({
    left: (event.deltaY || event.detail) > 0 ? 50 : -50,
  })
}
function scrollTo(offsetLeft: number) {
  tabsRef.value.scrollTo({
    left: offsetLeft - 50,
    behavior: 'smooth',
  })
}
function actionCommand(command: 'search-tabs' | 'other-side' | 'left-side' | 'right-side') {
  switch (command) {
    case 'search-tabs':
      eventBus.emit('global-search-toggle', 'tab')
      break
    case 'other-side':
      tabbar.closeOtherSide()
      break
    case 'left-side':
      tabbar.closeLeftSide()
      break
    case 'right-side':
      tabbar.closeRightSide()
      break
  }
}
function onTabbarContextmenu(event: MouseEvent, routeItem: Tabbar.recordRaw) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    zIndex: 1000,
    iconFontClass: '',
    customClass: 'contextmenu-custom',
    items: [
      {
        label: t('app.tabbar.reload'),
        icon: 'i-ri:refresh-line',
        disabled: routeItem.tabId !== activedTabId.value,
        onClick: () => useMainPage().reload(),
      },
      {
        label: t('app.tabbar.close'),
        icon: 'i-ri:close-line',
        disabled: tabbarStore.list.length <= 1 || routeItem.isPin || routeItem.isPermanent,
        divided: true,
        onClick: () => {
          tabbar.closeById(routeItem.tabId)
        },
      },
      {
        label: routeItem.isPin ? t('app.tabbar.unpin') : t('app.tabbar.pin'),
        icon: routeItem.isPin ? 'i-ri:pushpin-line' : 'i-ri:pushpin-2-line',
        // 主页不允许被固定，因为如果固定主页且主页未启用，会导致登录时进入路由死循环状态
        disabled: routeItem.fullPath === '/' || routeItem.isPermanent,
        onClick: () => {
          if (routeItem.isPin) {
            tabbarStore.unPin(routeItem.tabId)
          }
          else {
            tabbarStore.pin(routeItem.tabId)
          }
        },
      },
      {
        label: t('app.tabbar.maximize'),
        icon: 'i-ri:picture-in-picture-exit-line',
        divided: true,
        onClick: () => {
          if (routeItem.tabId !== activedTabId.value) {
            router.push(routeItem.fullPath)
          }
          tabbarMaximizeTip()
          settingsStore.setMainPageMaximize()
        },
      },
      {
        label: t('app.tabbar.closeOtherSide'),
        disabled: !tabbar.checkCloseOtherSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeOtherSide(routeItem.tabId)
        },
      },
      {
        label: t('app.tabbar.closeLeftSide'),
        disabled: !tabbar.checkCloseLeftSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeLeftSide(routeItem.tabId)
        },
      },
      {
        label: t('app.tabbar.closeRightSide'),
        disabled: !tabbar.checkCloseRightSide(routeItem.tabId),
        onClick: () => {
          tabbar.closeRightSide(routeItem.tabId)
        },
      },
    ],
  })
}

function iconName(isActive: boolean, icon: Tabbar.recordRaw['icon'], activeIcon: Tabbar.recordRaw['activeIcon']) {
  let name
  if ((!isActive && icon) || (isActive && !activeIcon)) {
    name = icon
  }
  else if (isActive && activeIcon) {
    name = activeIcon
  }
  return name
}

onMounted(() => {
  hotkeys('alt+q,alt+e,alt+w,alt+1,alt+2,alt+3,alt+4,alt+5,alt+6,alt+7,alt+8,alt+9,alt+0', (e, handle) => {
    if (settingsStore.settings.tabbar.enable && settingsStore.settings.tabbar.enableHotkeys) {
      e.preventDefault()
      switch (handle.key) {
        // 切换到当前标签页紧邻的上一个标签页
        case 'alt+q':
          if (tabbarStore.list[0].tabId !== activedTabId.value) {
            const index = tabbarStore.list.findIndex(item => item.tabId === activedTabId.value)
            router.push(tabbarStore.list[index - 1].fullPath)
          }
          break
        // 切换到当前标签页紧邻的下一个标签页
        case 'alt+e':
          if (tabbarStore.list.at(-1)?.tabId !== activedTabId.value) {
            const index = tabbarStore.list.findIndex(item => item.tabId === activedTabId.value)
            router.push(tabbarStore.list[index + 1].fullPath)
          }
          break
        // 关闭当前标签页
        case 'alt+w':
          tabbar.closeById(activedTabId.value)
          break
        // 切换到第 n 个标签页
        case 'alt+1':
        case 'alt+2':
        case 'alt+3':
        case 'alt+4':
        case 'alt+5':
        case 'alt+6':
        case 'alt+7':
        case 'alt+8':
        case 'alt+9':
        {
          const number = Number(handle.key.split('+')[1])
          tabbarStore.list[number - 1]?.fullPath && router.push(tabbarStore.list[number - 1].fullPath)
          break
        }
        // 切换到最后一个标签页
        case 'alt+0':
          router.push(tabbarStore.list[tabbarStore.list.length - 1].fullPath)
          break
      }
    }
  })
})
onUnmounted(() => {
  hotkeys.unbind('alt+q,alt+e,alt+w,alt+1,alt+2,alt+3,alt+4,alt+5,alt+6,alt+7,alt+8,alt+9,alt+0')
})
</script>

<template>
  <div class="tabbar-container">
    <div
      ref="tabsRef" class="tabs" :class="{
        'tabs-ontop': settingsStore.settings.topbar.switchTabbarAndToolbar,
        [`tabs-${settingsStore.settings.tabbar.style}`]: true,
      }" @wheel.prevent="handlerMouserScroll"
    >
      <transition-group ref="tabContainerRef" :name="!isDragging ? 'tabbar' : undefined" tag="div" class="tab-container" :class="{ dragging: isDragging }">
        <div
          v-for="element in tabbarList" :key="settingsStore.settings.tabbar.mergeTabsBy === 'routeName' && element.routeName ? element.routeName : element.tabId"
          :ref="setTabRef" class="tab" :class="{
            'tab-ontop': settingsStore.settings.topbar.switchTabbarAndToolbar,
            'actived': element.tabId === activedTabId,
            'no-drag': element.isPermanent || element.isPin,
          }" :title="settingsStore.titleFirst && element.tabId === activedTabId ? element.title : generateI18nTitle(element.i18n, element.title)" @click="router.push(element.fullPath)" @dblclick="settingsStore.setMainPageMaximize()" @contextmenu="onTabbarContextmenu($event, element)"
        >
          <div class="tab-dividers" />
          <div class="tab-background" />
          <div class="tab-content">
            <div :key="element.tabId" class="title">
              <el-icon v-if="settingsStore.settings.tabbar.enableIcon && iconName(element.tabId === activedTabId, element.icon, element.activeIcon)">
                <svg-icon :name="iconName(element.tabId === activedTabId, element.icon, element.activeIcon) as string" />
              </el-icon>
              {{ settingsStore.titleFirst && element.tabId === activedTabId ? element.title : generateI18nTitle(element.i18n, element.title) }}
            </div>
            <el-icon v-if="!element.isPermanent && element.isPin" class="action-icon" @click.stop="tabbarStore.unPin(element.tabId)">
              <svg-icon name="i-ri:pushpin-2-fill" />
            </el-icon>
            <el-icon v-else-if="!element.isPermanent && tabbarStore.list.length > 1" class="action-icon" @click.stop="tabbar.closeById(element.tabId)">
              <svg-icon name="i-ri:close-fill" />
            </el-icon>
            <div class="drag-handle" />
          </div>
        </div>
      </transition-group>
    </div>
    <div v-if="isShowMoreAction" class="more-action">
      <el-dropdown placement="bottom-end" popper-class="tabbar-dropdown">
        <el-icon>
          <svg-icon name="i-ri:arrow-down-s-fill" />
        </el-icon>
        <template #dropdown>
          <div class="quick-button">
            <button class="button" :title="t('app.tabbar.searchTabs')" @click="actionCommand('search-tabs')">
              <el-icon>
                <svg-icon name="i-ep:search" />
              </el-icon>
            </button>
            <button v-if="settingsStore.settings.navSearch.enable" class="button" :disabled="!tabbar.checkCloseOtherSide()" :title="t('app.tabbar.closeOtherSide')" @click="actionCommand('other-side')">
              <el-icon>
                <svg-icon name="i-ep:close" />
              </el-icon>
            </button>
            <button class="button" :disabled="!tabbar.checkCloseLeftSide()" :title="t('app.tabbar.closeLeftSide')" @click="actionCommand('left-side')">
              <el-icon>
                <svg-icon name="i-ph:arrow-line-left" />
              </el-icon>
            </button>
            <button class="button" :disabled="!tabbar.checkCloseRightSide()" :title="t('app.tabbar.closeRightSide')" @click="actionCommand('right-side')">
              <el-icon>
                <svg-icon name="i-ph:arrow-line-right" />
              </el-icon>
            </button>
          </div>
          <el-scrollbar max-height="300px">
            <transition-group ref="dropdownTabContainerRef" :name="!isDragging ? 'dropdown-tab' : undefined" tag="div" class="tabs" :class="{ dragging: isDragging }">
              <div
                v-for="element in tabbarList" :key="element.tabId" class="tab" :class="{
                  'actived': element.tabId === activedTabId,
                  'no-drag': element.isPermanent || element.isPin,
                }"
              >
                <div :key="element.tabId" class="title" :title="settingsStore.titleFirst && element.tabId === activedTabId ? element.title : generateI18nTitle(element.i18n, element.title)" @click="router.push(element.fullPath)">
                  <el-icon v-if="settingsStore.settings.tabbar.enableIcon && iconName(element.tabId === activedTabId, element.icon, element.activeIcon)">
                    <svg-icon :name="iconName(element.tabId === activedTabId, element.icon, element.activeIcon) as string" />
                  </el-icon>
                  {{ settingsStore.titleFirst && element.tabId === activedTabId ? element.title : generateI18nTitle(element.i18n, element.title) }}
                </div>
                <el-icon v-if="!element.isPermanent && element.isPin" class="action-icon" @click.stop="tabbarStore.unPin(element.tabId)">
                  <svg-icon name="i-ri:pushpin-2-fill" />
                </el-icon>
                <el-icon v-else-if="!element.isPermanent && tabbarStore.list.length > 1" class="action-icon" @click.stop="tabbar.closeById(element.tabId)">
                  <svg-icon name="i-ri:close-fill" />
                </el-icon>
              </div>
            </transition-group>
          </el-scrollbar>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss">
.mx-menu-ghost-host {
  z-index: 1000;

  .mx-context-menu {
    position: fixed;
    background-color: var(--g-app-bg);
    box-shadow: var(--el-box-shadow);

    .mx-context-menu-items .mx-context-menu-item {
      transition: background-color 0.3s;

      &:not(.disabled):hover {
        cursor: pointer;
        background-color: var(--el-fill-color);
      }

      span {
        color: var(--el-text-color-primary);
      }

      .icon {
        width: 1em;
        margin-right: 10px;
        color: var(--el-text-color-primary);
      }

      &.disabled span,
      &.disabled .icon {
        color: var(--el-text-color-disabled);
      }
    }

    .mx-context-menu-item-sperator {
      background-color: var(--g-app-bg);

      &::after {
        background-color: var(--el-border-color);
      }
    }
  }
}

.tabbar-dropdown {
  .quick-button {
    padding: 15px 15px 10px;
    display: flex;
    align-items: center;

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 5px;
      cursor: pointer;
      outline: none;
      border: none;
      background-color: var(--el-fill-color);
      transition: var(--el-transition-color), background-color 0.3s;

      &:hover:not(:disabled) {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }

      &:disabled {
        cursor: not-allowed;
      }

      .el-icon {
        font-size: 14px;
      }
    }
  }

  .tabs {
    width: 200px;
    padding: 0 0 10px;

    .el-scrollbar__wrap {
      overscroll-behavior: contain;
    }

    &:not(.dragging) {
      .tab:hover {
        &:not(.actived) {
          background-color: var(--el-fill-color);
        }

        .action-icon {
          opacity: 1;
        }
      }
    }

    .tab {
      position: relative;
      width: calc(100% - 30px);
      height: 30px;
      margin: 0 15px;
      padding: 0 5px;
      border-radius: 5px;
      transition: background-color 0.3s;

      &.actived {
        background-color: var(--el-fill-color-darker);
      }

      &.ghost {
        opacity: 0;
      }

      &:hover {
        .title {
          margin-right: 20px;
          mask-image: linear-gradient(to right, #000 calc(100% - 44px), transparent);
          color: var(--el-text-color-primary);
        }
      }

      * {
        user-select: none;
      }

      .title {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        mask-image: linear-gradient(to right, #000 calc(100% - 24px), transparent);
        color: var(--el-text-color-regular);
        transition: var(--el-transition-color), width 0.3s;

        .el-icon {
          margin-right: 5px;
          font-size: 16px;
        }
      }

      .action-icon {
        position: absolute;
        z-index: 10;
        top: 50%;
        right: 6px;
        margin-top: -9px;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        font-size: 12px;
        opacity: 0;
        pointer-events: all;
        color: var(--g-tabbar-tab-color);
        transition: var(--el-transition-color), var(--el-transition-fade);

        &:hover {
          background-color: var(--el-fill-color-darker);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.tabbar-container {
  position: relative;
  height: var(--g-tabbar-height);
  background-color: var(--g-tabbar-bg);
  transition: background-color 0.3s;

  .tabs {
    position: absolute;
    left: 0;
    right: 0;
    padding-right: 50px;
    overflow-y: hidden;
    white-space: nowrap;

    // firefox隐藏滚动条
    scrollbar-width: none;

    // chrome隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    &.tabs-ontop {
      top: 0 !important;
      bottom: inherit !important;
    }

    .tab-container {
      display: inline-block;

      &:not(.dragging) {
        .tab {
          &:not(.actived):hover {
            z-index: 3;

            &::before,
            &::after {
              content: none;
            }

            .tab-content {
              .title,
              .action-icon {
                color: var(--g-tabbar-tab-hover-color);
              }
            }
          }
        }
      }

      .tab {
        position: relative;
        display: inline-block;
        max-width: var(--g-tabbar-tab-max-width);
        min-width: var(--g-tabbar-tab-min-width);
        height: var(--g-tabbar-height);
        line-height: calc(var(--g-tabbar-height) - 2px);
        vertical-align: bottom;
        font-size: 14px;
        cursor: pointer;
        pointer-events: none;

        * {
          user-select: none;
        }

        &.actived {
          z-index: 5;

          &::before,
          &::after {
            content: none;
          }

          .tab-content {
            .title,
            .action-icon {
              color: var(--g-tabbar-tab-active-color);
            }
          }
        }

        &.tab-ghost {
          opacity: 0 !important;
        }

        .tab-dividers {
          position: absolute;
          z-index: 0;
          height: 14px;
          top: 50%;
          left: 0;
          right: 0;
          margin-top: -7px;

          &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 1px;
            bottom: 0;
            width: 1px;
            opacity: 1;
            background-color: var(--g-tabbar-dividers-bg);
            transition: opacity 0.2s ease, background-color 0.3s;
          }
        }

        &:first-child .tab-dividers::before {
          opacity: 0;
        }

        .tab-background {
          position: absolute;
          z-index: 0;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .tab-content {
          width: 100%;
          height: 100%;
          display: flex;
          pointer-events: all;

          .title {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 10px;
            margin-right: 10px;
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
            color: var(--g-tabbar-tab-color);
            transition: margin-right 0.3s, var(--el-transition-color);

            &:has(+ .action-icon) {
              margin-right: 28px;
            }

            .el-icon {
              margin-right: 5px;
            }
          }

          .action-icon {
            position: absolute;
            z-index: 10;
            top: 50%;
            right: 6px;
            margin-top: -9px;
            width: 1.5em;
            height: 1.5em;
            border-radius: 50%;
            font-size: 12px;
            color: var(--g-tabbar-tab-color);
            transition: var(--el-transition-color);

            &:hover {
              background-color: var(--el-fill-color);
            }
          }

          .drag-handle {
            position: absolute;
            z-index: 9;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      }
    }

    &.tabs-fashion {
      bottom: -1px;

      .tab-container {
        &:not(.dragging) {
          .tab:not(.actived):hover {
            & + .tab .tab-dividers::before {
              opacity: 0;
            }

            .tab-background {
              opacity: 1;

              &::before,
              &::after {
                box-shadow: 0 0 0 20px var(--g-tabbar-tab-hover-bg);
              }
            }
          }
        }

        .tab {
          height: calc(var(--g-tabbar-height) - 10px);
          line-height: calc(var(--g-tabbar-height) - 12px);
          margin-left: 10px;
          margin-right: -10px;

          &:last-child {
            margin-right: 0;
          }

          &.tab-ontop .tab-background {
            transform: rotate(180deg);
          }

          &:not(.actived) .tab-background {
            opacity: 0;
          }

          .tab-background {
            border-radius: 10px 10px 0 0;
            background-color: var(--g-tabbar-tab-hover-bg);
            transition: opacity 0.3s, background-color 0.3s;

            &::before,
            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              width: 20px;
              height: 20px;
              border-radius: 100%;
              box-shadow: 0 0 0 20px transparent;
              transition: box-shadow 0.3s;
            }

            &::before {
              left: -20px;
              clip-path: inset(50% -10px 0 50%);
            }

            &::after {
              right: -20px;
              clip-path: inset(50% 50% 0 -10px);
            }
          }

          &.actived {
            & + .tab .tab-dividers::before {
              opacity: 0;
            }

            .tab-background {
              opacity: 1;
              background-color: var(--g-tabbar-tab-active-bg);

              &::before,
              &::after {
                box-shadow: 0 0 0 20px var(--g-tabbar-tab-active-bg);
              }
            }
          }
        }
      }
    }

    &.tabs-card {
      .tab-container {
        &:not(.dragging) {
          .tab:not(.actived):hover {
            .tab-background {
              background-color: var(--g-tabbar-tab-hover-bg);
            }
          }
        }

        .tab {
          height: calc(var(--g-tabbar-height) - 10px);
          line-height: calc(var(--g-tabbar-height) - 12px);
          margin-top: 5px;
          margin-left: 5px;

          .tab-dividers {
            display: none;
          }

          .tab-background {
            border-radius: 5px;
            transition: background-color 0.3s;
          }

          &.actived {
            .tab-background {
              background-color: var(--g-tabbar-tab-active-bg);
            }
          }
        }
      }
    }

    &.tabs-square {
      .tab-container {
        &:not(.dragging) {
          .tab:not(.actived):hover {
            & + .tab .tab-dividers::before {
              opacity: 0;
            }

            .tab-background {
              &::before {
                height: 100%;
                background-color: var(--g-tabbar-tab-hover-bg);
              }
            }
          }
        }

        .tab {
          .tab-dividers {
            left: -1px;
            right: -1px;
          }

          &.tab-ontop .tab-background {
            transform: rotateX(180deg);
          }

          .tab-background {
            &::before {
              content: "";
              transition: background-color 0.3s;
              position: absolute;
              width: 100%;
              height: 0;
              bottom: 0;
            }

            &::after {
              content: "";
              transition: transform 0.3s;
              position: absolute;
              width: 100%;
              height: 2px;
              left: 0;
              bottom: 0;
              background-color: var(--g-theme-color);
              transform: scaleX(0);
              transform-origin: bottom right;
            }
          }

          &.actived {
            & + .tab .tab-dividers::before {
              opacity: 0;
            }

            .tab-background {
              &::before {
                height: calc(100% - 2px);
                bottom: 2px;
                background-color: var(--g-tabbar-tab-active-bg);
              }

              &::after {
                transform: scaleX(1);
                transform-origin: bottom left;
              }
            }
          }
        }
      }
    }
  }

  .more-action {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50px;
    background-image: linear-gradient(to right, transparent, var(--g-tabbar-bg));

    .el-icon {
      width: 1.5em;
      height: 1.5em;
      border-radius: 5px;
      font-size: 16px;
      color: var(--el-text-color-primary);
      background-color: var(--g-app-bg);
      box-shadow: var(--el-box-shadow-light);
      transition: background-color 0.3s, var(--el-transition-color), var(--el-transition-box-shadow);
      cursor: pointer;
    }
  }
}

// 标签栏动画
.tabs {
  .tabbar-enter-from,
  .tabbar-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  &.tabs-ontop {
    .tabbar-enter-from,
    .tabbar-leave-to {
      opacity: 0;
      transform: translateY(-30px);
    }
  }

  .tabbar-enter-active {
    transition: all 0.3s;
  }

  .tabbar-leave-active {
    position: absolute !important;
    transition: all 0.3s;
  }

  .tabbar-move {
    transition: transform 0.3s;
  }
}

.tabbar-dropdown {
  .dropdown-tab-enter-from,
  .dropdown-tab-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }

  .dropdown-tab-enter-active {
    transition: all 0.3s;
  }

  .dropdown-tab-leave-active {
    position: absolute !important;
    transition: all 0.3s;
  }

  .dropdown-tab-move {
    transition: transform 0.3s;
  }
}
</style>

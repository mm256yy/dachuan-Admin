<script lang="ts" setup name="Search">
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import hotkeys from 'hotkeys-js'
import type { RouteRecordRaw } from 'vue-router'
import eventBus from '@/utils/eventBus'
import { InjectionI18nTitle } from '@/utils/injectionKeys'
import useSettingsStore from '@/store/modules/settings'
import useRouteStore from '@/store/modules/route'
import useMenuStore from '@/store/modules/menu'
import useTabbarStore from '@/store/modules/tabbar'
import type { Menu, Tabbar } from '#/global'

const { t } = useI18n()

const router = useRouter()
const settingsStore = useSettingsStore()
const routeStore = useRouteStore()
const menuStore = useMenuStore()
const tabbarStore = useTabbarStore()

type searchTypes = 'menu' | 'tab'
interface listTypes {
  path: string
  icon?: string
  title?: string | Function
  i18n?: string
  link?: string
  breadcrumb: any[]
}

const generateI18nTitle = inject(InjectionI18nTitle) as Function
const isShow = ref(false)
const searchType = ref<searchTypes>()
const searchInput = ref('')
const sourceList = ref<listTypes[]>([])
const actived = ref(-1)

const searchInputRef = ref()
const searchResultRef = ref()
const searchResultItemRef = ref<any>([])
const setSearchResultItemRef = (el: any) => searchResultItemRef.value.push(el)
onBeforeUpdate(() => {
  searchResultItemRef.value = []
})

const resultList = computed(() => {
  let result = []
  result = sourceList.value.filter((item) => {
    let flag = false
    if (generateI18nTitle(item.i18n, item.title).toString().includes(searchInput.value)) {
      flag = true
    }
    if (item.path.includes(searchInput.value)) {
      flag = true
    }
    if (item.breadcrumb.some((b: { i18n: any; title: any }) => generateI18nTitle(b.i18n, b.title).toString().includes(searchInput.value))) {
      flag = true
    }
    return flag
  })
  return result
})

watch(() => isShow.value, (val) => {
  if (val) {
    document.body.classList.add('hidden')
    searchResultRef.value && (searchResultRef.value.scrollTop = 0)
    // 当搜索显示的时候绑定上、下、回车快捷键，隐藏的时候再解绑。另外当 input 处于 focus 状态时，采用 vue 来绑定键盘事件
    hotkeys('up', keyUp)
    hotkeys('down', keyDown)
    hotkeys('enter', keyEnter)
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 500)
  }
  else {
    document.body.classList.remove('hidden')
    hotkeys.unbind('up', keyUp)
    hotkeys.unbind('down', keyDown)
    hotkeys.unbind('enter', keyEnter)
    setTimeout(() => {
      searchInput.value = ''
      actived.value = -1
    }, 500)
  }
})
watch(() => resultList.value, () => {
  actived.value = -1
  handleScroll()
})

onMounted(() => {
  eventBus.on('global-search-toggle', (type) => {
    if (!isShow.value) {
      initSourceList(type)
    }
    isShow.value = !isShow.value
  })
  hotkeys('alt+s', (e) => {
    if (settingsStore.settings.navSearch.enable && settingsStore.settings.navSearch.enableHotkeys) {
      e.preventDefault()
      initSourceList()
      isShow.value = true
    }
  })
  hotkeys('esc', (e) => {
    if (settingsStore.settings.navSearch.enable && settingsStore.settings.navSearch.enableHotkeys) {
      e.preventDefault()
      isShow.value = false
    }
  })
  initSourceList()
})

function switchType(type: any) {
  searchInputRef.value.focus()
  initSourceList(type)
}

function initSourceList(type: searchTypes = 'menu') {
  searchType.value = type
  sourceList.value = []
  switch (type) {
    case 'menu':
      if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
        routeStore.routes.forEach((item) => {
          item.children && getSourceList(item.children as RouteRecordRaw[])
        })
      }
      else {
        menuStore.menus.forEach((item) => {
          getSourceListByMenus(item.children)
        })
      }
      break
    case 'tab':
      getSourceListByTabs(tabbarStore.list)
      break
  }
}

function hasChildren(item: RouteRecordRaw) {
  let flag = true
  if (item.children?.every(i => i.meta?.sidebar === false)) {
    flag = false
  }
  return flag
}
function getSourceList(arr: RouteRecordRaw[], basePath?: string, icon?: string, breadcrumb?: { title?: string | Function; i18n?: string }[]) {
  arr.forEach((item) => {
    if (item.meta?.sidebar !== false) {
      const breadcrumbTemp = cloneDeep(breadcrumb) || []
      if (item.children && hasChildren(item)) {
        breadcrumbTemp.push({
          title: item.meta?.title,
          i18n: item.meta?.i18n,
        })
        getSourceList(item.children, basePath ? [basePath, item.path].join('/') : item.path, item.meta?.icon ?? icon, breadcrumbTemp)
      }
      else {
        breadcrumbTemp.push({
          title: item.meta?.title,
          i18n: item.meta?.i18n,
        })
        sourceList.value.push({
          path: basePath ? [basePath, item.path].join('/') : item.path,
          icon: item.meta?.icon ?? icon,
          title: item.meta?.title,
          i18n: item.meta?.i18n,
          link: item.meta?.link,
          breadcrumb: breadcrumbTemp,
        })
      }
    }
  })
}
function getSourceListByMenus(arr: Menu.recordRaw[], icon?: string, breadcrumb?: { title?: string | Function; i18n?: string }[]) {
  arr.forEach((item) => {
    const breadcrumbTemp = cloneDeep(breadcrumb) || []
    if (item.children && item.children.length > 0) {
      breadcrumbTemp.push({
        title: item.meta?.title,
        i18n: item.meta?.i18n,
      })
      getSourceListByMenus(item.children, item.meta?.icon ?? icon, breadcrumbTemp)
    }
    else {
      breadcrumbTemp.push({
        title: item.meta?.title,
        i18n: item.meta?.i18n,
      })
      sourceList.value.push({
        icon: item.meta?.icon ?? icon,
        title: item.meta?.title,
        path: item.path as string,
        i18n: item.meta?.i18n,
        breadcrumb: breadcrumbTemp,
      })
    }
  })
}
function getSourceListByTabs(arr: Tabbar.recordRaw[]) {
  arr.forEach((item) => {
    sourceList.value.push({
      icon: item.icon,
      title: item.title,
      path: item.fullPath,
      i18n: item.i18n,
      breadcrumb: [],
    })
  })
}

function keyUp() {
  if (resultList.value.length) {
    actived.value -= 1
    if (actived.value < 0) {
      actived.value = resultList.value.length - 1
    }
    handleScroll()
  }
}
function keyDown() {
  if (resultList.value.length) {
    actived.value += 1
    if (actived.value > resultList.value.length - 1) {
      actived.value = 0
    }
    handleScroll()
  }
}
function keyEnter() {
  if (actived.value !== -1) {
    searchResultItemRef.value[actived.value].click()
  }
}
function handleScroll() {
  if (searchResultRef.value) {
    let scrollTo = 0
    if (actived.value !== -1) {
      scrollTo = searchResultRef.value.scrollTop
      const activedOffsetTop = searchResultItemRef.value[actived.value].offsetTop
      const activedClientHeight = searchResultItemRef.value[actived.value].clientHeight
      const searchScrollTop = searchResultRef.value.scrollTop
      const searchClientHeight = searchResultRef.value.clientHeight
      if (activedOffsetTop + activedClientHeight > searchScrollTop + searchClientHeight) {
        scrollTo = activedOffsetTop + activedClientHeight - searchClientHeight
      }
      else if (activedOffsetTop <= searchScrollTop) {
        scrollTo = activedOffsetTop
      }
    }
    searchResultRef.value.scrollTo({
      top: scrollTo,
    })
  }
}

function pageJump(path: listTypes['path'], link: listTypes['link']) {
  if (link) {
    window.open(link, '_blank')
  }
  else {
    router.push(path)
  }
}
</script>

<template>
  <div id="search" :class="{ searching: isShow }" @click="isShow && eventBus.emit('global-search-toggle')">
    <div class="container">
      <div class="search-box" @click.stop>
        <div v-if="settingsStore.settings.tabbar.enable" class="switch-type">
          <el-radio-group v-model="searchType" size="large" @change="switchType">
            <el-radio-button label="menu">
              {{ t('app.search.type.menu') }}
            </el-radio-button>
            <el-radio-button label="tab">
              {{ t('app.search.type.tab') }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-input ref="searchInputRef" v-model="searchInput" :placeholder="t('app.search.input')" clearable @keydown.esc="eventBus.emit('global-search-toggle')" @keydown.up.prevent="keyUp" @keydown.down.prevent="keyDown" @keydown.enter.prevent="keyEnter">
          <template #prefix>
            <el-icon>
              <svg-icon name="i-ep:search" />
            </el-icon>
          </template>
        </el-input>
        <div v-if="settingsStore.mode === 'pc'" class="tips">
          <div v-if="settingsStore.settings.navSearch.enableHotkeys" class="tip">
            <el-tag type="info" size="large">
              {{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }} + S
            </el-tag>
            <el-tag type="info" size="large">
              {{ t('app.search.alt_s') }}
            </el-tag>
          </div>
          <div class="tip">
            <el-tag type="info" size="large">
              <el-icon>
                <svg-icon name="i-ant-design:caret-up-filled" />
              </el-icon>
            </el-tag>
            <el-tag type="info" size="large">
              <el-icon>
                <svg-icon name="i-ant-design:caret-down-filled" />
              </el-icon>
            </el-tag>
            <el-tag type="info" size="large">
              {{ t('app.search.up_down') }}
            </el-tag>
          </div>
          <div class="tip">
            <el-tag type="info" size="large">
              <el-icon>
                <svg-icon name="i-ion:md-return-left" />
              </el-icon>
            </el-tag>
            <el-tag type="info" size="large">
              {{ t('app.search.enter') }}
            </el-tag>
          </div>
          <div v-if="settingsStore.settings.navSearch.enableHotkeys" class="tip">
            <el-tag type="info" size="large">
              ESC
            </el-tag>
            <el-tag type="info" size="large">
              {{ t('app.search.esc') }}
            </el-tag>
          </div>
        </div>
      </div>
      <div ref="searchResultRef" class="result">
        <a v-for="(item, index) in resultList" :ref="setSearchResultItemRef" :key="item.path" class="item" :class="{ actived: index === actived }" @click="pageJump(item.path, item.link)" @mouseover="actived = index">
          <div class="icon">
            <el-icon v-if="item.icon">
              <svg-icon :name="item.icon" />
            </el-icon>
          </div>
          <div class="info">
            <div class="title">{{ generateI18nTitle(item.i18n, item.title) }}</div>
            <div class="breadcrumb">
              <span v-for="(bc, bcIndex) in item.breadcrumb" :key="bcIndex">
                {{ generateI18nTitle(bc.i18n, bc.title) }}
                <el-icon>
                  <svg-icon name="i-ep:arrow-right" />
                </el-icon>
              </span>
            </div>
            <div class="path">{{ item.path }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#search {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(transparent 1px, rgb(0 0 0 / 30%) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  transition: all 0.2s;
  opacity: 0;
  visibility: hidden;

  &.searching {
    opacity: 1;
    visibility: visible;

    .container {
      transform: initial;
      filter: initial;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    transition: all 0.2s;
    transform: scale(1.1);
    filter: blur(10px);

    .search-box {
      margin: 50px 20px 40px;
      text-align: center;

      .switch-type {
        margin: -20px 0 20px;
      }

      :deep(.el-input__inner) {
        height: 52px;
        line-height: 52px;
      }

      .tips {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        font-weight: bold;

        .tip {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 20px;

          .el-tag {
            margin: 0 5px;

            &:first-child {
              margin-left: 0;
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }

    .result {
      position: relative;
      margin: 0 20px 50px;
      border-radius: 5px;
      overflow: auto;
      background-color: var(--el-bg-color);
      box-shadow: 0 0 0 1px var(--el-border-color-darker);

      .item {
        display: flex;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.1s;

        &.actived {
          background-color: var(--el-bg-color-page);

          .icon {
            .el-icon {
              color: var(--el-color-primary);
              transform: scale(1.2);
            }
          }

          .info {
            border-left-color: var(--el-border-color);

            .title {
              color: var(--el-text-color-primary);
            }

            .breadcrumb,
            .path {
              color: var(--el-text-color-regular);
            }
          }
        }

        .icon {
          flex: 0 0 66px;
          text-align: center;

          .el-icon {
            color: var(--el-color-info);
            font-size: 20px;
            transition: all 0.1s;
          }
        }

        .info {
          flex: 1;
          height: 70px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          border-left: 1px solid var(--el-border-color-lighter);
          padding: 5px 10px 7px;
          transition: all 0.1s;

          @include text-overflow(1, true);

          .title {
            font-size: 18px;
            font-weight: bold;
            color: var(--el-text-color-regular);

            @include text-overflow(1, true);

            .el-icon {
              font-size: 14px;
            }
          }

          .breadcrumb,
          .path {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            transition: all 0.1s;

            @include text-overflow(1, true);
          }

          .breadcrumb {
            display: flex;
            align-items: center;

            span {
              display: flex;
              align-items: center;

              .el-icon {
                margin: 0 5px;
              }

              &:last-child .el-icon {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>

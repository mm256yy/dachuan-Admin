<script lang="ts" setup name="SidebarItem">
import SidebarItem from './sub.vue'
import type { Menu } from '#/global'
import { InjectionI18nTitle } from '@/utils/injectionKeys'

defineProps({
  item: {
    type: Object as () => Menu.recordMainRaw,
    required: true,
  },
})

const generateI18nTitle = inject(InjectionI18nTitle) as Function
</script>

<template>
  <div class="sidebar-item">
    <el-sub-menu :title="generateI18nTitle(item.meta?.i18n, item.meta?.title)" :index="JSON.stringify(item)" popper-class="fa-popup-menu">
      <template #title>
        <div class="item">
          <el-icon v-if="item.meta?.icon" class="title-icon unactive">
            <svg-icon :name="item.meta.icon" />
          </el-icon>
          <el-icon v-if="item.meta?.activeIcon || item.meta?.icon" class="title-icon active">
            <svg-icon :name="(item.meta.activeIcon || item.meta.icon) as string" />
          </el-icon>
          <span class="title">{{ generateI18nTitle(item.meta?.i18n, item.meta?.title) }}</span>
        </div>
      </template>
      <template v-for="route in item.children">
        <SidebarItem v-if="route.meta?.sidebar !== false" :key="route.path" :item="route" />
      </template>
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-sub-menu) {
  > .el-sub-menu__title .title-icon.active {
    display: none;
  }

  &.is-active {
    > .el-sub-menu__title .title-icon.unactive {
      display: none;
    }

    > .el-sub-menu__title .title-icon.active {
      display: block;
    }
  }
}
</style>

<script lang="ts" setup name="I18nSelector">
import { useI18n } from 'vue-i18n'
import { getElementLocales } from '@/locales'
import useSettingsStore from '@/store/modules/settings'
import { InjectionI18nTitle } from '@/utils/injectionKeys'

const { locale } = useI18n()
const route = useRoute()

const settingsStore = useSettingsStore()

const locales = computed(() => getElementLocales())

const generateI18nTitle = inject(InjectionI18nTitle) as Function

function languageCommand(command: string) {
  locale.value = command
  settingsStore.setDefaultLang(command)
  if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
    if (route.meta.breadcrumbNeste?.at(-1)?.i18n || route.meta.breadcrumbNeste?.at(-1)?.title) {
      settingsStore.setTitle(generateI18nTitle(route.meta.breadcrumbNeste?.at(-1)?.i18n, route.meta.breadcrumbNeste?.at(-1)?.title), false)
    }
  }
  else {
    if (route.meta.i18n || route.meta.title) {
      settingsStore.setTitle(generateI18nTitle(route.meta.i18n, route.meta.title), false)
    }
  }
}
</script>

<template>
  <el-dropdown v-if="settingsStore.settings.toolbar.enableI18n" class="language-container" size="default" @command="languageCommand">
    <slot />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="(item, index) in locales" :key="index" :disabled="settingsStore.settings.app.defaultLang === item.name" :command="item.name">
          {{ item.labelName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

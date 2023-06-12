import type { App } from 'vue'
import { cloneDeep } from 'lodash-es'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import elementLocaleZhCN from 'element-plus/lib/locale/lang/zh-cn'
import elementLocaleZhTW from 'element-plus/lib/locale/lang/zh-tw'
import elementLocaleEn from 'element-plus/lib/locale/lang/en'
import useSettingsStore from '@/store/modules/settings'

function setupI18n() {
  const settingsStore = useSettingsStore()
  // 如果没设置默认语言，则根据当前浏览器语言设置默认语言
  if (!settingsStore.settings.app.defaultLang) {
    const lang = navigator.language.toLowerCase()
    for (const key in messages) {
      lang.includes(key) && settingsStore.setDefaultLang(key)
    }
  }
  const i18n = createI18n({
    legacy: false,
    locale: settingsStore.settings.app.defaultLang,
    flatJson: true,
    fallbackLocale: 'zh-cn',
    messages,
  })
  return i18n
}

function useI18n(app: App) {
  app.use(setupI18n())
}

function getLocales() {
  return cloneDeep(messages)
}

function getElementLocales() {
  const locales: {
    [key: string]: any
  } = {}
  for (const key in messages) {
    locales[key] = {}
    switch (key) {
      case 'zh-cn':
        Object.assign(locales[key], elementLocaleZhCN, { labelName: '中文(简体)' })
        break
      case 'zh-tw':
        Object.assign(locales[key], elementLocaleZhTW, { labelName: '中文(繁體)' })
        break
      case 'en':
        Object.assign(locales[key], elementLocaleEn, { labelName: 'English' })
        break
    }
  }
  return locales
}

export {
  setupI18n,
  useI18n,
  getLocales,
  getElementLocales,
}

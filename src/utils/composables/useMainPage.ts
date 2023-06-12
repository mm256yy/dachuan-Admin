import router from '@/router'
import useSettingsStore from '@/store/modules/settings'

export default function useMainPage() {
  const settingsStore = useSettingsStore()

  function reload() {
    router.push({
      name: 'reload',
    })
  }

  function maximize(status: boolean) {
    settingsStore.setMainPageMaximize(status)
  }

  return {
    reload,
    maximize,
  }
}

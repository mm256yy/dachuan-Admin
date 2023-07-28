import watermark from '../watermark'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import storage from '@/utils/storage'

export default function useWatermark() {
  const settingsStore = useSettingsStore()
  const userStore = useUserStore()
  const { init, remove } = watermark()

  watch(() => settingsStore.settings.app.enableWatermark, (val) => {
    if (val) {
      loadWatermark()
    }
    else {
      removeWatermark()
    }
  }, {
    immediate: true,
  })

  watch(() => settingsStore.settings.app.colorScheme, () => {
    if (settingsStore.settings.app.enableWatermark) {
      loadWatermark()
    }
  })

  function loadWatermark() {
    // 水印更多设置请查看 watermark.ts
    init({
      // text: `大川长风 页面水印 ${userStore.account}`,
      text: ` ID:${storage.local.get('adminId')}${userStore.account}`,
      width: 200,
      rows:2,
      x: 0,
      y: 0,
      x_space: 50,
      y_space: 50,
      alpha: 0.05,
      color: settingsStore.settings.app.colorScheme === 'light' ? 'black' : 'white',
    })
  }

  function removeWatermark() {
    try {
      remove()
    }
    catch (err) {
      // 忽略报错
    }
  }

  return {
    loadWatermark,
    removeWatermark,
  }
}

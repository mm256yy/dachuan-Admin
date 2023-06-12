import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueLegacy from '@vitejs/plugin-legacy'

import createInspector from './inspector'
import createAutoImport from './auto-import'
import createComponents from './components'
import createSetupExtend from './setup-extend'
import createUnocss from './unocss'
import createSvgIcon from './svg-icon'
import createI18n from './i18n'
import createMock from './mock'
import createLayouts from './layouts'
import createPages from './pages'
import createCompression from './compression'
import createSpritesmith from './spritesmith'
import createBanner from './banner'

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue({
      reactivityTransform: true,
    }),
    vueJsx(),
    vueLegacy({
      renderLegacyChunks: false,
      modernPolyfills: [
        'es.array.at',
      ],
    }),
  ]
  vitePlugins.push(createInspector())
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createUnocss())
  vitePlugins.push(createSvgIcon(isBuild))
  vitePlugins.push(createI18n())
  vitePlugins.push(createMock(viteEnv, isBuild))
  vitePlugins.push(createLayouts())
  vitePlugins.push(createPages())
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  vitePlugins.push(...createSpritesmith(isBuild))
  vitePlugins.push(createBanner())
  return vitePlugins
}

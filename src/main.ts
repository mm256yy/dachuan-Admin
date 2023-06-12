import './utils/system.copyright'
import ElementPlus from 'element-plus'
import JsonViewer from 'vue3-json-viewer'
import App from './App.vue'
import pinia from './store'
import router from './router'
import { useI18n } from './locales'
// json插件
// 自定义指令
import directive from '@/utils/directive'
// 错误日志上报
import errorLog from '@/utils/error.log'
// 加载 svg 图标
import 'virtual:svg-icons-register'

// 加载 iconify 图标
import { downloadAndInstall } from '@/iconify'
import icons from '@/iconify/index.json'
// 全局样式
import 'uno.css'
import '@/assets/styles/globals.scss'
import '@/store/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'


const app = createApp(App)

// app.config.globalProperties.$authority = {}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(JsonViewer)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
useI18n(app)
directive(app)
errorLog(app)
if (icons.useType === 'offline') {
  for (const info of icons.collections) {
    downloadAndInstall(info)
  }
}

app.mount('#app')

import type { App } from 'vue'
import Component from './index.vue'

let instance: App
let mountNode: HTMLElement

function loadingShow(options: {
  type?: string
  size?: number
  color?: string
}) {
  instance = createApp(Component, options)
  mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  instance.mount(mountNode)
}

function loadingHide() {
  instance.unmount()
  document.body.removeChild(mountNode)
}

export {
  loadingShow,
  loadingHide,
}

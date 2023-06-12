<script lang="ts" setup name="IframeView">
import useIframeStore from '@/store/modules/iframe'

const route = useRoute()

const iframeStore = useIframeStore()

const iframeRef = ref()

watch(() => route.fullPath, (val) => {
  nextTick(() => {
    iframeRef.value?.forEach((item: HTMLIFrameElement) => {
      if (item.dataset.path === val) {
        item.onload = () => {
          iframeStore.closeLoading(val)
        }
      }
    })
  })
}, {
  immediate: true,
})
</script>

<template>
  <div class="iframe-view">
    <div v-for="item in iframeStore.openedList" :key="item.path" v-loading="item.isLoading" class="iframe" :class="{ actived: route.fullPath === item.path }">
      <transition name="iframe" mode="out-in" appear>
        <iframe v-show="route.fullPath === item.path" ref="iframeRef" :data-path="item.path" :src="item.src" frameborder="0" />
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.iframe-view,
.iframe {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.actived {
    z-index: 1;
  }

  iframe {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}

// iframe区动画
.iframe-enter-active {
  transition: 0.2s;
}

.iframe-leave-active {
  transition: 0.15s;
}

.iframe-enter-from {
  opacity: 0;
  margin-left: -20px;
}

.iframe-leave-to {
  opacity: 0;
  margin-left: 20px;
}
</style>

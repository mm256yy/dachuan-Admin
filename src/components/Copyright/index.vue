<script lang="ts" setup name="Copyright">
import useSettingsStore from '@/store/modules/settings'

const route = useRoute()
const settingsStore = useSettingsStore()
</script>

<template>
  <footer v-if="route.meta.copyright ?? settingsStore.settings.copyright.enable" class="copyright">
    <span>Copyright</span>
    <el-icon size="18px">
      <svg-icon name="i-ri:copyright-line" />
    </el-icon>
    <span v-if="settingsStore.settings.copyright.dates">{{ settingsStore.settings.copyright.dates }}</span>
    <template v-if="settingsStore.settings.copyright.company">
      <a v-if="settingsStore.settings.copyright.website" :href="settingsStore.settings.copyright.website" target="_blank" rel="noopener">{{ settingsStore.settings.copyright.company }}</a>
      <span v-else>{{ settingsStore.settings.copyright.company }}</span>
    </template>
    <a v-if="settingsStore.settings.copyright.beian" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">{{ settingsStore.settings.copyright.beian }}</a>
  </footer>
</template>

<style lang="scss" scoped>
.copyright {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 0 20px;
  padding: 0 20px;
  color: var(--el-text-color-secondary);
  font-size: 14px;

  span,
  a {
    padding: 0 5px;
  }

  .el-icon {
    margin: 0 2px;
  }

  a {
    text-align: center;
    text-decoration: none;
    color: var(--el-text-color-secondary);
    transition: var(--el-transition-color);

    &:hover {
      color: var(--el-text-color-primary);
    }
  }
}
</style>

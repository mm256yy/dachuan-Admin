<script lang="ts" setup name="Logo">
import useSettingsStore from "@/store/modules/settings";
import imgLogo from "@/assets/images/logo2.png";

defineProps({
  showLogo: {
    type: Boolean,
    default: true,
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
});

const settingsStore = useSettingsStore();

const title = ref(import.meta.env.VITE_APP_TITLE);
const logo = ref(imgLogo);

const to = computed(() => {
  const rtn: {
    name?: string;
  } = {};
  if (settingsStore.settings.home.enable) {
    rtn.name = "home";
  }
  return rtn;
});
</script>

<template>
  <router-link
    :to="to"
    class="title"
    :class="{ 'is-link': settingsStore.settings.home.enable }"
    :title="title"
  >
    <img
      style="width: 30px; height: 30px; margin-top: 3px"
      v-if="showLogo"
      :src="logo"
      class="logo"
    />
    <div style="display: flex; align-items: center; z-index: 0; width: 160px">
      <span
        v-if="showTitle"
        style="color: #f6ca9d; font-size: 20px; margin-left: 3px"
        >{{ title }}</span
      >
      <div
        style="
          position: absolute;
          background: red;
          padding: 1px 2px;
          border-radius: 3px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          transform: scale(0.75);
          left: 60%;
          top: 20px;
          z-index: 1;
        "
      >
        1.2.02
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  position: fixed;
  z-index: 1000;
  top: 0;
  width: inherit;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--g-sidebar-logo-height);
  text-align: center;
  overflow: hidden;
  text-decoration: none;

  &.is-link {
    cursor: pointer;
  }

  .logo {
    width: 30px;
    height: 30px;
    object-fit: contain;
    vertical-align: bottom;
    & + span {
      margin-left: 10px;
    }
  }

  span {
    display: block;
    font-weight: bold;
    color: #fff;

    @include text-overflow;
  }
}
</style>

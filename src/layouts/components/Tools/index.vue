<script lang="ts" setup name="Tools">
import { useI18n } from "vue-i18n";
import { useFullscreen } from "@vueuse/core";
import Notification from "./Notification/index.vue";
import eventBus from "@/utils/eventBus";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
import useNotificationStore from "@/store/modules/notification";
import { InjectionI18nTitle } from "@/utils/injectionKeys";
import storage from "@/utils/storage";
const router = useRouter();

const settingsStore = useSettingsStore();
const userStore = useUserStore();

const notifucationStore = useNotificationStore();

notifucationStore.init();
const headImg: any = ref(storage.local.get("headImg"));
const { t } = useI18n();

const generateI18nTitle = inject(InjectionI18nTitle) as Function;

const mainPage = useMainPage();
const { isFullscreen, toggle } = useFullscreen();

function userCommand(command: "home" | "setting" | "hotkeys" | "logout") {
  switch (command) {
    case "home":
      router.push({
        name: "home",
      });
      break;
    case "setting":
      router.push({
        name: "personalSetting",
      });
      break;
    case "hotkeys":
      eventBus.emit("global-hotkeys-intro-toggle");
      break;
    case "logout":
      userStore.logout().then(() => {
        router.push({
          name: "login",
        });
      });
      break;
  }
}
</script>

<template>
  <div class="tools">
    <div class="buttons">
      <span
        v-if="settingsStore.settings.navSearch.enable"
        class="item"
        @click="eventBus.emit('global-search-toggle')"
      >
        <el-icon>
          <svg-icon name="i-ri:search-line" />
        </el-icon>
      </span>
      <!-- <el-popover
        v-if="settingsStore.settings.toolbar.enableNotification"
        trigger="hover"
        :show-after="200"
        placement="bottom"
        :width="350"
      >
        <Notification ref="tabs" />
        <template #reference>
          <span class="item">
            <el-badge
              type="primary"
              :value="notifucationStore.total"
              :is-dot="notifucationStore.total > 99"
              :hidden="notifucationStore.total === 0"
            >
              <el-icon>
                <svg-icon name="i-ri:notification-3-line" />
              </el-icon>
            </el-badge>
          </span>
        </template>
      </el-popover> -->
      <i18n-selector>
        <span class="item">
          <el-icon>
            <svg-icon name="i-ri:translate" />
          </el-icon>
        </span>
      </i18n-selector>
      <span
        v-if="
          settingsStore.mode === 'pc' &&
          settingsStore.settings.toolbar.enableFullscreen
        "
        class="item"
        @click="toggle"
      >
        <el-icon>
          <svg-icon
            :name="
              isFullscreen
                ? 'i-ri:fullscreen-exit-line'
                : 'i-ri:fullscreen-line'
            "
          />
        </el-icon>
      </span>
      <span
        v-if="settingsStore.settings.toolbar.enablePageReload"
        class="item"
        @click="mainPage.reload()"
      >
        <el-icon>
          <svg-icon name="i-iconoir:refresh-double" />
        </el-icon>
      </span>
      <span
        v-if="settingsStore.settings.toolbar.enableColorScheme"
        class="item"
        @click="
          settingsStore.setColorScheme(
            settingsStore.settings.app.colorScheme === 'dark' ? 'light' : 'dark'
          )
        "
      >
        <el-icon>
          <svg-icon
            :name="
              settingsStore.settings.app.colorScheme === 'light'
                ? 'i-ri:sun-line'
                : 'i-ri:moon-line'
            "
          />
        </el-icon>
      </span>
      <span
        v-if="settingsStore.settings.toolbar.enableAppSetting"
        class="item"
        @click="eventBus.emit('global-app-setting-toggle')"
      >
        <el-icon>
          <svg-icon name="i-uiw:setting-o" />
        </el-icon>
      </span>
    </div>
    <el-dropdown class="user-container" size="default" @command="userCommand">
      <div class="user-wrapper">
        <el-avatar size="small">
          <!-- <el-icon>
            <svg-icon name="i-ep:user-filled" />
          </el-icon> -->
          <img
            style="
              width: 24px;
              height: 24px;
              overflow: hidden;
              border-radius: 12px;
            "
            :src="headImg"
            alt=""
          />
        </el-avatar>
        {{ userStore.account }}
        <el-icon>
          <svg-icon name="i-ep:caret-bottom" />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown">
          <el-dropdown-item
            v-if="settingsStore.settings.home.enable"
            command="home"
          >
            {{
              generateI18nTitle("route.home", settingsStore.settings.home.title)
            }}
          </el-dropdown-item>
          <el-dropdown-item command="setting">
            {{ t("app.profile") }}
          </el-dropdown-item>
          <el-dropdown-item
            v-if="settingsStore.mode === 'pc'"
            divided
            command="hotkeys"
          >
            {{ t("app.hotkeys") }}
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            {{ t("app.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.tools {
  display: flex;
  align-items: center;
  padding: 0 20px;
  white-space: nowrap;

  .buttons {
    margin-right: 20px;

    .item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 26px;
      width: 34px;
      cursor: pointer;
      vertical-align: middle;

      .el-icon {
        color: var(--el-text-color-primary);
        transition: var(--el-transition-color);
      }

      .el-badge {
        display: flex;
        align-items: center;
      }
    }
  }

  :deep(.language-container) {
    font-size: 16px;
  }

  :deep(.user-container) {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    cursor: pointer;

    .user-wrapper {
      .el-avatar {
        vertical-align: middle;
        margin-top: -2px;
        margin-right: 4px;
      }
    }
  }
}
</style>

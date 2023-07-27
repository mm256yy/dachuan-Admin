<route lang="yaml">
name: personalSetting
meta:
  title: 个人设置
  cache: personal-edit.password
</route>

<script lang="ts" setup name="PersonalSetting">
import api from "@/api/plugin";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";

const settingsStore = useSettingsStore();
const userStore = useUserStore();
const router = useRouter();

const form: any = ref({});

onMounted(() => {
  api
    .get("/api/admin/searchAdminUserById", {
      params: {
        id: localStorage.getItem("fa_adminId"),
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        form.value = res.body;
      }
    });
});

const subimt = () => {
  api.post("/api/admin/updateAdminUser", form.value).then((res: any) => {
    if (res.code == 200) {
      ElMessage.success({
        message: "修改成功!",
        center: true,
      });

      localStorage.setItem("fa_account", form.value.userName);
      localStorage.setItem("fa_login_account", form.value.mobile);
      // router.go(0)
      userStore.logout().then(() => {
        router.push({
          name: "login",
        });
      });
    } else {
      ElMessage.success({
        message: res.msg,
        center: true,
      });
    }
  });
};
// 图片上传
const imageUrl = ref("");
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  form.value.headImg = response.body;
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  return true;
};

const enableWatermark = computed({
  get() {
    return settingsStore.settings.app.enableWatermark;
  },
  set(newValue) {
    settingsStore.$patch((state) => {
      state.settings.app.enableWatermark = newValue;
    });
  },
});

// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  title: "文件管理",
  data: "",
  button_title: "确定",
  width: "1100",
  heigth: "500",
  close_title: "取消",
});
const upload_image = () => {
  dialogPluginList.value.dialogVisible = true;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (data.type == "return") {
    form.value.headImg = data.data[0].url;
  }
};
</script>

<template>
  <div>
    <dialogWindows
      v-if="dialogPluginList.dialogVisible"
      v-model="dialogPluginList.dialogVisible"
      :title="dialogPluginList.title"
      :width="dialogPluginList.width"
      :button_title="dialogPluginList.button_title"
      :height="dialogPluginList.heigth"
      :dialogVisible="dialogPluginList.dialogVisible"
      :close_title="dialogPluginList.close_title"
      :data="dialogPluginList.data"
      @success="Return"
    />
    <page-main>
      <el-tabs tab-position="left" style="height: 600px">
        <el-tab-pane label="基本设置" class="basic">
          <h2>基本设置</h2>
          <el-row :gutter="20">
            <el-radio-group v-model="enableWatermark">
              <el-radio-button :label="true"> 开启 </el-radio-button>
              <el-radio-button :label="false"> 关闭 </el-radio-button>
            </el-radio-group>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="账号设置" class="security">
          <h2>安全设置</h2>
          <div class="setting-list">
            <el-col :span="16">
              <el-form
                ref="formRef"
                :model="form"
                label-width="120px"
                label-suffix="："
              >
                <el-form-item label="用户名">
                  <el-input
                    v-model="form.userName"
                    placeholder="请输入你的名称"
                  />
                </el-form-item>

                <el-form-item label="上传头像">
                  <!-- <el-upload
                      class="avatar-uploader"
                      :action="baseURL"
                      :headers="header"
                      name="file"
                      :data="{ type: 1 }"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="form.headImg" :src="form.headImg" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"> </el-icon>
                    </el-upload> -->
                  <img
                    @click="upload_image"
                    :src="form.headImg"
                    style="height: 80px; width: 80px; border-radius: 50%"
                  />
                </el-form-item>

                <el-form-item label="手机号">
                  <el-input
                    v-model="form.mobile"
                    placeholder="请输入你的手机号"
                  />
                </el-form-item>
                <el-form-item label="账号密码">
                  <el-input
                    v-model="form.password"
                    placeholder="请输入你的账号密码"
                  />
                </el-form-item>
                <el-form-item label="微信号">
                  <div>
                    {{ form.createTime }}
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="subimt"> 保存 </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </el-tab-pane>
      </el-tabs>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
  border-radius: 70px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  text-align: center;
  border: 1px dashed #8c939d;
}

:deep(.el-tabs) {
  .el-tabs__header .el-tabs__nav {
    .el-tabs__active-bar {
      z-index: 0;
      width: 100%;
      background-color: var(--el-color-primary-light-9);
      border-right: 2px solid var(--el-color-primary);
      transition: transform 0.3s, background-color 0.3s,
        var(--el-transition-border);
    }

    .el-tabs__item {
      text-align: left;
      padding-right: 100px;
    }
  }

  .el-tab-pane {
    padding: 0 20px 0 30px;
  }
}

h2 {
  margin: 0;
  margin-bottom: 30px;
  font-weight: normal;
}

.basic {
  :deep(.headimg-upload) {
    text-align: center;

    .el-upload-dragger {
      border-radius: 50%;
    }
  }
}

.security {
  .setting-list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
      transition: var(--el-transition-border);

      .content {
        .title {
          margin-bottom: 5px;
          color: var(--el-text-color-primary);
          transition: var(--el-transition-color);
        }

        .desc {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          transition: var(--el-transition-color);
        }
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>

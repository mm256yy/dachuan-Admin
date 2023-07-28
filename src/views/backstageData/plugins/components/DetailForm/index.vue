<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content" style="border-radius: 10px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="插件名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="插件描述" prop="plugsDescribe">
          <el-input
            type="textarea"
            v-model="form.plugsDescribe"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="数据标识" prop="id">
        <el-input v-model="form.id" placeholder="请输入" clearable />
      </el-form-item> -->
        <el-form-item label="权限标识" prop="authIdentification">
          <el-input
            v-model="form.authIdentification"
            placeholder="请输入"
            clearable
          />
        </el-form-item>

        <el-form-item label="页面路径" prop="paths">
          <el-input v-model="form.paths" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="插件类型" prop="plugsType">
          <el-input v-model="form.plugsType" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="插件图标" prop="icon">
          <!-- <el-upload
            class="avatar-uploader"
            :action="baseURL"
            :headers="header"
            name="file"
            :data="{ type: 1 }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          > -->
          <div @click="upload_file('插件图标')">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              style="
                height: 60px;
                width: 60px;
                border-radius: 8px;
                border: 1px solid #eee;
              "
              class="avatar"
            />
            <el-icon
              v-else
              class="avatar-uploader-icon"
              style="
                height: 60px;
                width: 60px;
                border-radius: 8px;
                border: 1px solid #eee;
              "
              ><Plus
            /></el-icon>
          </div>

          <!-- </el-upload> -->
        </el-form-item>

        <el-form-item label="状态" prop="plugsStatus">
          <el-switch
            v-model="form.plugsStatus"
            inline-prompt
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
  <dialogWindows
    v-if="dialogPluginList.dialogVisible"
    v-model="dialogPluginList.dialogVisible"
    :dialogVisible="dialogPluginList.dialogVisible"
    :source="dialogPluginList.source"
    @success="Return"
  />
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { UploadProps, ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
  }>(),
  {
    modelValue: false,
    id: "",
  }
);
const myVisible = ref(props.modelValue);

const title = computed(() => (props.id === "" ? "新增插件" : "修改插件"));
const form = ref({
  authIdentification: "",
  title: "",
  id: props.id,
  plugsDescribe: "",
  paths: "",
  plugsType: "",
  icon: "",
  plugsStatus: 1,
});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
onMounted(() => {
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsInfoById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value.authIdentification = res.body.authIdentification;
        form.value.title = res.body.title;
        form.value.id = res.body.id;
        form.value.plugsDescribe = res.body.plugsDescribe;
        form.value.paths = res.body.paths;
        form.value.plugsType = res.body.plugsType;
        form.value.icon = res.body.icon;
        form.value.plugsStatus = res.body.plugsStatus;
        imageUrl.value = res.body.icon;
        // emit("success");
        // onCancel();
      });
  }
});

function onSubmit() {
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsInfo", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });

                // emit("success");
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
              }
            });
        }
      });
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsInfo", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                // emit("success");
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
              }
            });
        }
      });
  }
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}

// 图片上传

const imageUrl = ref("");

const types: any = ref("");
// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";

const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_file = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
  types.value = item;
};
const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;

  if (types.value == "插件图标") {
    imageUrl.value = data[0];
    form.value.icon = data[0];
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style>
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
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>

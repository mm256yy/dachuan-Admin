<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
      <el-form-item label="联系人" prop="">
        <el-input
          v-model="form.dataJson.contactsName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="电话" prop="">
        <el-input
          v-model="form.dataJson.mobile"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注" prop="">
        <el-input
          v-model="form.dataJson.remarks"
          placeholder="请输入"
          clearable
        />
      </el-form-item>

      <!-- <el-form-item label="图片信息" prop="formLogo">
        <img
          @click="upload_image('imageUrl')"
          style="
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 1px solid #eee;
          "
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
        />
        <el-icon
          @click="upload_image('imageUrl')"
          style="
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 1px solid #eee;
          "
          v-else
          class="avatar-uploader-icon"
          ><Plus
        /></el-icon>
      </el-form-item> -->
    </el-form>
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
    :title="dialogPluginList.title"
    :width="dialogPluginList.width"
    :button_title="dialogPluginList.button_title"
    :height="dialogPluginList.heigth"
    :dialogVisible="dialogPluginList.dialogVisible"
    :close_title="dialogPluginList.close_title"
    :data="dialogPluginList.data"
    @success="Return"
  />
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
    plugsId: any;
  }>(),
  {
    modelValue: false,
    id: "",
    plugsId: "",
  }
);
const myVisible = ref(props.modelValue);
console.log(props, 999);

const title = computed(() => (props.id === "" ? "新增表单" : "修改表单"));
const form: any = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  dataJson: {},
  formId: "",
  userId: "",
});
const formRef = ref();
const formRules = ref({
  formName: [{ required: true, message: "请输入" }],
});
onMounted(() => {
  if (props.id !== "") {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsFormDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        form.value.dataJson = JSON.parse(form.value.dataJson);
        imageUrl.value = form.value.dataJson.images;
      });
  }
});

function onSubmit() {
  form.value.dataJson = JSON.stringify(form.value.dataJson);
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsFormData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
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
    console.log("xiugai", 999);
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsFormData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                onCancel();
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

const types: any = ref("");
const imageUrl = ref("");

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
const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (data.type == "return") {
    if (types.value == "imageUrl") {
      imageUrl.value = data.data[0].url;
      form.value.dataJson.images = data.data[0].url;
    }
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
.el-date-editor {
  --el-date-editor-width: 390px;
}
</style>

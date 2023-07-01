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
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="form.formName" placeholder="请输入" clearable />
      </el-form-item>

      <el-form-item label="表单logo" prop="formLogo">
        <el-input v-model="form.formLogo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="表单描述" prop="formDescribe">
        <el-input v-model="form.formDescribe" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="表单背景图" prop="formHeaderImages">
        <el-input
          v-model="form.formHeaderImages"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="表单背景" prop="fromBackground">
        <el-input
          v-model="form.fromBackground"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="validity">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="validity">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder=""
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
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
const form = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  endTime: "",
  formDescribe: "",
  formHeaderImages: "",
  formLogo: "",
  formName: "",
  fromBackground: "",
  startTime: "",
});
const formRef = ref();
const formRules = ref({
  formName: [{ required: true, message: "请输入" }],
});
onMounted(() => {
  if (props.id !== "") {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsFormById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
      });
  }
});

function onSubmit() {
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsForm", form.value)
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
            .post("/api/plugs/updatePlugsForm", form.value)
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

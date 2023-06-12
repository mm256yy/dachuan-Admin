<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="400px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content" style="margin: 20px;position: relative;right: 25px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item label="分销比例" prop="title">
          <el-input

            style="width: 200px;position: relative;bottom: 4px;"
            v-model="form.plugsConfigJson.ratio"
            placeholder="请输入"
            clearable
          >
          <template #append>%</template>
        </el-input>
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
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { UploadProps, ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
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
console.log(props.modelValue,456);

const myVisible = ref(props.modelValue);


const title = computed(() => (props.id === "" ? "分销设置" : "修改"));

const form: any = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),
  configType: "",
  jsonViewData: {},
  plugsConfigJson: {
    ratio: "",
  },
});

const formRef = ref();
const formRules = ref({});
const formId = ref(0);
onMounted(() => {
  api
    .get("/api/plugs/getPlugsConfigInfo", {
      params: {
        id: form.value.plugsId,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        if (res.body) {

          form.value = res.body;
          form.value.plugsConfigJson = JSON.parse(form.value.plugsConfigJson);
          form.value.plugsConfigJson.ratio = Number(form.value.plugsConfigJson.ratio * 100)


          formId.value = 1;
        } else {
          formId.value = 0;
        }
      }
    });
});

function onSubmit() {

  form.value.plugsConfigJson['ratio'] =  (Number(form.value.plugsConfigJson.ratio) / 100).toFixed(2)
  form.value.plugsConfigJson = JSON.stringify(form.value.plugsConfigJson);
  if (formId.value == 0) {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsConfig", form.value)
            .then((res: any) => {
              ElMessage.success({
                message: "设置成功！",
                center: true,
              });

              // emit("success");
              onCancel();
            });
        }
      });
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsConfig", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                // emit("success");
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
.file {
  position: relative;
  width: 100px;
  background-color: #ccc;
  text-align: center;
}
.file input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}
</style>

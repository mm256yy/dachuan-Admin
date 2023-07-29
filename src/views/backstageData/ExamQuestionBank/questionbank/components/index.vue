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
      <el-form-item label="题库名称" prop="questionBankName">
        <el-input
          v-model="form.questionBankName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属科目" prop="subjectId">
        <el-select
          v-model="form.subjectId"
          filterable
          placeholder="请选择科目"
          clearable
          style="width: 390px"
        >
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :label="item.subjectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="题库排序" prop="subjectOrder">
        <el-input
          v-model="form.questionBankOrder"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注说明" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="题库状态" prop="status">
        <el-switch
          v-model="form.status"
          inline-prompt
          :inactive-value="0"
          inactive-text="关闭"
          :active-value="1"
          active-text="开启"
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

const title = computed(() => (props.id === "" ? "新增题库" : "修改题库"));
const form = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  questionBankName: "",
  questionBankOrder: "",
  remark: "",
  status: 0,
  subjectId: "",
});
const formRef = ref();
const formRules = ref({
  questionBankName: [{ required: true, message: "请输入" }],
  subjectId: [{ required: true, message: "请输入", trigger: "change" }],
});
const subjectList: any = ref([]);
onMounted(() => {
  let data: any = {
    page: 1,
    size: 50,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api
    .get("/api/plugs/searchPlugsPracticeSubjectList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        subjectList.value = res.body.list;
      }
    });
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsPracticeQuestionBankById", {
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
            .post("/api/plugs/insertPlugsPracticeQuestionBank", form.value)
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
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsPracticeQuestionBank", form.value)
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
</style>

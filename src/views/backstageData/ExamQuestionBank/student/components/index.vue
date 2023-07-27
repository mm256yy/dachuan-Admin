<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="700px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-alert
      title="注：练习比例表示学员在模拟练习时可练习的题目数量百分比，可选比例为：0～100"
      style="height: 40px; margin-bottom: 5px; width: 700px"
      type="success"
      show-icon
    />
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学员姓名" prop="studentName">
            <el-input
              v-model="form.studentName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效期至" prop="validity">
            <el-date-picker
              v-model="form.validity"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder=""
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="cardNo">
            <el-input v-model="form.cardNo" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="练习比例" prop="practiceRatio">
            <el-input
              v-model="form.practiceRatio"
              placeholder="请输入"
              clearable
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属年级" prop="gradeId">
        <el-select
          v-model="form.gradeId"
          filterable
          placeholder="请选择年级"
          clearable
        >
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级" prop="classId">
        <el-select
          v-model="form.classId"
          filterable
          placeholder="请选择班级"
          clearable
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属科目" prop="subjectId">
        <el-select
          v-model="form.subjectId"
          filterable
          multiple
          placeholder="请选择科目"
          clearable
        >
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :label="item.subjectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="学员状态" prop="enable">
        <el-switch
          v-model="form.enable"
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

const title = computed(() => (props.id === "" ? "新增学员" : "修改学员"));
const form: any = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  cardNo: "",
  classId: "",
  enable: 0,
  enterpriseId: 0,
  gradeId: "",
  practiceRatio: "",
  remark: "",
  studentName: "",
  subjectId: [],
  userid: 0,
  validity: "",
});
const formRef = ref();
const formRules = ref({
  studentName: [{ required: true, message: "请输入" }],
  subjectId: [{ required: true, message: "请输入" }],
  cardNo: [{ required: true, message: "请输入" }],
});
const gradeList: any = ref([]);
const classList: any = ref([]);
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
  api
    .get("/api/plugs/searchPlugsPracticeGradeList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        gradeList.value = res.body.list;
      }
    });
  api
    .get("/api/plugs/searchPlugsPracticeClassList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        classList.value = res.body.list;
      }
    });
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsPracticeStudentById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        form.value.subjectId = form.value.subjectId.split(",").map(Number);
      });
  }
});

function onSubmit() {
  form.value.subjectId = form.value.subjectId.join();
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsPracticeStudent", form.value)
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
            .post("/api/plugs/updatePlugsPracticeStudent", form.value)
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
  --el-date-editor-width: 240px;
}
.el-select .el-input__wrapper {
  cursor: pointer;
  width: 580px;
}
</style>

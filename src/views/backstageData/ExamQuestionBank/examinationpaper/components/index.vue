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
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="考卷名称" prop="testPaperName">
        <el-input v-model="form.testPaperName" placeholder="请输入" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属科目" prop="subjectId">
            <el-select
              v-model="form.subjectId"
              filterable
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="难度系数" prop="coefficientDifficulty">
            <el-input
              v-model="form.coefficientDifficulty"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开考时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开考时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="考试时长" prop="subjectId">
            <el-input v-model="form.orders" placeholder="请输入" clearable>
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="试题排序" prop="orders">
            <el-select
              v-model="form.orders"
              filterable
              placeholder="请选择科目"
              clearable
            >
              <el-option key="1" label="默认排序" :value="1" />
              <el-option key="2" label="随机排序" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="考试次数" prop="subjectId">
            <el-input v-model="form.testOrder" placeholder="请输入" clearable>
              <template #append>次</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考卷排序" prop="testOrder">
            <el-input v-model="form.testOrder" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="考卷说明" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" clearable />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="公布答案" prop="enablePublishAnswer">
            <el-switch
              v-model="form.enablePublishAnswer"
              inline-prompt
              :inactive-value="0"
              inactive-text="关闭"
              :active-value="1"
              active-text="开启"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考卷状态" prop="status">
            <el-switch
              v-model="form.status"
              inline-prompt
              :inactive-value="0"
              inactive-text="关闭"
              :active-value="1"
              active-text="开启"
            />
          </el-form-item>
        </el-col>
      </el-row>
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

const title = computed(() => (props.id === "" ? "新增考卷" : "修改考卷"));
const form = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  coefficientDifficulty: "",
  enablePublishAnswer: 0,
  endTime: "",
  orders: 1,
  questionsJson: "",
  remark: "",
  startTime: "",
  status: 0,
  subjectId: "",
  testOrder: 0,
  testPaperName: "",
});
const formRef = ref();
const formRules = ref({
  testPaperName: [{ required: true, message: "请输入" }],
  subjectId: [{ required: true, message: "请输入" }],
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
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsPracticeTestPaperById", {
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
            .post("/api/plugs/insertPlugsPracticeTestPaper", form.value)
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
            .post("/api/plugs/updatePlugsPracticeTestPaper", form.value)
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
  width: 240px;
}
</style>

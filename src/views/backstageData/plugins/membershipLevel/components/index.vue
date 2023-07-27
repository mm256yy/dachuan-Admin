<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item label="会员名称" prop="title">
          <el-input v-model="form.levelName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="会员编号" prop="title">
          <el-input v-model="form.levelNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="折扣率" prop="title">
          <el-input v-model="form.discount" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="单日消费次数" prop="title">
          <el-input
            v-model="form.buyDayNumber"
            placeholder="请输入"
            clearable
          />
        </el-form-item>

        <!-- <el-form-item label="扩展JSON" prop="title">
          <el-input v-model="form.extJson" placeholder="请输入" clearable />
        </el-form-item> -->
        <el-form-item label="累计购买次数" prop="title">
          <el-input v-model="form.levelCount" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="累计消费金额" prop="title">
          <el-input v-model="form.levelMoney" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="有效天数" prop="title">
          <el-input v-model="form.levelPayday" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="付费购买价格" prop="title">
          <el-input v-model="form.levelPrice" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="累计积分" prop="title">
          <el-input v-model="form.levelScore" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="排序标识" prop="title">
          <el-input v-model="form.orders" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="是否是默认会员" prop="type">
          <el-radio-group v-model="form.defaultStatus" class="ml-4">
            <el-radio :label="1" size="large">是</el-radio>
            <el-radio :label="0" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-switch
            v-model="form.status"
            class="ml-2"
            :active-value="0"
            :inactive-value="1"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>

        <el-form-item label="插件ID" prop="plugsId">
          <el-select
            v-model="form.plugsId"
            filterable
            placeholder="选择插件"
            disabled
          >
            <el-option
              v-for="item in plugsList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户服务标识" prop="userServiceToken">
          <el-input
            v-model="form.userServiceToken"
            disabled
            placeholder="请输入"
            clearable
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
const myVisible = ref(props.modelValue);

const title = computed(() => (props.id === "" ? "新增" : "修改"));
const pcasName: any = ref([]);

const form = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: 174,
  buyDayNumber: 0,
  defaultStatus: 1,
  discount: 0,
  extJson: "",
  levelCount: 0,
  levelMoney: 0,
  levelName: "",
  levelNo: "",
  levelPayday: 0,
  levelPrice: 0,
  levelScore: 0,
  orders: 0,
  status: 0,
});

const formRef = ref();
const formRules = ref({
  // title: [{ required: true, message: "请输入" }],
  // businessId: [{ required: true, message: "请输入", trigger: "change" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugsList: any = ref([]);
onMounted(() => {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  api
    .get("/api/plugs/searchPlugsInfoList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
      }
    });

  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlusgVipLevelById", {
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
            .post("/api/plugs/insertPlusgVipLevel", form.value)
            .then((res: any) => {
              ElMessage.success({
                message: "新增成功",
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
            .post("/api/plugs/updatePlusgVipLevel", form.value)
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

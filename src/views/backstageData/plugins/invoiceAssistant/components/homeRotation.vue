<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    center
    width="500px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content">
      <!-- <div style="display: flex;align-items: center;" >
          <div style="margin-right:6px ;" >发票抬头</div>
          <div>{{ form2.jsonData.invoiceHeader }}</div>
        </div> -->
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          发票抬头：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.invoiceHeader }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          发票类型：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div v-if="form2.jsonData.invoiceType == 1">企业</div>
          <div v-else-if="form2.jsonData.invoiceType == 2">
            个人/飞企业性单位
          </div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          纳税编号：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.dutyParagraph }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          卡号：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.bankAccount }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          企业联系方式：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.enterpriseMobile }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          开票金额：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.money }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          企业地址：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.enterpriseAddress }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          开户银行：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.openBankDeposit }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          邮箱：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.Email }}</div>
        </div>
      </div>
      <div style="display: flex; margin: 10px 20px">
        <div
          style="
            font-weight: bolder;
            font-size: 14px;
            width: 100px;
            text-align: right;
          "
        >
          个人联系方式：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.jsonData.Mobile }}</div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onCancel">
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

const title = computed(() => (props.id === "" ? "开票信息" : "开票信息"));

const form2: any = ref({
  adminId: "",
  businessId: "",
  createTime: "",
  distance: "",
  id: "",
  jsonData: {
    invoiceHeader: "发票抬头",
    dutyParagraph: "纳税编号",
    bankAccount: "卡号",
    enterpriseMobile: "联系方式",
    money: 1000,
    enterpriseAddress: "企业地址",
    openBankDeposit: "开户银行",
    Email: "邮箱",
    Mobile: "联系电话",
    invoiceType: 1,
    orderList: [],
  },
  jsonViewData: "",
  plugsId: "",
  updateTime: "",
  userId: "",
  userServiceToken: "",
});

onMounted(() => {
  api
    .get("/api/plugs/searchPlugsDataById", {
      params: {
        id: props.id,
      },
    })
    .then((res: any) => {
      form2.value = res.body;
      form2.value.jsonData = JSON.parse(form2.value.jsonData);
    });
});

const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}

// 图片上传

const imageUrl = ref("");
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});
// const baseURL: any = "http://192.168.31.47:7001/api/file/uploadImages";

const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
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

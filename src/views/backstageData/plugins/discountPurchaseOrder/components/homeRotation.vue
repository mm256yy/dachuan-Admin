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
    <div class="content" style="border-radius: 10px">
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
          用户昵称：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.userName }}</div>
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
          消费金额：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.consumptionMoney }}</div>
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
          支付方式：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div v-if="form2.payWay == 0">支付宝</div>
          <div v-else-if="form2.payWay == 1">微信</div>
          <div v-else-if="form2.payWay == 2">余额</div>
          <div v-else-if="form2.payWay == 3">微信加余额</div>
          <div v-else-if="form2.payWay == 5">优惠买单</div>
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
          支付状态：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div v-if="form2.payRecordStatus == 0">待支付</div>
          <div v-else-if="form2.payRecordStatus == 1">支付中</div>
          <div v-else-if="form2.payRecordStatus == 2">支付成功</div>
          <div v-else-if="form2.payRecordStatus == 3">支付失败</div>
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
          所属店铺：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div v-for="item in businessList" :key="item.businessId">
            <div v-if="form2.businessId == item.businessId">
              {{ item.businessName }}
            </div>
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
          交易流水号：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.outTradeNo }}</div>
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
          支付时间：
        </div>
        <div style="font-size: 13px; display: flex; align-items: center">
          <div>{{ form2.payTime }}</div>
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

const title = computed(() => (props.id === "" ? "买单信息" : "买单信息"));
const businessList: any = ref([]);

const form2: any = ref({});

onMounted(() => {
  api
    .get("/api/user/searchConsumptionRecordById", {
      params: {
        id: props.id,
      },
    })
    .then((res: any) => {
      form2.value = res.body;

      getStoreList();
    });
});
function getStoreList() {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  // 获取店铺
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });
}

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

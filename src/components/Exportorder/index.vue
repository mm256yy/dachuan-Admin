<template>
  <el-dialog
    v-model="myVisible"
    title="订单导出"
    width="500px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content">
      <el-form :model="form" label-width="100px" style="padding: 0">
        <el-form-item label="订单状态">
          <el-select
            class="formItem"
            v-model="form.orderStatus"
            placeholder="订单状态"
          >
            <el-option key="-1" label="全部" value="-1" />
            <el-option key="0" label="待付款" value="0" />
            <el-option key="1" label="待接单" value="1" />
            <el-option key="2" label="待发货/待服务/待取货" value="2" />
            <el-option key="3" label="待收货/确认" value="3" />
            <el-option key="4" label="待使用" value="4" />
            <el-option key="5" label="已完成" value="5" />
            <el-option key="6" label="已取消" value="6" />
            <el-option key="7" label="已失效" value="7" />
            <el-option key="8" label="退款中" value="8" />
            <el-option key="9" label="退款成功" value="9" />
            <el-option key="10" label="退款失败" value="10" />
            <el-option key="11" label="待结算" value="11" />
            <el-option key="12" label="已结算" value="12" />
            <el-option key="13" label="结算失败" value="13" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺">
          <el-select
            class="formItem"
            v-model="form.businessId"
            filterable
            placeholder="选择店铺"
          >
            <el-option key="-1" label="全部" value="-1" />
            <el-option
              v-for="item in businessList"
              :key="item.businessId"
              :label="item.businessName"
              :value="item.businessId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <div>
            <el-date-picker
              style="width: 360px"
              v-model="value1"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="exportOrder33"> 导出 </el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { UploadProps, ElMessage } from "element-plus";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import api from "../../api/plugin";
import Axios from "axios";
import fileDownload from "js-file-download";
import table2excel from "js-table2excel";
import useUserStore from "../../store/modules/user";
import storage from "../../utils/storage";
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
const myVisible: any = ref(props.modelValue);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const loading: any = ref(false);
onBeforeMount(() => {
  getDianpu();
});
const businessList: any = ref([]);
function getDianpu() {
  api.get("/api/plugs/getBusinessInfo").then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });
}

const form: any = ref({
  page: tableobj.currentPage,
  size: 1000,
  keyword: tableobj.keyword,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  businessId: "-1",
  orderStatus: "-1",
  startDateTime: "",
  endDateTime: "",
  loadingType: 1,
});
// 日期范围
const value1: any = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
]);
function changeTime(val: any) {
  if (!val) {
    value1.value = new Date();
    form.value.startDateTime = "";
    form.value.endDateTime = "";
  } else {
    form.value.startDateTime = value1.value[0];
    form.value.endDateTime = value1.value[1];
  }
  // getMallSetting()
}
const emit = defineEmits(["exportOrderChange"]);
const exportState: any = ref({
  loading: false,
  myVisible: true,
});
function exportOrder33() {
  if (form.value.startDateTime === "") {
    ElMessage.warning({
      message: "请选择起始时间",
      center: true,
    });
    return;
  }
  exportState.value.loading = true;
  exportState.value.myVisible = true;
  emit("exportOrderChange", exportState.value);
  const userStore = useUserStore();
  const requestUrl = "/api/order/exportOrderExcel";
  // const basrUrl = import.meta.env.VITE_APP_API_BASEURL;
  const basrUrl = import.meta.env.VITE_APP_API_BASEURL;
  Axios({
    method: "get",
    url: basrUrl + requestUrl,
    params: form.value,
    headers: {
      Authorization: userStore.token,
      USER_SERVICE_TOKEN: storage.local.get("userServiceToken"),
    },
    responseType: "blob",
  }).then((res: any) => {
    fileDownload(res.data, "OrderList.xlsx");
    exportState.value.loading = false;
    exportState.value.myVisible = false;
    emit("exportOrderChange", exportState.value);
  });
}
function cancel() {
  exportState.value.loading = false;
  exportState.value.myVisible = false;
  emit("exportOrderChange", exportState.value);
}
// 图片上传
</script>

<style scoped>
.content {
  width: 500px;
}
.date-box >>> .el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 360px !important;
}

.date-input >>> .el-input__inner {
  width: 360px !important;
}
.formItem {
  width: 360px !important;
}
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
.example-pagination-block {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}
</style>

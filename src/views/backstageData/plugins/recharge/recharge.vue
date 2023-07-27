<route lang="yaml">
name: homeRotation
meta:
  title: 优惠券
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 10px">
        <div class="header-left">
          <el-button
            type="primary"
            @click="addPlugin"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增
          </el-button>
          <el-button
            type="danger"
            @click="delPlugin"
            :disabled="!multipleSelection.length"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="ep:delete" />
              </el-icon>
            </template>
            批量删除
          </el-button>
        </div>
        <div style="display: flex">
          <div class="lang" style="display: flex; align-items: center">
            <el-date-picker
              style="width: 352px; margin-right: 10px"
              size="default"
              v-model="value2"
              @change="changeTime2"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-select
              style="width: 180px; margin-right: 15px"
              v-model="businessId"
              filterable
              placeholder="选择店铺"
            >
              <el-option key="0" label="全部" value="-1" />
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
            <el-input
              style="width: 150px"
              v-model="tableobj.keyword"
              placeholder="请输入"
              @keyup.enter.native="rechargeRecord"
            />
          </div>
          <el-button
            type="primary"
            style="margin: 0 10px 0 10px"
            @click="rechargeRecord"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:search" />
              </el-icon>
            </template>
            搜索
          </el-button>
        </div>
      </div>
      <!-- 充值规则 充值记录 -->
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="changeTabs">
          <el-tab-pane label="充值规则" name="first"></el-tab-pane>
          <el-tab-pane label="消费记录" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="main">
        <el-table
          v-if="activeName == 'first'"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <!-- <el-table-column type="selection" /> -->
          <el-table-column label="ID" align="center" type="index" width="70" />
          <el-table-column label="充值金额" align="center" width="500">
            <template #default="scope">
              <div>￥{{ scope.row.rechargeMoney }}元</div>
            </template>
          </el-table-column>
          <el-table-column label="赠送金额" align="center" width="400">
            <template #default="scope">
              <div>￥{{ scope.row.giveeMoney }}元</div>
            </template>
          </el-table-column>
          <el-table-column
            label="规则备注"
            align="center"
            show-overflow-tooltip
            width="560"
          >
            <template #default="scope">
              <div>{{ scope.row.remarks }}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
          >
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="handleClick(scope.$index)"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.$index)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="activeName == 'second'"
          :data="recordList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <el-table-column
            label="用户ID"
            align="center"
            type="index"
            prop="userId"
            width="70"
          />
          <el-table-column label="用户名" align="center" width="200">
            <template #default="scope">
              <div>{{ scope.row.userName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="支付金额"
            align="center"
            show-overflow-tooltip
            width="300"
          >
            <template #default="scope">
              <div>{{ scope.row.payMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="支付类型"
            align="center"
            show-overflow-tooltip
            width="200"
          >
            <template #default="scope">
              <div v-if="scope.row.payType == 0">商城订单</div>
              <div v-else-if="scope.row.payType == 1">会员购买</div>
              <div v-else-if="scope.row.payType == 2">余额充值</div>
              <div v-else-if="scope.row.payType == 3">优惠买单</div>
            </template>
          </el-table-column>
          <el-table-column
            label="支付方式"
            align="center"
            show-overflow-tooltip
            width="200"
          >
            <template #default="scope">
              <div v-if="scope.row.payWay == 0">微信支付</div>
              <div v-else-if="scope.row.payWay == 1">微信支付</div>
              <div v-else-if="scope.row.payWay == 2">支付宝支付</div>
              <div v-else-if="scope.row.payWay == 3">积分支付</div>
              <div v-else-if="scope.row.payWay == 4">余额支付</div>
              <div v-else-if="scope.row.payWay == 5">优惠买单</div>
            </template>
          </el-table-column>
          <el-table-column
            label="所属店铺"
            align="center"
            show-overflow-tooltip
            width="320"
          >
            <template #default="scope">
              <div v-for="item in businessList" :key="item.businessId">
                <div v-if="scope.row.businessId == item.businessId">
                  {{ item.businessName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="支付时间"
            align="center"
            fixed="right"
            width="360"
          >
            <template #default="scope">
              <div>{{ scope.row.payTime }}</div>
            </template>
          </el-table-column>

          <!-- <el-table-column fixed="right"  align="center" label="操作" width="200">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleClick(scope.$index )"
                  >删除</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="editClick(scope.$index )"
                  >编辑</el-button
                >
              </template>
            </el-table-column> -->
        </el-table>
      </div>
      <div class="example-pagination-block">
        <div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="tableobj.currentPage"
            :page-size="tableobj.pageSize"
            layout="prev,pager,next,total"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      :plugsId="data.formModeProps.plugsId"
      @success="update"
    />
  </div>
</template>
<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/homeRotation.vue";
import type { TabsPaneContext } from "element-plus";
import storage from "@/utils/storage";
const route = useRoute();
const activeName = ref("first");
const businessList: any = ref([]);
const businessId: any = ref("");
const recordList: any = ref([]);
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
});

onMounted(() => {
  getlist();
  getDianpu();
});
const value2: any = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
]);
const startime: any = ref("");
const endtime: any = ref("");
function changeTime2(val: any) {
  if (!val) {
    value2.value = new Date();
    startime.value = "";
    endtime.value = "";
  } else {
    startime.value = value2.value[0];
    endtime.value = value2.value[1];
  }
}
// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const form = ref({
  adminId: "",
  configType: "",
  userServiceToken: "",
  plugsId: "",
  jsonViewData: {},
  plugsConfigJson: "",
});

const userServiceToken = ref(storage.local.get("userServiceToken"));
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
function changeTabs(val: any) {
  const tabName = val.props.name;
  activeName.value = tabName;
  if (tabName == "first") {
    getlist();
  } else if (tabName == "second") {
    rechargeRecord();
  }
}
function searchlist() {
  if (activeName.value == "first") {
    getlist();
  } else if (activeName.value == "second") {
    rechargeRecord();
  }
}
function getlist() {
  let data: any = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id,
    // keyword: tableobj.keyword,
  };
  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/plugs/getPlugsConfigInfo", { params: data })
    .then((res: any) => {
      if (res.body) {
        tableData.value = JSON.parse(res.body.plugsConfigJson);
        form.value = res.body;
        total.value = tableData.value.length;
      }
    });
}
function rechargeRecord() {
  const data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    keyword: tableobj.keyword,
    startDateTime: startime.value,
    endDateTime: endtime.value,
    businessId: businessId.value != "" ? businessId.value : -1,
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api.get("/api/pay/searchPayRecordList", { params: data }).then((res: any) => {
    if (res.code == 200) {
      recordList.value = res.body.list;
      recordList.value.forEach((item: any) => {
        item.businessId = JSON.parse(JSON.stringify(item.businessId));
      });
      total.value = res.body.total;
    }
  });
}

function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  if (activeName.value == "first") {
    getlist();
  } else if (activeName.value == "second") {
    rechargeRecord();
  }
}
function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  if (activeName.value == "first") {
    getlist();
  } else if (activeName.value == "second") {
    rechargeRecord();
  }
}
// 格式化日期
function formatDate(value: any) {
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = (date.getMonth() + 1) as number;
  MM = MM < 10 ? (("0" + MM) as unknown as number) : MM;
  let d = date.getDate();
  d = d < 10 ? (("0" + d) as unknown as number) : d;
  let h = date.getHours();
  h = h < 10 ? (("0" + h) as unknown as number) : h;
  let m = date.getMinutes();
  m = m < 10 ? (("0" + m) as unknown as number) : m;
  let s = date.getSeconds();
  s = s < 10 ? (("0" + s) as unknown as number) : s;
  return y + "-" + MM + "-" + d;
  // y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}
// 新增插件
function addPlugin() {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
  data.value.formModeProps.plugsId = route.params.id;
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
  //
};

const delPlugin = (index: any) => {
  // let data = {
  //   ids: idlist.value.join(),
  // };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsCoupons", data).then((res: any) => {
        if (res.code == 200) {
          getlist();
          ElMessage.success({
            message: "删除成功",
            center: true,
          });
        } else {
          ElMessage.error({
            message: "删除失败",
            center: true,
          });
        }
      });
    })
    .catch(() => {});
  // ids.push(idlist.value);
};
// 删除插件
const handleClick = (e: any) => {
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      tableData.value.splice(e, 1);
      form.value.plugsConfigJson = JSON.stringify(tableData.value);
      http.post("/api/plugs/updatePlugsConfig", form.value).then((res: any) => {
        ElMessage.success({
          message: "删除",
          center: true,
        });

        // emit("success");
        // onCancel();
      });
    })
    .catch(() => {});
};
// 编辑插件
const editClick = (e: any) => {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = e;
  data.value.formModeProps.plugsId = route.params.id;
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
</script>
<style scoped lang="scss">
.container {
  padding: 10px;
}

.content {
  padding: 10px;
  background-color: #fff;

  .header {
    display: flex;
    justify-content: space-between;

    // .header-left {
    // }

    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .lang {
        width: 120px;
        margin-right: 20px;
        height: 40px;
        // display:flex ;
        // align-items: center;
      }
    }
  }

  .example-pagination-block {
    margin-bottom: 16px;
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

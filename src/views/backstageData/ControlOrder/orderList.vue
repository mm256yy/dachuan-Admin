<route lang="yaml">
meta: title:订单管理
</route>

<script setup lang="ts">
import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
import api from "@/api";
import Axios from "axios";
import useUserStore from "@/store/modules/user";
import http from "@/api/plugin";
import { ref, onMounted, computed, reactive } from "vue";
import storage from "@/utils/storage";
import { ElMessage, ElMessageBox, TabsPaneContext } from "element-plus";
import EditDetails from "./components/editDetails.vue";
import ViewDetails from "./components/viewDetails.vue";
import Exportorder from "@/components/Exportorder/index.vue";
import Salessummary from "@/components/Salessummary/index.vue";
import JSONBIG from "json-bigint";
import table2excel from "js-table2excel";
const router = useRouter();
const tableData = ref([]);
const tableData2 = ref([]);
const adminId: any = storage.local.get("adminId");
const total = ref(0);
const total2 = ref(0);
const businessId: any = ref("");
const businessId2: any = ref("");
const size = ref("-1");
const loading = ref(false);
const loading2 = ref(false);
const listvalue = ref(true); // 控制列表格式
const expandall = ref(false);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const value2 = ref("");
const starttime: any = ref("");
const endtime: any = ref("");
const loadingType: any = ref("-1");
// 日期范围
const value4: any = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
]);
function changeTime4(val: any) {
  if (!val) {
    value4.value = new Date();
    starttime.value = "";
    endtime.value = "";
  } else {
    starttime.value = value4.value[0];
    endtime.value = value4.value[1];
  }
  // getMallSetting()
}

function exportOrders() {
  loadingType.value = 1;
  exportStatus.value = 1;
  tableobj.pageSize = 1000;

  getMallSetting();
}

const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
// 列表格式
function changeformat(val: any) {
  if (val) {
    loadingType.value = -1;
    expandall.value = false;
    tableobj.pageSize = 10;
    listvalue.value = true;
    getMallSetting();
  } else {
    loadingType.value = 1;
    tableobj.pageSize = 10;
    expandall.value = true;
    listvalue.value = false;
    getMallSetting();
  }
}
// 导出表格数据
const DialogVisible2: any = ref({
  visible: false,
});
const exportStatus: any = ref("0");
const datas: any = reactive({
  arr: [],
}); //这里用四个对象来模拟接口中得到的object型数据
const orderItemInfo: any = ref({
  StoreName: "",
  orderId: "",
  orderNo: "",
  createOrderTime: "", // 下单时间
  orderType: "",
  orderStatus: "",
  expressMoney: "", // 快递费
  orderMoney: "",
  payType: "微信支付",
  logisticsType: "", // 配送方式
  goodsInfo: "",
  userId: "",
  userName: "",
  consigneeName: "",
  consigneePhone: "",
  consigneeAddress: "",
  orderMark: "",
});

const businessList: any = ref([]);
const businessList2: any = ref([]);

function getDianpu() {
  api.get("/api/plugs/getBusinessInfo").then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
        businessList2.value.push(item.jsonViewData);
      });
    }
  });
}
onBeforeMount(() => {
  getMallSetting();
  getDianpu();
});
// 销售汇总
function saleTotal() {
  DialogVisible2.value.visible = true;
}
function salessummary(e: any) {
  DialogVisible2.value.visible = false;
}

// 批量发货
function deliverGoods() {
  let data = {
    orderIds: idlist.value.join(),
  };
  if (data.orderIds == "" || data.orderIds == null) {
    ElMessage.warning({
      message: "请选择订单(最多选择当前页面)",
      center: true,
    });
    return;
  }
  api.post("/api/order/orderSendGoods", data).then((res: any) => {
    if (res.code == 200) {
      ElMessage.success({
        message: res.msg,
        center: true,
      });
      getMallSetting();
    } else {
      ElMessage.error({
        message: res.msg,
        center: true,
      });
    }
  });
}
function exportOrder33() {
  formModeProps2.value.visible = true;
}
function exportOrderChange(e: any) {
  loading.value = e.loading;
  formModeProps2.value.visible = e.myVisible;
}

function getMallSetting() {
  loading.value = true;
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    keyword: tableobj.keyword,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    businessId: businessId.value != "" ? businessId.value : -1,
    orderStatus: activeName.value,
    startDateTime: starttime.value,
    endDateTime: endtime.value,
    loadingType: loadingType.value,
  };
  api
    .get("/api/order/searchOrderList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        loading.value = false;
        tableData.value = res.body.list;
        tableData.value.forEach((item: any) => {
          item.businessId = JSON.parse(JSON.stringify(item.businessId));
        });
        // tableData.value.forEach((item:any)=>{
        // 	if(item.orderLogistics.receiverAddressJson!==""){
        // 		item.orderLogistics.receiverAddressJson=JSON.parse(item.orderLogistics.receiverAddressJson)
        // 	}

        // })
        total.value = res.body.total;
        let orderArr = res.body.list;
      }
    });
}

function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  getMallSetting();
}

function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getMallSetting();
}
// 时间转换
function formatDate(row: any, column: any, cellValue: any, index: any) {
  var dateee = new Date(cellValue).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
}

const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
};
// 批量删除
const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  // ids.push(idlist.value);
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/order/delOrder", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getMallSetting();
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
};
// 删除
const handleClick = (e: any) => {
  let data = {
    ids: e,
  };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/order/delOrder", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getMallSetting();
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
};
const formModeProps: any = ref({
  visible: false,
  visible1: false,
  id: "",
  id1: "",
});
// 导出订单弹框
const formModeProps2: any = ref({
  visible: false,
});
const editDetails = (item: any) => {
  formModeProps.value.visible = true;
  formModeProps.value.id = item;
};
const viewDetails = (item: any) => {
  formModeProps.value.visible1 = true;
  formModeProps.value.id1 = item;
};
ViewDetails;
// 刷新组件
function update() {
  getMallSetting();
  formModeProps.value.visible = false;
}
function update1() {
  getMallSetting();
  formModeProps.value.visible1 = false;
}
// 更改状态
const dialogVisible = ref(false);
const orderStatus: any = ref(0);
const content: any = ref({});
const statusList: any = ref([
  {
    id: 0,
    name: "待付款",
  },
  {
    id: 1,
    name: "待接单",
  },
  {
    id: 2,
    name: "待发货/待服务/待取货",
  },
  {
    id: 3,
    name: "待收货/待确认",
  },
  {
    id: 4,
    name: "待使用",
  },
  {
    id: 5,
    name: "已完成",
  },
  {
    id: 6,
    name: "已取消",
  },
  {
    id: 7,
    name: "已失效",
  },
  {
    id: 8,
    name: "退款中",
  },
  {
    id: 9,
    name: "退款成功",
  },
  {
    id: 10,
    name: "退款失败",
  },
]);

const editClick = (item: any) => {
  orderStatus.value = item.orderStatus;
  dialogVisible.value = true;
  let data = {
    id: item.id.toString(),
  };

  api
    .get("/api/order/getOrderInfoById", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        content.value = res.body;
      }
    });
};
const change = (done: any) => {
  content.value.orderStatus = done;
};
const handleClose = () => {
  http.post("/api/order/updateOrder", content.value).then((res: any) => {
    if (res.code == 200) {
      dialogVisible.value = false;
      getMallSetting();
    }
  });
};
const activeName: any = ref("-1");
const changeClick = () => {
  getMallSetting();
};
</script>

<template>
  <div>
    <div>
      <page-main style="border-radius: 10px">
        <div style="margin-bottom: 20px">
          <div
            style="
              margin: 0 0 10px 0;
              display: flex;
              justify-content: space-between;
              overflow: hidden;
              overflow-x: scroll;
            "
          >
            <div style="display: flex; align-items: center">
              <el-button type="success" :icon="Share" @click="saleTotal"
                >销售汇总</el-button
              >
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
              <el-button type="primary" @click="exportOrder33()">
                <template #icon>
                  <el-icon>
                    <Position />
                  </el-icon>
                </template>
                导出
              </el-button>
              <el-button
                type="primary"
                v-if="activeName == 2"
                @click="deliverGoods"
              >
                <template #icon>
                  <el-icon>
                    <Files />
                  </el-icon>
                </template>
                批量发货
              </el-button>
              <div
                style="
                  display: flex;
                  height: 32px;
                  align-items: center;
                  border: 1px solid #e4e6e9;
                  border-radius: 6px;
                  width: 160px;
                  justify-content: center;
                  margin-left: 8px;
                "
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="此功能仅对商品订单有效"
                  placement="top-start"
                >
                  <div style="display: flex; align-items: center">
                    <p style="font-size: 15px; margin-right: 10px">列表格式:</p>
                    <el-switch
                      v-model="listvalue"
                      class="ml-2"
                      @change="changeformat"
                      width="56"
                      style="
                        --el-switch-on-color: #409eff;
                        --el-switch-off-color: #fb5531;
                      "
                      inline-prompt
                      active-text="简洁"
                      inactive-text="详细"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div style="display: flex">
              <div>
                <el-date-picker
                  style="width: 352px"
                  v-model="value4"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="changeTime4"
                />
              </div>
              <el-select
                style="width: 160px; margin-left: 10px"
                v-model="businessId"
                filterable
                placeholder="选择店铺"
              >
                <el-option :key="0" label="全部" :value="0" />
                <el-option
                  v-for="item in businessList"
                  :key="item.businessId"
                  :label="item.businessName"
                  :value="item.businessId"
                />
              </el-select>
              <el-input
                v-model="tableobj.keyword"
                style="width: 150px; margin: 0 10px"
                placeholder="请输入"
                @keyup.enter.native="getMallSetting"
              />
              <el-button :icon="Search" type="primary" @click="getMallSetting()"
                >搜索</el-button
              >
            </div>
          </div>
          <el-tabs
            v-model="activeName"
            class="demo-tabs"
            @tab-change="changeClick"
          >
            <el-tab-pane label="全部" name="-1"></el-tab-pane>
            <el-tab-pane label="待付款" name="0"></el-tab-pane>
            <el-tab-pane label="待接单" name="1"></el-tab-pane>
            <el-tab-pane label="待发货/待服务/待取货" name="2"></el-tab-pane>
            <el-tab-pane label="待收货/待确认" name="3"></el-tab-pane>
            <el-tab-pane label="待使用" name="4"></el-tab-pane>
            <el-tab-pane label="已完成" name="5"></el-tab-pane>
            <el-tab-pane label="已取消" name="6"></el-tab-pane>
            <el-tab-pane label="已失效" name="7"></el-tab-pane>
            <el-tab-pane label="退款中" name="8"></el-tab-pane>
            <el-tab-pane label="退款成功" name="9"></el-tab-pane>
            <el-tab-pane label="退款失败" name="10"></el-tab-pane>
            <el-tab-pane label="待结算" name="11"></el-tab-pane>
            <el-tab-pane label="已结算" name="12"></el-tab-pane>
            <el-tab-pane label="结算失败" name="13"></el-tab-pane>
          </el-tabs>
          <div>
            <el-table
              :data="tableData"
              v-loading="loading"
              :default-expand-all="expandall"
              element-loading-text="加载中..."
              style="width: 100%"
              :header-cell-style="{
                background: '#f9f9f9',
                color: '#666',
                textAlign: 'left',
                height: '55px',
              }"
              @selection-change="handleSelectionChange"
            >
              <!-- 展开订单详情 -->
              <el-table-column
                type="expand"
                v-if="listvalue == false"
                width="1"
              >
                <template #default="props">
                  <div v-if="props.row.orderType == 0">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 100px 0 30px;
                        width: 100%;
                      "
                    >
                      <div>
                        <div
                          v-for="item in props.row.orderItemList"
                          :key="item.id"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                          "
                        >
                          <div
                            style="
                              display: flex;
                              align-items: center;
                              width: 360px;
                            "
                          >
                            <div>
                              <img
                                v-if="item.goodsSpecification != null"
                                style="
                                  width: 60px;
                                  height: 60px;
                                  margin-right: 8px;
                                  margin-bottom: 3px;
                                "
                                :src="item.previewUrl"
                                alt=""
                              />
                              <img
                                v-else
                                style="
                                  width: 60px;
                                  height: 60px;
                                  margin-right: 8px;
                                  margin-bottom: 3px;
                                "
                                :src="item.previewUrl"
                                alt=""
                              />
                            </div>
                            <div>
                              <p>{{ item.goodName }}</p>
                              <p
                                v-for="(item2, key) in JSON.parse(
                                  item.goodsSpecificationName
                                )"
                              >
                                {{ key }}:{{ item2 }}
                              </p>
                              <!-- <p>{{ item.goodsSpecificationName }}</p> -->
                            </div>
                          </div>
                          <div style="width: 240px">
                            数量:x{{ item.goodsNum }}
                          </div>
                          <div>
                            <div style="width: 200px">
                              <div v-if="item.goodsSpecification">
                                单价:￥{{ item.goodsSpecification.dealPrice }}
                                <!-- <div v-if="item.plugsGoods.goodsType=0
                                ">
																单价:￥{{item.goodsSpecification.dealPrice}}
															</div> -->
                                <!-- <div v-else-if="item.plugsGoods.goodsType=1
                                ">
																单价:{{item.goodsSpecification.dealPrice}}积分
															</div> -->
                              </div>
                              <div v-else>单价:￥{{ item.goodsPrice }}</div>
                            </div>
                          </div>
                          <div style="width: 200px">
                            <div v-if="item.orderStatus == 0">待付款</div>
                            <div v-else-if="item.orderStatus == 1">待接单</div>
                            <div v-else-if="item.orderStatus == 2">
                              待发货/待服务/待取货
                            </div>
                            <div v-else-if="item.orderStatus == 3">
                              待收货/待确认
                            </div>
                            <div v-else-if="item.orderStatus == 4">待使用</div>
                            <div v-else-if="item.orderStatus == 5">已完成</div>
                            <div v-else-if="item.orderStatus == 6">已取消</div>
                            <div v-else-if="item.orderStatus == 7">已失效</div>
                            <div v-else-if="item.orderStatus == 8">退款中</div>
                            <div v-else-if="item.orderStatus == 9">
                              退款成功
                            </div>
                            <div v-else-if="item.orderStatus == 10">
                              退款失败
                            </div>
                            <div v-else-if="item.orderStatus == 11">待结算</div>
                            <div v-else-if="item.orderStatus == 12">结算中</div>
                            <div v-else-if="item.orderStatus == 13">已结算</div>
                            <div v-else-if="item.orderStatus == 14">
                              结算失败
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span>姓名:</span
                          >{{ props.row.orderLogistics.receiverName }}
                        </p>
                        <p>
                          <span>电话:</span
                          >{{ props.row.orderLogistics.receiverMobile }}
                        </p>
                        <p v-if="props.row.orderLogistics.receiverAddressJson">
                          <span>地址:</span>
                          {{
                            JSON.parse(
                              props.row.orderLogistics.receiverAddressJson
                            ).province +
                            JSON.parse(
                              props.row.orderLogistics.receiverAddressJson
                            ).city +
                            JSON.parse(
                              props.row.orderLogistics.receiverAddressJson
                            ).district +
                            JSON.parse(
                              props.row.orderLogistics.receiverAddressJson
                            ).address +
                            JSON.parse(
                              props.row.orderLogistics.receiverAddressJson
                            ).houseNumber
                          }}
                        </p>
                      </div>
                    </div>
                    <div
                      style="
                        display: flex;
                        font-size: 14px;
                        color: #999;
                        align-items: center;
                        background: #f9f9f9;
                        padding: 0 100px 0 30px;
                        width: 100%;
                      "
                    >
                      <div style="width: 360px">
                        <p>订单号:{{ props.row.orderNo }}</p>
                        <p>订单备注:{{ props.row.orderRemark }}</p>
                      </div>
                      <div style="width: 240px">
                        <p>下单时间:{{ props.row.createTime }}</p>
                        <p>支付时间:{{ props.row.payTime }}</p>
                      </div>
                      <div style="width: 200px">
                        <p>订单合计:￥{{ props.row.payMoney }}</p>
                        <p>订单优惠:￥{{ props.row.couponPrice }}</p>
                      </div>
                      <div style="width: 200px">
                        <p v-if="props.row.logisticsType == 1">配送方式:配送</p>
                        <p v-else-if="props.row.logisticsType == 2">
                          配送方式:快递
                        </p>
                        <p v-else-if="props.row.logisticsType == 3">
                          配送方式:自提
                        </p>
                        <p v-else-if="props.row.logisticsType == 4">
                          配送方式:到店消费
                        </p>
                        <p v-else-if="props.row.logisticsType == 5">
                          配送方式:上门服务
                        </p>
                        <p v-else-if="props.row.logisticsType == 0">
                          配送方式:快递
                        </p>
                        <p>配送费:￥{{ props.row.distributionFee }}</p>
                      </div>
                      <div v-for="item in businessList" :key="item.businessId">
                        <P v-if="item.businessId == props.row.businessId"
                          >店铺:{{ item.businessName }}</P
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- 展开订单详情end -->
              <el-table-column type="selection" width="40" />
              <!-- <el-table-column
                label="订单ID"
                width="200"
                align="center"
                prop="id"
                show-overflow-tooltip
              >
              </el-table-column> -->
              <el-table-column
                label="订单编号"
                prop="orderNo"
                width="300"
                show-overflow-tooltip
                align="left"
              >
              </el-table-column>
              <el-table-column label="配送方式" width="150" align="left">
                <template #default="scope">
                  <div v-if="scope.row.logisticsType == 1">配送</div>
                  <div v-else-if="scope.row.logisticsType == 2">快递</div>
                  <div v-else-if="scope.row.logisticsType == 3">自提</div>
                  <div v-else-if="scope.row.logisticsType == 4">到店消费</div>
                  <div v-else-if="scope.row.logisticsType == 5">上门服务</div>
                  <div v-else-if="scope.row.logisticsType == 0">快递</div>
                </template>
              </el-table-column>
              <el-table-column
                label="店铺"
                align="left"
                width="270"
                show-overflow-tooltip
              >
                <template #default="scope">
                  <div v-for="item in businessList" :key="item.businessId">
                    <div v-if="scope.row.businessId == item.businessId">
                      {{ item.businessName }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品数量" width="140" align="left">
                <template #default="scope">
                  <div>
                    {{ scope.row.goodsTotalNum }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="实际支付" width="160" align="left">
                <template #default="scope">
                  <div>
                    <span style="color: red">¥{{ scope.row.payMoney }}</span>
                  </div>
                </template>
              </el-table-column>

              <!-- <el-table-column label="支付方式" align="center">
                <template #default="scope">
                  <div v-if="scope.row.payType == 1">微信支付</div>
                  <div v-if="scope.row.payType == 2">支付宝支付</div>
                </template>
              </el-table-column> -->

              <el-table-column
                label="下单时间"
                prop="updateTime"
                align="left"
                :formatter="formatDate"
              >
              </el-table-column>
              <el-table-column
                label="订单状态"
                align="left"
                fixed="right"
                width="100"
              >
                <template #default="scope">
                  <div style="color: #ff4f4f">
                    <div v-if="scope.row.orderStatus == 0">待付款</div>
                    <div v-else-if="scope.row.orderStatus == 1">待接单</div>
                    <div v-else-if="scope.row.orderStatus == 2">
                      <div v-if="scope.row.orderType == 3">待服务</div>
                      <div v-else="scope.row.orderType != 3">待发货</div>
                    </div>
                    <div v-else-if="scope.row.orderStatus == 3">
                      <div v-if="scope.row.orderType == 3">待确认</div>
                      <div v-else="scope.row.orderType != 3">待收货</div>
                    </div>
                    <div v-else-if="scope.row.orderStatus == 4">待使用</div>
                    <div
                      v-else-if="scope.row.orderStatus == 5"
                      style="color: #4cd909"
                    >
                      已完成
                    </div>
                    <div
                      v-else-if="scope.row.orderStatus == 6"
                      style="color: #606266"
                    >
                      已取消
                    </div>
                    <div
                      v-else-if="scope.row.orderStatus == 7"
                      style="color: #606266"
                    >
                      已失效
                    </div>
                    <div v-else-if="scope.row.orderStatus == 8">退款中</div>
                    <div v-else-if="scope.row.orderStatus == 9">退款成功</div>
                    <div v-else-if="scope.row.orderStatus == 10">退款失败</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="left"
                width="250"
              >
                <template #default="scope">
                  <el-button
                    v-if="adminId != 39"
                    link
                    type="primary"
                    size="small"
                    @click="editDetails(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="viewDetails(scope.row.id)"
                    >查看
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="handleClick(scope.row.id)"
                    >删除
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="editClick(scope.row)"
                    >更改状态
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 订单详情 -->
          <div v-if="dialogVisible">
            <el-dialog v-model="dialogVisible" title="Tips" width="30%">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-select
                  v-model="orderStatus"
                  filterable
                  placeholder="请选择"
                  @change="change(orderStatus)"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="handleClose">
                    确定
                  </el-button>
                </span>
              </template>
            </el-dialog>
          </div>

          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              top: 20px;
              right: 60px;
            "
          >
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
      </page-main>
    </div>
    <div>
      <div v-if="formModeProps.visible">
        <EditDetails
          v-model="formModeProps.visible"
          :id="formModeProps.id"
          @success="update"
        ></EditDetails>
      </div>
      <div v-if="formModeProps.visible1">
        <ViewDetails
          v-model="formModeProps.visible1"
          :id="formModeProps.id1"
          @success="update1"
        ></ViewDetails>
      </div>
      <div v-if="formModeProps2.visible">
        <Exportorder
          v-model="formModeProps2.visible"
          @exportOrderChange="exportOrderChange"
        >
        </Exportorder>
      </div>
      <div v-if="DialogVisible2.visible">
        <Salessummary
          v-model="DialogVisible2.visible"
          @salessummary="salessummary"
        >
        </Salessummary>
      </div>
    </div>
  </div>
</template>
<style scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.block:last-child {
  border-right: none;
}

.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

/* .el-table__expand-icon {
  visibility:hidden !important;
} */
:deep(.el-table__expand-icon) {
  display: none;
}
</style>

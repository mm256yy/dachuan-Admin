<template>
  <el-dialog
    v-model="myVisible"
    title="修改订单"
    width="900px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="订单信息" name="first">
          <el-scrollbar>
            <el-form-item label="姓名" prop="pid">
              <el-input
                style="width: 500px"
                v-model="form.orderLogistics.receiverAddressJson.name"
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
            <el-form-item label="手机号" prop="pid">
              <el-input
                style="width: 500px"
                v-model="form.orderLogistics.receiverAddressJson.mobile"
                placeholder="请输入手机号"
                clearable
              />
            </el-form-item>

            <el-form-item label="地区" prop="pca">
              <pcas-cascader v-model="pcasName" format="name" />
            </el-form-item>
            <el-form-item label="详细地址" prop="pid">
              <el-input
                style="width: 500px"
                v-model="form.orderLogistics.receiverAddressJson.address"
                placeholder="请输入"
                autosize
                clearable
              />
            </el-form-item>

            <el-form-item label="订单备注" prop="pid">
              <el-input
                rows="5"
                style="width: 500px"
                type="textarea"
                v-model="form.orderRemark"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="购物清单" name="second">
          <el-scrollbar>
            <el-table
              :data="form.orderItemList"
              :header-cell-style="{
                background: '#f3f6fd',
                color: '#555',
                textAlign: 'center',
              }"
              stripe
              style="width: 120%"
            >
              <el-table-column label="商品图片" align="center">
                <template #default="scope">
                  <div>
                    <div v-if="form.orderType == 0 || form.orderType == 4">
                      <img
                        v-if="scope.row.goodsSpecification !== null"
                        style="width: 60px; height: 60px"
                        :src="scope.row.goodsSpecification.specificationImages"
                        alt=""
                      />
                      <img
                        v-else
                        style="width: 60px; height: 60px"
                        :src="scope.row.previewUrl"
                        alt=""
                      />
                    </div>
                    <div v-else-if="form.orderType == 1">
                      <img
                        style="width: 60px; height: 60px"
                        :src="scope.row.extJson.petStewardInfo.headImgUrl"
                        alt=""
                      />
                    </div>
                    <div v-else-if="form.orderType == 2">
                      <img
                        style="width: 60px; height: 60px"
                        :src="scope.row.extJson.petFosterHome.headImgUrl"
                        alt=""
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品信息" align="center">
                <template #default="scope">
                  <div>{{ scope.row.goodName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="商品价格" align="center">
                <template #default="scope">
                  <div v-if="scope.row.goodsSpecification == null">
                    {{ scope.row.goodsPrice }}
                  </div>
                  <div v-else>{{ scope.row.goodsSpecification.dealPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="优惠金额" align="center">
                <template #default="scope">
                  <div>{{ scope.row.concessionalPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="实际支付" align="center">
                <template #default="scope">
                  <div>{{ scope.row.payPrice }}</div>
                </template>
              </el-table-column>

              <el-table-column label="购买数量" align="center">
                <template #default="scope">
                  <div>{{ scope.row.goodsNum }}</div>
                </template>
              </el-table-column>
              <el-table-column label="规格" align="center">
                <template #default="scope">
                  <div v-if="scope.row.goodsSpecification !== null">
                    <div
                      style="text-align: left"
                      v-for="(item, key) in JSON.parse(
                        scope.row.goodsSpecification.specificationName
                      )"
                    >
                      {{ key }}: {{ item }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">
                优惠金额：￥：{{ form.couponPrice }}
              </div>
              <div>打包费：￥：{{ form.packingFee }}</div>
            </div>

            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">会员折扣:￥0</div>
              <div>运费：￥：{{ form.distributionFee }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">支付金额：￥：{{ form.payMoney }}</div>
              <div>订单总额：￥：{{ form.totalMoney }}</div>
            </div>

            <el-form-item
              label="修改订单总金额为:"
              prop="pid"
              label-width="130"
            >
              <el-input
                rows="5"
                type="text"
                style="width: 200px"
                v-model="form.payMoney"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="售后信息" name="third">
          <el-scrollbar>
            <div v-if="form.orderType == 4">
              <span style="margin-right: 10px">押金:</span>
              <el-input
                style="width: 200px; margin-right: 20px"
                disabled
                v-model="extJsonDetail.depositInfo.money"
                placeholder="配送费"
                type="number"
                class="input-with-select"
              >
              </el-input>
              <!-- <el-button type="danger" @click="returndeposit()" >退押金</el-button> -->
            </div>
            <div v-if="form.orderRefundRecord" style="padding: 0 20px">
              <div style="margin: 10px">
                <span style="font-weight: 700">退款类型：</span>
                <span v-if="form.orderRefundRecord.refundType == 1"
                  >仅退款
                </span>
                <span v-if="form.orderRefundRecord.refundType == 2"
                  >退货退款
                </span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">申请理由：</span>
                <span>{{ form.orderRefundRecord.applyRemark }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">申请时间：</span>
                <span>{{ formatDate(form.orderRefundRecord.createTime) }}</span>
              </div>

              <div style="margin: 10px">
                <span style="font-weight: 700">退款金额：</span>
                <span>{{ form.orderRefundRecord.refundMoney }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">退单编号：</span>
                <span>{{ form.orderRefundRecord.refundNo }}</span>
              </div>

              <div style="margin: 10px">
                <span style="font-weight: 700">退款方式：</span>
                <span v-if="form.orderRefundRecord.refundPayWay == 1"
                  >微信</span
                >
                <span v-if="form.orderRefundRecord.refundPayWay == 2"
                  >支付宝</span
                >
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">微信支付宝订单号：</span>
                <span>{{ form.orderRefundRecord.tradeNo }}</span>
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundType == 1"
              >
                <span style="font-weight: 700">退款状态：</span>
                <span v-if="form.orderRefundRecord.refundStatus == 0"
                  >待退款</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 5"
                  >退款中</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 10"
                  >退款成功</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 15"
                  >退款失败</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 20"
                  >待审核</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 25"
                  >拒绝退款</span
                >
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundType == 2"
              >
                <span style="font-weight: 700">退款状态：</span>
                <span v-if="form.orderRefundRecord.refundStatus == 0"
                  >待退货审核</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 5"
                  >待填写回寄单号</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 10"
                  >待质检</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 20"
                  >待退款</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 25"
                  >退款成功</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 30"
                  >拒绝退货</span
                >
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundStatus == 25"
              >
                <span style="font-weight: 700">退款时间：</span>
                <span>{{ formatDate(form.orderRefundRecord.refundTime) }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">退款说明：</span>
                <span>{{ form.orderRefundRecord.refuseApplyRemark }}</span>
              </div>
              <div
                v-if="form.refundStatus == 8"
                style="
                  font-size: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <el-button @click="open" type="danger">退款</el-button>
                <!-- <el-button @click="openNo" type="">拒绝退款</el-button> -->
              </div>
            </div>
            <div v-else><el-empty description="暂无售后信息" /></div>
          </el-scrollbar>
        </el-tab-pane>
        <!-- 物流信息 -->
        <el-tab-pane label="物流信息" name="fourth">
          <el-scrollbar>
            <el-form-item label="配送方式" prop="pid">
              <el-select
                disabled
                style="width: 220px"
                v-model="form.logisticsType"
                class="m-2"
                placeholder="请选择"
                size="default"
              >
                <el-option :key="1" label="配送" :value="1" />
                <el-option :key="2" label="快递" :value="2" />
                <el-option :key="3" label="自提" :value="3" />
                <el-option :key="4" label="到店消费" :value="4" />
                <el-option :key="5" label="上门服务" :value="5" />
              </el-select>
              <!-- <div style="width: 250px">
                <div v-if="form.logisticsType==1">配送</div>
                <div v-else-if="form.logisticsType==2">快递</div>
                <div v-else-if="form.logisticsType==3">自提</div>
                <div v-else-if="form.logisticsType==4">到店消费</div>
                <div v-else-if="form.logisticsType==5">上门服务</div>
              </div> -->
            </el-form-item>

            <el-form-item
              label="预计自提时间"
              prop="pid"
              v-if="form.logisticsType == 3"
            >
              <el-date-picker
                v-model="logisticsInfo.expectPickTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                @change="changeTime"
                placeholder="Select date and time"
              />
            </el-form-item>
            <el-form-item
              label="快递公司"
              prop="pid"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <el-input
                style="width: 330px"
                v-model="logisticsInfo.expressName"
                placeholder="请输入物流公司"
              >
                <template #append>
                  <el-select
                    @change="changeLogistics"
                    v-model="select"
                    placeholder="选择"
                    style="width: 115px"
                  >
                    <el-option label="圆通速递" value="1" />
                    <el-option label="韵达快递" value="2" />
                    <el-option label="中通快递" value="3" />
                    <el-option label="申通快递" value="4" />
                    <el-option label="百世快递" value="5" />
                    <el-option label="天天快递" value="6" />
                    <el-option label="顺丰速运" value="7" />
                    <el-option label="邮政快递" value="8" />
                    <el-option label="同城配送" value="9" />
                    <el-option label="自营配送" value="10" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="快递单号"
              prop="pid"
              v-if="form.logisticsType == 2"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.expressNo"
                placeholder="请输入快递单号"
                clearable
              />
            </el-form-item>
            <el-form-item label="配送状态" prop="pid">
              <el-select
                v-model="logisticsInfo.expressStatus"
                placeholder="选择"
                style="width: 115px"
              >
                <el-option label="创建订单" :value="0" />
                <el-option label="配送订单已创建" :value="5" />
                <el-option label="订单已改派" :value="10" />
                <el-option label="配送员已接单" :value="15" />
                <el-option label=">配送员已到店" :value="20" />
                <el-option label="配送员配送中" :value="25" />
                <el-option label="配送员点击订单完成" :value="30" />
                <el-option label="店家取消订单" :value="50" />
                <el-option label="顺丰原因取消订单" :value="55" />
                <el-option label="订单异常" :value="66" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="运费/配送费"
              prop="pid"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.realPayMoney"
                placeholder="请输入配送费"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="收货人姓名"
              prop="pid"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverName"
                placeholder="请输入收货人姓名"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="自提人姓名"
              prop="pid"
              v-if="form.logisticsType == 3"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverName"
                placeholder="请输入自提人姓名"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="收货人电话"
              prop="pid"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverMobile"
                placeholder="请输入收货人电话"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="自提人电话"
              prop="pid"
              v-if="form.logisticsType == 3"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverMobile"
                placeholder="请输入自提人电话"
                clearable
              />
            </el-form-item>
            <el-form-item label="地区" prop="pca">
              <pcas-cascader v-model="pcasName2" format="name" />
            </el-form-item>
            <el-form-item
              label="收货详细地址"
              prop="pid"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverAddressJson.address"
                placeholder="请输入"
                autosize
                clearable
              />
            </el-form-item>
            <el-form-item
              label="店铺地址"
              prop="pid"
              v-if="form.logisticsType == 3"
            >
              <el-input
                style="width: 500px"
                v-model="logisticsInfo.receiverAddressJson.address"
                placeholder="请输入"
                autosize
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="" prop="pid">
              <el-button type="primary" size="large" @click="Editlogistics">
        保存物流信息
      </el-button>
            </el-form-item> -->
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
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
import http from "@/api/index";
import api from "@/api/plugin";
import { UploadProps, ElMessage, ElMessageBox } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id: any;
  }>(),
  {
    modelValue: false,
    id: "",
  }
);

// 日期查询条件
const selectorData = ref({
  sta: "",
  end: "",
});

const activeName = ref("first");
// const value2:any=ref([])

const myVisible = ref(props.modelValue);
const form: any = ref({
  orderLogistics: {
    receiverAddressJson: {},
  },
  orderItemList: [],
});
const formRef = ref();
const formRules = ref({});
const pcasName: any = ref([]);
const pcasName2: any = ref([]);
const extJsonDetail: any = ref({});
const valueTime: any = ref("");
const select = ref("");

const logisticsInfo: any = ref({
  businessArriveTime: "",
  businessId: 0,
  completeCode: "",
  couponsTotalFee: 0,
  deliveryDistanceMeter: 0,
  expectExpectTimepickupTime: "",
  expectPickTime: "",
  expectTime: "",
  expressName: "",
  expressNo: "",
  expressStatus: 0,
  expressStatusDesc: "",
  extJson: "",
  id: 0,
  isAppoint: 0,
  orderId: 0,
  orderNo: "",
  payType: 0,
  pickupCode: "",
  realPayMoney: 0,
  receiverAddressJson: "",
  receiverCity: "",
  receiverDistrict: "",
  receiverLat: 0,
  receiverLng: 0,
  receiverMobile: "",
  receiverName: "",
  receiverProvince: "",
  riderName: "",
  riderPhone: "",
  serviceTime: "",
  startTime: "",
  totalPayMoney: 0,
  userId: 0,
});
const receiverAddressJson: any = ref({
  address: "",
  city: "",
  default: "",
  district: "",
  latitude: "",
  longitude: "",
  mobile: "",
  name: "",
  order: "",
  province: "",
});
function changeLogistics(e: any) {
  if (e == 1) {
    logisticsInfo.value.expressName = "圆通速递";
  } else if (e == 2) {
    logisticsInfo.value.expressName = "韵达快递";
  } else if (e == 3) {
    logisticsInfo.value.expressName = "中通快递";
  } else if (e == 4) {
    logisticsInfo.value.expressName = "申通快递";
  } else if (e == 5) {
    logisticsInfo.value.expressName = "百世快递";
  } else if (e == 6) {
    logisticsInfo.value.expressName = "天天快递";
  } else if (e == 7) {
    logisticsInfo.value.expressName = "顺丰速运";
  } else if (e == 8) {
    logisticsInfo.value.expressName = "邮政快递";
  } else if (e == 9) {
    logisticsInfo.value.expressName = "同城配送";
  } else if (e == 9) {
    logisticsInfo.value.expressName = "自营配送";
  }
}
function changeTime(e: any) {
  logisticsInfo.value.expectPickTime = e;
}

onMounted(() => {
  getdetalis();
});
function getdetalis() {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: props.id,
  };

  api
    .get("/api/order/getOrderInfoById", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        form.value = res.body;
        logisticsInfo.value = res.body.orderLogistics;
        receiverAddressJson.value = JSON.parse(
          res.body.orderLogistics.receiverAddressJson
        );
        form.value.orderLogistics.receiverAddressJson = JSON.parse(
          form.value.orderLogistics.receiverAddressJson
        );

        if (form.value.orderLogistics.receiverAddressJson) {
          pcasName.value[0] = logisticsInfo.value.receiverAddressJson.province;
          pcasName.value[1] =
            form.value.orderLogistics.receiverAddressJson.city;
          pcasName.value[2] =
            form.value.orderLogistics.receiverAddressJson.district;

          pcasName2.value[0] = logisticsInfo.value.receiverAddressJson.province;
          pcasName2.value[1] =
            form.value.orderLogistics.receiverAddressJson.city;
          pcasName2.value[2] =
            form.value.orderLogistics.receiverAddressJson.district;
        }

        form.value.orderItemList[0].extJson = JSON.parse(
          form.value.orderItemList[0].extJson
        );
        extJsonDetail.value = form.value.orderItemList[0].extJson;
      }
    });
}
function Editlogistics() {
  let data = logisticsInfo.value;
  receiverAddressJson.value.province = pcasName2.value[0];
  receiverAddressJson.value.city = pcasName2.value[1];
  receiverAddressJson.value.district = pcasName2.value[2];
  receiverAddressJson.value.name = logisticsInfo.value.receiverName;
  receiverAddressJson.value.mobile = logisticsInfo.value.receiverMobile;
  logisticsInfo.value.receiverAddressJson = JSON.stringify(
    receiverAddressJson.value
  );
  logisticsInfo.value.receiverProvince = pcasName2.value[0];
  logisticsInfo.value.receiverCity = pcasName2.value[1];
  logisticsInfo.value.receiverDistrict = pcasName2.value[2];
  api.post("/api/logistics/updateOrderLogistics", data).then((res: any) => {
    if (res.code == 200) {
      //  ElMessage.success({
      //         message: res.msg,
      //         center: true,
      //       });
    } else {
      ElMessage.error({
        message: res.msg,
        center: true,
      });
    }
  });
}
function onSubmit() {
  form.value.orderLogistics.receiverAddressJson.province = pcasName.value[0];
  form.value.orderLogistics.receiverAddressJson.city = pcasName.value[1];
  form.value.orderLogistics.receiverAddressJson.district = pcasName.value[2];
  form.value.orderLogistics.receiverAddressJson = JSON.stringify(
    form.value.orderLogistics.receiverAddressJson
  );
  formRef.value &&
    formRef.value.validate((valid: any) => {
      if (valid) {
        api.post("/api/order/updateOrder", form.value).then((res: any) => {
          if (res.code == 200) {
            // ElMessage.success({
            //   message: "修改成功",
            //   center: true,
            // });
            Editlogistics();
            api
              .post(
                "/api/logistics/updateOrderLogistics",
                form.value.orderLogistics
              )
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
    });
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}
// 退款
const open = () => {
  ElMessageBox.prompt("您确定要退款吗?", "提示", {
    confirmButtonText: "同意",
    cancelButtonText: "拒绝",
    type: "warning",
    inputPlaceholder: "请输入理由",
  })
    .then(({ value }) => {
      let data: any = {
        orderNo: form.value.orderNo,
        pass: 0,
        applyRemark: value,
      };
      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "退款成功",
          });
          activeName.value = "third";
          getdetalis();
        } else {
          ElMessage({
            type: "info",
            message: res.msg,
          });
          getdetalis();
        }
      });
    })
    .catch(({ value }) => {
      let data: any = {
        orderNo: form.value.orderNo,
        pass: 1,
        applyRemark: value,
      };

      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "拒绝成功",
          });
          activeName.value = "third";
          getdetalis();
        } else {
          ElMessage({
            type: "info",
            message: "拒绝失败",
          });
          getdetalis();
        }
      });
    });
};
const openNo: any = () => {
  ElMessageBox.prompt("", "确定要拒绝退款吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPlaceholder: "请输入理由",
  })
    .then(({ value }) => {
      let data: any = {
        orderNo: form.value.orderNo,
        pass: 1,
        applyRemark: value,
      };

      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "拒绝成功",
          });
          activeName.value = "third";
          getdetalis();
        } else {
          ElMessage({
            type: "info",
            message: "拒绝失败",
          });
          getdetalis();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "您取消了此次退款",
      });
    });
};
// 时间转换
function formatDate(cellValue: any) {
  if (cellValue == null || cellValue == "") return "";
  let date = new Date(parseInt(cellValue)); //时间戳为10位需*1000，如果为13位的话不需乘1000。
  let Y = date.getFullYear() + "-";
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1) + "-"
      : date.getMonth() + 1 + "-";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  let h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  let m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {};
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

<route lang="yaml">
meta: title:订单详情
</route>

<script setup lang="ts">
import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
import api from "@/api";
import http from "@/api/plugin";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const tableData: any = ref([]);

const content: any = ref({
  orderType: "普通订单",
  payType: 1,
  logisticsType: 2,
  userName: "张三",
  userMobile: "13900000000",
  orderRemark: "我要打七个",
  orderNo: "B2301111054061837459",
  createTime: "2023-03-15 08:00:00",
  canDelivery: "未发货",
  payMoney: 0,
  totalMoney: 0,
  userAvatar: "",
  paytime: "",
  orderLogistics: {
    receiverMobile: "",
  },
});
onBeforeMount(() => {
  getMallSetting();
});
function getMallSetting() {
  let data: any = {
    id: route.params.id,
  };
  console.log(data);
  try {
    api
      .get("/api/order/getOrderInfoById", {
        params: data,
      })
      .then((res: any) => {
        console.log(res);
        if (res.code == 200) {
          content.value = res.body;
          console.log(content.value,'订单详情8888888888')
        }
      });
  } catch (error) {
    console.log(error);
  }
}

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
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}

function addressData(value: any) {
  // console.log((value))
  let data: any = value;
  try {
    data = JSON.parse(data);
  } catch (error) {
    // data = JSON.parse(data)
  }
  let province =
    data.province + "" + data.city + "" + data.district + "" + data.address;

  return province;
}
function addressData1(value: any) {
  // console.log((value))
  let data: any = value;
  try {
    data = JSON.parse(data);
  } catch (error) {
    // data = JSON.parse(data)
  }
  let province = data.mobile;

  return province;
}

// 退款
const open = () => {
  ElMessageBox.confirm("您确定要退款吗?", "提示", {
    confirmButtonText: "同意",
    cancelButtonText: "拒绝",
    type: "warning",
  })
    .then(() => {
      let data: any = {
        orderNo: content.value.orderNo,
        pass: 0,
      };
      api.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "退款成功",
          });
          getMallSetting();
        } else {
          ElMessage({
            type: "info",
            message: "退款失败",
          });
          getMallSetting();
        }
      });
    })
    .catch(() => {
      let data: any = {
        orderNo: content.value.orderNo,
        pass: 1,
      };
      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        console.log(res);
        if (res.code == 200) {
          getMallSetting();
          ElMessage({
            type: "info",
            message: "退款失败",
          });
        }
      });
    });
};
</script>

<template>
  <div>
    <page-main>
      <div
        style="border: 1px solid #f2f2f2; border-radius: 5px; padding: 40px 10%"
      >
        <!--  active激活步骤条 -->
        <el-steps
          :space="400"
          :active="content.orderStatus"
          finish-status="success"
          style="font-size: 10px"
        >
          <el-step title="待付款" style="color: greenyellow" />
          <el-step title="待接单" />
          <el-step title="待发货" />
          <el-step title="待收货" />
          <el-step title="待使用" />
          <el-step title="已完成" />
        </el-steps>
      </div>
      <div class="content">
        <div class="cotent_lb">
          <div class="content_text">
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                订单类型：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                <!-- <div v-if="content.orderLogistics.orderType">
                    {{ content.orderLogistics.orderType }}
                  </div> -->
                <div>普通订单</div>
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                支付方式：
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-if="content.orderLogistics.payType == 1"

              >
                微信支付
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.orderLogistics
.payType == 2"
              >
                支付宝支付
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.orderLogistics
.payType ==3"
              >
                积分支付
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.orderLogistics
.payType ==5"
              >
                余额支付
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                配送方式：
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-if="content.logisticsType == 1"
              >
                配送
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.logisticsType == 2"
              >
                快递
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.logisticsType == 3"
              >
                自提
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.logisticsType == 4"
              >
                到店消费
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else-if="content.logisticsType == 5"
              >
                上门服务
              </div>
              <div
                style="font-size: 10px; display: flex; align-items: center"
                v-else
              >
                快递/配送
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                收货人：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ content.userName }}
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                联系方式
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ addressData1(content.orderLogistics.receiverMobile) }}
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                收货地址：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ addressData(content.orderLogistics.receiverMobile) }}
              </div>
            </div>
            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">会员昵称：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">王余银（ID:55345）</div>
              </div> -->
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                客户备注：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ content.orderRemark }}
              </div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                用户头像：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                <img
                  :src="content.userAvatar"
                  alt=""
                  style="width: 68px; height: 68px"
                />
              </div>
            </div>
            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">商家备注：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">无</div>
              </div> -->
            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">附加信息：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">合同制人员金辰实业有限公司,</div>
              </div> -->
          </div>
        </div>
        <div class="cotent_lb">
          <h3 style="position: relative; bottom: 10px; color: #464646">
            <div v-if="content.orderStatus == 0">订单状态:待付款</div>
            <div v-else-if="content.orderStatus == 1">订单状态:待接单</div>
            <div v-else-if="content.orderStatus == 2">订单状态:待发货</div>
            <div v-else-if="content.orderStatus == 3">订单状态:待收货</div>
            <div v-else-if="content.orderStatus == 4">订单状态:待使用</div>
            <div v-else-if="content.orderStatus == 5">订单状态:已完成</div>
            <div v-else-if="content.orderStatus == 6">订单状态:已取消</div>
            <div v-else-if="content.orderStatus == 7">订单状态:已失效</div>
            <div v-else-if="content.orderStatus == 8">订单状态:退款中</div>
            <div v-else-if="content.orderStatus == 9">订单状态:退款成功</div>
            <div v-else-if="content.orderStatus == 10">订单状态:退款失败</div>
          </h3>
          <div style="position: relative; bottom: 20px">
            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                订单编码：
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ content.orderNo }}
              </div>
            </div>

            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">下单时间：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">2023-01-11 10:54:06</div>
              </div> -->

            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                下单时间
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                {{ content.createTime}}
              </div>
            </div>

            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">物流公司：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">自营配送</div>
              </div> -->

            <div style="display: flex; margin: 10px 0">
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                是否发货
              </div>
              <div style="font-size: 10px; display: flex; align-items: center">
                <div v-if="content.canDelivery">{{ content.canDelivery }}</div>
                <!-- <div v-else-if="content.canDelivery">{{ content.canDelivery }}</div>
                  <div v-if="content.canDelivery">{{ content.canDelivery }}</div> -->
                <div v-else>暂无数据</div>
              </div>
            </div>

            <!-- <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">运单编号：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">18905130717</div>
              </div>

              <div style="display:flex;margin: 10px 0;">
                <div style="font-weight:bolder;font-size: 12px;width: 80px;">发货时间：</div>
                <div style="font-size: 10px;display: flex;align-items: center;">2023-02-07 10:34:21</div>
              </div> -->

            <div
              style="display: flex; margin: 20px 0; flex-direction: column"
              v-if="content.orderStatus == 8"
            >
              <div style="font-weight: bolder; font-size: 12px; width: 80px">
                您可以：
              </div>
              <div
                style="
                  font-size: 10px;
                  display: flex;
                  align-items: center;
                  position: relative;
                  left: 50px;
                  top: 20px;
                "
              >
                <el-button @click="open" type="danger" plain size="small"
                  >退款</el-button
                >
                <!-- <el-button type="primary" plain size="small"
                  >补打小票</el-button
                > -->
              </div>
            </div>
            <div v-if="content.orderStatus == 9">
              <div
                style="
                  font-weight: bolder;
                  font-size: 15px;
                  width: 80px;
                  font-weight: 700;
                  color: red;
                "
              >
                退款信息:
              </div>
              <div style="display: flex; margin: 10px 0">
                <div style="font-weight: bolder; font-size: 12px; width: 80px">
                  退款理由
                </div>
                <div
                  style="font-size: 10px; display: flex; align-items: center"
                >
                  {{ content.orderRefundRecord.applyRemark }}
                </div>
              </div>
              <div style="display: flex; margin: 10px 0">
                <div style="font-weight: bolder; font-size: 12px; width: 80px">
                  退款时间
                </div>
                <div
                  style="font-size: 10px; display: flex; align-items: center"
                >
                  {{ formatDate(content.orderRefundRecord.createTime) }}
                </div>
              </div>
              <div style="display: flex; margin: 10px 0">
                <div style="font-weight: bolder; font-size: 12px; width: 80px">
                  退款金额
                </div>
                <div
                  style="font-size: 10px; display: flex; align-items: center"
                >
                  {{ content.orderRefundRecord.payMoney }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px; border: 1px solid #f2f2f2">
        <el-table :data="content.orderItemList" stripe style="width: 120%">
          <el-table-column label="商品图片" align="center">
            <template #default="scope">
              <div>
                <img
                  style="width: 60px; height: 60px"
                  :src="scope.row.previewUrl"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" align="center">
            <template #default="scope">
              <div>{{ scope.row.goodName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="购买数量" align="center">
            <template #default="scope">
              <div>{{ scope.row.goodsNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template #default="scope">
              <div
                v-for="item in scope.row.goodsSpecificationList"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                {{ item.specificationName }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: space-around; margin: 20px">
          <div></div>
          <div>
            <!-- <div style="font-weight: bold">
              原价：¥{{ content.originalPrice }}
            </div> -->
            <div
              style="
                color: red;
                font-weight: bold;
                position: relative;
                top: 10px;
              "
            >
              实付总金额：¥{{ content.payMoney }}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 10px">
        <!-- <div
          style="display: flex; justify-content: space-between; margin-top: 5px"
        >
          <div style="color: #464646; font-size: 14px; font-weight: bold">
            后台确认
          </div>
          <div style="color: #464646; font-size: 14px">2023-02-08 13:54:33</div>
        </div> -->
        <!-- <div
          style="display: flex; justify-content: space-between; margin-top: 5px"
        >
          <div style="color: #464646; font-size: 14px; font-weight: bold">
            发货
          </div>
          <div style="color: #464646; font-size: 14px">2023-02-08 13:54:33</div>
        </div> -->
        <!-- <div
          style="display: flex; justify-content: space-between; margin-top: 5px"
        >
          <div style="color: #464646; font-size: 14px; font-weight: bold">
            余额支付
          </div>
          <div style="color: #464646; font-size: 14px">
            {{ formatDate(content.paytime) }}
          </div>
        </div> -->
        <div
          style="display: flex; justify-content: space-between; margin-top: 5px"
        >
          <div style="color: #464646; font-size: 14px; font-weight: bold">
            下单时间：
          </div>
          <div style="color: #464646; font-size: 14px">
            {{ formatDate(content.createTime) }}
          </div>
        </div>
      </div>
      <div style="height: 100px"></div>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  position: relative;
}

.content {
  // border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
  display: flex;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;

  .cotent_lb {
    color: #464646;
    border: 1px solid #f2f2f2;
    // border-radius: 5px;
    width: 50%;
    padding: 10px 20px;
  }
}
</style>

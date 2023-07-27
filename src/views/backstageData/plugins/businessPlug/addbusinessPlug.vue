<template>
  <div
    style="
      background-color: #fff;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-form
      ref="formRef"
      :model="info"
      :rules="formRules"
      label-width="100px"
      label-position="top"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-scrollbar height="65vh">
            <el-form-item label="店铺名字" prop="businessName">
              <el-input
                style="width: 650px"
                v-model="info.businessName"
                placeholder="请输入"
                clearable
              />
            </el-form-item>

            <el-form-item label="店铺logo" prop="">
              <img
                v-if="imageUrl"
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                :src="imageUrl"
                class="avatar"
                @click="upload_image('imageUrl')"
              />
              <el-icon
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                @click="upload_image('imageUrl')"
                v-else
                class="avatar-uploader-icon"
                ><Plus
              /></el-icon>
              <!-- </el-upload> -->
            </el-form-item>
            <el-form-item label="店铺详情轮播图" prop="rotationImgsJson">
              <div style="display: flex; flex-direction: column">
                <div style="display: flex">
                  <el-alert
                    title="双击图片进行删除！"
                    style="height: 30px; margin-bottom: 5px; width: 360px"
                    type="info"
                    show-icon
                    :closable="false"
                  />
                </div>
                <div style="display: flex">
                  <img
                    style="
                      width: 60px;
                      height: 60px;
                      margin-right: 10px;
                      border: 1px solid #eee;
                      border-radius: 8px;
                    "
                    v-if="imageUrl2"
                    v-for="(item, index) in imageUrl2"
                    @dblclick="delimg(index)"
                    :src="item"
                    class="avatar"
                  />
                  <el-icon
                    @click="upload_image('imageUrl2')"
                    class="avatar-uploader-icon"
                    style="border: 1px solid #eee; border-radius: 8px"
                    ><Plus
                  /></el-icon>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="店铺微信" prop="">
              <img
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                @click="upload_image('imageUrl3')"
                v-if="imageUrl3"
                :src="imageUrl3"
                class="avatar"
              />
              <el-icon
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                @click="upload_image('imageUrl3')"
                v-else
                class="avatar-uploader-icon"
                ><Plus
              /></el-icon>
              <!-- </el-upload> -->
            </el-form-item>
            <el-form-item label="店铺手机" prop="businessMobile">
              <el-input
                style="width: 650px"
                v-model="info.businessMobile"
                placeholder="请输入"
                clearable
              />
            </el-form-item>

            <!-- <el-form-item label="地区" prop="pca">
              <div style="display: flex;" >
                <pcas-cascader v-model="pcasName" format="name" />
                <el-button type="primary" @click="openMapPickPop" >选择地址</el-button>
              </div>

            </el-form-item> -->
            <el-form-item label="店铺地址" prop="businessAddress">
              <div style="display: flex">
                <el-input
                  v-model="info.businessAddress.address"
                  placeholder="请选择地址"
                  style="width: 650px"
                  clearable
                  disabled
                />
                <div style="margin-left: 10px">
                  <el-button type="primary" @click="openMapPickPop"
                    >选择地址</el-button
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item label="详细地址" prop="">
              <el-input
                v-model="info.businessAddress.inDetail"
                placeholder="请输入"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item>
              <el-form-item label="维度" prop="">
                <el-input
                  v-model="info.businessAddress.latitude"
                  placeholder="纬度"
                  disabled
                  clearable
                  style="width: 405px"
                />
              </el-form-item>
              <el-form-item label="经度" prop="">
                <el-input
                  v-model="info.businessAddress.longitude"
                  placeholder="经度"
                  disabled
                  clearable
                  style="width: 405px"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item label="提现账号" prop="">
              <el-input
                v-model="payjson.merchantWithdrawal.withdrawalAccount"
                placeholder="提现账号"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="备注信息" prop="">
              <el-input
                v-model="payjson.merchantWithdrawal.remark"
                placeholder="备注信息"
                clearable
                type="textarea"
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="提现天数" prop="">
              <el-alert
                title=" 当提现天数为10,代表商户10天后才可提现"
                style="height: 30px; margin-bottom: 5px; width: 360px"
                type="info"
                show-icon
                :closable="false"
              />
              <el-input
                v-model="payjson.merchantWithdrawal.withdrawalDays"
                placeholder="提现天数"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="提现比率" prop="">
              <el-alert
                title=" 当提现比率为70%时,商户只可提现可提现金额的百分之70(默认为0时,不可提现)"
                style="height: 30px; margin-bottom: 5px; width: 605px"
                type="info"
                show-icon
                :closable="false"
              />
              <el-input
                v-model="payjson.merchantWithdrawal.proportion"
                placeholder="提现比率"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="提现手续费" prop="">
              <el-alert
                title="当手续费为10时,则代表百分之1的手续费,100块钱提现手续费为1块钱"
                style="height: 30px; margin-bottom: 5px; width: 605px"
                type="info"
                show-icon
                :closable="false"
              />
              <el-input
                v-model="payjson.merchantWithdrawal.commission"
                placeholder="提现手续费"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="商户状态" prop="">
              <el-switch
                v-model="payjson.merchantWithdrawal.merchantStatus"
                class="ml-2"
                width="60"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
                active-value="0"
                inactive-value="1"
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="其他配置" name="second"
          ><el-scrollbar height="65vh">
            <el-row :gutter="20">
              <el-col :span="3">
                <el-form-item label="货到付款" prop="">
                  <el-switch
                    v-model="info.payType.cashDelivery"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
              <el-col :span="3"
                ><el-form-item label="微信支付" prop="">
                  <el-switch
                    v-model="info.payType.wxPay"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
              <el-col :span="3">
                <el-form-item label="余额支付" prop="">
                  <el-switch
                    v-model="info.payType.balance"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
              <el-col :span="3">
                <el-form-item label="积分支付" prop="">
                  <el-switch
                    v-model="info.payType.integral"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
              <el-col :span="3">
                <el-form-item label="快递费是否累加" prop="">
                  <el-switch
                    v-model="
                      info.shopExpressFee.allShopExpressFeeAccumulateORNot
                    "
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="3"
                ><el-form-item label="自提" prop="">
                  <el-switch
                    v-model="info.logisticsType.oneselfDelivery"
                    inline-prompt
                    active-text="是"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="快递" prop="">
                  <el-switch
                    v-model="info.logisticsType.expressDelivery"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="无服务物流" prop="">
                  <el-switch
                    v-model="info.logisticsType.noDelivery"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="是否包邮" prop="">
                  <el-switch
                    v-model="info.shopExpressFee.freeShipping"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
              <el-col :span="3">
                <el-form-item label="打包费是否累加" prop="">
                  <el-switch
                    v-model="info.shopExpressFee.packingFeeAccumulateORNot"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                  /> </el-form-item
              ></el-col>
            </el-row>
            <el-form-item label="全店运费" prop="">
              <el-input
                v-model="info.shopExpressFee.allShopExpressFee"
                placeholder="请输入"
                style="width: 650px"
                clearable
              />
            </el-form-item>
            <el-form-item label="起送金额(元)" prop="">
              <el-input
                v-model="info.shopExpressFee.orderStartMoney"
                placeholder="请输入"
                style="width: 650px"
                clearable
              />
            </el-form-item>
            <el-form-item label="最大配送距离(米)" prop="">
              <el-input
                v-model="info.shopExpressFee.maxDeliveryDistance"
                placeholder="请输入"
                style="width: 650px"
                clearable
              />
            </el-form-item>
            <el-form-item label="打包费" prop="">
              <el-input
                v-model="info.shopExpressFee.packingFee"
                placeholder="请输入"
                clearable
                style="width: 650px"
              />
            </el-form-item>

            <el-form-item label="自动收货时间" prop="">
              <el-input
                v-model="info.automaticReceiptDay"
                placeholder="请输入"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="订单结束退款天数" prop="">
              <el-input
                v-model="info.refundInfo.applyRefundDay"
                placeholder="请输入"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="退款是否审核" prop="">
              <el-switch
                v-model="info.refundInfo.refundReview"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="分享标题" prop="">
              <el-input
                v-model="info.shareTitle"
                placeholder="请输入"
                clearable
                style="width: 650px"
              />
            </el-form-item>
            <el-form-item label="分享图片" prop="">
              <img
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                @click="upload_image('imageUrl1')"
                v-if="imageUrl1"
                :src="imageUrl1"
                class="avatar"
              />
              <el-icon
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #eee;
                "
                @click="upload_image('imageUrl1')"
                v-else
                class="avatar-uploader-icon"
                ><Plus
              /></el-icon>
              <!-- </el-upload> -->
            </el-form-item>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 60%;
              "
            >
              <span style="color: #333; font-size: 22px; margin-bottom: 10px"
                >营业时间</span
              >
              <el-button type="primary" @click="addtime"
                >添加营业时间</el-button
              >
            </div>
            <div
              class="demo-time-range"
              v-for="(item, index) in info.businessHours"
            >
              <el-form-item label="营业时间段" prop="">
                <div>
                  <el-time-select
                    v-model="item.businessStartTime"
                    class="mr-4"
                    placeholder="Start time"
                    start="00:00"
                    step="00:15"
                    end="23:59"
                  />
                  <el-time-select
                    style="margin: 0px 20px"
                    v-model="item.businessEndTime"
                    placeholder="End time"
                    start="00:00"
                    step="00:15"
                    end="23:59"
                  />
                  <el-button
                    style="float: right"
                    type="danger"
                    round
                    @click="deltime(index)"
                    >删除</el-button
                  >
                </div>
              </el-form-item>
            </div></el-scrollbar
          ></el-tab-pane
        >
      </el-tabs>
    </el-form>

    <div class="footer">
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </div>

    <dialogWindows
      v-if="dialogPluginList.dialogVisible"
      v-model="dialogPluginList.dialogVisible"
      :dialogVisible="dialogPluginList.dialogVisible"
      :source="dialogPluginList.source"
      @success="Return"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { UploadProps, ElMessage, ElMessageBox } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
import { ref, reactive, computed, watch, onMounted } from "vue";
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();
const form: any = ref({
  id: route.params.id ?? "",
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  configType: "",
  jsonViewData: {},
  jsonData: {},
  plugsId: route.params.plugsId ?? "",
  businessId: "",
  userId: 0,
});
const pcasName: any = ref([]);
// 选择店铺地图
const mapApiKey = "KEDBZ-NJ7WJ-OOXFM-KGYWA-YSG4O-M5FT4";
const IFRAME_HTML = `<iframe id="mapPage" width="800" height="400" frameborder="0"
              src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${mapApiKey}&referer=myapp"></iframe>`;

const currentPicked: any = ref({
  latlng: {},
});
function openMapPickPop($event: any) {
  if ($event.relatedTarget) return;
  ElMessageBox({
    title: "选择地址",
    message: IFRAME_HTML,
    customClass: "location-picker-box",
    dangerouslyUseHTMLString: true,
    closeOnPressEscape: false,
  })
    .then(() => {
      window.removeEventListener("message", handleMapPickedMessage, false);
      info.value.businessAddress.address =
        currentPicked.value.poiaddress + "-" + currentPicked.value.poiname;
      info.value.businessAddress.latitude = currentPicked.value.latlng.lat;
      info.value.businessAddress.longitude = currentPicked.value.latlng.lng;
      info.value.businessAddress.city = currentPicked.value.cityname;
      let data = getArea(currentPicked.value.poiaddress);
      if (data.Province !== "") {
        info.value.businessAddress.province = data.Province;
      } else {
        info.value.businessAddress.province = data.City;
      }
      info.value.businessAddress.district = data.Country;
    })
    .catch((e) => {
      if (e != "cancel") throw e;
      window.removeEventListener("message", handleMapPickedMessage, false);
    });

  window.addEventListener("message", handleMapPickedMessage, false);
}
function getArea(str: any) {
  let area = {
    Province: "",
    City: "",
    Country: "",
  };
  let index11 = 0;
  let index1 = str.indexOf("省");
  if (index1 == -1) {
    index11 = str.indexOf("自治区");
    if (index11 != -1) {
      area.Province = str.substring(0, index11 + 3);
    } else {
      area.Province = str.substring(0, 0);
    }
  } else {
    area.Province = str.substring(0, index1 + 1);
  }
  let index2 = str.indexOf("市");
  if (index11 == -1) {
    area.City = str.substring(index11 + 1, index2 + 1);
  } else {
    if (index11 == 0) {
      area.City = str.substring(index1 + 1, index2 + 1);
    } else {
      area.City = str.substring(index11 + 3, index2 + 1);
    }
  }
  let index3 = str.lastIndexOf("区");
  if (index3 == -1) {
    index3 = str.indexOf("县");
    area.Country = str.substring(index2 + 1, index3 + 1);
  } else {
    area.Country = str.substring(index2 + 1, index3 + 1);
  }
  return area;
}
function handleMapPickedMessage(event: any) {
  /**
   * 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
   */
  let loc = event.data;
  // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
  if (loc && loc.module != "locationPicker") return;
  currentPicked.value = loc;
  //(" currentPicked.value ", currentPicked.value );
}

// const getPerson=(data:any)=>{
//       Object.assign(payjson, data)
// }

const info: any = ref({
  businessMobile: "",
  businessId: "",
  businessName: "",
  businessLogo: "",
  businessHours: [
    {
      businessStartTime: "08:00",
      businessEndTime: "12:00",
    },
  ],
  businessStatus: 0,
  shareImages: "",
  shopExpressFee: {
    allShopExpressFeeAccumulateORNot: 0,
    allShopExpressFee: 0,
    freeShipping: 0,
    packingFee: 0,
    packingFeeAccumulateORNot: 0,
    maxDeliveryDistance: 0,
    orderStartMoney: 0,
  },
  payType: {
    cashDelivery: 0,
    wxPay: 0,
    balance: 0,
    integral: 0,
  },
  shareTitle: "这是我们店里买的最好的一个商品",
  weChatORCodeImage: "",
  refundInfo: {
    applyRefundDay: 30,
    refundReview: 0,
  },
  businessAddress: {
    address: "",
    province: "",
    city: "",
    district: "",
    latitude: 0,
    longitude: 0,
    inDetail: "",
  },
  logisticsType: {
    oneselfDelivery: 0,
    expressDelivery: 0,
    noDelivery: 0,
  },
  automaticReceiptDay: 7,
  businessImages: [],
  payJson: {},
});
const payjson: any = ref({
  wei_chat: "0",
  bank_card: "0",
  alipay: "0",
  merchantWithdrawal: {
    merchantStatus: "0",
    merchantCity: " ",
    proportion: "",
    withdrawalAccount: "",
    merchantAddress: info.value.businessAddress.address,
    commission: "",
    remark: "",
    withdrawalDays: "",
    merchantMobile: info.value.businessMobile,
    merchantName: info.value.businessName,
  },
});
const formRef = ref();
const formRules = ref({
  businessName: [{ required: true, message: "请输入" }],
  businessMobile: [{ required: true, message: "请输入" }],
  businessAddress: [{ required: true, message: "请输入" }],
  logisticsType: [{ required: true, message: "请输入" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
onMounted(() => {
  if (form.value.id !== "") {
    api
      .get("/api/plugs/searchPlugsDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        info.value = JSONBIG.parse(res.body.jsonData);
        if (info.value.payJson) {
          payjson.value = info.value.payJson;
        }
        form.value = res.body;
        pcasName.value[0] = info.value.businessAddress.province;
        pcasName.value[1] = info.value.businessAddress.city;
        pcasName.value[2] = info.value.businessAddress.district;
        imageUrl.value = info.value.businessLogo;
        imageUrl1.value = info.value.shareImages;
        imageUrl3.value = info.value.weChatORCodeImage;

        if (info.value.businessImages) {
          imageUrl2.value = JSON.parse(info.value.businessImages);
        }
        // emit("success");
        // onCancel();
      });
  }
});
const addtime = () => {
  let obj = {
    businessStartTime: "08:00",
    businessEndTime: "12:00",
  };
  info.value.businessHours.push(obj);
};
const deltime = (index: any) => {
  info.value.businessHours.splice(index, 1);
};

// 为了更好的生成唯一的 ID，需要获取当前时间戳
function getTimestamp() {
  return new Date().getTime();
}

// 生成一个随机的工作机器 ID，实际应用中应该使用机器的真实标识符
function getWorkerID() {
  var code_fill_str = ["000000", "00000", "0000", "000", "00", "0", ""];
  var code: any = "" + parseInt((Math.random() * 1000000).toString());
  code = code_fill_str[code.length] + code;
  return code;
}
// 生成一个随机的序列号
// function getSequence() {
//   return Math.floor(Math.random() * 100000);
// }
// const sequence = getSequence();
// 生成雪花 ID 的主函数
function generateSnowflakeID() {
  const timestamp = getTimestamp();
  const workerID = getWorkerID();

  // 将时间戳、工作机器 ID 和序列号组合在一起生成雪花 ID
  return `${timestamp}${workerID}`;
}

// 使用示例  1670742827904-17081-61215

function onSubmit() {
  info.value.payJson = payjson.value;
  // if( info.value.businessAddress. address==''){
  //   ElMessage.warning({
  //                 message: "请点击选择店铺位置",
  //                 center: true,
  //               });
  //     return
  // }
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          info.value.businessId = generateSnowflakeID();
          form.value.businessId = info.value.businessId;
          info.value.businessAddress.province = pcasName.value[0];
          info.value.businessAddress.city = pcasName.value[1];
          info.value.businessAddress.district = pcasName.value[2];
          form.value.jsonData = JSONBIG.stringify(info.value);
          api
            .post("/api/plugs/insertPlugsData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
                // emit("success");
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
          form.value.jsonData = JSON.stringify(info.value);
          // return
          api
            .post("/api/plugs/updatePlugsData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
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
  }
}

function onCancel() {
  tabbar.close({ name: "addbusinessPlug" });
  router.push({
    name: "businessPlug",
    params: {
      id: route.params.plugsId,
      admin: "user",
    },
  });
}

// 图片上传

const imageUrl = ref("");
const imageUrl1 = ref("");
const imageUrl3 = ref("");

// 详情轮播
const imageUrl2: any = ref([]);

const delimg = (index: any) => {
  imageUrl2.value.splice(index, 1);
  info.value.businessImages = JSON.stringify(imageUrl2.value);
};
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {};

// 使用文件管理组件
// 使用文件管理组件
const types: any = ref("");
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  types.value = item;
  if (
    types.value == "imageUrl" ||
    types.value == "imageUrl1" ||
    types.value == "imageUrl3"
  ) {
    dialogPluginList.value.source = 1;
  } else if (types.value == "imageUrl2") {
    dialogPluginList.value.source = 2;
  }
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;

  if (types.value == "imageUrl") {
    imageUrl.value = data[0];
    info.value.businessLogo = data[0];
  } else if (types.value == "imageUrl2") {
    imageUrl2.value = data;
    info.value.businessImages = JSON.stringify(imageUrl2.value);
  } else if (types.value == "imageUrl3") {
    imageUrl3.value = data[0];
    info.value.weChatORCodeImage = data[0];
  } else if (types.value == "imageUrl1") {
    imageUrl1.value = data[0];
    info.value.shareImages = data[0];
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;

  display: block;
}
</style>

<style>
html .location-picker-box {
  width: auto;
  max-width: none;
}
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
.demo-tabs > .el-tabs__content {
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.footer {
  width: 100%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<route lang="yaml">
meta: title:商品添加
</route>
<route lang="yaml">
meta:
  enabled: false
</route>

<template>
  <div
    class="containter"
    style="
      background-color: #fff;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
      label-position="top"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-scrollbar height="64vh">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input
                style="width: 480px"
                v-model="form.goodsName"
                placeholder="商品名称"
                clearable
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="商品类型" prop="goodsType">
              <el-select
                v-model="form.goodsType"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option :key="0" label="普通商品" :value="0" />
                <el-option :key="1" label="积分商品" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input
                style="width: 240px"
                v-model="form.goodsPrice"
                placeholder="商品价格"
                type="number"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
                <template #append> 元 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="会员价" prop="memberPrice">
              <el-input
                style="width: 240px"
                type="number"
                v-model="form.memberPrice"
                placeholder="会员价"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
                <template #append> 元 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品划线价" prop="scribePrice">
              <el-input
                type="number"
                style="width: 240px"
                v-model="form.scribePrice"
                placeholder="会员价"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
                <template #append> 元 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="商品预览图" prop="previewUrl">
              <div @click="upload_file('商品预览图')">
                <img
                  v-if="imageUrl1"
                  style="
                    height: 80px;
                    width: 80px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                  "
                  :src="imageUrl1"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </div>
            </el-form-item>

            <!-- <el-form-item label="商品详情图" prop="goodsDetails">

              <div @click="upload_file('商品详情图')">
                <img v-if="imageUrl2" style="height: 80px;width: 80px;border:1px solid #eee;border-radius: 8px;" :src="imageUrl2" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon" style="border-radius: 8px;border:1px solid #eee"><Plus /></el-icon>
              </div>
            </el-form-item> -->
            <el-form-item label="商品详情轮播图" prop="rotationImgsJson">
              <div style="display: flex; flex-direction: column">
                <el-alert
                  title="双击图片进行删除！"
                  style="height: 30px; margin-bottom: 5px; width: 400px"
                  type="success"
                  show-icon
                />
                <div style="display: flex">
                  <el-icon
                    @click="upload_file('商品详情轮播图')"
                    class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                  <img
                    style="width: 60px; height: 60px; margin-left: 10px"
                    v-if="imageUrl.length"
                    v-for="(item, index) in imageUrl"
                    @dblclick="delimg(index)"
                    :src="item"
                    class="avatar"
                  />

                  <!-- <el-upload
                    class="avatar-uploader"
                    :action="baseURL"
                    :headers="header"
                    name="file"
                    :data="{ type: 1 }"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload> -->
                </div>
              </div>
            </el-form-item>
            <el-form-item label="所属插件" prop="plugsId">
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
            <el-form-item label="所属店铺" prop="businessId">
              <el-select
                v-model="form.businessId"
                filterable
                placeholder="选择店铺"
                @change="change(form.businessId)"
              >
                <el-option key="0" label="全部" value="0" />
                <el-option
                  v-for="item in businessList"
                  :key="item.businessId"
                  :label="item.businessName"
                  :value="item.businessId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
              <el-select
                v-model="form.categoryId"
                filterable
                placeholder="选择分类"
              >
                <el-option :key="0" label="全部" :value="0" />
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="运费模板" prop="categoryId">
              <el-select
                v-model="form.expressfeeTemplateId"
                filterable
                placeholder="选择模板"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.templateName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="库存量" prop="stockNum">
              <el-input
                style="width: 240px"
                v-model="form.stockNum"
                placeholder="库存量"
                type="number"
                class="input-with-select"
              >
                <template #append> 库存 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="限购数量" prop="limitNum">
              <el-input
                style="width: 240px"
                v-model="form.limitNum"
                placeholder="限购数量"
                type="number"
                class="input-with-select"
              >
                <template #append> 数量 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品状态" prop="goodsStatus">
              <el-switch
                v-model="form.goodsStatus"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="上架"
                inactive-text="下架"
              />
            </el-form-item>

            <el-form-item label="商品重量(克)" prop="goodsWeight">
              <el-input
                style="width: 240px"
                v-model="form.goodsWeight"
                placeholder="商品重量(克)"
                type="number"
                class="input-with-select"
              >
                <template #append> 克 </template>
              </el-input>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="商品配置" name="second">
          <el-scrollbar height="64vh">
            <el-form-item label="适用人数" prop="consumePersonNum">
              <el-input
                style="width: 240px"
                v-model="form.consumePersonNum"
                placeholder="适用人数"
                type="number"
                class="input-with-select"
              >
                <template #append> 人 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="购买有效天数" prop="effectDays">
              <el-input
                style="width: 240px"
                v-model="form.effectDays"
                placeholder="购买有效天数"
                type="number"
                class="input-with-select"
              >
                <template #append> 天 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="配送费" prop="distributionFee">
              <el-input
                style="width: 240px"
                v-model="form.distributionFee"
                placeholder="配送费"
                type="number"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
              </el-input>
            </el-form-item>
            <el-form-item label="打包费" prop="packingFee">
              <el-input
                style="width: 240px"
                v-model="form.packingFee"
                placeholder="打包费"
                type="number"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
              </el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="examineStatus">
              <!-- 0-待审核 1-审核成功 2-审核失败 -->
              <el-select
                v-model="form.examineStatus"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option :key="1" label="审核成功" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="	选择方式" prop="logisticsType">
              <!-- 1-快递,2-自提,3-到店消费,4快递自提都支持 5全部支持 -->
              <el-select
                v-model="form.logisticsType"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option :key="1" label="快递" :value="1" />
                <el-option :key="2" label="自提" :value="2" />
                <el-option :key="3" label="到店消费" :value="3" />
                <el-option :key="4" label="快递自提都支持" :value="4" />
                <el-option :key="5" label="全部支持" :value="5" />
              </el-select>
              <!-- <el-input v-model="form.goodsType" placeholder="请输入" clearable /> -->
            </el-form-item>
            <el-form-item label="月销售" prop="monthSales">
              <el-input
                style="width: 240px"
                v-model="form.monthSales"
                placeholder="打包费"
                type="number"
                class="input-with-select"
              >
                <template #prepend> 销量 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="总销量" prop="totalSales">
              <el-input
                style="width: 240px"
                v-model="form.totalSales"
                placeholder="打包费"
                type="number"
                class="input-with-select"
              >
                <template #prepend> 销量 </template>
              </el-input>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="规格设置" name="six">
          <el-scrollbar height="64vh">
            <SKU v-if="goodId !== 0" @success="skudata" :goodId="goodId"></SKU>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="其他配置" name="third">
          <el-scrollbar height="64vh">
            <el-form-item label="退改规则" prop="retirementRule">
              <el-input
                style="width: 400px"
                v-model="form.retirementRule"
                :rows="2"
                maxlength="300"
                show-word-limit
                placeholder="Please input"
              />
            </el-form-item>
            <el-form-item label="下单可得积分" prop="rewardIntegral">
              <el-input
                style="width: 240px"
                v-model="form.rewardIntegral"
                placeholder="下单可得积分"
                type="number"
                class="input-with-select"
              >
                <template #append> 积分 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="分享信息json" prop="shareJson">
              <!-- <el-input
                v-model="form.shareJson"
                placeholder="请输入"
                clearable
              /> -->
              <el-input
                style="width: 400px"
                v-model="form.shareJson"
                :rows="2"
                maxlength="300"
                show-word-limit
                placeholder="分享信息json"
              />
            </el-form-item>

            <el-form-item label="使用规则JSON" prop="useRuleJson">
              <el-input
                style="width: 400px"
                v-model="form.useRuleJson"
                :rows="2"
                maxlength="300"
                show-word-limit
                placeholder="使用规则JSON"
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="图文详情" name="foutid">
          <el-scrollbar height="64vh">
            <div>
              <TinymceEditor
                v-model="form.goodsDetailsJson"
                :init="defaultSetting"
              />
            </div>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="扩展信息" name="five">
          <el-scrollbar height="64vh">
            <el-form-item label="商品押金" prop="distributionFee">
              <el-input
                style="width: 240px"
                v-model="deposit.depositInfo.money"
                placeholder="商品押金"
                type="number"
                class="input-with-select"
              >
                <template #prepend> ¥ </template>
              </el-input>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
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
      :title="dialogPluginList.title"
      :width="dialogPluginList.width"
      :button_title="dialogPluginList.button_title"
      :height="dialogPluginList.heigth"
      :dialogVisible="dialogPluginList.dialogVisible"
      :close_title="dialogPluginList.close_title"
      :data="dialogPluginList.data"
      @success="Return"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import http from "@/api";
import { UploadProps, ElMessage } from "element-plus";
import SKU from "./components/sku.vue";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
import tinymce from "tinymce/tinymce";
import TinymceEditor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";
import "tinymce/models/dom";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/searchreplace";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const images: any = ref([
  // 'https://picsum.photos/400',
  // 'https://picsum.photos/600',
  // 'https://picsum.photos/500',
]);
const handleSuccess2: UploadProps["onSuccess"] = (res: any) => {
  if (res.code === 200) {
    images.value.push(res.body);
  } else {
    ElMessage.warning(res.msg);
  }
};
const defaultSetting = ref({
  language_url: "tinymce/langs/zh-Hans.js",
  language: "zh-Hans",
  skin_url:
    settingsStore.settings.app.colorScheme === "light"
      ? "tinymce/skins/ui/oxide"
      : "tinymce/skins/ui/oxide-dark",
  content_css:
    settingsStore.settings.app.colorScheme === "light"
      ? "tinymce/skins/content/default/content.min.css"
      : "tinymce/skins/content/dark/content.min.css",
  min_height: 250,
  max_height: 650,
  selector: "textarea",
  plugins:
    "autolink autoresize fullscreen image insertdatetime link lists media preview table wordcount code searchreplace",
  toolbar:
    "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat | link image media table insertdatetime searchreplace | preview code fullscreen",
  branding: false,
  menubar: false,
  toolbar_mode: "sliding",
  insertdatetime_formats: [
    "%Y年%m月%d日",
    "%H点%M分%S秒",
    "%Y-%m-%d",
    "%H:%M:%S",
  ],

  // https://www.tiny.cloud/docs/tinymce/6/file-image-upload/#images_upload_handler
  images_upload_handler: (blobInfo: any, success: any) =>
    new Promise((resolve) => {
      let formData = new FormData();
      formData.append("file", blobInfo.blob());
      formData.append("type", "1");
      api.post("/api/file/uploadImages", formData).then((res: any) => {
        console.log(res);
        const img = res.body;
        resolve(img);
      });
    }),
});
const content = ref("");
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();
const businessId = ref("0");
const activeName = ref("first");
// 押金
const deposit: any = ref({
  depositInfo: { money: "" },
});
const goodId = ref(0);
const handleClick = (tab: any) => {
  console.log(tab);
  if (tab == "six") {
    goodId.value = form.value.id;
  }
};
const form: any = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  consumePersonNum: "",
  effectDays: "",
  examineStatus: 1,
  extJson: "",
  goodsBeginTime: "",
  goodsDetails: "",
  goodsDetailsJson: "",
  goodsEndingTime: "",
  goodsName: "",
  goodsPrice: "",
  goodsStatus: 0,
  goodsType: 0,
  logisticsType: 1,
  goodsViewCount: "",
  goodsWeight: 0,
  id: route.params.id ?? "",
  limitNum: "100",
  monthSales: "",
  plugsId: Number(route.params.plugsId) ?? "",
  businessId: "0",
  categoryId: 0,
  previewUrl: "",
  retirementRule: "",
  rewardIntegral: "",
  distributionFee: "",
  rotationImgsJson: "",
  scribePrice: "",
  shareJson: "",
  stockNum: "1000",
  totalSales: "",
  useRuleJson: "",
  memberPrice: "",
  packingFee: "",
  businessName: "",
  expressfeeTemplateId: "",
});
const formRef = ref();
const formRules = ref({
  goodsName: [{ required: true, message: "请输入" }],
  plugsId: [{ required: true, message: "请输入", trigger: "change" }],
  businessId: [{ required: true, message: "请输入", trigger: "change" }],
  categoryId: [{ required: true, message: "请输入", trigger: "change" }],
  title: [{ required: true, message: "请输入" }],
  goodsPrice: [{ required: true, message: "请输入" }],
  limitNum: [{ required: true, message: "请输入" }],
  stockNum: [{ required: true, message: "请输入" }],
  goodsWeight: [{ required: true, message: "请输入" }],
});
const plugsList: any = ref([]);
const categoryList: any = ref([]);
const businessList: any = ref([]);
onMounted(() => {
  tinymce.init({});
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  // 获取插件列表
  api
    .get("/api/plugs/searchPlugsInfoList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
      }
    });

  // 获取分类
  api
    .get("/api/plugs/searchPlugsGoodCategoryList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        categoryList.value = res.body.list;
      }
    });
  // 获取店铺
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });

  if (form.value.id !== "") {
    api
      .get("/api/plugs/searchPlugsGoodsById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        console.log(res);

        if (res.code == 200) {
          form.value.consumePersonNum = res.body.consumePersonNum;
          form.value.adminId = res.body.adminId;
          form.value.effectDays = res.body.effectDays;
          form.value.examineStatus = res.body.examineStatus;
          form.value.goodsBeginTime = res.body.goodsBeginTime;
          form.value.goodsDetails = res.body.goodsDetails;
          form.value.goodsDetailsJson = res.body.goodsDetailsJson;
          form.value.goodsEndingTime = res.body.goodsEndingTime;
          form.value.goodsName = res.body.goodsName;
          form.value.goodsPrice = res.body.goodsPrice;
          form.value.goodsType = res.body.goodsType;
          form.value.goodsViewCount = res.body.goodsViewCount;
          form.value.goodsWeight = res.body.goodsWeight;
          form.value.id = res.body.id;
          form.value.businessName = res.body.businessName;
          form.value.limitNum = res.body.limitNum;
          form.value.monthSales = res.body.monthSales;
          form.value.plugsId = res.body.plugsId;
          form.value.businessId = JSONBIG.stringify(res.body.businessId);
          form.value.previewUrl = res.body.previewUrl;
          form.value.retirementRule = res.body.retirementRule;
          form.value.rewardIntegral = res.body.rewardIntegral;
          form.value.rotationImgsJson = res.body.rotationImgsJson;
          form.value.scribePrice = res.body.scribePrice;
          form.value.shareJson = res.body.shareJson;
          form.value.stockNum = res.body.stockNum;
          form.value.totalSales = res.body.totalSales;
          form.value.useRuleJson = res.body.useRuleJson;
          form.value.memberPrice = res.body.memberPrice;
          form.value.categoryId = res.body.categoryId;
          form.value.distributionFee = res.body.distributionFee;
          form.value.goodsStatus = res.body.goodsStatus;
          form.value.packingFee = res.body.packingFee;
          form.value.expressfeeTemplateId = res.body.expressfeeTemplateId;
          api
            .get("/api/platform/getExpressfeeTemplateList", {
              params: {
                businessId: form.value.businessId,
              },
            })
            .then((res: any) => {
              if (res.code == 200) {
                templateList.value = res.body;
              }
            });
          if (res.body.rotationImgsJson) {
            imageUrl.value = JSON.parse(res.body.rotationImgsJson);
          }

          imageUrl1.value = res.body.previewUrl;
          imageUrl2.value = res.body.goodsDetails;
          console.log(res.body);

          if (res.body.extJson) {
            form.value.extJson = JSON.parse(res.body.extJson);
            deposit.value = JSON.parse(res.body.extJson);
          }
          getsku();
        } else {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }
      });
  }
});

const getsku = () => {
  let data = {
    goodsId: form.value.id,
  };
  api
    .get("/api/plugs/searchPlugsGoodsSpecificationByGoodsId", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        if (res.body.specificationInfo.length !== 0) {
          let arr = [];
          // this.specificationInfo = res.body.specificationInfo;
          for (let item of res.body.specificationInfo) {
            let obj1: any = {
              name: Object.keys(item)[0],
              value: [],
              title: "",
              show: false,
              children: Object.values(item)[0],
            };
            console.log(item, 456);
            arr.push(obj1);
          }
          arr.forEach((item) => {
            console.log(item.children, 7777);
            item.children.forEach((ress: any) => {
              console.log(ress.attributeValue);
              item.value.push(ress.attributeValue);
            });
          });
          console.log(arr, 789);
          guige.value = arr;
          let arr1: any = [];
          res.body.plugsGoodsSpecificationList.forEach((item: any) => {
            let obj2 = {
              specificationName: item.specificationName,
              scribePrice: item.scribePrice,
              dealPrice: item.dealPrice,
              stockNum: item.stockNum,
              specificationNumber: item.specificationNumber,
              specificationImages: item.specificationImages,
              position: item.position,
            };
            arr1.push(obj2);
          });

          skulist.value = arr1;
        }
      }
    });
};
const templateList: any = ref([]);
function change(val: any) {
  console.log(val);
  // 获取运费模板
  api
    .get("/api/platform/getExpressfeeTemplateList", {
      params: {
        businessId: val,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        templateList.value = res.body;
      }
    });
  if (val == "0") {
    form.value.businessName = "全部";
  } else {
    let a = businessList.value.filter((item: any) => {
      if (item.businessId == val) {
        return item;
      }
    });
    console.log(a[0], 1);
    form.value.businessName = a[0].businessName;
    form.value.distributionFee = a[0].shopExpressFee.allShopExpressFee;
  }
}

const guige: any = ref([]);
const skulist: any = ref([]);
const skudata = (item: any, list: any) => {
  console.log(item, list, 9988888);
  guige.value = item;
  skulist.value = list;
};
function onSubmit() {
  if (form.value.businessId == "" && !form.value.businessId) {
    ElMessage.error({
      message: "店铺不能为空",
      center: true,
    });
    return;
  }
  form.value.businessId = JSONBIG.parse(form.value.businessId);
  form.value.extJson = JSON.stringify(deposit.value);

  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsGoods", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                console.log(res.body.id, 999963);

                guige.value.forEach((item: any) => {
                  let data = {
                    attributeName: item.name,
                    goodsId: res.body.id,
                  };
                  api
                    .post("/api/plugs/insertPlugsGoodsAttributeKey", data)
                    .then((ress: any) => {
                      if (ress.code == 200) {
                        if (item.name === ress.body.attributeName) {
                          item.id = ress.body.id;
                        }
                        item.value.forEach((result: any) => {
                          console.log(result);
                          let datas = {
                            attributeValue: result,
                            attributeKeyId: item.id,
                          };
                          api
                            .post(
                              "/api/plugs/insertPlugsGoodsAttributeValue",
                              datas
                            )
                            .then((ressss) => {
                              if (res.ressss == 200) {
                              }
                            });
                        });
                      }
                    });
                });
                skulist.value.forEach((element: any) => {
                  element.goodsId = res.body.id;
                });
                setTimeout(() => {
                  api
                    .post(
                      "/api/plugs/insertPlugsGoodsSpecification",
                      skulist.value
                    )
                    .then((res1: any) => {
                      if (res1.code == 200) {
                      }
                    });
                }, 1000);

                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
                console.log(res, 787);
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
          api
            .post("/api/plugs/updatePlugsGoods", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                console.log(skulist.value.length, 966);
                if (skulist.value.length !== 0) {
                  http
                    .post("/api/plugs/delPlugsGoodsSpecificationAll", {
                      goodsId: form.value.id,
                    })
                    .then((res1: any) => {
                      if (res1.code == 200) {
                        guige.value.forEach((item: any) => {
                          let data = {
                            attributeName: item.name,
                            goodsId: form.value.id,
                          };
                          api
                            .post(
                              "/api/plugs/insertPlugsGoodsAttributeKey",
                              data
                            )
                            .then((ress: any) => {
                              if (ress.code == 200) {
                                if (item.name === ress.body.attributeName) {
                                  item.id = ress.body.id;
                                }
                                item.value.forEach((result: any) => {
                                  console.log(result);
                                  let datas = {
                                    attributeValue: result,
                                    attributeKeyId: item.id,
                                  };
                                  api
                                    .post(
                                      "/api/plugs/insertPlugsGoodsAttributeValue",
                                      datas
                                    )
                                    .then((ressss) => {
                                      if (res.ressss == 200) {
                                      }
                                    });
                                });
                              }
                            });
                        });
                        skulist.value.forEach((element: any) => {
                          element.goodsId = form.value.id;
                        });
                        setTimeout(() => {
                          api
                            .post(
                              "/api/plugs/insertPlugsGoodsSpecification",
                              skulist.value
                            )
                            .then((res2: any) => {
                              if (res2.code == 200) {
                              }
                            });
                        }, 1000);
                      }
                    });
                } else {
                  http
                    .post("/api/plugs/delPlugsGoodsSpecificationAll", {
                      goodsId: form.value.id,
                    })
                    .then((res: any) => {
                      if (res.code == 200) {
                      }
                    });
                  // guige.value.forEach((item: any) => {
                  //   let data = {
                  //     attributeName: item.name,
                  //     goodsId: form.value.id,
                  //   };
                  //   api
                  //     .post("/api/plugs/insertPlugsGoodsAttributeKey", data)
                  //     .then((ress: any) => {
                  //       if (ress.code == 200) {
                  //         if (item.name === ress.body.attributeName) {
                  //           item.id = ress.body.id;
                  //         }
                  //         item.value.forEach((result: any) => {
                  //           console.log(result);
                  //           let datas = {
                  //             attributeValue: result,
                  //             attributeKeyId: item.id,
                  //           };
                  //           api
                  //             .post(
                  //               "/api/plugs/insertPlugsGoodsAttributeValue",
                  //               datas
                  //             )
                  //             .then((ressss) => {
                  //               if (res.ressss == 200) {
                  //               }
                  //             });
                  //         });
                  //       }
                  //     });
                  // });
                  // skulist.value.forEach((element: any) => {
                  //   element.goodsId = form.value.id;
                  // });
                  // setTimeout(() => {
                  //   api
                  //     .post(
                  //       "/api/plugs/insertPlugsGoodsSpecification",
                  //       skulist.value
                  //     )
                  //     .then((res2: any) => {
                  //       if (res2.code == 200) {
                  //       }
                  //     });
                  // }, 1000);
                }

                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                onCancel();
              } else {
                ElMessage.success({
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
  tabbar.close({ name: "addGoods" });
  router.push({
    name: "goodsList",
    params: {
      id: route.params.plugsId,
      admin: "user",
    },
  });
}

// 图片上传
const imageUrl: any = ref([]);
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, "456465", uploadFile);
  let obj = response.body;
  imageUrl.value.push(obj);

  form.value.rotationImgsJson = JSON.stringify(imageUrl.value);
};
const delimg = (index: any) => {
  imageUrl.value.splice(index, 1);
  form.value.rotationImgsJson = JSON.stringify(imageUrl.value);
};

const imageUrl1 = ref("");
const handleAvatarSuccess1: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  imageUrl1.value = response.body;
  form.value.previewUrl = response.body;
};

const imageUrl2 = ref("");
const handleAvatarSuccess2: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  imageUrl2.value = response.body;
  form.value.goodsDetails = response.body;
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // if (rawFile.type !== "image/jpeg") {
  //   ElMessage.error("Avatar picture must be JPG format!");
  //   return false;
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error("Avatar picture size can not exceed 2MB!");
  //   return false;
  // }
  // return true;
};

const types: any = ref("");
// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  title: "文件管理",
  data: "",
  button_title: "确定",
  width: "1100",
  heigth: "500",
  close_title: "取消",
});

const upload_file = (item: any) => {
  types.value = item;
  dialogPluginList.value.dialogVisible = true;
};
const Return = (data: any) => {
  console.log(data);

  dialogPluginList.value.dialogVisible = false;
  if (data.type == "return") {
    if (types.value == "商品预览图") {
      imageUrl1.value = data.data[0].url;
      form.value.previewUrl = data.data[0].url;
    } else if (types.value == "商品详情图") {
      imageUrl2.value = data.data[0].url;
      form.value.goodsDetails = data.data[0].url;
    } else if (types.value == "商品详情轮播图") {
      // imageUrl2.value =  data.data[0].url
      // form.value.goodsDetails = data.data[0].url

      data.data.forEach((item: any) => {
        imageUrl.value.push(item.url);
      });

      form.value.rotationImgsJson = JSON.stringify(imageUrl.value);
    }
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
  border-radius: 8px;
  border: 1px solid #eee;
}

.footer {
  width: 100%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .demo-tabs > .el-tabs__content {
  padding: 20px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
} */
</style>

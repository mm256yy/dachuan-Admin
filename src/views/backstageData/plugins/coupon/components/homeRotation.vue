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
        label-width="110px"
      >
        <div>
          <el-form-item label="优惠券名称" prop="couponName">
            <el-input
              v-model="form.couponName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="优惠券类型" prop="couponType">
            <!-- <el-input v-model="form.type" placeholder="请输入" clearable /> -->
            <el-select
              v-model="form.couponType"
              filterable
              placeholder="请选择优惠券类型"
            >
              <!-- <el-option key="0" label="全部" value="0" /> -->
              <el-option
                v-for="item in couponType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="businessId">
            <el-select
              v-if="props.id == ''"
              style="width: 680px"
              v-model="sleStoreList"
              filterable
              placeholder="选择店铺(一个或多个)"
              multiple
              @change="selectBusiness"
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="4"
            >
              <el-option key="selectAll" label="全部" value="selectAll" />
              <!-- <el-option key="0" label="全部" value="0" /> -->
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
            <el-select
              v-else
              v-model="form.businessId"
              filterable
              placeholder="选择店铺"
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
          <el-form-item label="封面链接" prop="couponIocn">
            <img
              @click="upload_image('imageUrl')"
              style="
                border-radius: 8px;
                border: 1px solid #eee;
                width: 64px;
                heigth: 64px;
              "
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            />
            <el-icon
              @click="upload_image('imageUrl')"
              style="
                border-radius: 8px;
                border: 1px solid #eee;
                width: 64px;
                heigth: 64px;
              "
              v-else
              class="avatar-uploader-icon"
            >
              <Plus />
            </el-icon>
            <!-- </el-upload> -->
          </el-form-item>
          <el-form-item
            v-if="form.couponType == 0 || form.couponType == 1"
            label="优惠券面额"
            prop="couponDenomination"
          >
            <el-input
              style="width: 240px"
              v-model="form.couponDenomination"
              placeholder="优惠券面额"
              type="number"
              min="0"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
              <template #append> 元 </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="form.couponType == 2"
            label="积分优惠券"
            prop="couponDenomination"
          >
            <el-input
              style="width: 240px"
              v-model="form.couponDenomination"
              placeholder="积分值"
              type="number"
              min="0"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
              <template #append> 分 </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="form.couponType == 3"
            label="折扣优惠券"
            prop="couponDenomination"
          >
            <el-input
              style="width: 240px"
              v-model="form.couponDenomination"
              placeholder="折扣值0~1"
              min="0"
              max="1"
              step="0.1"
              type="number"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
              <template #append> 折 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="发放数量" prop="number">
            <el-input
              style="width: 240px"
              v-model="form.number"
              placeholder="发放数量"
              type="number"
              min="0"
              class="input-with-select"
            >
              <template #append> 张 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最多领取" prop="maxNumber">
            <el-input
              style="width: 240px"
              v-model="form.maxNumber"
              placeholder="每人最多领取(10张)"
              type="number"
              min="0"
              max="10"
              class="input-with-select"
            >
              <template #append> 张 </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="form.couponType !== 2"
            label="满多少元使用"
            prop="howMuchFullMoney"
          >
            <el-input
              style="width: 240px"
              v-model="form.howMuchFullMoney"
              placeholder="满多少元使用"
              type="number"
              min="0"
              class="input-with-select"
            >
              <template #append> 元 </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="form.couponType == 1"
            label="优惠券口令"
            prop="couponPassword"
          >
            <el-input
              style="width: 460px"
              v-model="form.couponPassword"
              placeholder="设置优惠券口令,用户必须输入正确的口令才能领取"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="有效时间" prop="timeType">
            <el-radio-group
              @change="dateType"
              v-model="form.timeType"
              class="ml-4"
            >
              <el-radio :label="1" size="large">固定日期</el-radio>
              <el-radio :label="2" size="large"
                >领取到当日开始N天内有效</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.timeType == 1" label="" prop="startTime">
            <span style="margin-right: 8px" class="demonstration"
              >生效日期:</span
            >
            <el-date-picker
              @change="startTime"
              v-model="value1"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="生效日期"
            />
          </el-form-item>
          <el-form-item v-if="form.timeType == 1" label="" prop="endTime">
            <span style="margin-right: 8px" class="demonstration"
              >过期日期:</span
            >
            <el-date-picker
              v-model="value2"
              @change="endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="过期日期"
            />
          </el-form-item>
          <el-form-item v-if="form.timeType == 2" label="" prop="timeDay">
            <span class="demonstration">领取之日起</span>
            <el-input
              style="width: 240px"
              v-model="form.timeDay"
              placeholder="优惠券面额"
              type="number"
              min="0"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
              <template #append> 天内有效 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="可使用商品" prop="goodsType">
            <el-radio-group
              @change="selectGoods"
              v-model="form.goodsType"
              class="ml-4"
            >
              <el-radio :label="1" size="large">全部商品</el-radio>
              <el-radio :label="2" size="large">部分商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.goodsType == 2" label="" prop="goodsIds">
            <el-input
              v-model="form.goodsIds"
              placeholder="请选择商品"
              clearable
              @click="changeGoods"
            />
          </el-form-item>
          <!-- <el-form-item label="用户服务标识" prop="userServiceToken">
						<el-input v-model="form.userServiceToken" disabled placeholder="请输入" clearable />
					</el-form-item> -->
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
  <ChangeGoods
    v-if="comp.modelValue"
    v-model="comp.modelValue"
    @success="update"
  ></ChangeGoods>
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
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import ChangeGoods from "@/components/changeGoods/index.vue";
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

const title = computed(() => (props.id === "" ? "新增优惠券" : "修改优惠券"));

const form: any = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),
  businessId: "0",
  couponIocn: "",
  couponDenomination: 0,
  couponName: "",
  couponPassword: "",
  couponType: 0,
  endTime: "",
  goodsIds: "",
  goodsType: 1,
  howMuchFullMoney: 0,
  startTime: "",
  status: 0,
  timeType: 1,
  number: 0,
  maxNumber: 0,
  timeDay: 0,
  businessList: [],
});
const couponType = ref([
  { name: "普通优惠券", id: 0 },
  { name: "口令优惠券", id: 1 },
  { name: "积分优惠券", id: 2 },
  { name: "折扣优惠券", id: 3 },
]);
const radio1 = ref("1"); // 有效时间
// form.value.timeType=radio1.value;
const radio2 = ref("1"); // 可使用商品
// 有效期
const value1 = ref(""); // 生效日期
const value2 = ref(""); // 过期日期

// 日期类型

const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const shortcuts = [
  {
    text: "Today",
    value: new Date(),
  },
  {
    text: "Yesterday",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "A week ago",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];
const formRef = ref();
const formRules = ref({
  couponName: [
    {
      required: true,
      message: "请输入",
    },
  ],
  businessId: [
    {
      required: true,
      message: "请输入",
      trigger: "change",
    },
  ],
  couponDenomination: [
    {
      required: true,
      message: "请输入",
    },
  ],
  number: [
    {
      required: true,
      message: "请输入",
    },
  ],
  maxNumber: [
    {
      required: true,
      message: "请输入",
    },
  ],
  howMuchFullMoney: [
    {
      required: true,
      message: "请输入",
    },
  ],
  goodsType: [
    {
      required: true,
      message: "请输入",
    },
  ],
  timeType: [
    {
      required: true,
      message: "请输入",
    },
  ],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);
const sleStoreList: any = ref([]);
const selectAll: any = ref(false);
const busList: any = ref([]);
function selectBusiness(val: any) {
  if (selectAll.value) {
    selectAll.value = false;
    if (val.indexOf("selectAll") > -1) {
      sleStoreList.value = val.filter((item: any) => {
        return item != "selectAll";
      });
    } else {
      sleStoreList.value = [];
    }
  } else {
    if (val.indexOf("selectAll") > -1) {
      const optionsValue: any = [];
      businessList.value.forEach((item: any) => {
        optionsValue.push(item.businessId);
      });
      sleStoreList.value = ["selectAll", ...optionsValue];
      selectAll.value = true;
    } else {
      if (val.length === businessList.value.length) {
        const optionsValue: any = [];
        businessList.value.forEach((item: any) => {
          optionsValue.push(item.businessId);
        });
        sleStoreList.value = ["selectAll", ...optionsValue];
        selectAll.value = true;
      } else {
        sleStoreList.value = val;
      }
    }
  }
  const realSelect = sleStoreList.value.filter((item: any) => {
    return item != "selectAll";
  });
  // realSelect.toString()
  // form.value.businessId=realSelect.toString();
}
onMounted(() => {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  api
    .get("/api/plugs/searchPlugsInfoList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
      }
    });
  // 获取店铺
  api
    .get("/api/plugs/getBusinessInfo", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        res.body.forEach((item: any) => {
          item.jsonViewData.businessId =
            item.jsonViewData.businessId.toString();
          businessList.value.push(item.jsonViewData);
        });
      }
    });
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsCouponsById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        form.value.businessId = JSONBIG.stringify(form.value.businessId);
        radio1.value = res.body.timeType;
        radio2.value = res.body.goodsType;
        value1.value = formatDate(res.body.startTime);
        value2.value = formatDate(res.body.endTime);
        imageUrl.value = res.body.couponIocn;
      });
  }
});
// 指定类型商品
const comp = ref({
  modelValue: false,
});
const changeGoods = () => {
  comp.value.modelValue = true;
};
const update = (item: any) => {
  form.value.goodsIds = item.join();
  comp.value.modelValue = false;
};

// 生效日期
function startTime() {
  form.value.startTime = value1.value;
}
// 过期日期
function endTime() {
  form.value.endTime = value2.value;
}
function dateType() {
  // form.value.timeType=radio1.value;
}
function selectGoods() {
  // form.value.goodsType=radio2.value;
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
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}

function onSubmit() {
  if (form.value.id === "") {
    form.value.businessId = "0";
    businessList.value.forEach((item2: any) => {
      sleStoreList.value.forEach((item: any) => {
        if (item == item2.businessId) {
          let str = item2.businessId + "_" + item2.businessName;
          busList.value.push(str);
        }
      });
    });
    form.value.businessList = busList.value;
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsCoupons", form.value)
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
            .post("/api/plugs/updatePlugsCoupons", form.value)
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

// 图片上传

const imageUrl = ref("");

const fullscreenLoading = ref(false);

// 使用文件管理组件

const types: any = ref("");

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

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (data.type == "return") {
    if (types.value == "imageUrl") {
      imageUrl.value = data.data[0].url;
      form.value.couponIocn = data.data[0].url;
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
/* .el-form-item__content{
		display: none;
	} */
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

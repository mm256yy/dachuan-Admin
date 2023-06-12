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
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-scrollbar height="" style="padding: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="top"
      >
        <!-- <el-form-item label="数据类型" prop="dataType">
          <el-input v-model="form.dataType" placeholder="dataType" clearable />
        </el-form-item>
        <el-form-item label="数据说明" prop="describes">
          <el-input v-model="form.describes" placeholder="插件数据" clearable />
        </el-form-item> -->
        <el-form-item label="插件" prop="plugsId">
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
        <el-form-item label="店铺ID" prop="">
          <el-select
            v-model="form.businessId"
            filterable
            placeholder="选择插件"
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
        <el-form-item label="插件数据" prop="jsonData">
          <el-input v-model="form.jsonData" />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button size="large" @click="onCancel"> 取消 </el-button>
        <el-button type="primary" size="large" @click="onSubmit">
          确定
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();

const form: any = ref({
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  id: route.params.id ?? "",
  jsonData: ` [{"data":[{"customer_images":"https://systemimgs.oss-cn-hangzhou.aliyuncs.com/recommendedBits/yzqc_0007.jpg?time=1678687920394","mobile":"18324496190","customer_name":"张三"}],"data_type":"static","description":"这是一个图片列表解析数据 customer_images:客服头像,customer_name:客服名字,mobile:客服名字","key_description":{"customer_images":"客服头像","mobile":"手机","customer_name":"客服名称"},"type":"ax001","sql":"0","parms":"-"},{"data":"0","data_type":"sql","description":"这是一个热销商品的布局页面数据",
  "key_description":"0","type":"ax002","sql":"SELECT * FROM cf_plugs_goods WHERE id in(?);","parms":"126,127"}]`,

  // describes: "",
  plugsId: Number(route.params.plugsId) ?? "",
  jsonViewData: {},
  businessId: "0",
  // dataType: "",
});

const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);
onMounted(() => {
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
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });
});
// 获取店铺

function onSubmit() {
  console.log(form.value);

  formRef.value &&
    formRef.value.validate((valid: any) => {
      if (valid) {
        api
          .post("/api/plugs/insertPlugsHomeData", form.value)
          .then((res: any) => {
            if (res.code == 200) {
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
}
function onCancel() {
  tabbar.close({ name: "addHomeData" });
  router.push({
    name: "homeData",
    params: {
      id: route.params.plugsId,
      admin:'user'
    },
  });
}
</script>

<style scoped></style>

<style></style>

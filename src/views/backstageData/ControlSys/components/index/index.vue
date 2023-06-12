<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="280px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="content" style="padding: 0 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
        label-position="top"
      >
        <el-form-item label="请输入运费模板名称" prop="title">
          <el-input
            v-model="form.templateName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>

        <el-form-item label="请选择运费计算类型" prop="businessId">
          <el-select
            v-model="form.computeType"
            filterable
            placeholder="选择店铺"
          >
            <el-option :key="1" label="按购买件数" :value="1" />
            <el-option :key="2" label="按下单距离" :value="2" />
            <el-option :key="3" label="按购买重量" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺" prop="">
          <el-select
            v-model="form.businessId"
            filterable
            placeholder="选择插件"
          >
            <el-option
              v-for="item in businessList"
              :key="item.jsonViewData.businessId"
              :label="item.jsonViewData.businessName"
              :value="item.jsonViewData.businessId"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
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
console.log(props, 999);

const title = computed(() =>
  props.id === "" ? "创建运费模板" : "修改运费模板"
);

const form: any = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),

  businessId: "",
  computeType: 1,
  status: 0,
  templateName: "",
});

const formRef = ref();
const formRules = ref({});
const businessList: any = ref([]);
onMounted(() => {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      businessList.value = res.body;
      // res.body.forEach((item: any) => {
      //   item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
      // });
    }
  });
  if (props.id !== "") {
    console.log("我用了你");
    api
      .get("/api/platform/searchExpressfeeTemplateById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        form.value.businessId = form.value.businessId.toString();
        console.log(form.value.businessId);
      });
  }
});

function onSubmit() {
  if (!form.value.templateName || form.value.templateName == "") {
    ElMessage.info({
      message: "请输入运费模板名称",
      center: true,
    });
    return;
  } else if (!form.value.businessId || form.value.businessId == "") {
    ElMessage.info({
      message: "请选择店铺",
      center: true,
    });
    return;
  }
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/platform/insertExpressfeeTemplate", form.value)
            .then((res: any) => {
              ElMessage.success({
                message: "新增成功",
                center: true,
              });
              console.log(res, 787);
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
            .post("/api/platform/updateExpressfeeTemplate", form.value)
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
</script>

<style scoped>
:deep(.el-form-item__content) {
  line-height: 32px;
  width: 100%;
}
</style>

<style></style>

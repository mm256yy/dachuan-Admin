<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="规格名称" prop="specificationName">
        <el-input
          v-model="form.specificationName"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="成交价" prop="dealPrice">
        <el-input
          type="number"
          v-model="form.dealPrice"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="商品id" prop="goodsId">
        <el-input v-model="form.goodsId" placeholder="请输入" clearable />
      </el-form-item> -->
      <!-- <el-form-item label="id" prop="id">
        <el-input v-model="form.id" placeholder="请输入" clearable />
      </el-form-item> -->
      <el-form-item label="划线价" prop="scribePrice">
        <el-input
          type="number"
          v-model="form.scribePrice"
          placeholder="请输入"
          clearable
        />
      </el-form-item>

      <el-form-item label="库存量" prop="stockNum">
        <el-input
          type="number"
          v-model="form.stockNum"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
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
import api from "@/api/plugin";
import { UploadProps, ElMessage } from "element-plus";
import storage from "@/utils/storage";
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
    goodsId: any;
  }>(),
  {
    modelValue: false,
    id: "",
    goodsId: "",
  }
);
const myVisible = ref(props.modelValue);
console.log(props, 999);

const title = computed(() =>
  props.id === "" ? "新增商品规格" : "修改商品规格"
);
const form = ref({
  dealPrice: "",
  goodsId: props.goodsId,
  id: props.id,
  // adminId: storage.local.get("adminId"),
  // userServiceToken: storage.local.get("userServiceToken"),
  scribePrice: "",
  specificationName: "",
  stockNum: "",
});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
onMounted(() => {
  if (props.id !== "") {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsGoodsSpecificationById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        if (res.code == 200) {
          form.value.dealPrice = res.body.dealPrice;
          form.value.goodsId = res.body.goodsId;
          form.value.id = res.body.id;
          form.value.scribePrice = res.body.scribePrice;
          form.value.specificationName = res.body.specificationName;
          form.value.stockNum = res.body.stockNum;
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
  }
});

function onSubmit() {
  if (form.value.id === "") {
    console.log(form.value.id, 999);

    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsGoodsSpecification", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
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
  } else {
    console.log("xiugai", 999);

    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsGoodsSpecification", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
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
  }
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}

// 图片上传

const imageUrl = ref("");
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
});
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
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
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>

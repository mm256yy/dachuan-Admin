<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="700px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="110px">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="form.categoryName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="分类说明" prop="categoryDesc">
        <el-input v-model="form.categoryDesc" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="所属店铺" prop="businessId">
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
      <el-form-item label="	图片链接" prop="icon">
        <!-- <el-upload
          class="avatar-uploader"
          :action="baseURL"
          :headers="header"
          name="file"
          :data="{ type: 1 }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        > -->
        <img
          @click="upload_image('imageUrl')"
          style="
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 1px solid #eee;
          "
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
        />
        <el-icon
          @click="upload_image('imageUrl')"
          style="
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 1px solid #eee;
          "
          v-else
          class="avatar-uploader-icon"
          ><Plus
        /></el-icon>
        <!-- </el-upload> -->
      </el-form-item>
      <el-form-item label="排序标识" prop="orders">
        <el-input v-model="form.orders" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="父id" prop="pid">
        <el-input v-model="form.pid" placeholder="请输入" clearable />
      </el-form-item>

      <!-- <el-form-item label="预告url" prop="prenoticeUrl">
        <el-input v-model="form.prenoticeUrl" placeholder="请输入" clearable />
      </el-form-item> -->
      <el-form-item label="	是否启用" prop="status">
        <el-switch
          v-model="form.status"
          inline-prompt
          :active-value="0"
          :inactive-value="1"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
      <!-- <el-form-item label="		用户服务标识" prop="userServiceToken">
        <el-input
          v-model="form.userServiceToken"
          placeholder="请输入"
          clearable
        />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
  <dialogWindows
    v-if="dialogPluginList.dialogVisible"
    v-model="dialogPluginList.dialogVisible"
    :dialogVisible="dialogPluginList.dialogVisible"
    :source="dialogPluginList.source"
    @success="Return"
  />
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
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

const title = computed(() =>
  props.id === "" ? "新增商品分类" : "修改商品分类"
);
const form = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  categoryName: "",
  categoryDesc: "",
  icon: "",
  orders: "",
  pid: "",
  plugsId: Number(props.plugsId),
  status: "",
  businessId: "0",
  businessList: [],
});
const formRef = ref();
const formRules = ref({
  categoryName: [{ required: true, message: "请输入" }],
  categoryDesc: [{ required: true, message: "请输入" }],
  businessId: [{ required: true, message: "请输入", trigger: "change" }],
  // categoryName: [{ required: true, message: "请输入" }],
  // categoryName: [{ required: true, message: "请输入" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);
const sleStoreList: any = ref([]);
const busList: any = ref([]);
const selectAll: any = ref(false);
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
    .get("/api/plugs/searchPlugsInfoList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
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
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsGoodCategoryById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        imageUrl.value = res.body.icon;
        form.value.businessId = JSONBIG.stringify(form.value.businessId);
      });
  }
});

function onSubmit() {
  // if (form.value.businessId == "" && !form.value.businessId) {
  //   ElMessage.error({
  //     message: "店铺不能为空",
  //     center: true,
  //   });
  //   return;
  // }
  // form.value.businessId = JSONBIG.parse(form.value.businessId);
  if (form.value.id === "") {
    //
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
            .post("/api/plugs/insertPlugsGoodCategory", form.value)
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
    //
    form.value.businessId = JSONBIG.parse(form.value.businessId);
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsGoodCategory", form.value)
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

import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  imageUrl.value = data[0];
  form.value.icon = data[0];
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
}
</style>

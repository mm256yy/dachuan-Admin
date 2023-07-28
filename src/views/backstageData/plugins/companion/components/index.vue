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
    <div class="content" style="border-radius: 10px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item label="申请人姓名" prop="title">
          <el-input v-model="jsonData.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="申请人电话" prop="type">
          <el-input v-model="jsonData.phone" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="申请人身份证" prop="type">
          <el-input v-model="jsonData.idCard" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="申请人性别" prop="type">
          <el-input v-model="jsonData.sex" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="地区" prop="pca">
          <pcas-cascader v-model="pcasName" format="name" />
        </el-form-item>
        <el-form-item label="详细地址" prop="">
          <el-input
            v-model="jsonData.address.address"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="能否提供车辆接送" prop="type">
          <el-radio-group v-model="jsonData.jieSong" class="ml-4">
            <el-radio :label="0" size="large">能</el-radio>
            <el-radio :label="1" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直接开启电话联系" prop="type">
          <el-switch
            v-model="jsonData.phoneShow"
            class="ml-2"
            :active-value="0"
            :inactive-value="1"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>

        <el-form-item label="身份证正面照片" prop="activityImgUrl">
          <!-- <el-upload
            class="avatar-uploader"
            :action="baseURL"
            :headers="header"
            :on-remove="handleRemove"
            name="file"
            :data="{ type: 1 }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          > -->
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
            ><Plus
          /></el-icon>
          <!-- </el-upload> -->
        </el-form-item>
        <el-form-item label="身份证反面照片" prop="activityImgUrl">
          <!-- <el-upload
            class="avatar-uploader"
            :action="baseURL"
            :headers="header"
            :on-remove="handleRemove"
            name="file"
            :data="{ type: 1 }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
          > -->
          <img
            @click="upload_image('imageUrl1')"
            style="
              border-radius: 8px;
              border: 1px solid #eee;
              width: 64px;
              heigth: 64px;
            "
            v-if="imageUrl1"
            :src="imageUrl1"
            class="avatar"
          />
          <el-icon
            @click="upload_image('imageUrl1')"
            style="
              border-radius: 8px;
              border: 1px solid #eee;
              width: 64px;
              heigth: 64px;
            "
            v-else
            class="avatar-uploader-icon"
            ><Plus
          /></el-icon>
          <!-- </el-upload> -->
        </el-form-item>

        <el-form-item label="店铺" prop="businessId">
          <el-select
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

        <el-form-item label="用户服务标识" prop="userServiceToken">
          <el-input
            v-model="form.userServiceToken"
            disabled
            placeholder="请输入"
            clearable
          />
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

const title = computed(() => (props.id === "" ? "新增" : "修改"));
const pcasName: any = ref([]);

const form = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),
  businessId: 0,
  distance: 0,
  jsonData: "",
  jsonViewData: {},
  userId: 0,
});

const jsonData = ref({
  phoneShow: 1,
  idCarImageFront: "",
  address: {
    address: "详细地址",
    province: "",
    city: "",
    district: "",
    latitude: 11.0,
    longitude: 120.11,
  },
  jieSong: 0,
  phone: "18324496191",
  idCard: "18324496191",
  qrcode: "xxxxxxxxxxxxxxxx",
  sex: "男",
  name: "张三",
  idCarImageOpposite: "",
  serviceHospital: [
    // {
    // 	serviceHospitalId: 111,
    // 	departmentInfo: [
    // 		{ departmentName: '耳鼻喉科', child: ['放射科01', '放射科02', '放射科03'] },
    // 		{ departmentName: '心血管科', child: ['脑科01', '脑科科02', '脑科科03'] }
    // 	]
    // }
  ],
});

const formRef = ref();
const formRules = ref({
  // title: [{ required: true, message: "请输入" }],
  // businessId: [{ required: true, message: "请输入", trigger: "change" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);
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
      .get("/api/plugs/searchPlugsDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        jsonData.value = JSON.parse(form.value.jsonData);
        pcasName.value[0] = jsonData.value.address.province;
        pcasName.value[1] = jsonData.value.address.city;
        pcasName.value[2] = jsonData.value.address.district;
        imageUrl.value = jsonData.value.idCarImageFront;
        imageUrl1.value = jsonData.value.idCarImageOpposite;
        form.value.businessId = JSONBIG.stringify(form.value.businessId);
      });
  }
});

function onSubmit() {
  jsonData.value.address.province = pcasName.value[0];
  jsonData.value.address.city = pcasName.value[1];
  jsonData.value.address.district = pcasName.value[2];
  form.value.jsonData = JSON.stringify(jsonData.value);
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsData", form.value)
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
            .post("/api/plugs/updatePlugsData", form.value)
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

const imageUrl1 = ref("");

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
  dialogPluginList.value.source = 1;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (types.value == "imageUrl") {
    imageUrl.value = data[0];
    jsonData.value.idCarImageFront = data[0];
  } else if (types.value == "imageUrl1") {
    imageUrl1.value = data[0];
    jsonData.value.idCarImageOpposite = data[0];
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

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
        <div v-if="form.userServiceToken == 'PO5159ATBWNAPEXVKDK6E'">
          <el-form-item label="法规名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="法规上传" prop="detailsImgAndPageUrl">
            <el-input
              v-model="form.detailsImgAndPageUrl"
              placeholder="请输入"
              clearable
            >
              <template #append>
                <el-button
                  class="file"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  element-loading-text="上传中"
                >
                  <input type="file" @change="change" />
                  点击上传
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div v-else>
          <el-form-item label="推荐位名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="推荐位类型" prop="type">
            <el-input v-model="form.type" placeholder="请输入" clearable />
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

          <el-form-item label="封面链接" prop="activityImgUrl"
            >
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
              <img @click="upload_image('imageUrl')" style="width:60px;height: 60px;border-radius: 8px;border: 1px solid #eee;" v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon @click="upload_image('imageUrl')" style="width:60px;height: 60px;border-radius: 8px;border: 1px solid #eee;" v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <!-- </el-upload> -->
          </el-form-item>
          <el-form-item label="跳转id" prop="detailsId">
            <el-input v-model="form.detailsId" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="	扩展数据" prop="extJson">
            <el-input v-model="form.extJson" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="详情页跳转" prop="detailsImgAndPageUrl">
            <el-input
              v-model="form.detailsImgAndPageUrl"
              placeholder="请输入"
              clearable
            >
              <template #append>
                <el-button
                  class="file"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  element-loading-text="上传中"
                >
                  <input type="file" @change="change" />
                  点击上传
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="跳转位置	" prop="jumpPosition">
            <el-input
              v-model="form.jumpPosition"
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="	是否显示" prop="showHide">
            <el-input v-model="form.showHide" placeholder="请输入" clearable />
          </el-form-item>

          <el-form-item label="用户服务标识" prop="userServiceToken">
            <el-input
              v-model="form.userServiceToken"
              disabled
              placeholder="请输入"
              clearable
            />
          </el-form-item>
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
console.log(props, 999);

const title = computed(() => (props.id === "" ? "新增" : "修改"));

const form = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  activityImgUrl: "",
  detailsId: "",
  detailsImgAndPageUrl: "",
  extJson: "",
  jumpPosition: "",
  plugsId: Number(props.plugsId),
  showHide: "",
  title: "",
  type: "",
  businessId: "0",
});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入" }],
  businessId: [{ required: true, message: "请输入", trigger: "change" }],

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
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsRecommendedById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        imageUrl.value = res.body.activityImgUrl;
        form.value.businessId = JSONBIG.stringify(form.value.businessId);

        // form.value.id = res.body.id;
        // form.value.plugsDescribe = res.body.plugsDescribe;
        // form.value.paths = res.body.paths;
        // form.value.plugsType = res.body.plugsType;
        // form.value.icon = res.body.icon;
        // form.value.plugsStatus = res.body.plugsStatus;
        // imageUrl.value = res.body.icon;
        // emit("success");
        // onCancel();
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
            .post("/api/plugs/insertPlugsRecommended", form.value)
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
    console.log("xiugai", 999);

    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsRecommended", form.value)
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
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});
// const baseURL: any = "http://192.168.31.47:7001/api/file/uploadImages";

const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  form.value.activityImgUrl = response.body;
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
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const fullscreenLoading = ref(false);
const change = (e: any) => {
  console.log(e.target.files[0]);
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("type", "1");
  fullscreenLoading.value = true;
  api.post("/api/file/uploadImages", formData).then((res: any) => {
    console.log(res);
    form.value.detailsImgAndPageUrl = res.body;
    fullscreenLoading.value = false;
  });
};


// 使用文件管理组件

const types:any = ref('')

import dialogWindows from '@/components/FileManagement/dialogWindows.vue'
const dialogPluginList:any = ref({
  dialogVisible:false,
  title:'文件管理',
  data:'',
  button_title:'确定',
  width:'1100',
  heigth:'500',
  close_title:"取消"

})

const upload_image = (item:any)=>{
  dialogPluginList.value.dialogVisible = true
  types.value = item
}

const Return = (data:any)=>{
  dialogPluginList.value.dialogVisible = false
  if(data.type == 'return'){
    if(types.value == 'imageUrl'){
      imageUrl.value = data.data[0].url
      form.value.activityImgUrl = data.data[0].url
    }

  }

}



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

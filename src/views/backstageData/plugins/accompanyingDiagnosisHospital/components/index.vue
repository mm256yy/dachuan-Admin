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
    <div class="content" style="padding: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="110px"
      >
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="基本信息" name="first">
            <el-scrollbar height="64vh">
              <el-form-item label="医院名称" prop="hospitalName">
                <el-input
                  v-model="form.hospitalName"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>

              <el-form-item label="医院简介" prop="hospitalIntroduction">
                <el-input
                  v-model="form.hospitalIntroduction"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="医院图片" prop="hospitalImages"
                ><el-upload
                  class="avatar-uploader"
                  :action="baseURL"
                  :headers="header"
                  :on-remove="handleRemove"
                  name="file"
                  :data="{ type: 1 }"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item label="医院标签" prop="hospitalLableJson">
                <el-tag
                  v-for="(tag, index) in hospitalLableJson"
                  :key="index"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="inputValue"
                  class="ml-1 w-20"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
                  placeholder="请输入标签名称"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput"
                >
                  添加医院标签
                </el-button>
              </el-form-item>

              <el-form-item label="地区" prop="pca">
                <pcas-cascader v-model="pcasName" format="name" />
              </el-form-item>
              <el-form-item label="详细地址" prop="">
                <el-input
                  v-model="addressJson.address"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="城市编码" prop="cityCode">
                <el-input
                  v-model="form.cityCode"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="经度" prop="latitude">
                <el-input
                  v-model="form.latitude"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
              <el-form-item label="维度" prop="longitude">
                <el-input
                  v-model="form.longitude"
                  placeholder="请输入"
                  clearable
                />
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
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="医院服务" name="second">
            <el-scrollbar height="64vh">
              <!-- <el-form-item label="医院服务" prop="serverListJson"> -->
              <el-button @click="addServer" type="primary" plain
                >添加服务</el-button
              >

              <div v-for="(item, index) in serverListJson" class="box">
                <div class="box-con">
                  <div style="font-weight: 600; margin-right: 25px">
                    医院服务{{ index + 1 }}
                  </div>
                  <el-button
                    @click="delServer(index)"
                    type="danger"
                    size="small"
                    plain
                    >删除此服务</el-button
                  >
                </div>
                <div class="box-con">
                  <span>服务名称：</span>

                  <el-input
                    v-model="item.serviceName"
                    placeholder="请输入"
                    clearable
                  />
                </div>
                <div class="box-con">
                  <span>服务图片</span>
                  <img
                    @dblclick="delServiceImage(index)"
                    v-if="item.serviceImage"
                    :src="item.serviceImage"
                    class="avatar"
                    style="margin-left: -10px"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index)"
                    style="margin-left: -10px"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>注意事项</span>
                  <el-input
                    v-model="item.note"
                    placeholder="请输入"
                    clearable
                  />
                </div>
                <div class="box-con">
                  <span>服务价格</span>
                  <el-input
                    v-model="item.money"
                    placeholder="请输入"
                    clearable
                  />
                </div>
                <div class="box-con">
                  <span>服务介绍</span>
                  <el-input
                    v-model="item.serviceIntroduction"
                    placeholder="请输入"
                    clearable
                  />
                </div>
              </div>
              <!-- </el-form-item> -->
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="医院科室" name="third">
            <el-scrollbar height="64vh">
              <!-- <el-form-item label="医院科室" prop="departmentJson"> -->
              <!-- <el-input
                  v-model="form.departmentJson"
                  placeholder="请输入"
                  clearable
                /> -->
              <el-button @click="addDepartment" type="primary" plain
                >添加科室</el-button
              >

              <div v-for="(item, index) in departmentJson" class="box">
                <div class="box-con">
                  <div style="font-weight: 600; margin-right: 25px">
                    医院科室{{ index + 1 }}
                  </div>
                  <el-button
                    @click="delDepartment(index)"
                    type="danger"
                    size="small"
                    plain
                    >删除此科室</el-button
                  >
                </div>
                <div class="box-con">
                  <span>科室名称：</span>

                  <el-input
                    v-model="item.departmentName"
                    placeholder="请输入"
                    clearable
                  />
                </div>

                <div class="box-con">
                  <span>科室下级</span>
                  <el-tag
                    v-for="(tag, index1) in item.child"
                    :key="index1"
                    class="mx-1"
                    closable
                    :disable-transitions="false"
                    @close="handleClose1(tag, index)"
                    style="margin-left: -10px"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="item.show"
                    ref="InputRef1"
                    v-model="inputValue1"
                    class="ml-1 w-20"
                    @keyup.enter="handleInputConfirm1(index)"
                    @blur="handleInputConfirm1(index)"
                    placeholder="请输入标签名称"
                  />
                  <el-button
                    v-else
                    class="button-new-tag ml-1"
                    size="small"
                    @click="showInput1(index)"
                    style="margin-left: -10px"
                  >
                    添加下级标签
                  </el-button>
                </div>
              </div>
              <!-- </el-form-item> -->
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
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
import { UploadProps, ElMessage, ElInput } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
import Json from "@/components/json/json.vue";
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

const activeName = ref("first");
const title = computed(() => (props.id === "" ? "新增" : "修改"));
const pcasName: any = ref([]);
const form: any = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),
  businessId: "0",
  addressJson: {
    address: "无名路海智中心3号楼901",
    province: "浙江省",
    city: "杭州市",
    district: "余杭区",
    latitude: 0,
    longitude: 0,
  },
  cityCode: 0,
  departmentJson: [],
  hospitalImages: "",
  hospitalIntroduction: "",
  hospitalLableJson: [],
  hospitalName: "",
  latitude: 0,
  longitude: 0,
  serverListJson: [
    // {
    //   serviceIntroduction: "陪诊就医 专业保障 省时省心",
    //   note: "注意事项",
    //   money: 50,
    //   serviceImage: "",
    //   serviceName: "一对一专业陪诊(半天服务)",
    // },
  ],
});

const hospitalLableJson: any = ref([]);
const departmentJson: any = ref([]);
const serverListJson: any = ref([]);
const addressJson: any = ref({
  address: "无名路海智中心3号楼901",
  province: "浙江省",
  city: "杭州市",
  district: "余杭区",
  latitude: 0,
  longitude: 0,
});
const formRef = ref();
const formRules = ref({
  hospitalName: [{ required: true, message: "请输入" }],
  businessId: [{ required: true, message: "请输入", trigger: "change" }],

  hospitalIntroduction: [{ required: true, message: "请输入" }],
  cityCode: [{ required: true, message: "请输入" }],

  // value: [{ required: true, message: "请输入字典项键值" }],
});

const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const handleClose = (tag: string) => {
  hospitalLableJson.value.splice(hospitalLableJson.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    hospitalLableJson.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

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
      .get("/api/plugs/searchPlugsHospitalInfoById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        if (res.code == 200) {
          form.value = res.body;
          imageUrl.value = res.body.activityImgUrl;
          form.value.businessId = JSONBIG.stringify(form.value.businessId);
          hospitalLableJson.value = JSON.parse(form.value.hospitalLableJson);

          serverListJson.value = JSON.parse(form.value.serverListJson);
          departmentJson.value = JSON.parse(form.value.departmentJson);
          addressJson.value = JSON.parse(form.value.addressJson);

          pcasName.value[0] = addressJson.value.province;
          pcasName.value[1] = addressJson.value.city;
          pcasName.value[2] = addressJson.value.district;
          imageUrl.value = form.value.hospitalImages;
        }
      });
  }
});

function onSubmit() {
  if (JSON.stringify(pcasName.value) == "[]") {
    ElMessage.error({
      message: "地区不能为空",
      center: true,
    });
    return;
  }

  addressJson.value.province = pcasName.value[0];
  addressJson.value.city = pcasName.value[1];
  addressJson.value.district = pcasName.value[2];
  form.value.addressJson = JSON.stringify(addressJson.value);
  form.value.hospitalLableJson = JSON.stringify(hospitalLableJson.value);
  form.value.serverListJson = JSON.stringify(serverListJson.value);
  form.value.departmentJson = JSON.stringify(departmentJson.value);
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsHospitalInfo", form.value)
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
            .post("/api/plugs/updatePlugsHospitalInfo", form.value)
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

const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  form.value.hospitalImages = response.body;
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {};
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {};
// 添加医院服务
const addServer = () => {
  let obj = {
    serviceIntroduction: "陪诊就医 专业保障 省时省心",
    note: "注意事项",
    money: 50,
    serviceImage: "",
    serviceName: "一对一专业陪诊(半天服务)",
  };
  serverListJson.value.push(obj);
};
// 删除医院服务
const delServer = (index: any) => {
  serverListJson.value.splice(index, 1);
};
// 添加服务图片
const inx: any = ref(0);
const upload = (index: any) => {
  // form.value.serverListJson.splice(index, 1);
};

const change = (e: any) => {
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("type", "1");
  api.post("/api/file/uploadImages", formData).then((res: any) => {
    serverListJson.value[inx.value].serviceImage = res.body;
  });
};
const delServiceImage = (index: any) => {
  serverListJson.value[index].serviceImage = "";
};

// 添加科室服务
const addDepartment = () => {
  let obj1 = {
    departmentName: "陪诊就医 专业保障 省时省心",
    child: [],
    show: false,
  };
  departmentJson.value.push(obj1);
};
// 删除科室服务
const delDepartment = (index: any) => {
  departmentJson.value.splice(index, 1);
};
const inputValue1 = ref("");
const inputVisible1 = ref(false);
const InputRef1 = ref<InstanceType<typeof ElInput>>();

const handleClose1 = (tag: any, index: any) => {
  departmentJson.value[index].child.splice(tag, 1);
};

const showInput1 = (index: any) => {
  departmentJson.value[index].show = true;
  nextTick(() => {
    InputRef1.value!.input!.focus();
  });
};

const handleInputConfirm1 = (index: any) => {
  if (inputValue1.value) {
    departmentJson.value[index].child.push(inputValue1.value);
  }
  departmentJson.value[index].show = false;
  inputValue1.value = "";
};
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
.box {
  width: 100%;
  margin: 10px 0;
  .box-con {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      text-align: center;
      border: 1px dashed var(--el-border-color);
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
    img {
      width: 60px;
      height: 60px;
    }
    span {
      width: 100px;
    }
  }
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
  border: 1px dashed var(--el-border-color);
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

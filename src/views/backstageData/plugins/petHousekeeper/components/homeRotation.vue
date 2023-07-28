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
        label-width="110px"
      >
        <div>
          <el-form-item label="宠物名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="品种" prop="type">
            <el-input v-model="form.breed" placeholder="请输入" clearable />
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

          <el-form-item label="宠物图片" prop="activityImgUrl">
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
            >
              <Plus />
            </el-icon>
            <!-- </el-upload> -->
          </el-form-item>
          <el-form-item label="宠物性别" prop="detailsId">
            <!-- <el-input  placeholder="请输入" clearable /> -->
            <div>
              <el-radio-group v-model="form.sex" @change="changeItem()">
                <el-radio :label="0" size="large">雌性</el-radio>
                <el-radio :label="1" size="large">雄性</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="疫苗" prop="detailsId">
            <!-- <el-input  placeholder="请输入" clearable /> -->
            <div>
              <el-radio-group
                v-model="form.vaccineStatus"
                @change="changeItem()"
              >
                <el-radio :label="0" size="large">已打疫苗</el-radio>
                <el-radio :label="1" size="large">未打疫苗</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="绝育" prop="detailsId">
            <!-- <el-input  placeholder="请输入" clearable /> -->
            <div>
              <el-radio-group
                v-model="form.neuterStatus"
                @change="changeItem()"
              >
                <el-radio :label="0" size="large">已绝育</el-radio>
                <el-radio :label="1" size="large">未绝育</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="体重" prop="type">
            <el-input
              v-model="form.weightExtJson"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="生日" prop="type">
            <el-date-picker
              @change="changed()"
              v-model="form.birthDay"
              type="datetime"
              placeholder="请输入"
            />
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
  <div>
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

const form = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  headImgUrl: "",
  name: "",
  sex: 0,
  plugsId: Number(props.plugsId),
  showHide: "",
  title: "",
  type: "",
  businessId: "0",
  accountBookExtJson: "",
  anthelminticExtJson: "",
  anthelminticStatus: 0,
  birthDay: "",
  breed: "",
  bussinessId: 0,
  categoryId: 0,
  growthRecordExtJson: "",
  neuterStatus: "",
  userId: 0,
  vaccineExtJson: "",
  vaccineStatus: 0,
  weightExtJson: "",
});
const formRef = ref();
const formRules = ref({
  title: [
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
      .get("/api/plugs/searchPlugsPetRarchivesById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        imageUrl.value = res.body.headImgUrl;
        form.value.businessId = JSONBIG.stringify(form.value.businessId);
      });
  }
});
function changeItem() {}
function changed() {}
function onSubmit() {
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsPetRarchives", form.value)
            .then((res: any) => {
              ElMessage.success({
                message: "新增成功",
                center: true,
              });
              onCancel();
            });
        }
      });
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsPetRarchives", form.value)
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

// 使用文件管理组件
const types: any = ref("");

import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (types.value == "imageUrl") {
    imageUrl.value = data[0];
    form.value.headImgUrl = data[0];
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

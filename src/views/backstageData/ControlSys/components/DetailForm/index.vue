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
        label-width="100px"
      >
        <el-form-item label="第三方关联账号" prop="">
          <el-input
            v-model="form.associatedAccounJson"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="生日" prop="">
          <el-input v-model="form.birth" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="小程序JSON配置信息" prop="">
          <el-input v-model="form.configJson" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="设备信息" prop="">
          <el-input v-model="form.deviceJson" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户头像" prop="headImg">
          <el-upload
            class="avatar-uploader"
            :action="baseURL"
            :headers="header"
            name="file"
            :data="{ type: 1 }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证号" prop="">
          <el-input v-model="form.idCar" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户注册IP" prop="">
          <el-input v-model="form.ipAddress" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="最后一次登录时间" prop="">
          <el-input
            v-model="form.lastLoginTime"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="登录次数" prop="">
          <el-input v-model="form.loginCount" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="">
          <el-input v-model="form.mobile" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="当前登录时间" prop="">
          <el-input
            v-model="form.nowLoginTime"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="">
          <el-input v-model="form.password" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="密码" prop=""> </el-form-item> -->
        <h2>插件信息</h2>
        <div v-for="(item, index) in plugJson" style="margin-left: 60px">
          <div style="margin: 5px">
            插件名字:<span style="margin-left: 10px"
              >{{ item.plugsName }}
            </span>

            <span
              style="
                background-color: red;
                width: 30px;
                height: 20px;
                padding: 3px 10px;
                color: aliceblue;
                border-radius: 5px;
                margin-left: 50px;
              "
              @click="delplugsName(index)"
              >删除
            </span>
          </div>
        </div>

        <el-form-item label="真实姓名" prop="">
          <el-input v-model="form.realname" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input v-model="form.remark" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户CODE渠道标识" prop="">
          <el-input v-model="form.userCode" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="">
          <el-input v-model="form.userEmail" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户等级" prop="">
          <el-input v-model="form.userLevel" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户名	" prop="">
          <el-input v-model="form.userName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户等级" prop="">
          <el-input v-model="form.userPayJson" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="支付信息JSON 格式" prop="">
          <el-input v-model="form.userPayJson" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="用户服务标识" prop="">
          <el-input
            v-model="form.userServiceToken"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户状态(0正常,1锁定)" prop="plugsDescribe">
          <el-switch
            v-model="form.userState"
            inline-prompt
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="锁定"
          />
        </el-form-item>

        <el-form-item label="插件图标" prop="icon"> </el-form-item>

        <el-form-item label="状态" prop="plugsStatus"> </el-form-item>
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
import { UploadProps, ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
import storage from "@/utils/storage";

const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
  }>(),
  {
    modelValue: false,
    id: "",
  }
);
const myVisible = ref(props.modelValue);

const title = computed(() => (props.id === "" ? "新增管理员" : "修改管理员"));
const form: any = ref({
  id: props.id,
  associatedAccounJson: "",
  birth: "",
  configJson: "",
  deviceJson: "",
  gender: 0,
  headImg: "",
  idCar: "",
  ipAddress: "",
  lastLoginTime: "",
  loginCount: 0,
  mobile: "",
  nowLoginTime: "",
  password: "",
  plugJson: "",
  realname: "",
  remark: "",
  userCode: "",
  userEmail: "",
  userLevel: 0,
  userName: "",
  userPayJson: "",
  userServiceToken: "",
  userState: 0,
});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugJson: any = ref([]);
onMounted(() => {
  if (props.id !== "") {
    api
      .get("/api/admin/searchAdminUserById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        plugJson.value = JSON.parse(form.value.plugJson);

        imageUrl.value = form.value.headImg;
        // form.value.title = res.body.title;
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

const delplugsName = (index: any) => {
  plugJson.value.splice(index, 1);
};
function onSubmit() {
  form.value.plugJson = JSON.stringify(plugJson.value);

  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsInfo", form.value)
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
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/admin/updateAdminUser", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                // storage.local.set("plugJson", form.value.plugJson);
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
  Authorization: userStore.token,
});
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  form.value.headImg = response.body;
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

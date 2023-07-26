<template>
  <div
    class="content"
    style="
      background-color: #fff;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-position="top"
      label-width="100px"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-scrollbar height="64vh">
            <el-form-item label="用户名	" prop="">
              <el-input
                style="width: 480px"
                v-model="form.userName"
                placeholder="用户名"
                clearable
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="用户头像" prop="headImg">
              <div @click="upload_file('touxiang')">
                <img
                  v-if="imageUrl"
                  style="
                    height: 80px;
                    width: 80px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                  "
                  :src="imageUrl"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </div>

              <!-- </el-upload> -->
            </el-form-item>
            <el-form-item label="用户邮箱" prop="userEmail">
              <el-input
                style="width: 360px"
                v-model="form.userEmail"
                placeholder="用户邮箱"
                clearable
              />
            </el-form-item>
            <el-form-item label="真实姓名" prop="realname">
              <el-input
                style="width: 360px"
                v-model="form.realname"
                placeholder="真实姓名"
                clearable
              />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="身份证号" prop="idCar">
              <el-input
                style="width: 360px"
                v-model="form.idCar"
                placeholder="身份证号"
                class="input-with-select"
              >
                <template #prepend> 中国居民 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input
                style="width: 360px"
                v-model="form.mobile"
                placeholder="手机号"
                class="input-with-select"
              >
                <template #prepend> 号码 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" v-if="form.id != 31">
              <el-input
                style="width: 360px"
                v-model="form.password"
                placeholder="密码"
                class="input-with-select"
              >
                <template #prepend> 密码 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="生日" prop="birth">
              <div>
                <el-input
                  style="width: 150px"
                  v-model="births.year"
                  placeholder="年份"
                  class="input-with-select"
                >
                  <template #append> 年 </template>
                </el-input>

                <el-input
                  style="width: 150px"
                  v-model="births.moth"
                  placeholder="月份"
                  class="input-with-select"
                >
                  <template #append> 月 </template>
                </el-input>

                <el-input
                  style="width: 150px"
                  v-model="births.day"
                  placeholder="日份"
                  class="input-with-select"
                >
                  <template #append> 日 </template>
                </el-input>
              </div>

              <!-- <el-input v-model="form.birth" placeholder="请输入" clearable /> -->
            </el-form-item>
            <el-form-item label="第三方关联账号" prop="">
              <el-input
                style="width: 360px"
                v-model="form.associatedAccounJson"
                placeholder="第三方关联账号"
                class="input-with-select"
              >
                <template #prepend> 第三方账号 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                style="width: 400px"
                v-model="form.remark"
                :rows="2"
                maxlength="150"
                show-word-limit
                type="textarea"
                placeholder="备注"
              />
            </el-form-item>
            <el-form-item label="用户等级" prop="">
              <el-input
                style="width: 360px"
                v-model="form.userLevel"
                placeholder="用户等级"
                class="input-with-select"
              >
                <template #prepend> 等级 </template>
              </el-input>
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
            <el-form-item label="用户CODE渠道标识" prop="">
              <el-input
                style="width: 360px"
                v-model="form.userCode"
                placeholder="用户CODE渠道标识"
                class="input-with-select"
              >
                <template #prepend> 用户CODE渠道标识 </template>
              </el-input>
            </el-form-item>

            <el-form-item label="设备信息" prop="">
              <el-input
                style="width: 400px"
                v-model="form.deviceJson"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="设备信息"
              />
            </el-form-item>

            <el-form-item label="用户注册IP" prop="">
              <el-input
                style="width: 360px"
                v-model="form.ipAddress"
                placeholder="用户注册IP"
                class="input-with-select"
              >
                <template #prepend> IP </template>
              </el-input>
            </el-form-item>

            <el-form-item label="登录次数" prop="">
              <el-input
                style="width: 360px"
                v-model="form.loginCount"
                placeholder="登录次数"
                class="input-with-select"
              >
                <template #append> 次 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="支付信息JSON 格式" prop="">
              <el-input
                style="width: 400px"
                v-model="form.userPayJson"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="支付信息JSON 格式"
              />
            </el-form-item>
            <el-form-item label="用户服务标识" prop="">
              <el-input
                style="width: 360px"
                v-model="form.userServiceToken"
                placeholder="用户服务标识"
                class="input-with-select"
              >
                <template #prepend> 标识 </template>
              </el-input>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="店铺配置" name="second">
          <el-scrollbar height="64vh">
            <el-form-item label="店铺名称" prop="smallRoutine">
              <el-input
                style="width: 360px"
                v-model="configJson.smallRoutine"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 店铺名称 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="店铺Logo" prop="shopLogo">
              <div @click="upload_file('dianpu')">
                <img
                  v-if="imageUrl1"
                  style="
                    height: 80px;
                    width: 80px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                  "
                  :src="imageUrl1"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </div>
            </el-form-item>
            <el-form-item label="店铺电话" prop="shopMobile">
              <el-input
                style="width: 360px"
                v-model="configJson.shopMobile"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 店铺电话 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="分享标题" prop="shareTitle">
              <el-input
                style="width: 400px"
                v-model="configJson.shareTitle"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="分享图片" prop="shareImages">
              <div @click="upload_file('share')">
                <img
                  v-if="imageUrl2"
                  style="
                    height: 80px;
                    width: 80px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                  "
                  :src="imageUrl2"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </div>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="微信配置" name="third">
          <el-scrollbar height="64vh">
            <el-form-item label="通知地址" prop="notice_url">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.notice_url"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="小程序appID" prop="x_appid">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.x_appid"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> Appid </template>
              </el-input>
            </el-form-item>
            <el-form-item label="小程序密钥" prop="x_secret">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.x_secret"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> Secret </template>
              </el-input>
            </el-form-item>
            <el-form-item label="微信商户号" prop="mchid">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.mchid"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 商户号 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="微信支付密钥" prop="pay_key">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.pay_key"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 微信支付密钥 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="微信支付证书(cert)" prop="pay_cert">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.pay_cert"
                :rows="2"
                maxlength="500"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="微信支付证书(key)" prop="pay_cert_key">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.pay_cert_key"
                :rows="2"
                maxlength="500"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="公众号appID" prop="g_appid">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.g_appid"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 公众号Appid </template>
              </el-input>
            </el-form-item>
            <el-form-item label="公众号密钥" prop="g_secret">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.g_secret"
                placeholder="请输入"
                class="input-with-select"
              >
                <template #prepend> 公众号Secret </template>
              </el-input>
            </el-form-item>
            <el-form-item label="公众号Token" prop="g_token">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.g_token"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="公众号EncodingAESKey" prop="g_encodingAESKey">
              <el-input
                style="width: 400px"
                v-model="configJson.weiXinConfig.g_encodingAESKey"
                :rows="2"
                maxlength="300"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="七牛云存储配置" name="fourth">
          <el-scrollbar height="64vh">
            <el-form-item label="AccessKey" prop="accessKey">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.accessKey"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="SecretKey" prop="secretKey">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.secretKey"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="七牛云bucket" prop="bucket">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.bucket"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="七牛云zone" prop="zone">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.zone"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="七牛云domainOfBucket" prop="domainOfBucket">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.domainOfBucket"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="七牛云expireSeconds" prop="expireSeconds">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.expireSeconds"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="七牛云访问域名" prop="url">
              <el-input
                style="width: 400px"
                v-model="configJson.qiniuYunConfig.url"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="插件信息配置" name="fifth "
          ><el-scrollbar height="64vh">
            <div>
              <el-alert
                title="Tips：双击对应插件可进行删除"
                type="success"
                alert
              />
            </div>
            <div class="bigbox">
              <div
                class="box"
                v-for="(item, index) in pluginList"
                :key="item.id"
                @dblclick="delplugsName(index)"
                style="
                  position: relative;
                  box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
                "
              >
                <div class="box-left">
                  <img style="border-radius: 5px" :src="item.icon" alt="" />
                </div>
                <div class="box-right">
                  <div class="box-title">{{ item.title }}</div>
                  <div class="box-content">{{ item.plugsDescribe }}</div>
                </div>
              </div>

              <div
                class="box"
                @click="addchangeplug"
                style="
                  position: relative;
                  box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
                "
              >
                <div class="box-left" style="width: 60px; height: 60px">
                  <el-icon size="50">
                    <svg-icon name="i-ep:plus" />
                  </el-icon>
                  <!-- <img style="border-radius: 5px" alt="" /> -->
                </div>
                <div class="box-right" style="font-weight: bolder">
                  新增插件
                </div>
              </div>
            </div>
            <ChangePlug
              v-if="comp.modelValue"
              v-model="comp.modelValue"
              @success="update"
              @success1="update1"
            ></ChangePlug>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div style="display: flex; justify-content: center">
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </div>
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
import { UploadProps, ElMessage, ElMessageBox } from "element-plus";
import useUserStore from "@/store/modules/user";
import ChangePlug from "@/components/changePlug/index.vue";
import storage from "@/utils/storage";
const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();
const userStore = useUserStore();
const births = ref({
  year: "",
  moth: "",
  day: "",
});
const form: any = ref({
  id: route.params.id ?? "",
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
const activeName = ref("first");

const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
};
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
const plugJson: any = ref([]);
const configJson: any = ref({
  qiniuYunConfig: {},
  weiXinConfig: {},
});
const pluginList: any = ref([]);

watch(births.value, (newData: any, OldData: any) => {
  form.value.birth =
    (births.value.year || 2001) +
    "年" +
    (births.value.moth || 1) +
    "月" +
    (births.value.day || 1) +
    "日";
});

onMounted(() => {
  if (form.value.id !== "") {
    api
      .get("/api/admin/searchAdminUserById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        plugJson.value = JSON.parse(form.value.plugJson);
        configJson.value = JSON.parse(form.value.configJson);
        imageUrl1.value = configJson.value.shopLogo;
        imageUrl2.value = configJson.value.shareImages;

        // console.log(configJson.value, 998);
        imageUrl.value = form.value.headImg;

        let arr: any = [];
        console.log(plugJson.value, 999);

        if (plugJson.value) {
          plugJson.value.forEach((i: any) => {
            arr.push(i.plugsId);
          });
          let data = {
            ids: arr.join(),
          };
          api
            .get("/api/plugs/getPlugsInfoById", { params: data })
            .then((ress: any) => {
              if (ress.code == 200) {
                pluginList.value = ress.body;
              }
            });
        }
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
const comp = ref({
  modelValue: false,
});
const addchangeplug = () => {
  comp.value.modelValue = true;
};
const update = (item: any) => {
  let arr: any = [];
  console.log(item, 456);
  arr = [...item, ...pluginList.value];
  // console.log(arr, 999);

  let obj: any = {};

  let peon = arr.reduce((cur: any, next: any) => {
    obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
    return cur;
  }, []); //设置cur默认类型为数组，并且初始值为空的数组

  pluginList.value = peon;
  comp.value.modelValue = false;
};
const update1 = (item: any) => {
  comp.value.modelValue = false;
};
const delplugsName = (index: any) => {
  ElMessageBox.confirm("是否删除该插件?", "插件", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "success",
  }).then(() => {
    pluginList.value.splice(index, 1);
  });
};
function onSubmit() {
  pluginList.value.forEach((item: any) => {
    item.plugsId = item.id;
    item.plugsName = item.title;
  });
  form.value.plugJson = JSON.stringify(pluginList.value);
  form.value.configJson = JSON.stringify(configJson.value);

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
                console.log(res, 787);
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

function onCancel() {
  tabbar.close({ name: "addAdminlist" });
  router.push({
    name: "adminList",
  });
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
const imageUrl1 = ref("");
const handleAvatarSuccess1: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl1.value = URL.createObjectURL(uploadFile.raw!);
  configJson.value.shopLogo = response.body;
};
const imageUrl2 = ref("");
const handleAvatarSuccess2: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl2.value = URL.createObjectURL(uploadFile.raw!);
  configJson.value.shareImages = response.body;
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

const types: any = ref("");
// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_file = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
  types.value = item;
};

const Return = (data: any) => {
  console.log(data, 666);
  console.log(types.value, 666);

  dialogPluginList.value.dialogVisible = false;
  if (types.value == "touxiang") {
    imageUrl.value = data[0];
    form.value.headImg = data[0];
  } else if (types.value == "dianpu") {
    imageUrl1.value = data[0];
    console.log(form.value.configJson);
    configJson.value.shopLogo = data[0];
  } else if (types.value == "share") {
    imageUrl2.value = data[0];
    configJson.value.shareImages = data[0];
  }
};
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
.bigbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  //
  .box {
    width: 300px;
    padding: 10px;
    margin: 10px 5px;
    background-color: rgb(45 140 240 / 6%);
    overflow: hidden;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 10px;
    display: flex;
    max-width: 280px;

    // align-items: center;

    .box-left {
      margin-right: 5px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    .box-right {
      .box-title {
        color: #1c1d23;
        font-weight: 700;
        font-size: 14px;
      }

      .box-content {
        color: #999;
        padding-top: 2px;
        font-size: 13px;
      }
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
}
</style>

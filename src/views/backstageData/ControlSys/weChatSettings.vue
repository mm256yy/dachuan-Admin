<route lang="yaml">
name: personalSetting
meta:
  title: 个人设置
  cache: personal-edit.password
</route>

<script lang="ts" setup name="PersonalSetting">
import api from "@/api/plugin";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();

const wx_form = ref({
  upload_file: {
    file: [],
    type: 5,
  },
  familyMember: [
    {
      isEdit: false,
      name: "通知地址",
      mobile: "",
      relationship: "<div>通知地址</div><div>第三方开放平台的通知地址</div>",
      label: "notice_url",
    },
    {
      isEdit: false,
      name: "小程序appID",
      mobile: "",
      relationship:
        '<span>如果要开启微信小程序则必须设置,获取appid <br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a>  > 开发 > 开发设置</span>',
      label: "x_appid",
    },
    {
      isEdit: false,
      name: "小程序密钥",
      mobile: "",
      relationship:
        '<span>如果要开启微信小程序则必须设置,获取密钥<br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a> > 开发 > 开发设置</span>',
      label: "x_secret",
    },
    {
      isEdit: false,
      name: "微信商户号",
      mobile: "",

      relationship:
        '<span>如果要进行支付则必须设置，获取商户号<br/>请登陆 <a href="https://pay.weixin.qq.com/index.php/core/home/login" style="color: #57A3F3;text-decoration: none;">微信商户平台</a> > 账户中心 > 账户信息</span>',
      label: "mchid",
    },
    {
      isEdit: false,
      name: "微信支付密钥",
      mobile: "",
      relationship:
        '<span>如果要进行支付则必须设置，获取密钥<br/>请登陆 <a href="https://pay.weixin.qq.com/index.php/core/home/login" style="color: #57A3F3;text-decoration: none;">微信商户平台</a> > 账户中心 > API安全 > API密钥</span>',
      label: "pay_key",
    },
    {
      isEdit: false,
      name: "微信支付证书(cert)",
      mobile: "",
      relationship:
        '<span>如果要在平台进行退款操作则必须设置，获取证书cert<br/>请登陆 <a href="https://pay.weixin.qq.com/index.php/core/home/login" style="color: #57A3F3;text-decoration: none;">微信商户平台</a> > 账户中心 > API安全 > API密钥（上传apiclient_cert.pem证书文件）</span>',
      label: "pay_cert",
    },
    {
      isEdit: false,
      name: "微信支付证书(key)",
      mobile: "",
      relationship:
        '如果要在平台进行退款操作则必须设置，获取证书key<br/>请登陆 <a href="https://pay.weixin.qq.com/index.php/core/home/login" style="color: #57A3F3;text-decoration: none;">微信商户平台</a> > 账户中心 > API安全 > API密钥（上传apiclient_key.pem证书文件）',
      label: "pay_cert_key",
    },
    {
      isEdit: false,
      name: "公众号appID",
      mobile: "",
      relationship:
        '如果要开启微信网页授权或接口使用则必须设置，获取公众号appid<br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a> > 开发 > 基本配置',
      label: "g_appid",
    },
    {
      isEdit: false,
      name: "公众号密钥",
      mobile: "",
      relationship:
        '如果要开启微信网页授权或接口使用则必须设置，获取公众号密钥<br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a> > 开发 > 基本配置',
      label: "g_secret",
    },
    {
      isEdit: false,
      name: "公众号Token",
      mobile: "",
      relationship:
        '如果要解密或发送用户信息则必须设置，获取ID<br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a> > 开发 > 基本配置 > 服务器配置',
      label: "g_token",
    },
    {
      isEdit: false,
      name: "公众号EncodingAESKey",
      mobile: "",
      relationship:
        '如果要解密或发送用户信息则必须设置，获取ID<br/>请登陆 <a href="https://mp.weixin.qq.com/" style="color: #57A3F3;text-decoration: none;">微信公众平台</a> > 开发 > 基本配置 > 服务器配置',
      label: "g_encodingAESKey",
    },
  ],
  dianpu: [
    {
      name: "店铺名称",
      data: "",
      label: "smallRoutine",
      relationship:
        "设置店铺对外展示的名称，该名称建议尽量简短，不宜设置太长（最好控制在10个字以内）",
      isEdit: false,
    },
    {
      name: "店铺Logo",
      data: "",
      label: "shopLogo",
      relationship: "设置店铺Logo图标，图标尺寸建议 200*200像素",
      isEdit: false,
    },
    {
      name: "店铺电话",
      data: "",
      label: "shopMobile",
      relationship: "用于联系店铺的电话，部分模版肯能需要设置",
      isEdit: false,
    },
    {
      name: "分享标题",
      data: "",
      label: "shareTitle",
      relationship: "小程序分享时自定义的分享标题，建议不超过20个字",
      isEdit: false,
    },
    {
      name: "分享图片",
      data: "",
      label: "shareImages",
      relationship: "小程序分享时自定义的分享图标，建议尺寸：500*400px",
      isEdit: false,
    },
  ],
  cunchu_selct: [
    {
      value: 1,
      name: "七牛云",
    },
    {
      value: 2,
      name: "阿里云",
    },
  ],
  cunchu_show: "1",
  // https://sso.qiniu.com/?client_id=PIapUKqa3u6S24H868BelwrG0OFu8dS7AxVQ8oz8HznLXhgrl2BnjaO9cs9LzxK2&redirect_url=https:%2F%2Fportal.qiniu.com%2Fapi%2Fgaea%2Fsso%2Fsignin%3Fredirect%3D%252Fhome
  cunchu: [
    {
      name: "AccessKey",
      data: "",
      label: "accessKey",
      relationship:
        '如果要存储在七牛则必须设置，AccessKey获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 个人中心 > 密钥管理',
      isEdit: false,
    },
    {
      name: "SecretKey",
      data: "",
      label: "secretKey",
      relationship:
        '如果要存储在七牛则必须设置，SecretKey获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 个人中心 > 密钥管理',
      isEdit: false,
    },
    {
      name: "七牛云bucket",
      data: "",
      label: "bucket",
      relationship:
        '如果要存储在七牛则必须设置，空间名称获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 对象存储 > 存储空间列表',
      isEdit: false,
    },
    {
      name: "七牛云zone",
      data: "",
      label: "zone",
      relationship:
        '如果要存储在七牛则必须设置，空间域名获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 对象存储 > 融合CDN加速域名',
      isEdit: false,
    },
    {
      name: "七牛云domainOfBucket",
      data: "",
      label: "domainOfBucket",
      relationship:
        '如果要存储在七牛则必须设置，空间域名获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 对象存储 > 融合CDN加速域名',
      isEdit: false,
    },
    {
      name: "七牛云expireSeconds",
      data: "",
      label: "expireSeconds",
      relationship:
        '如果要存储在七牛则必须设置，空间域名获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 对象存储 > 融合CDN加速域名',
      isEdit: false,
    },
    {
      name: "七牛云访问域名",
      data: "",
      label: "url",
      relationship:
        '如果要存储在七牛则必须设置，空间域名获取请登陆 <a href="https://sso.qiniu.com/" style="color: #57A3F3;text-decoration: none;">七牛云后台</a> > 对象存储 > 融合CDN加速域名',
      isEdit: false,
    },
  ],
});
const info: any = ref("");
onMounted(() => {
  configJson();
});

function configJson() {
  let data: any = {
    id: localStorage.getItem("fa_adminId"),
  };

  api
    .get("/api/admin/searchAdminUserById", {
      params: data,
    })
    .then((res: any) => {
      info.value = res.body.configJson;
      console.log(JSON.parse(info.value));

      getMallSetting();
    });
}

function getMallSetting() {
  try {
    let config: any = JSON.parse(info.value);

    for (var a = 0; wx_form.value.familyMember.length > a; a++) {
      for (let key in config.weiXinConfig) {
        if (key == wx_form.value.familyMember[a].label) {
          if (config.weiXinConfig[key] == 0) {
          } else {
            wx_form.value.familyMember[a].mobile = config.weiXinConfig[key];
            break;
          }
        }
      }
    }

    wx_form.value.dianpu[0].data = config.smallRoutine;
    wx_form.value.dianpu[1].data = config.shopLogo;
    wx_form.value.dianpu[2].data = config.shopMobile;
    wx_form.value.dianpu[3].data = config.shareTitle;
    wx_form.value.dianpu[4].data = config.shareImages;
    // wx_form.value.dianpu[5].data  =

    for (var a = 0; wx_form.value.cunchu.length > a; a++) {
      for (let key in config.qiniuYunConfig) {
        if (key == wx_form.value.cunchu[a].label) {
          if (config.qiniuYunConfig[key] == "0") {
          } else {
            wx_form.value.cunchu[a].data = config.qiniuYunConfig[key];
            break;
          }
        }
      }
    }

    getUserList();
  } catch (error) {}
}

function Edit(item: any) {
  // let label = ''
  // let label:any = ''
  item.isEdit = true;

  if (item.name == "小程序appID") {
    item.label = "x_appid";
  } else if (item.name == "小程序密钥") {
    item.label = "x_secret";
  } else if (item.name == "微信商户号") {
    item.label = "mchid";
  } else if (item.name == "微信支付密钥") {
    item.label = "pay_key";
  } else if (item.name == "微信支付证书(cert)") {
    item.label = "pay_cert";
  } else if (item.name == "微信支付证书(key)") {
    item.label = "pay_cert_key";
  } else if (item.name == "公众号appID") {
    item.label = "g_appid";
  } else if (item.name == "公众号密钥") {
    item.label = "g_secret";
  } else if (item.name == "公众号Token") {
    item.label = "g_token";
  } else if (item.name == "公众号EncodingAESKey") {
    item.label = "g_encodingAESKey";
  }
}

function Save(item: any) {
  // var a:any = {
  //   userServiceToken:storage.local.get('userServiceToken'),
  //   id:Number(storage.local.get('adminId')),
  //   configJson:`{
  //     "x_appid":${wx_form.value.familyMember[0].mobile|| 0},
  //     "x_secret":${wx_form.value.familyMember[1].mobile||0},
  //     "mchid":${wx_form.value.familyMember[2].mobile|| 0},
  //     "pay_key":${wx_form.value.familyMember[3].mobile|| 0},
  //     "pay_cert":${wx_form.value.familyMember[4].mobile|| 0},
  //     "pay_cert_key":${wx_form.value.familyMember[5].mobile|| 0},
  //     "g_appid":${wx_form.value.familyMember[6].mobile|| 0},
  //     "g_secret":${wx_form.value.familyMember[7].mobile|| 0},
  //     "g_token":${wx_form.value.familyMember[8].mobile|| 0},
  //     "g_encodingAESKey":${wx_form.value.familyMember[9].mobile|| 0}
  //   }`
  // }

  var b: any = {
    userServiceToken: storage.local.get("userServiceToken"),
    id: Number(storage.local.get("adminId")),
    configJson: `{
              "smallRoutine":"${wx_form.value.dianpu[0].data || 0}",
              "shareTitle":"${wx_form.value.dianpu[3].data || 0}",
              "weiXinConfig":{
                "notice_url":"${wx_form.value.familyMember[0].mobile || 0}",
                "x_appid":"${wx_form.value.familyMember[1].mobile || 0}",
                "x_secret":"${wx_form.value.familyMember[2].mobile || 0}",
                "mchid":"${wx_form.value.familyMember[3].mobile || 0}",
                "pay_key":"${wx_form.value.familyMember[4].mobile || 0}",
                "pay_cert":"${wx_form.value.familyMember[5].mobile || 0}",
                "pay_cert_key":"${wx_form.value.familyMember[6].mobile || 0}",
                "g_appid":"${wx_form.value.familyMember[7].mobile || 0}",
                "g_secret":"${wx_form.value.familyMember[8].mobile || 0}",
                "g_token":"${wx_form.value.familyMember[9].mobile || 0}",
                "g_encodingAESKey":"${
                  wx_form.value.familyMember[10].mobile || 0
                }"
              },
              "shopLogo":"${wx_form.value.dianpu[1].data || 0}",
              "shopMobile":"${wx_form.value.dianpu[2].data || 0}",
              "shareImages":"${wx_form.value.dianpu[4].data || 0}",
              "qiniuYunConfig":{
                "bucket":"${wx_form.value.cunchu[2].data || 0}",
                "secretKey":"${wx_form.value.cunchu[1].data || 0}",
                "accessKey":"${wx_form.value.cunchu[0].data || 0}",
                "zone":"${wx_form.value.cunchu[3].data || 0}",
                "domainOfBucket":"${wx_form.value.cunchu[4].data || 0}",
                "expireSeconds":"${wx_form.value.cunchu[5].data || 0}",
                "url":"${wx_form.value.cunchu[6].data || 0}"
              }
            }`,
  };

  // var a:any = {
  //   userServiceToken:storage.local.get('userServiceToken'),
  //   id:Number(storage.local.get('adminId')),
  //   configJson:`{
  //     ${item.label}:${item.mobile},

  //   } `
  // }
  api.post("/api/admin/updateAdminUser", b).then((res: any) => {
    if (res.code == 200) {
      item.isEdit = false;
      getUserList();
      configJson();
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  });
}

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {

  // imageUrl.value = URL.createObjectURL(uploadFile.raw!);

  // wx_form.value.familyMember[5].mobile = response.body;
  var b: any = {
    userServiceToken: storage.local.get("userServiceToken"),
    id: Number(storage.local.get("adminId")),
    configJson: `{
              "smallRoutine":"${wx_form.value.dianpu[0].data || 0}",
              "shareTitle":"${wx_form.value.dianpu[3].data || 0}",
              "weiXinConfig":{
                "x_appid":"${wx_form.value.familyMember[0].mobile || 0}",
                "x_secret":"${wx_form.value.familyMember[1].mobile || 0}",
                "mchid":"${wx_form.value.familyMember[2].mobile || 0}",
                "pay_key":"${wx_form.value.familyMember[3].mobile || 0}",
                "pay_cert":"${wx_form.value.familyMember[4].mobile || 0}",
                "pay_cert_key":"${response.body || 0}",
                "g_appid":"${wx_form.value.familyMember[6].mobile || 0}",
                "g_secret":"${wx_form.value.familyMember[7].mobile || 0}",
                "g_token":"${wx_form.value.familyMember[8].mobile || 0}",
                "g_encodingAESKey":"${
                  wx_form.value.familyMember[9].mobile || 0
                }"
              },
              "shopLogo":"${wx_form.value.dianpu[1].data || 0}",
              "shopMobile":"${wx_form.value.dianpu[2].data || 0}",
              "shareImages":"${wx_form.value.dianpu[4].data || 0}",
              "qiniuYunConfig":{
                "bucket":"${wx_form.value.cunchu[2].data || 0}",
                "secretKey":"${wx_form.value.cunchu[1].data || 0}",
                "accessKey":"${wx_form.value.cunchu[0].data || 0}",
                "zone":"${wx_form.value.cunchu[3].data || 0}",
                "domainOfBucket":"${wx_form.value.cunchu[4].data || 0}",
                "expireSeconds":"${wx_form.value.cunchu[5].data || 0}",
                "url":"${wx_form.value.cunchu[6].data || 0}"
              }
            }`,
  };

  api.post("/api/admin/updateAdminUser", b).then((res: any) => {
    if (res.code == 200) {
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  });
  getUserList();
};

const handleAvatarSuccess1: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  // wx_form.value.familyMember[4].mobile = response.body;
  var b: any = {
    userServiceToken: storage.local.get("userServiceToken"),
    id: Number(storage.local.get("adminId")),
    configJson: `{
              "smallRoutine":"${wx_form.value.dianpu[0].data || 0}",
              "shareTitle":"${wx_form.value.dianpu[3].data || 0}",
              "weiXinConfig":{
                "x_appid":"${wx_form.value.familyMember[0].mobile || 0}",
                "x_secret":"${wx_form.value.familyMember[1].mobile || 0}",
                "mchid":"${wx_form.value.familyMember[2].mobile || 0}",
                "pay_key":"${wx_form.value.familyMember[3].mobile || 0}",
                "pay_cert":"${response.body || 0}",
                "pay_cert_key":"${wx_form.value.familyMember[5].mobile || 0}",
                "g_appid":"${wx_form.value.familyMember[6].mobile || 0}",
                "g_secret":"${wx_form.value.familyMember[7].mobile || 0}",
                "g_token":"${wx_form.value.familyMember[8].mobile || 0}",
                "g_encodingAESKey":"${
                  wx_form.value.familyMember[9].mobile || 0
                }"
              },
              "shopLogo":"${wx_form.value.dianpu[1].data || 0}",
              "shopMobile":"${wx_form.value.dianpu[2].data || 0}",
              "shareImages":"${wx_form.value.dianpu[4].data || 0}",
              "qiniuYunConfig":{
                "bucket":"${wx_form.value.cunchu[2].data || 0}",
                "secretKey":"${wx_form.value.cunchu[1].data || 0}",
                "accessKey":"${wx_form.value.cunchu[0].data || 0}",
                "zone":"${wx_form.value.cunchu[3].data || 0}",
                "domainOfBucket":"${wx_form.value.cunchu[4].data || 0}",
                "expireSeconds":"${wx_form.value.cunchu[5].data || 0}",
                "url":"${wx_form.value.cunchu[6].data || 0}"
              }
            }`,
  };

  api.post("/api/admin/updateAdminUser", b).then((res: any) => {
    if (res.code == 200) {
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  });
  getUserList();
};

const handleAvatarSuccess2: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  wx_form.value.dianpu[4].data = response.body;
  var b: any = {
    userServiceToken: storage.local.get("userServiceToken"),
    id: Number(storage.local.get("adminId")),
    configJson: `{
              "smallRoutine":"${wx_form.value.dianpu[0].data || 0}",
              "shareTitle":"${wx_form.value.dianpu[3].data || 0}",
              "weiXinConfig":{
                "x_appid":"${wx_form.value.familyMember[0].mobile || 0}",
                "x_secret":"${wx_form.value.familyMember[1].mobile || 0}",
                "mchid":"${wx_form.value.familyMember[2].mobile || 0}",
                "pay_key":"${wx_form.value.familyMember[3].mobile || 0}",
                "pay_cert":"${wx_form.value.familyMember[4].mobile || 0}",
                "pay_cert_key":"${wx_form.value.familyMember[5].mobile || 0}",
                "g_appid":"${wx_form.value.familyMember[6].mobile || 0}",
                "g_secret":"${wx_form.value.familyMember[7].mobile || 0}",
                "g_token":"${wx_form.value.familyMember[8].mobile || 0}",
                "g_encodingAESKey":"${
                  wx_form.value.familyMember[9].mobile || 0
                }"
              },
              "shopLogo":"${wx_form.value.dianpu[1].data || 0}",
              "shopMobile":"${wx_form.value.dianpu[2].data || 0}",
              "shareImages":"${wx_form.value.dianpu[4].data || 0}",
              "qiniuYunConfig":{
                "bucket":"${wx_form.value.cunchu[2].data || 0}",
                "secretKey":"${wx_form.value.cunchu[1].data || 0}",
                "accessKey":"${wx_form.value.cunchu[0].data || 0}",
                "zone":"${wx_form.value.cunchu[3].data || 0}",
                "domainOfBucket":"${wx_form.value.cunchu[4].data || 0}",
                "expireSeconds":"${wx_form.value.cunchu[5].data || 0}",
                "url":"${wx_form.value.cunchu[6].data || 0}"
              }
            }`,
  };

  api.post("/api/admin/updateAdminUser", b).then((res: any) => {
    if (res.code == 200) {
      getUserList();
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  });
};
function getUserList() {
  const result = wx_form.value.dianpu[2].data;
  wx_form.value.dianpu[2].label = result.replace(
    /(\d{3})\d{4}(\d{4})/,
    "$1****$2"
  );
}

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {};

const handlePreview: UploadProps["onPreview"] = (file) => {};
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});

// 调用文件上传
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  title: "文件管理(默认上传到全部)",
  data: "",
  button_title: "确定",
  width: "1100",
  heigth: "80%",
  close_title: "取消",
});
const Files: any = ref();
const upload = (item: any) => {
  dialogPluginList.value.data = item;
  dialogPluginList.value.dialogVisible = !dialogPluginList.value.dialogVisible;
};

// 接收回调
function Return(data: any) {
  // Files.value = data

  dialogPluginList.value.dialogVisible = false;
  if (data.type == "quit") {
  } else {
    if (dialogPluginList.value.data.label == "pay_cert") {
      wx_form.value.familyMember[5].mobile = data.data[0].path;
    } else if (dialogPluginList.value.data.label == "pay_cert_key") {
      wx_form.value.familyMember[6].mobile = data.data[0].path;
    }

    Save(dialogPluginList.value.data);
  }
}
</script>

<template>
  <div>
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

    <page-main>
      <div class="setting-list">
        <page-main title="">
          <el-table :data="wx_form.familyMember" :style="{ width: '100%' }">
            <el-table-column label="基本信息" width="200">
              <template #default="scope">
                <!-- <el-input v-if="scope.row.isEdit" v-model="scope.row.name" size="small" />
                      <span v-else>{{ scope.row.name }}</span> -->
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前设置" width="300">
              <template #default="scope">
                <el-input
                  v-if="scope.row.isEdit"
                  v-model="scope.row.mobile"
                  size="small"
                  style="width: 250px"
                />
                <div v-else>
                  <span v-if="scope.row.mobile" style="color: green">
                    已设置
                  </span>
                  <span v-else style="color: red"> 未设置 </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="说明">
              <template #default="scope">
                <!-- <el-input v-if="scope.row.isEdit" v-model="scope.row.relationship" size="small" />
                      <span v-else>{{ scope.row.relationship }}</span> -->

                <span v-html="scope.row.relationship"></span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <template v-if="scope.row.isEdit">
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="Save(scope.row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    type="danger"
                    plain
                    size="small"
                    @click="scope.row.isEdit = false"
                  >
                    取消
                  </el-button>
                </template>
                <template v-else>
                  <!-- <el-button type="primary" plain size="small" @click="scope.row.isEdit = true">
                          编辑
                        </el-button> -->

                  <!-- <div
                    v-if="
                      scope.row.name == '微信支付证书(cert)' ||
                      scope.row.name == '微信支付证书(key)'
                    "
                  >
                    <el-button
                      v-if="scope.row.mobile"
                      @click="upload(scope.row)"
                      type="primary"
                      plain
                      size="small"
                    >
                      重新上传
                    </el-button>

                    <el-button
                      v-else
                      @click="upload(scope.row)"
                      type="primary"
                      plain
                      size="small"
                    >
                      上传
                    </el-button>
                  </div> -->

                  <el-upload
                     v-if="
                          scope.row.name == '微信支付证书(cert)'
                        "
                        class="upload-demo"
                        :action="baseURL"
                        name="file"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleAvatarSuccess1"
                        :data="{ type: 1 }"
                        :headers="header"

                      >
                        <el-button type="primary" plain size="small" v-if="wx_form.familyMember[5].mobile">
                          重新上传
                        </el-button>
                        <el-button type="primary" plain size="small" v-else>
                          上传
                        </el-button>
                        <template #tip>
                          <div class="el-upload__tip"></div>
                        </template>
                      </el-upload>

                      <el-upload
                     v-else-if="
                          scope.row.name == '微信支付证书(key)'
                        "
                        class="upload-demo"
                        :action="baseURL"
                        name="file"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleAvatarSuccess"
                        :data="{ type: 1 }"
                        :headers="header"
                        list-type="picture"
                      >
                      <el-button type="primary" plain size="small" v-if="wx_form.familyMember[6].mobile">
                          重新上传
                        </el-button>
                        <el-button type="primary" plain size="small" v-else>
                          上传
                        </el-button>
                        <template #tip>
                          <div class="el-upload__tip"></div>
                        </template>
                      </el-upload>

                  <el-button
                    v-else
                    type="primary"
                    plain
                    size="small"
                    @click="Edit(scope.row)"
                  >
                    修改
                  </el-button>
                </template>
              </template>
            </el-table-column>
            <!-- <div style="height:1200px"></div> -->
          </el-table>
        </page-main>
      </div>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs) {
  .el-tabs__header .el-tabs__nav {
    .el-tabs__active-bar {
      z-index: 0;
      width: 100%;
      background-color: var(--el-color-primary-light-9);
      border-right: 2px solid var(--el-color-primary);
      transition: transform 0.3s, background-color 0.3s,
        var(--el-transition-border);
    }

    .el-tabs__item {
      text-align: left;
      padding-right: 100px;
    }
  }

  .el-tab-pane {
    padding: 0 20px 0 30px;
  }
}

h2 {
  margin: 0;
  margin-bottom: 30px;
  font-weight: normal;
}

:deep(.el-upload-list) {
  display: none;
}
.basic {
  :deep(.headimg-upload) {
    text-align: center;

    .el-upload-dragger {
      border-radius: 50%;
    }
  }
}

.security {
  .setting-list {
    max-height: 740px;
    overflow-x: hidden;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
      transition: var(--el-transition-border);

      .content {
        .title {
          margin-bottom: 5px;
          color: var(--el-text-color-primary);
          transition: var(--el-transition-color);
        }

        .desc {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          transition: var(--el-transition-color);
        }
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>

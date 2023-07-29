<route lang="yaml">
meta:
  whiteList: true
  title: 登录
  constant: true
  layout: false
</route>

<script lang="ts" setup name="Login">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import useUserStore from "@/store/modules/user";
import storage from "@/utils/storage";
import api from "@/api";
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const { t } = useI18n();

const banner = new URL("../assets/images/login-banner.png", import.meta.url)
  .href;
const title = import.meta.env.VITE_APP_TITLE;

// 表单类型，login 登录，register 注册，reset 重置密码
const formType: any = ref("login");
const loading = ref(false);
const redirect = ref(route.query.redirect?.toString() ?? "/");

// 登录
const loginFormRef = ref<FormInstance>();
const loginForm = ref({
  userName: storage.local.get("login_account") || "",
  password: "",
  remember: storage.local.has("login_account"),
});
const loginRules = ref<FormRules>({
  userName: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { min: 6, max: 18, trigger: "blur", message: "密码长度为6到18位" },
  ],
});
function handleLogin() {
  loginFormRef.value &&
    loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        userStore
          .login(loginForm.value)
          .then(() => {
            loading.value = false;
            if (loginForm.value.remember) {
              storage.local.set("login_account", loginForm.value.userName);
            } else {
              storage.local.remove("login_account");
            }
            setTimeout(() => {
              router.push(redirect.value);
            }, 1000);
          })
          .catch(() => {
            loading.value = false;
          });
      }
    });
}

// 注册
const registerFormRef = ref<FormInstance>();
const registerForm = ref({
  mobile: "",
  verificationCode: "",
  password: "",
  checkPassword: "",
});
const registerRules = ref<FormRules>({
  mobile: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  verificationCode: [
    { required: true, trigger: "blur", message: "请输入验证码" },
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { min: 6, max: 18, trigger: "blur", message: "密码长度为6到18位" },
  ],
  checkPassword: [
    { required: true, trigger: "blur", message: "请再次输入密码" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
    },
  ],
});

function handleRegister() {
  registerFormRef.value &&
    registerFormRef.value.validate((valid) => {
      if (valid) {
        // 这里编写业务代码
        api
          .post("/api/admin/adminUserRegister", registerForm.value)
          .then((res: any) => {
            if (res.code !== 200) {
              ElMessage({
                message: res.msg,
                type: "warning",
              });

              return;
            } else {
              ElMessage({
                message: res.msg,
                type: "success",
              });
              registerForm.value = {
                mobile: "",
                verificationCode: "",
                password: "",
                checkPassword: "",
              };
            }
            formType.value = "login";
          });
      }
    });
}

// 重置密码
const resetFormRef = ref<FormInstance>();
const resetForm = ref({
  account: storage.local.get("login_account"),
  captcha: "",
  newPassword: "",
});
const resetRules = ref<FormRules>({
  account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  captcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
  newPassword: [
    { required: true, trigger: "blur", message: "请输入新密码" },
    { min: 6, max: 18, trigger: "blur", message: "密码长度为6到18位" },
  ],
});
function handleReset() {
  ElMessage({
    message: "重置密码仅提供界面演示，无实际功能，需开发者自行扩展",
    type: "info",
  });
  resetFormRef.value &&
    resetFormRef.value.validate((valid) => {
      if (valid) {
        // 这里编写业务代码
      }
    });
}

function testAccount(account: string) {
  loginForm.value.userName = account;
  loginForm.value.password = "123456";
  handleLogin();
}
const timeNum = ref(10);
// 发送验证码
async function sendMsg() {
  let timer: any;
  clearInterval(timer);
  const res: any = await api.get("/api/plugs/sendRegisterVerificationCode", {
    params: {
      mobile: registerForm.value.mobile,
    },
  });
  if (res.code == 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });

    timer = setInterval(() => {
      timeNum.value--;
      if (timeNum.value == 0) {
        timeNum.value = 10;
        clearInterval(timer);
      }
    }, 1000);
  } else {
    ElMessage({
      message: res.msg,
      type: "warning",
    });
  }
}
</script>

<template>
  <div>
    <div class="bg-banner" />
    <div class="headlogo">
      <img
        src="https://app.daccf.com/cdn/01/9ecb25038b2e790cb2f9f27bb4386f16.png"
        alt=""
      />
      <div class="title">
        大川长风
        <!-- <span style="font-size: 14px; margin-left: 8px; opacity: 0.6"
          >1.0.0</span
        > -->
      </div>
    </div>
    <div class="footer">
      <a class="aherf" href="https://beian.miit.gov.cn/">浙ICP备15000106号</a>
      <div class="title">© 2019-2022 杭州大川长风网络科技有限公司</div>
    </div>

    <div class="introText">
      <div>提供跨平台定制解决方案 让您不再因技术短板而止步</div>
    </div>
    <i18n-selector class="i18n-selector">
      <el-icon>
        <svg-icon name="i-ri:translate" />
      </el-icon>
    </i18n-selector>
    <div id="login-box">
      <!-- <div class="login-banner">
          <div class="logo" />
          <img :src="banner" class="banner" />
        </div> -->
      <el-form
        v-show="formType === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
      >
        <div class="title-container">
          <h3 class="title">登录您的管理账户</h3>
        </div>
        <div class="sub-link">
          <span class="text">还没有帐号?</span>
          <el-link
            type="primary"
            :underline="false"
            @click="formType = 'register'"
          >
            立即注册
          </el-link>
        </div>
        <div class="select">
          <div class="label active">账户密码登录</div>
          <div class="label">微信扫码登录</div>
        </div>
        <div>
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.userName"
              :placeholder="t('app.account')"
              type="text"
              tabindex="1"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:user-3-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('app.password')"
              tabindex="2"
              autocomplete="on"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:lock-2-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="flex-bar">
          <el-checkbox v-model="loginForm.remember"> 记住我 </el-checkbox>
          <el-link
            type="primary"
            :underline="false"
            @click="formType = 'reset'"
          >
            忘记密码了?
          </el-link>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          {{ t("app.login") }}
        </el-button>

        <div
          class=""
          style="
            text-align: center;
            color: #666;
            font-size: 15px;
            user-select: none;
            margin-top: 30px;
          "
        >
          点击「登录」表示已阅读并同意
          <span style="color: rgb(0 157 255)">隐私政策</span>
        </div>
        <!-- <div style="margin-top: 20px; margin-bottom: -20px; text-align: center">
            <el-divider>演示账号一键登录</el-divider>
            <el-button
              type="primary"
              size="small"
              plain
              @click="testAccount('admin')"
            >
              admin
            </el-button>
            <el-button size="small" plain @click="testAccount('test')">
              test
            </el-button>
          </div> -->
      </el-form>
      <el-form
        v-show="formType === 'register'"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="login-form"
        auto-complete="on"
      >
        <div class="title-container">
          <h3 class="title">注册你的管理账户</h3>
          <div class="sub-link">
            <span class="text">已经有帐号?</span>
            <el-link
              type="primary"
              :underline="false"
              @click="formType = 'login'"
            >
              去登录
            </el-link>
          </div>
        </div>
        <div>
          <el-form-item prop="mobile">
            <el-input
              v-model="registerForm.mobile"
              placeholder="用户名"
              tabindex="1"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:user-3-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input
              v-model="registerForm.verificationCode"
              placeholder="验证码"
              tabindex="2"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ic:baseline-verified-user" />
                </el-icon>
              </template>
              <template #append>
                <el-button @click="sendMsg" v-if="timeNum == 10"
                  >发送验证码</el-button
                >
                <el-button @click="sendMsg" v-else
                  >{{ timeNum }}s后重新发送</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              tabindex="3"
              autocomplete="on"
              show-password
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:lock-2-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input
              v-model="registerForm.checkPassword"
              type="password"
              placeholder="确认密码"
              tabindex="4"
              autocomplete="on"
              show-password
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:lock-2-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%; margin-top: 20px"
          @click.prevent="handleRegister"
        >
          注册
        </el-button>
      </el-form>

      <el-form
        v-show="formType === 'reset'"
        ref="resetFormRef"
        :model="resetForm"
        :rules="resetRules"
        class="login-form"
        auto-complete="on"
      >
        <div class="title-container">
          <h3 class="title">找回你的管理账户</h3>

          <div class="sub-link">
            <span class="text">已经有帐号?</span>
            <el-link
              type="primary"
              :underline="false"
              @click="formType = 'login'"
            >
              {{ t("app.goLogin") }}
            </el-link>
          </div>
        </div>
        <div>
          <el-form-item prop="account">
            <el-input
              v-model="resetForm.account"
              :placeholder="t('app.account')"
              type="text"
              tabindex="1"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:user-3-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input
              v-model="resetForm.captcha"
              :placeholder="t('app.captcha')"
              type="text"
              tabindex="2"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ic:baseline-verified-user" />
                </el-icon>
              </template>
              <template #append>
                <el-button>{{ t("app.sendCaptcha") }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              v-model="resetForm.newPassword"
              type="password"
              :placeholder="t('app.newPassword')"
              tabindex="3"
              autocomplete="on"
              show-password
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="i-ri:lock-2-fill" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%; margin-top: 20px"
          @click.prevent="handleReset"
        >
          {{ t("app.check") }}
        </el-button>
      </el-form>
    </div>
    <Copyright />
  </div>
</template>

<style lang="scss" scoped>
[data-mode="mobile"] {
  #login-box {
    position: relative;
    width: 100%;
    height: 100%;
    top: inherit;
    left: inherit;
    transform: translateX(0) translateY(0);
    flex-direction: column;
    justify-content: start;
    border-radius: 0;
    box-shadow: none;

    .login-banner {
      width: 100%;
      padding: 20px 0;

      .banner {
        position: relative;
        right: inherit;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        display: inherit;
        top: inherit;
        transform: translateY(0);
      }
    }

    .login-form {
      width: 100%;
      min-height: auto;
      padding: 30px;
    }
  }

  .copyright {
    position: relative;
  }
}

:deep(input[type="password"]::-ms-reveal) {
  display: none;
}

:deep(.i18n-selector) {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  // background: radial-gradient(
  //   circle at center,
  //   var(--g-app-bg),
  //   var(--g-main-bg)
  // );
  background: url("https://app.daccf.com/cdn/01/8f2fd0aa712b0e6f0dfefccf368430c9.jpeg")
    center bottom no-repeat rgb(0 157 255);
  background-size: cover;
  background-attachment: fixed;
}

.headlogo {
  position: absolute;
  left: 32px;
  top: 32px;
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
  }

  .title {
    color: #fff;
    font-size: 25px;
    font-weight: 700;
    padding-left: 3px;
    user-select: none;
  }
}

.footer {
  position: absolute;
  left: 32px;
  bottom: 32px;
  color: #fff;
  opacity: 0.6;
  font-size: 13px;

  .aherf {
    background: 0 0;
    text-decoration: none;
    outline: 0;
    cursor: pointer;
    transition: color 0.2s ease;
    margin-bottom: 5px;
    color: #fff;
  }
}

.introText {
  position: absolute;
  left: 16%;
  top: 45%;
  width: 420px;
  height: 140px;
  font-size: 35px;
  color: #fff;
  line-height: 200%;
}

#login-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translateX(-50%) translateY(-50%);
  background-color: var(--g-app-bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow);

  .login-banner {
    position: relative;
    width: 450px;
    background-color: var(--g-main-bg);
    overflow: hidden;

    .banner {
      width: 100%;

      @include position-center(y);
    }

    .logo {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      background: url("../assets/images/logo.png") no-repeat;
      background-size: contain;
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    width: 500px;
    padding: 50px;
    overflow: hidden;

    .title-container {
      position: relative;

      .title {
        font-size: 1.3em;
        color: var(--el-text-color-primary);
        margin: 0 auto 30px;
        font-weight: bold;
      }
    }
  }

  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      height: 48px;
      line-height: inherit;
      width: 100%;

      input {
        height: 48px;
      }

      .el-input__prefix,
      .el-input__suffix {
        display: flex;
        align-items: center;
      }

      .el-input__prefix {
        left: 10px;
      }

      .el-input__suffix {
        right: 10px;
      }
    }
  }
  :deep(.el-form-item) {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    box-sizing: border-box;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none;
  }
  :deep(input:-webkit-autofill, ) {
    -webkit-text-fill-color: #000 !important; //这个地方的颜色是字体颜色，可以根据实际情况修改
    -webkit-box-shadow: 0 0 0px 24px #fff inset !important; //设置input输入框的背景颜色为透明色
    background-color: transparent; //设置input输入框的背景颜色为透明色
    background-image: none;
    // border: 1px solid #dcdfe6;
    border-left: none;
    border-right: none;
    transition: background-color 50000s ease-in-out 0s;
  }
  :deep(input) {
    background-color: transparent; //设置input输入框的背景颜色为透明色
  }
  :deep(.el-divider__text) {
    background-color: var(--g-app-bg);
  }

  .flex-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sub-link {
    display: flex;
    align-items: center;
    // justify-content: center;
    // margin-top: 20px;
    margin-bottom: 40px;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    .text {
      margin-right: 10px;
    }
  }

  .select {
    background: #ebeff4;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    width: 62%;
    border-radius: 8px;

    .label {
      font-size: 14px;
      color: #243042;
      padding: 5px 12px;
      margin: 6px;
      opacity: 0.7;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.33, 1, 0.68, 1);
    }

    .active {
      opacity: 1;
      font-weight: 700;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgb(23 28 39 / 14%);
    }
  }
}

.copyright {
  position: absolute;
  bottom: 0;
  padding: 20px;
  margin: 0;
  width: 100%;
}
</style>

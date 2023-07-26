<template>
  <el-dialog
    v-model="myVisible"
    title="采集商品"
    width="1000px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div style="padding-left: 20px">
      <div>
        <el-alert
          title="支持采集淘宝、天猫、拼多多平台商品，复制对应平台的商品链接粘贴到采集框内即可，每次最多支持200个商品。
            本服务属于增值服务，按采集商品数量进行收费，收费标准为0.5元/个商品（采集成功才扣费，采集失败不扣费）。"
          type="info"
          show-icon
        />
      </div>
      <div style="padding: 20px">
        当前余额：<span style="color: #95d475; padding: 0 5px">5.00元</span
        >预计可采集10个商品
        <el-button type="success" size="small" style="margin-left: 10px"
          >充值</el-button
        >
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item label="采集平台" prop="className">
          <div class="boxlist">
            <div
              v-for="(item, index) in dataList"
              class="box"
              :class="num == index ? 'active' : ''"
              @click="changeNum(item, index)"
            >
              {{ item.name }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="采集说明" prop="gradeId">
          <div v-if="num == 0" style="color: #999">
            请打开电脑版淘宝官网：<a
              href="https://www.taobao.com/"
              target="_blank"
              >https://www.taobao.com/</a
            >
            ，复制商品链接到下面输入框开始采集（每个商品链接一行，用回车键换行）
          </div>
          <div v-if="num == 1" style="color: #999">
            请打开电脑版天猫官网：<a
              href="https://www.tmall.com/"
              target="_blank"
              >https://www.tmall.com/</a
            >
            ，复制商品链接到下面输入框开始采集（每个商品链接一行，用回车键换行）
          </div>
          <div v-if="num == 2" style="color: #999">
            请打开电脑版拼多多官网：
            <a href="https://mobile.yangkeduo.com/" target="_blank"
              >https://mobile.yangkeduo.com/</a
            >
            复制商品链接到下面输入框开始采集（每个商品链接一行，用回车键换行）
          </div>
        </el-form-item>
        <el-form-item label="采集商品" prop="classOrder">
          <el-input
            type="textarea"
            v-model="form.classOrder"
            placeholder="请输入要采集的商品链接，不同平台的商品需要分开采集"
            :rows="5"
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
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
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
const num = ref(0);
const changeNum = (item: any, index: any) => {
  num.value = index;
};
const dataList = ref([
  {
    icon: "",
    name: "淘宝",
  },
  {
    icon: "",
    name: "天猫",
  },
  {
    icon: "",
    name: "拼多多",
  },
]);
const form = ref({
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  id: props.id,
  className: "",
  classOrder: "",
  gradeId: "",
  remark: "",
  status: 0,
});
const formRef = ref();
const formRules = ref({
  className: [{ required: true, message: "请输入" }],
});
const gradeList: any = ref([]);
onMounted(() => {
  let data: any = {
    page: 1,
    size: 50,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api
    .get("/api/plugs/searchPlugsPracticeGradeList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        gradeList.value = res.body.list;
      }
    });
  if (props.id !== "") {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsPracticeClassById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
      });
  }
});

function onSubmit() {
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsPracticeClass", form.value)
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
            .post("/api/plugs/updatePlugsPracticeClass", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
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
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style lang="scss">
.boxlist {
  display: flex;
  .box {
    padding: 0px 20px;
    border: 1px solid #999;
    margin-right: 20px;
    border-radius: 10px;
  }
  .active {
    border: 1px solid #4298f2;
  }
}
</style>

<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="600px"
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
        <el-form-item label="企业名" prop="name">
          <el-input v-model="form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="企业代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入" clearable />
        </el-form-item>
        <!-- <el-form-item label="数据标识" prop="id">
        <el-input v-model="form.id" placeholder="请输入" clearable />
      </el-form-item> -->
        <el-form-item label="代码类型" prop="codeType">
          <el-select
            v-model="form.codeType"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="法人姓名" prop="legalPersonaName">
          <el-input
            v-model="form.legalPersonaName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="法人微信" prop="legalPersonaWechat">
          <el-input
            v-model="form.legalPersonaWechat"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="服务电话" prop="componentPhone">
          <el-input
            v-model="form.componentPhone"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="营业执照" prop="icon"
          ><el-upload
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
        </el-form-item> -->
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
import axios from "axios";
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

const options = [
  {
    value: "1",
    label: "统一社会信用代码（18 位）",
  },
  {
    value: "2",
    label: "组织机构代码（9 位 xxxxxxxx-x）",
  },
  {
    value: "3",
    label: "营业执照注册号(15 位)",
  },
];
const title = computed(() =>
  props.id === "" ? "拓展小程序商户" : "修改小程序商户"
);
const form = ref({
  // id: "",
  // adminId: storage.local.get("adminId"),
  // userServiceToken: storage.local.get("userServiceToken"),
  name: "",
  code: "",
  codeType: "1",
  legalPersonaName: "",
  legalPersonaWechat: "",
  componentPhone: "",
  // appSecret: "",
  // authCode: "",
  msg: "",
  status: 0,
});
const formRef = ref();
const formRules = ref({
  name: [{ required: true, message: "请输入" }],
  code: [{ required: true, message: "请输入" }],
  codeType: [{ required: true, message: "请输入" }],
  legalPersonaName: [{ required: true, message: "请输入" }],
  legalPersonaWechat: [{ required: true, message: "请输入" }],
  componentPhone: [{ required: true, message: "请输入" }],
  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
// onMounted(() => {
//   if (props.id !== "") {
//
//     api
//       .get("/api/plugs/searchPlugsInfoById", {
//         params: {
//           id: form.value.id,
//         },
//       })
//       .then((res: any) => {
//         form.value = res.body;

//         imageUrl.value = res.body.icon;
//         // emit("success");
//         // onCancel();
//       });
//   }
// });

function onSubmit() {
  // if (form.value.id === "") {
  //

  formRef.value &&
    formRef.value.validate((valid: any) => {
      if (valid) {
        api
          .post("/api/plugs/insertPlugsAppletExtension", form.value)
          .then((res: any) => {
            if (res.code == 200) {
              ElMessage.success({
                message: "新增成功",
                center: true,
              });

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
  // } else {
  //

  //   formRef.value &&
  //     formRef.value.validate((valid: any) => {
  //       if (valid) {
  //         api
  //           .post("/api/plugs/updatePlugsAppletExtension", form.value)
  //           .then((res: any) => {
  //             if (res.code == 200) {
  //               ElMessage.success({
  //                 message: "修改成功",
  //                 center: true,
  //               });
  //               // emit("success");
  //               onCancel();
  //             } else {
  //               ElMessage.error({
  //                 message: res.msg,
  //                 center: true,
  //               });
  //             }
  //           });
  //       }
  //     });
  // }
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}

// 图片上传

const imageUrl = ref("");
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

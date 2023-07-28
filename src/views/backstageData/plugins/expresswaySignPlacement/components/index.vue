<template>
  <el-dialog
    v-model="myVisible"
    :title="title"
    width="1000px"
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
        <div style="padding: 0 20px 20px">
          <div
            style="
              margin: 0 0 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>
              <span style="font-weight: 700; font-size: 18px">标题：</span
              ><el-input style="width: 240px" v-model="tableData.title">
              </el-input>
            </div>

            <el-button type="primary" @click="add">新增</el-button>
          </div>
          <el-table
            :data="tableData.list"
            style="width: 100%"
            :header-cell-style="{
              background: '#f3f6fd',
              color: '#555',
              textAlign: 'center',
            }"
          >
            <el-table-column prop="l0" label="内容" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.l0" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column prop="l6" label="规则" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.l6" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column
              prop="l1"
              label="设置桩号"
              align="center"
              width="100"
            >
              <template #default="scope"></template>
            </el-table-column>
            <el-table-column
              prop="l2"
              label="图例样式"
              width="100"
              align="center"
            >
              <template #default="scope">
                <!-- <el-upload
                  class="avatar-uploader"
                  :action="baseURL"
                  :headers="header"
                  name="file"
                  :data="{ type: 1 }"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                > -->
                <img
                  style="
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                  "
                  @click="upload_image(scope.$index)"
                  v-if="scope.row.l2"
                  :src="scope.row.l2"
                  class="avatar"
                />
                <el-icon
                  style="
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                  "
                  @click="upload_image(scope.$index)"
                  v-else
                  class="avatar-uploader-icon"
                  ><Plus
                /></el-icon>
                <!-- </el-upload> -->
              </template>
            </el-table-column>
            <el-table-column prop="l3" label="设置位置" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.l3" placeholder=""
              /></template>
            </el-table-column>
            <el-table-column
              prop="l4"
              label="是否符合要求"
              width="110"
              align="center"
            >
              <template #default="scope"> </template>
            </el-table-column>
            <el-table-column prop="l5" label="备注" align="center">
              <template #default="scope"
                ><el-input v-model="scope.row.l5" placeholder="" />
              </template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="" width="60">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="del(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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

const tableData: any = ref({
  list: [],
  title: "",
});
const title = computed(() => (props.id === "" ? "新增数据" : "修改数据"));
const form = ref({
  id: props.id,
  adminId: storage.local.get("adminId"),
  userServiceToken: storage.local.get("userServiceToken"),
  plugsId: Number(props.plugsId),
  businessId: 0,
  jsonData: "",
  jsonViewData: {},
  userId: 0,
});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入" }],
  type: [{ required: true, message: "请输入" }],
  businessId: [{ required: true, message: "请输入", trigger: "change" }],

  // name: [{ required: true, message: "请输入字典项名称" }],
  // value: [{ required: true, message: "请输入字典项键值" }],
});
onMounted(() => {
  if (props.id !== "") {
    api
      .get("/api/plugs/searchPlugsDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        let jsonData = JSON.parse(form.value.jsonData);
        // tableData.value = JSON.parse(form.value.jsonData);

        tableData.value.title = jsonData.title;
        tableData.value.list = jsonData.list;
      });
  }
});

function onSubmit() {
  form.value.jsonData = JSON.stringify(tableData.value);
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
const add = () => {
  let obj: any = {
    l0: "",
    l1: "",
    l2: "",
    l3: "",
    l4: "",
    l5: "",
    l6: "",
  };
  tableData.value.list.push(obj);
};
const del = (index: any) => {
  tableData.value.list.splice(index, 1);
};
// 图片上传

const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  Authorization: userStore.token,
});
const num: any = ref(0);
const changeFile = (index: any) => {
  num.value = index;
};
const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  tableData.value.list[num.value].l2 = response.body;
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
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {};

// 使用文件管理组件

const types: any = ref("");

import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  title: "文件管理",
  data: "",
  button_title: "确定",
  width: "1100",
  heigth: "500",
  close_title: "取消",
});

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (data.type == "return") {
    tableData.value.list[types.value].l2 = data.data[0].url;
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
</style>

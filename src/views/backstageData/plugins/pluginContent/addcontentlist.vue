<route lang="yaml">
meta: title:配置
</route>
<route lang="yaml">
meta:
  enabled: false
</route>

<template>
  <div
    class="containter"
    style="
      background-color: #fff;
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-scrollbar height="" style="padding: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="数据类型" prop="configType">
          <el-input
            v-model="form.configType"
            placeholder="configType"
            clearable
          />
        </el-form-item>

        <el-form-item label="插件id" prop="plugsId">
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
        <el-form-item label="插件数据" prop="jsonData">
          <el-input v-model="form.plugsConfigJson" placeholder="" clearable />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button size="large" @click="onCancel"> 取消 </el-button>
        <el-button type="primary" size="large" @click="onSubmit">
          确定
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();

const form: any = ref({
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  id: route.params.id ?? "",
  plugsId: route.params.plugsId,
  configType: "",
  jsonViewData: {},
  plugsConfigJson: "",
});
const jsonData = ref({});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
});
const plugsList: any = ref([]);
onMounted(() => {
  // 获取插件列表
  api.get("/api/plugs/searchPlugsInfoList").then((res: any) => {
    if (res.code == 200) {
      plugsList.value = res.body.list;
    }
  });

  if (form.value.id !== "") {
    api
      .get("/api/plugs/searchPlugsConfigById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        if (res.code == 200) {
          form.value = res.body;

          // form.value.jsonData.forEach((item)=>{
          //   item.key_description=
          // })
          form.value.id = res.body.id;
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
  }
});

function onSubmit() {
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsConfig", form.value)
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
            .post("/api/plugs/updatePlugsConfig", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
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
  }
}
function onCancel() {
  tabbar.close({ name: "addcontentlist" });
  router.push({
    name: "contentlist",
    params: {
      id: route.params.plugsId,
    },
  });
}
</script>

<style scoped></style>

<style></style>

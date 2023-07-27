<route lang="yaml">
name: homeRotation
meta:
  title: 易联云打印机
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <el-dialog
      v-model="dialogVisibles"
      :title="title"
      :width="width"
      :height="height"
    >
      <div>
        <div style="margin: 20px; height: 500px; overflow-y: scroll">
          <div>
            <el-button type="primary" @click="AddPriner">
              <template #icon>
                <el-icon>
                  <svg-icon name="i-ep:circle-plus" />
                </el-icon>
              </template>
              添加打印机
            </el-button>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              border-radius: 16px;
              border: 1px solid #eee;
              margin-top: 5px;
            "
            v-for="(item, index) in data.plugsConfigJson"
          >
            <el-input
              style="
                margin-left: 20px;
                width: 90%;
                position: relative;
                top: 15px;
              "
              v-model="item.device"
              placeholder="请输入云喇叭编码"
              clearable
            >
              <template #prepend>({{ index + 1 }})云喇叭编码</template>
            </el-input>

            <el-input
              style="margin: 20px; width: 90%"
              v-model="item.businessId"
              placeholder="请输入店铺ID"
              clearable
            >
              <template #prepend>
                <el-select
                  v-model="item.businessId"
                  placeholder="选择店铺"
                  style="width: 115px"
                >
                  <div v-for="business in businessList">
                    <el-option
                      :label="business.jsonViewData.businessName"
                      :value="business.jsonViewData.businessId"
                    />
                  </div>
                </el-select>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel('quit')">{{ close_title }}</el-button>
          <el-button type="primary" @click="shot">
            {{ button_title }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput, ElMessageBox, ElMessage } from "element-plus";
import api from "@/api";
import http from "@/api/plugin";
import router from "@/router";
const route = useRoute();
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    title: string;
    width: string;
    height: string;
    button_title: string;
    close_title: string;
    info: any;
  }>(),
  {
    dialogVisible: false,
    title: "组件标题",
    width: "30%",
    height: "50%",
    button_title: "确定",
    close_title: "关闭",
    info: {},
  }
);
const data: any = ref({
  id: props.info.id || "",
  adminId: props.info.adminId,
  plugsId: props.info.plugsId,
  userServiceToken: localStorage.getItem("fa_userServiceToken"),
  plugsConfigJson: props.info.plugsConfigJson || [
    {
      device: "",
      businessId: "",
    },
  ],
});

const businessList: any = ref([]);
onMounted(() => {
  getDianpu();
});

function getDianpu() {
  api
    .get("/api/plugs/getBusinessInfo", { params: { size: 100 } })
    .then((res: any) => {
      if (res.code == 200) {
        businessList.value = res.body;
      }
    });
}

const AddPriner = () => {
  data.value.plugsConfigJson.push({
    device: "",
    businessId: "",
  });
};

const dialogVisibles = ref(props.dialogVisible);
const shot = () => {
  if (props.button_title == "修改") {
    if (props.info.id) {
      props.info.plugsConfigJson = JSON.stringify(data.value.plugsConfigJson);
      http.post("/api/plugs/updatePlugsConfig", props.info).then((res: any) => {
        data.value.plugsConfigJson = [
          {
            device: "",
            businessId: "",
          },
        ];

        dialogVisibles.value = false;
        ElMessage({
          message: res.msg,
          type: "success",
        });
        onCancel("update");
        // router.go(0)
      });
    }
  } else {
    data.value.plugsConfigJson = JSON.stringify(data.value.plugsConfigJson);
    http.post("/api/plugs/insertPlugsConfig", data.value).then((res: any) => {
      if (res.code == 200) {
        data.value.plugsConfigJson = [
          {
            device: "",
            businessId: "",
          },
        ];
        dialogVisibles.value = false;
        ElMessage({
          message: res.msg,
          type: "success",
        });
        onCancel("add");
        // router.go(0)
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      }
    });
  }
};

const emit = defineEmits(["success"]);

function onCancel(item: any) {
  dialogVisibles.value = false;
  const select = item;
  // 回调
  emit("success", select);
}
</script>
<style scoped lang="scss"></style>

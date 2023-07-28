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
        autocomplete="off"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="110px"
      >
        <div>
          <el-form-item label="员工姓名" prop="realname">
            <el-input
              style="width: 400px"
              v-model="form.realname"
              placeholder="员工姓名"
              type="text"
              class="input-with-select"
            >
              <!-- <template #prepend> ¥ </template> -->
              <!-- <template #append> 元 </template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input
              style="width: 400px"
              v-model="form.userName"
              placeholder="用户名"
              autocomplete="off"
              type="text"
              class="zc_display"
            >
              <!-- <template #prepend> ¥ </template> -->
              <!-- <template #append> 元 </template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="mobile">
            <el-input
              style="width: 400px"
              v-model="form.mobile"
              placeholder="登录账号"
              type="text"
              min="0"
              class="input-with-select"
            >
              <template #prepend>{{ newcount }} </template>
              <!-- props.newmobile -->
              <!-- <template #prepend> ¥ </template> -->
              <!-- <template #append> 元 </template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input
              style="width: 400px"
              v-model="form.password"
              placeholder="登录密码"
              type="password"
              show-password
              autocomplete="new-password"
              class="zc_display"
            >
              <!-- <template #prepend> ¥ </template> -->
              <!-- <template #append> 元 </template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="businessListJson">
            <el-select
              :clearable="true"
              style="width: 400px; margin-right: 15px"
              @change="selectBusiness"
              multiple
              v-model="selectBuiness"
              filterable
              placeholder="选择店铺"
            >
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工备注" prop="remark">
            <el-input
              style="width: 400px"
              v-model="form.remark"
              placeholder="充值备注"
              type="text"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="用户服务标识" prop="userServiceToken">
						<el-input v-model="form.userServiceToken" disabled placeholder="请输入" clearable />
					</el-form-item> -->
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
  <!-- <ChangeGoods
	  v-if="comp.modelValue"
	  v-model="comp.modelValue"
	  @success="update"
	></ChangeGoods> -->
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
// import ChangeGoods from "@/components/changeGoods/index.vue";
import { UploadProps, ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
import { JSONStringify } from "lib/tool";
const route = useRoute();
const userStore = useUserStore();
const Totalaccount: any = ref(storage.local.get("account"));
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
    plugsId: any;
    newmobile: string | number;
  }>(),
  {
    modelValue: false,
    id: "",
    plugsId: "",
    newmobile: "",
  }
);
const myVisible = ref(props.modelValue);
const comp = ref({
  modelValue: false,
});
const newcount: any = ref();

const title = computed(() =>
  props.id === "" ? "新增员工账号" : "修改员工账号"
);
const selectBuiness: any = ref([]);
const form: any = ref({
  id: props.id,
  realname: "",
  userName: "",
  remark: "",
  mobile: "",
  password: "",
  businessListJson: "",
});
// const form:any = ref({
// 	"id": '',
// 	"adminId": storage.local.get("adminId"),
// 	"configType": "",
// 	"userServiceToken": storage.local.get("userServiceToken"),
// 	"plugsId": Number(props.plugsId),
// 	"jsonViewData": {},
// 	"plugsConfigJson":"",
// });

// 新增充值余额
const recharge = ref({
  rechargeMoney: "",
  giveeMoney: "",
  remarks: "",
});
// 充值规则列表
const rechargeList: any = ref([]);
const formRef = ref();
const formRules = ref({
  realname: [
    {
      required: true,
      message: "请输入",
    },
  ],
  mobile: [
    {
      required: true,
      message: "请输入",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入",
    },
  ],
  businessListJson: [
    {
      required: true,
      message: "请输入",
    },
  ],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);
onMounted(() => {
  getlist();

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
          if (props.newmobile == "") {
            newcount.value = Totalaccount.value;
          } else {
            newcount.value = props.newmobile;
          }
        });
      }
    });
});
function selectBusiness(val: any) {
  const data = val;
  const list: any = [];
  businessList.value.forEach((item: any) => {
    data.forEach((item2: any) => {
      if (item.businessId == item2) {
        // obj.businessName=item.businessName;
        // obj.businessId=item.businessId;
        list.push(item);
      }
    });
  });
  form.value.businessListJson = JSON.stringify(list);
}
// 获取详情
function getlist() {
  let data = {
    id: props.id,
  };
  api
    .get("/api/admin/searchAdminUserById", { params: data })
    .then((res: any) => {
      if (res.body) {
        let data2 = res.body.mobile.split(":");
        form.value.realname = res.body.realname;
        form.value.userName = res.body.userName;
        form.value.remark = res.body.remark;
        form.value.mobile = data2[1];
        form.value.password = res.body.password;
        form.value.businessListJson = res.body.businessListJson;
        let list = JSON.parse(res.body.businessListJson);
        list.forEach((item: any) => {
          selectBuiness.value.push(item.businessId);
        });
      }
    });
}
function onSubmit() {
  if (props.id == "") {
    form.value.mobile = Totalaccount.value + ":" + form.value.mobile;
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/admin/adminSubAccountrRegister", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
                // emit("success");
                onCancel();
              }
            });
        }
      });
  } else {
    form.value.mobile = Totalaccount.value + ":" + form.value.mobile;
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

const fullscreenLoading = ref(false);
const change = (e: any) => {
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("type", "1");
  fullscreenLoading.value = true;
  api.post("/api/file/uploadImages", formData).then((res: any) => {
    form.value.detailsImgAndPageUrl = res.body;
    fullscreenLoading.value = false;
  });
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

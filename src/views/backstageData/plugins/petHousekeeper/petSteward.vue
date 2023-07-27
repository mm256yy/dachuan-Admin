<route lang="yaml">
meta: title:宠物管家
</route>
<route lang="yaml">
meta:
  enabled: false
</route>
<template>
  <div style="color: white">
    <div style="margin: 20px; display: flex; justify-content: space-between">
      <el-button type="primary" @click="addPet">添加宠物管家</el-button>
      <div></div>
      <div>
        <el-input v-model="keyword" placeholder="请输入宠物管家ID">
          <template #append>
            <el-button :icon="Search" @click="find">
              <!-- <Search style="width: 1em; height: 1em; margin-right: 8px" /> -->
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" width="60">
        <template #default="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="人员名字">
        <template #default="scope" property="name">{{
          scope.row.name
        }}</template>
      </el-table-column>
      <el-table-column label="电话" property="phone">
        <template #default="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template #default="scope">
          <img
            :src="scope.row.headImgUrl"
            style="
              height: 64px;
              width: 64px;
              border-radius: 6px;
              border: 1px solid #ccc;
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="养龄" align="center">
        <template #default="scope">{{ scope.row.adopterAge || 0 }}年</template>
      </el-table-column>
      <el-table-column label="养过的宠物">
        <template #default="scope">{{ scope.row.adopterHistory }}</template>
      </el-table-column>
      <el-table-column label="基础价格" align="center">
        <template #default="scope">
          <div style="color: red">¥{{ scope.row.basicCost }}</div>
        </template>
      </el-table-column>
      <el-table-column label="擅长">
        <template #default="scope">{{ scope.row.begoodat }}</template>
      </el-table-column>

      <el-table-column label="职业" property="job">
        <template #default="scope">{{ scope.row.job }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row)">删除</el-button>
          <!-- <el-button type="primary">Primary</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="example-pagination-block">
      <div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="tableobj.currentPage"
          :page-size="tableobj.pageSize"
          layout="prev,pager,next,total"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="添加宠物管理"
      width="700"
      :before-close="handleClose"
    >
      <div
        style="
          padding: 20px;
          border: 1px solid #eee;
          margin: 10px;
          display: flex;
        "
      >
        <div>
          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >人员名称</span
              >
            </div>
            <el-input
              style="width: 260px"
              v-model="form.name"
              placeholder="人员名称"
              clearable
              maxlength="50"
              show-word-limit
            />
          </div>
          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >手机号</span
              >
            </div>
            <el-input
              style="width: 260px"
              type="number"
              v-model="form.phone"
              placeholder="请输入手机号"
              class="input-with-select"
            >
              <template #prepend> 号码 </template>
            </el-input>
          </div>
          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >基础价格</span
              >
            </div>
            <el-input
              style="width: 200px"
              type="number"
              v-model="form.basicCost"
              placeholder="基础价格"
              class="input-with-select"
            >
              <template #append> 元 </template>
            </el-input>
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: black">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >头像</span
              >
            </div>
            <!-- <el-upload
              class="avatar-uploader"
              :action="baseURL"
              :headers="header"
              name="file"
              :data="{ type: 1 }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
            > -->
            <img
              @click="upload_image('imageUrl')"
              v-if="form.headImgUrl"
              :src="form.headImgUrl"
              style="
                width: 64px;
                height: 64px;
                border: 1px solid #ccc;
                border-radius: 6px;
              "
            />
            <el-icon
              @click="upload_image('imageUrl')"
              v-else
              style="
                width: 64px;
                height: 64px;
                border: 1px solid #ccc;
                border-radius: 6px;
              "
              ><Plus
            /></el-icon>
            <!-- </el-upload> -->
            <!-- <el-input v-model="form.headImgUrl" placeholder="头像" style="width:300px"/> -->
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >擅长</span
              >
            </div>
            <el-input
              v-model="form.begoodat"
              placeholder="请输入擅长"
              style="width: 260px"
            />
          </div>

          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >养过的宠物</span
              >
            </div>
            <el-input
              v-model="form.adopterHistory"
              placeholder="养过的宠物"
              style="width: 260px"
            />
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >养龄</span
              >
            </div>
            <el-input
              style="width: 200px"
              type="number"
              v-model="form.adopterAge"
              placeholder="养龄"
              class="input-with-select"
            >
              <template #append> 年 </template>
            </el-input>
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >职业</span
              >
            </div>
            <el-input
              v-model="form.job"
              placeholder="职业"
              style="width: 260px"
            />
          </div>
        </div>
        <div style="margin-left: 20px">
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >店铺</span
              >
            </div>
            <div>
              <el-select
                v-model="value"
                class="m-2"
                placeholder="Select"
                @change="selectBusi"
              >
                <el-option
                  v-for="item in businessList"
                  :key="item.businessId"
                  :label="item.pluginName"
                  :value="item.businessId"
                />
              </el-select>
            </div>
          </div>

          <div>
            <div style="margin: 2px 0">
              <span style="color: black">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >描述</span
              >
            </div>
            <div>
              <el-input
                style="width: 260px"
                v-model="form.serviceDescribe"
                placeholder="描述"
                :rows="2"
                maxlength="150"
                show-word-limit
                type="textarea"
              />
            </div>
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >套餐</span
              >
            </div>
            <div>
              <el-tag
                v-for="(tag, index) in dynamicTags"
                :key="index"
                effect="light"
                class="mx-1"
                closable
                type="info"
                style="margin: 5px"
                :disable-transitions="false"
                @close="handleClose1(tag)"
              >
                <div v-if="tag.setMealName != ''">
                  {{ tag.setMealName }} + 价格:{{ tag.money }}
                </div>
              </el-tag>
              <div v-if="inputVisible">
                <el-input
                  ref="InputRef"
                  style="width: 240px"
                  v-model="inputValue"
                  placeholder="套餐名称"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
                  size="small"
                  class="input-with-select"
                >
                </el-input>

                <el-input
                  ref="InputRef"
                  style="width: 240px; margin-top: 2px"
                  v-model="inputValuePrice"
                  placeholder="套餐价格"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
                  size="small"
                  class="input-with-select"
                >
                  <template #prepend> ¥ </template>
                  <template #append> 元 </template>
                </el-input>
              </div>

              <el-button
                style="margin-left: 5px"
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click="showInput"
              >
                + 添加套餐
              </el-button>
            </div>
          </div>

          <div style="margin-top: 5px">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >升级套餐</span
              >
            </div>
            <div>
              <el-tag
                v-for="(tag, index) in dynamicTags1"
                :key="index"
                class="mx-1"
                closable
                type="info"
                style="margin: 5px"
                :disable-transitions="false"
                @close="handleClose2(tag)"
              >
                <div v-if="tag.serviceName != ''">
                  {{ tag.serviceName }} + 价格:{{ tag.money }}
                </div>
              </el-tag>
              <div v-if="inputVisible1">
                <el-input
                  ref="InputRef"
                  style="width: 240px"
                  v-model="inputValue1"
                  placeholder="升级服务名称"
                  @keyup.enter="handleInputConfirm1"
                  @blur="handleInputConfirm1"
                  size="small"
                  class="input-with-select"
                >
                </el-input>

                <el-input
                  ref="InputRef"
                  style="width: 240px; margin-top: 2px"
                  v-model="inputValuePrice1"
                  placeholder="升级服务价格"
                  @keyup.enter="handleInputConfirm1"
                  @blur="handleInputConfirm1"
                  size="small"
                  class="input-with-select"
                >
                  <template #prepend> ¥ </template>
                  <template #append> 元 </template>
                </el-input>
              </div>

              <el-button
                style="margin-left: 5px"
                v-else
                class="button-new-tag ml-1"
                size="small"
                @click="showInput1"
              >
                + 添加升级服务
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="shop"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
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
import { ref, nextTick } from "vue";
import api from "@/api";
import http from "@/api/plugin";
import {
  ElTable,
  ElMessageBox,
  ElMessage,
  UploadProps,
  ElInput,
} from "element-plus";
import { Search } from "@element-plus/icons-vue";
import useUserStore from "@/store/modules/user";
const inputValue = ref("");
const inputValue1 = ref("");
const dynamicTags: any = ref([]);
const dynamicTags1: any = ref([]);
const inputValuePrice: any = ref("");
const inputValuePrice1: any = ref("");
const inputVisible = ref(false);
const inputVisible1 = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const userStore = useUserStore();
const select_type: any = ref("新增");
const keyword: any = ref("");
const form: any = ref({
  name: "",
  phone: "",
  headImgUrl: "",
  begoodat: "",
  basicCost: "",
  adopterHistory: "",
  adopterAge: "",
  adminId: localStorage.getItem("fa_adminId"),
  job: "",
  serviceDescribe: "",
  businessId: "",
  plugsId: Number(route.params.id),
  setmealExtJson: "",
  upgradeServiceExtJson: "",
  userId: 0,
  userServiceToken: "",
});

const value = ref("");
const businessList: any = ref();
const selectBusi = (val: any) => {
  form.value.businessId = val;
};

interface User {
  date: string;
  name: string;
  address: string;
}
const imageUrl: any = ref([]);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);

onMounted(() => {
  getPet();
  getbusiness();
});

const getPet = () => {
  var data: any = {
    page: tableData.currentPage,
    size: tableData.pageSize,
    adminId: localStorage.getItem("fa_adminId"),
    userServiceToken: localStorage.getItem("fa_userServiceToken"),
  };
  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/plugs/searchPlugsPetStewardList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        total.value = res.body.total;
        tableData.value = res.body.list;
      }
    });
};

const getbusiness = () => {
  let data = {
    adminId: localStorage.getItem("fa_adminId"),
    userServiceToken: localStorage.getItem("fa_userServiceToken"),
    id: route.params.id,
  };
  api
    .get("/api/plugs/searchPlugsConfigList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        res.body.list.forEach((item: any, index: any) => {
          item["businessId"] = JSON.parse(item.plugsConfigJson).businessId;
          item["pluginName"] = JSON.parse(item.plugsConfigJson).businessName;
        });
        businessList.value = res.body.list;
      }
    });
};

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

const tableData: any = ref([]);
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("是否取消该操作?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});

function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  getPet();
}

function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getPet();
}

const addPet = () => {
  dynamicTags.value = [];
  dynamicTags1.value = [];
  value.value = "";
  form.value = {
    name: "",
    phone: "",
    headImgUrl: "",
    begoodat: "",
    basicCost: "",
    adopterHistory: "",
    adopterAge: "",
    adminId: localStorage.getItem("fa_adminId"),
    job: "",
    serviceDescribe: "",
    businessId: "",
    plugsId: Number(route.params.id),
    setmealExtJson: "",
    upgradeServiceExtJson: "",
    userId: 0,
    userServiceToken: "",
  };
  select_type.value = "新增";
  dialogVisible.value = true;
};

const shop = () => {
  let tableList: any = [];
  let tableList1: any = [];
  dynamicTags.value.forEach((item: any, index: any) => {
    tableList.push({
      setMealName: item.setMealName,
      money: item.money,
    });
  });

  dynamicTags1.value.forEach((item: any, index: any) => {
    tableList1.push({
      serviceName: item.serviceName,
      money: item.money,
    });
  });

  form.value.setmealExtJson = JSON.stringify(tableList);
  form.value.upgradeServiceExtJson = JSON.stringify(tableList1);

  if (select_type.value == "新增") {
    form.value.adminId = Number(localStorage.getItem("fa_adminId"));
    form.value.userServiceToken = localStorage.getItem("fa_userServiceToken");
    http
      .post("/api/plugs/insertPlugsPetSteward", form.value)
      .then((res: any) => {
        if (res.code == 200) {
          dialogVisible.value = false;
          getPet();
          ElMessage({
            type: "success",
            message: "添加成功！",
          });
        }
      });
  } else {
    http
      .post("/api/plugs/updatePlugsPetSteward", form.value)
      .then((res: any) => {
        if (res.code == 200) {
          dialogVisible.value = false;
          ElMessage({
            type: "success",
            message: "编辑成功!",
          });
        }
      });
  }
};

const del = (item: any) => {
  let data: any = {
    ids: item.id,
  };
  api.post("/api/plugs/delPlugsPetSteward", data).then((res: any) => {
    if (res.code == 200) {
      getPet();
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
    }
  });
};

const edit = (item: any) => {
  if (item.setmealExtJson) {
    dynamicTags.value = JSON.parse(item.setmealExtJson);
  } else {
    dynamicTags.value = [];
  }
  if (item.upgradeServiceExtJson) {
    dynamicTags1.value = JSON.parse(item.upgradeServiceExtJson);
  } else {
    dynamicTags1.value = [];
  }

  value.value = item.businessId;

  select_type.value = "编辑";
  form.value = item;
  dialogVisible.value = true;
};

const find = () => {
  if (keyword.value) {
    tableData.value = [];
    let data: any = {
      id: Number(keyword.value),
    };
    http
      .get("/api/plugs/searchPlugsPetStewardById", {
        params: data,
      })
      .then((res: any) => {
        tableData.value.push(res.body);
      });
  } else {
    getPet();
  }
};

// 套餐
const handleClose1 = (tag: any) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  inputVisible.value = false;
};

const handleClose2 = (tag: any) => {
  dynamicTags1.value.splice(dynamicTags1.value.indexOf(tag), 1);
  inputVisible1.value = false;
};

const showInput = () => {
  inputVisible.value = true;
  dynamicTags.value.push({
    setMealName: "",
    money: "",
    show: true,
  });
};

const showInput1 = () => {
  inputVisible1.value = true;
  dynamicTags1.value.push({
    serviceName: "",
    money: "",
    show: true,
  });
};

const handleInputConfirm = () => {
  if (inputValue.value && inputValuePrice.value) {
    dynamicTags.value[dynamicTags.value.length - 1].show = false;
    dynamicTags.value[dynamicTags.value.length - 1].setMealName =
      inputValue.value;
    dynamicTags.value[dynamicTags.value.length - 1].money =
      inputValuePrice.value;
    inputVisible.value = false;
    inputValue.value = "";
    inputValuePrice.value = "";
  }
};

const handleInputConfirm1 = () => {
  if (inputValue1.value && inputValuePrice1.value) {
    dynamicTags1.value[dynamicTags1.value.length - 1].show = false;
    dynamicTags1.value[dynamicTags1.value.length - 1].serviceName =
      inputValue1.value;
    dynamicTags1.value[dynamicTags1.value.length - 1].money =
      inputValuePrice1.value;
    inputVisible1.value = false;
    inputValue1.value = "";
    inputValuePrice1.value = "";
  }
};

// 使用文件管理组件
const types: any = ref("");

import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_image = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  if (types.value == "imageUrl") {
    imageUrl.value = data[0];
    form.value.headImgUrl = data[0];
  }
};
</script>

<style>
.example-pagination-block {
  margin-bottom: 16px;
  width: 100%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

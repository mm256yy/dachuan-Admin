<route lang="yaml">
meta: title:宠物管理列表
</route>
<route lang="yaml">
	meta:
	enabled: false
</route>

<template>
  <div style="color: white">
    <div style="margin: 20px; display: flex; justify-content: space-between">
      <el-button type="primary" @click="addPet">添加宠物寄养家庭</el-button>
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
      <el-table-column label="寄养员名称">
        <template #default="scope">{{ scope.row.fosterCareName }}</template>
      </el-table-column>
      <el-table-column label="宠物家庭名称">
        <template #default="scope">{{ scope.row.homeName }}</template>
      </el-table-column>
      <el-table-column
        label="家庭地址"
        width="250"
        show-overflow-tooltip
        align="center"
      >
        <template #default="scope" style="">
          {{ scope.row.addressJson.address }}
        </template>
      </el-table-column>
      <el-table-column label="寄养员头像" align="center">
        <template #default="scope">
          <img
            :src="scope.row.fosterCareHeadUrl"
            style="
              height: 64px;
              width: 64px;
              border-radius: 6px;
              border: 1px solid #ccc;
            "
          />
        </template>
      </el-table-column>
      <el-table-column label="价格/天">
        <template #default="scope">
          <div style="color: red">¥{{ scope.row.price }}</div>
        </template>
      </el-table-column>

      <el-table-column label="号码" align="center">
        <template #default="scope">
          <div>
            {{ scope.row.fosterPhone }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="寄养员工作" align="center">
        <template #default="scope">{{ scope.row.fosterCareJob }}</template>
      </el-table-column>

      <el-table-column label="寄养员经验年限" width="130">
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
            v-if="scope.row.fosterCareExp == 0"
          >
            {{ scope.row.fosterCareExp || 0 }}年
          </div>
          <div
            v-else-if="
              scope.row.fosterCareExp <= 3 && scope.row.fosterCareExp != 0
            "
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-tag class="ml-2" type="success"
              >{{ scope.row.fosterCareExp }}年</el-tag
            >
          </div>
          <div
            v-else-if="scope.row.fosterCareExp >= 5"
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-tag class="ml-2" type="danger"
              >{{ scope.row.fosterCareExp }}年</el-tag
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="寄养员擅长" align="center">
        <template #default="scope">{{ scope.row.fosterCareBegoodat }}</template>
      </el-table-column>

      <el-table-column label="轮播图">
        <template #default="scope">
          <div v-for="item in scope.row.rotationImagesUrl">
            <img
              :src="item"
              alt=""
              style="
                width: 64px;
                height: 64px;
                border-radius: 6px;
                border: 1px solid #eee;
              "
            />
          </div>
        </template>
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
      width="800"
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
                >寄养员名称</span
              >
            </div>
            <el-input
              style="width: 260px"
              v-model="form.fosterCareName"
              placeholder="寄养员名称"
              clearable
              maxlength="50"
              show-word-limit
            />
          </div>
          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >寄养员擅长</span
              >
            </div>
            <el-input
              v-model="form.fosterCareBegoodat"
              placeholder="寄养员擅长"
              style="width: 260px"
            />
          </div>
          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >多少钱/天</span
              >
            </div>
            <el-input
              style="width: 200px"
              type="number"
              v-model="form.price"
              placeholder="多少钱/天"
              class="input-with-select"
            >
              <template #append> 元/天 </template>
            </el-input>
          </div>

          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >寄养员头像</span
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
              v-if="form.fosterCareHeadUrl"
              :src="form.fosterCareHeadUrl"
              style="
                width: 64px;
                height: 64px;
                margin-left: 10px;
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
            >
              <Plus />
            </el-icon>
            <!-- </el-upload> -->

            <!-- <el-input v-model="form.headImgUrl" placeholder="头像" style="width:300px"/> -->
          </div>

          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >寄养员工作</span
              >
            </div>
            <el-input
              v-model="form.fosterCareJob"
              placeholder="寄养员工作"
              style="width: 260px"
            />
          </div>

          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >寄养员经验年限</span
              >
            </div>
            <el-input
              style="width: 200px"
              v-model="form.fosterCareExp"
              placeholder="寄养员经验年限"
              class="input-with-select"
            >
              <template #append> 年 </template>
            </el-input>
          </div>

          <div style="">
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >宠物家庭名称</span
              >
            </div>
            <el-input
              style="width: 260px"
              v-model="form.homeName"
              placeholder="宠物家庭名称"
              class="input-with-select"
            >
              <!-- <template #append>
                  年
                </template> -->
            </el-input>
          </div>

          <div style="">
            <div style="margin: 2px 0">
              <!-- <h1  >选点</h1> -->
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >家庭地址</span
              >
            </div>
            <el-input
              @click="openMapPickPop"
              v-model="currentPicked.poiaddress"
              placeholder="家庭地址"
              style="width: 260px"
            />
          </div>
        </div>

        <div style="margin-left: 20px">
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >标签</span
              >
            </div>

            <div>
              <el-tag
                style="margin: 5px"
                v-for="tag in dynamicTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose1(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                style="width: 200px"
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag ml-1"
                style="position: relative; bottom: 2px; margin: 5px"
                size="small"
                @click="showInput"
              >
                + 新增标签
              </el-button>
              <!-- <el-input v-model="form.labelList" placeholder="标签" style="width:260px"/> -->
            </div>
          </div>
          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >轮播图</span
              >
            </div>

            <div style="display: flex; flex-direction: column">
              <!-- <el-alert title="双击图片进行删除！" style="height: 30px;margin-bottom: 5px;width: 380px;" type="success" show-icon /> -->
              <div style="display: flex">
                <el-icon
                  @click="upload_image('imageUrl1')"
                  style="
                    width: 64px;
                    height: 64px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                  "
                >
                  <Plus />
                </el-icon>
                <img
                  style="
                    width: 64px;
                    height: 64px;
                    margin-left: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                  "
                  v-if="form.rotationImagesUrl"
                  v-for="(item, index) in form.rotationImagesUrl"
                  @dblclick="delimg(index)"
                  :src="item"
                  class="avatar"
                />
                <!-- <el-upload
                  class="avatar-uploader"
                  :action="baseURL"
                  :headers="header"
                  name="file"
                  :data="{ type: 1 }"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                > -->

                <!-- </el-upload> -->
              </div>
            </div>
          </div>

          <div>
            <div style="margin: 2px 0">
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >家庭成员</span
              >
            </div>

            <div style="display: flex; flex-direction: column">
              <!-- <el-alert title="双击图片进行删除！" style="height: 30px;margin-bottom: 5px;width: 380px;" type="success" show-icon /> -->
              <div style="display: flex">
                <el-icon
                  @click="upload_image('imageUrl2')"
                  style="
                    width: 64px;
                    height: 64px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                  "
                >
                  <Plus />
                </el-icon>
                <img
                  style="
                    width: 64px;
                    height: 64px;
                    margin-left: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                  "
                  v-if="form.homePetListJson.length"
                  v-for="(item, index) in form.homePetListJson"
                  @dblclick="delimg1(index)"
                  :src="item.pet_images"
                  class="avatar"
                />
                <!-- <el-upload
                  class="avatar-uploader"
                  :action="baseURL"
                  :headers="header"
                  name="file"
                  :data="{ type: 1 }"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess1"
                > -->

                <!-- </el-upload> -->
              </div>
            </div>
          </div>

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
              <span style="color: red">*</span>
              <span style="font-weight: bolder; color: black; font-size: 14px"
                >给养员手机号</span
              >
            </div>

            <div>
              <el-input
                v-model="form.fosterPhone"
                placeholder="给养员手机号"
                style="width: 200px"
              />
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
      :title="dialogPluginList.title"
      :width="dialogPluginList.width"
      :button_title="dialogPluginList.button_title"
      :height="dialogPluginList.heigth"
      :dialogVisible="dialogPluginList.dialogVisible"
      :close_title="dialogPluginList.close_title"
      :data="dialogPluginList.data"
      @success="Return"
    />
    <!-- 获取地址以及经纬度 -->
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, reactive, computed, watch, onMounted } from "vue";
// import {
// 	jsonp
// } from 'vue-jsonp'
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
import axios from "axios";
const dialogVisible = ref(false);
const userStore = useUserStore();
const select_type: any = ref("新增");
const keyword: any = ref("");
const route = useRoute();
const router = useRouter();
const inputValue: any = ref("");
const dynamicTags: any = ref([]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const handleClose1 = (tag: any) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};
// 获取地图位置
const mapApiKey = "KEDBZ-NJ7WJ-OOXFM-KGYWA-YSG4O-M5FT4";
const IFRAME_HTML = `<iframe id="mapPage" width="600" height="400" frameborder="0"
                src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${mapApiKey}&referer=myapp"></iframe>`;

const currentPicked: any = ref({
  latlng: {},
});
const address = ref({
  province: "浙江省",
  city: "",
  district: "临平区",
  latitude: "",
  longitude: "",
  address: "",
});
function openMapPickPop($event: any) {
  if ($event.relatedTarget) return;
  ElMessageBox({
    title: "选择地址",
    message: IFRAME_HTML,
    customClass: "location-picker-box",
    dangerouslyUseHTMLString: true,
    closeOnPressEscape: false,
    confirmButtonText: "确定",
  })
    .then(() => {
      window.removeEventListener("message", handleMapPickedMessage, false);
      form.value.latitude = currentPicked.value.latlng.lat;
      form.value.latitude = currentPicked.value.latlng.lng;
      address.value.city = currentPicked.value.cityname;
      address.value.latitude = currentPicked.value.latlng.lat;
      address.value.longitude = currentPicked.value.latlng.lng;
      address.value.address = currentPicked.value.poiaddress;
      form.value.addressJson = JSON.stringify(address.value);
    })
    .catch((e) => {
      if (e != "cancel") throw e;
      window.removeEventListener("message", handleMapPickedMessage, false);
    });

  window.addEventListener("message", handleMapPickedMessage, false);
}

function handleMapPickedMessage(event: any) {
  /**
   * 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
   */
  let loc = event.data;
  // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
  if (loc && loc.module != "locationPicker") return;
  currentPicked.value = loc;
}

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

const form: any = ref({
  addressJson: "",
  adminId: localStorage.getItem("fa_adminId"),
  businessId: "",
  distance: "",
  homePetListJson: [],
  fosterCareBegoodat: "",
  fosterCareExp: "",
  fosterCareHeadUrl: "",
  fosterCareJob: "",
  fosterCareName: "",
  fosterPhone: "",
  homeName: "",
  labelList: "",
  latitude: 0,
  longitude: 0,
  plugsId: Number(route.params.id),
  rotationImagesUrl: [],
  price: "",
  userId: 0,
  userServiceToken: localStorage.getItem("fa_userServiceToken"),
});

interface User {
  date: string;
  name: string;
  address: string;
}

const delimg = (index: any) => {
  form.value.rotationImagesUrl.splice(index, 1);
  // form.value.rotationImagesUrl = JSON.stringify(form.value.rotationImagesUrl);
};

const delimg1 = (index: any) => {
  form.value.homePetListJson.splice(index, 1);
  // form.value.rotationImagesUrl = JSON.stringify(form.value.rotationImagesUrl);
};

const value = ref("");

const selectBusi = (val: any) => {
  form.value.businessId = val;
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const businessList: any = ref();
onMounted(() => {
  getPet();
  getbusiness();
});
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
    .get("/api/plugs/searchPlugsPetFosterHomeList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        total.value = res.body.total;
        tableobj.keyword = "";
        res.body.list.forEach((item: any, index: any) => {
          item["homePetListJson"] = JSON.parse(item.homePetListJson);
          dynamicTags.value = JSON.parse(item.labelList);
          item.rotationImagesUrl = JSON.parse(item.rotationImagesUrl);
          item.addressJson = JSON.parse(item.addressJson);
        });
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
    .get("/api/plugs/searchPlugsConfigList", {
      params: data,
    })
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

const addPet = () => {
  dynamicTags.value = [];
  value.value = "";
  form.value = {
    addressJson: "",
    adminId: localStorage.getItem("fa_adminId"),
    businessId: "",
    distance: "",
    fosterCareBegoodat: "",
    fosterCareExp: "",
    fosterCareHeadUrl: "",
    fosterCareJob: "",
    homePetListJson: [],
    fosterCareName: "",
    fosterPhone: "",
    homeName: "",
    labelList: "",
    latitude: 0,
    longitude: 0,
    plugsId: Number(route.params.id),
    rotationImagesUrl: [],
    totalAccount: "",
    userId: 0,
    userServiceToken: localStorage.getItem("fa_userServiceToken"),
  };
  select_type.value = "新增";
  dialogVisible.value = true;
};

const shop = () => {
  form.value.adminId = Number(localStorage.getItem("fa_adminId"));
  form.value.userServiceToken = localStorage.getItem("fa_userServiceToken");
  form.value.labelList = JSON.stringify(dynamicTags.value);
  form.value.homePetListJson = JSON.stringify(form.value.homePetListJson);
  if (select_type.value == "新增") {
    form.value.rotationImagesUrl = JSON.stringify(form.value.rotationImagesUrl);
    http
      .post("/api/plugs/insertPlugsPetFosterHome", form.value)
      .then((res: any) => {
        if (res.code == 200) {
          getPet();
          ElMessage({
            type: "success",
            message: "添加成功！",
          });
        }
      });
  } else {
    form.value.rotationImagesUrl = JSON.stringify(form.value.rotationImagesUrl);
    http
      .post("/api/plugs/updatePlugsPetFosterHome", form.value)
      .then((res: any) => {
        if (res.code == 200) {
          dialogVisible.value = false;
          getPet();
          ElMessage({
            type: "success",
            message: "编辑成功!",
          });
        }
      });
  }

  dialogVisible.value = false;
};

const del = (item: any) => {
  let data: any = {
    ids: item.id,
  };
  api.post("/api/plugs/delPlugsPetFosterHome", data).then((res: any) => {
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
  dynamicTags.value = JSON.parse(item.labelList);
  value.value = item.businessId;
  select_type.value = "编辑";
  form.value = item;
  currentPicked.value.poiaddress = item.addressJson.address;

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
    if (types.value == "imageUrl") {
      form.value.fosterCareHeadUrl = data.data[0].url;
    } else if (types.value == "imageUrl2") {
      data.data.forEach((item: any) => {
        form.value.homePetListJson.push({
          pet_images: item.url,
        });
      });
    } else if (types.value == "imageUrl1") {
      data.data.forEach((item: any) => {
        form.value.rotationImagesUrl.push(item.url);
      });
    }
  }
};
</script>

<style>
html .location-picker-box {
  width: auto;
  max-width: none;
}
.example-pagination-block {
  margin-bottom: 16px;
  width: 100%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<route lang="yaml">
meta: title:会员列表
</route>

<script setup lang="ts">
import { DocumentAdd, Upload, Download, Check } from "@element-plus/icons-vue";
import { ElButton, ElDialog, ElMessageBox } from "element-plus";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "@/api/plugin";
import http from "@/api";
import { ref } from "vue";
import storage from "@/utils/storage";
const router = useRouter();
const route = useRoute();
const options2: any = ref([]);
onBeforeMount(() => {
  getUser();
});
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    if (item.id == 31) {
      return;
    } else {
      return item.id;
    }
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
  getUser();
}
function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getUser();
}
function getUser() {
  let data: any = {
    size: tableobj.pageSize,
    page: tableobj.currentPage,
    keyword: tableobj.keyword,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };

  api
    .get("/api/user/searchUserInfoList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        for (let index = 0; index < res.body.list.length; index++) {
          res.body.list[index].userState = !res.body.list[index].userState;
        }
        tableData.value = res.body.list;
        total.value = res.body.total;
        tableobj.keyword = "";
      }
    });
}

function update(swithcs: any) {
  if (swithcs == "update") {
    let data: any = userinfo.value;
    data.powerJson = JSON.stringify(userTag.value);
    if (data.userState) {
      data.userState = 0;
    } else {
      data.userState = 1;
    }
    api.post("/api/user/adminUpdateUserInfo", data).then((res: any) => {
      if (res.code == 200) {
        visible.value = false;
        getUser();
        ElMessage({
          type: "success",
          message: res.msg,
        });
      } else {
        ElMessage({
          type: "error",
          message: res.msg,
        });
      }
    });
  } else {
    if (tableData.value[index.value].userState) {
      tableData.value[index.value].userState = 0;
    } else {
      tableData.value[index.value].userState = 1;
    }

    let dd: any = tableData.value[index.value];
    dd.powerJson = JSON.stringify(userTag.value);
    api.post("/api/user/adminUpdateUserInfo", dd).then((res: any) => {
      if (res.code == 200) {
        visible.value = false;
        getUser();
        ElMessage({
          type: "success",
          message: res.msg,
        });
      } else {
        ElMessage({
          type: "error",
          message: res.msg,
        });
      }
    });
  }
}
const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      http.post("/api/user/delUserInfo", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getUser();
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
  // ids.push(idlist.value);
};
const handleClick = (e: any) => {
  let data = {
    ids: e,
  };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      http.post("/api/user/delUserInfo", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getUser();
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
};
const tableData: any = ref([]);

const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
});

function formatDate(value: any) {
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = (date.getMonth() + 1) as number;
  MM = MM < 10 ? (("0" + MM) as unknown as number) : MM;
  let d = date.getDate();
  d = d < 10 ? (("0" + d) as unknown as number) : d;
  let h = date.getHours();
  h = h < 10 ? (("0" + h) as unknown as number) : h;
  let m = date.getMinutes();
  m = m < 10 ? (("0" + m) as unknown as number) : m;
  let s = date.getSeconds();
  s = s < 10 ? (("0" + s) as unknown as number) : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}
const index = ref();
function select(e: any) {
  userinfo.value = e;
  if (userinfo.value.powerJson != null) {
    userTag.value = JSON.parse(userinfo.value.powerJson);
  }
  visible.value = !visible.value;
}

function switchs(row: any, index1: any) {
  index.value = index1;
  if (row.userState) {
    row.userState = true;
  } else {
    row.userState = false;
  }
  update("switchs");
}

const visible = ref(false);
const value = ref("1");
const userTag: any = ref({
  tag: 0,
});
const userinfo = ref({
  mobile: "",
  password: "",
  userName: "",
  userLevel: "",
  headImg: "",
  balance: "",
  realname: "",
  receiveAddressJson: "",
  userEmail: "",
  userCode: "",
  userServiceToken: "",
  powerJson: "",
});

const options = [
  {
    value: "1",
    label: "普通用户",
  },
  {
    value: "2",
    label: "青铜VIP",
    // disabled: true,
  },
  {
    value: "3",
    label: "白银VIP",
  },
  {
    value: "5",
    label: "黄金VIP",
  },
  {
    value: "6",
    label: "铂金VIP",
  },
];

const types: any = ref("");
// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_file = () => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  userinfo.value.headImg = data[0];
};
</script>
<template>
  <div>
    <page-main style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button
            type="danger"
            @click="delPlugin"
            :disabled="!multipleSelection.length"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="ep:delete" />
              </el-icon>
            </template>
            批量删除
          </el-button>
        </div>
        <div style="display: flex">
          <div class="lang">
            <el-input
              style="width: 150px; height: 40px"
              v-model="tableobj.keyword"
              placeholder="请输入"
              @keyup.enter.native="getUser"
            />
          </div>
          <el-button
            type="primary"
            style="height: 40px; margin: 0 20px 0 30px"
            @click="getUser"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:search" />
              </el-icon>
            </template>
            搜索
          </el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          :header-cell-style="{
            background: '#f9f9f9',
            color: '#666',
            textAlign: 'center',
            height: '55px',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" />

          <el-table-column prop="id" label="ID" align="center" width="60" />

          <el-table-column label="用户头像" align="center">
            <template #default="scope">
              <div>
                <img
                  :src="scope.row.headImg"
                  style="width: 64px; height: 64px"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户昵称" prop="userName" align="center">
          </el-table-column>
          <el-table-column label="手机号" align="center">
            <template #default="scope">
              <div>
                <div>
                  {{ scope.row.mobile }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="会员等级" align="center">
            <template #default="scope">
              <div>
                <div v-if="scope.row.userLevel == 0">普通用户</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="账户余额" align="center">
            <template #default="scope">
              <div>
                <div v-if="scope.row.balance">{{ scope.row.balance }}元</div>
                <div v-else>0元</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="注册时间" align="center">
            <template #default="scope">
              <div>{{ formatDate(scope.row.createTime) }}</div>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center">
            <template #default="scope">
              <div>
                <el-switch
                  v-model="scope.row.userState"
                  class="ml-2"
                  width="60"
                  inline-prompt
                  active-text="正常"
                  inactive-text="禁用"
                  @click="switchs(scope.row, scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="handleClick(scope.row.id)"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="select(scope.row)"
                >编辑</el-button
              >
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
      </div>

      <el-dialog
        v-model="visible"
        :show-close="false"
        :close-on-click-modal="false"
        append-to-body
        destroy-on-close
        width="700px"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header" style="font-weight: 700">修改会员信息</div>
        </template>
        <div style="height: 500px">
          <div style="">
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">用户头像</div>
              <img
                :src="userinfo.headImg"
                style="height: 64px; width: 64px"
                @click="upload_file()"
              />
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">手机号码</div>
              <el-input
                v-model="userinfo.mobile"
                placeholder="手机号码"
                style="width: 550px"
              />
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">用户昵称</div>
              <el-input
                v-model="userinfo.userName"
                placeholder="用户昵称"
                style="width: 550px"
              />
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">
                <span style="color: red"></span> 会员等级
              </div>
              <!-- <el-input v-model="input" placeholder="会员标签" style="width: 300px;"/> -->
              <el-select v-model="value" placeholder="Select">
                <el-option
                  style="width: 530px"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">
                <span style="color: red"></span> 会员权限
              </div>
              <!-- <el-input v-model="input" placeholder="会员标签" style="width: 300px;"/> -->
              <el-select
                v-model="userTag.tag"
                class="m-2"
                placeholder="请选择"
                size="large"
              >
                <el-option :key="0" label="默认店铺" :value="0" />
                <el-option :key="1" label="全部店铺" :value="1" />
              </el-select>
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">注册渠道</div>
              <el-input
                v-model="userinfo.userCode"
                disabled
                placeholder="注册渠道"
                style="width: 550px"
              />
            </div>
            <div style="display: flex; margin: 20px; align-items: center">
              <div style="width: 80px; color: #515a6e">用户标识</div>
              <el-input
                v-model="userinfo.userServiceToken"
                disabled
                placeholder="用户标识"
                style="width: 550px"
              />
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              top: 40px;
            "
          >
            <!-- <template #footer>
                <el-button size="large" @click="onCancel"> 取消 </el-button>
                <el-button type="primary" size="large" @click="onSubmit">
                  确定
                </el-button>
              </template> -->
            <el-button type="primary" @click="update('update')">
              修改
            </el-button>
            <el-button @click="visible = false"> 取消 </el-button>
          </div>
        </div>
      </el-dialog>
    </page-main>
    <dialogWindows
      v-if="dialogPluginList.dialogVisible"
      v-model="dialogPluginList.dialogVisible"
      :dialogVisible="dialogPluginList.dialogVisible"
      :source="dialogPluginList.source"
      @success="Return"
    />
  </div>
</template>

<style scoped>
:deep(.el-upload-list) {
  display: none;
}
.my-header {
}
.example-pagination-block {
  margin-bottom: 16px;
  width: 100%;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.lang {
  width: 120px;
  margin-right: 20px;
  height: 40px;
}
</style>

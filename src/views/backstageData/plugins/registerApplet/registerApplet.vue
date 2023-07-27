<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button type="primary" @click="addPlugin">
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            拓展商户
          </el-button>
        </div>
        <div style="display: flex">
          <div class="lang">
            <el-input
              style="width: 150px"
              v-model="tableobj.keyword"
              placeholder="请输入"
              @keyup.enter.native="getlist"
            />
          </div>
          <el-button
            type="primary"
            @click="getlist"
            style="margin: 0 20px 0 30px"
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

      <div class="main">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <!-- <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" /> -->
          <!-- <el-table-column prop="icon" label="插件icon" align="center">
            <template #default="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.icon"
              />
            </template>
          </el-table-column> -->
          <el-table-column prop="name" label="企业名" align="center" />

          <el-table-column prop="code" label="企业代码" align="center" />
          <el-table-column
            prop="legalPersonaName"
            label="法人姓名"
            align="center"
          />
          <el-table-column
            prop="legalPersonaWechat"
            label="法人微信"
            align="center"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="componentPhone"
            label="服务电话"
            align="center"
          >
          </el-table-column> -->
          <el-table-column prop="appId" label="Appid" align="center" />
          <el-table-column prop="createTime" label="注册时间" align="center" />

          <el-table-column
            prop="msg"
            label="返回消息"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div v-if="scope.row.status == '100001'">
                已下发的模板消息法人并未确认且已超时（24h），未进行身份证校验
              </div>
              <div v-else-if="scope.row.status == '100002'">
                已下发的模板消息法人并未确认且已超时（24h），未进行人脸识别校验
              </div>
              <div v-else-if="scope.row.status == '100003'">
                已下发的模板消息法人并未确认且已超时（24h）
              </div>
              <div v-else-if="scope.row.status == '101'">
                工商数据返回：“企业已注销”
              </div>
              <div v-else-if="scope.row.status == '102'">
                工商数据返回：“企业不存在或企业信息未更新”
              </div>
              <div v-else-if="scope.row.status == '103'">
                工商数据返回：“企业法定代表人姓名不一致”
              </div>
              <div v-else-if="scope.row.status == '104'">
                工商数据返回：“企业法定代表人身份证号码不一致”
              </div>
              <div v-else-if="scope.row.status == '105'">
                法定代表人身份证号码，工商数据未更新，请 5-15 个工作日之后尝试
              </div>
              <div v-else-if="scope.row.status == '1000'">
                工商数据返回：“企业信息或法定代表人信息不一致”
              </div>
              <div v-else-if="scope.row.status == '1001'">
                主体创建小程序数量达到上限
              </div>
              <div v-else-if="scope.row.status == '1002'">
                主体违规命中黑名单
              </div>
              <div v-else-if="scope.row.status == '1003'">
                管理员绑定账号数量达到上限
              </div>
              <div v-else-if="scope.row.status == '1004'">
                管理员违规命中黑名单
              </div>
              <div v-else-if="scope.row.status == '1005'">
                管理员手机绑定账号数量达到上限
              </div>
              <div v-else-if="scope.row.status == '1006'">
                管理员手机号违规命中黑名单
              </div>
              <div v-else-if="scope.row.status == '1007'">
                管理员身份证创建账号数量达到上限
              </div>
              <div v-else-if="scope.row.status == '1008'">
                管理员身份证违规命中黑名单”
              </div>
              <div v-else-if="scope.row.status == '-1'">
                企业与法人姓名不一致
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="注册状态" align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.status == 200"
                style="background-color: ##19be6b; color: #fff"
                >拓展成功</el-button
              >
              <el-button
                v-else
                style="background-color: #ff9900; color: #fff"
                >{{ scope.row.status }}</el-button
              >
            </template>
          </el-table-column>
          <!-- <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="handleClick(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
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
    <!-- 添加插件弹框 -->
    <el-dialog v-model="dialogVisible" title="选择用户" width="30%">
      <div style="display: flex; justify-content: center; align-items: center">
        <el-select
          v-model="userId"
          filterable
          placeholder="请选择用户"
          @change="change(userId)"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="edituser"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/registerApplet.vue";
import storage from "@/utils/storage";
import router from "@/router";

const data = ref({
  formModeProps: {
    visible: false,
    id: "",
  },
});
// 下拉信息
const options = [
  {
    value: "0",
    label: "统一社会信用代码（18 位）",
  },
  {
    value: "1",
    label: "组织机构代码（9 位 xxxxxxxx-x）",
  },
  {
    value: "2",
    label: "营业执照注册号(15 位)",
  },
];
const userId = ref("");
const dialogVisible = ref(false);

const userList: any = ref([]);
const plugsList: any = ref([]);

onMounted(() => {
  // 获取用户列表
  api
    .get("/api/admin/searchAdminUserList", {
      params: {
        page: 1,
        size: 10000,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        userList.value = res.body.list;
      }
    });
  api.get("/api/plugs/searchPlugsInfoList").then((res: any) => {
    if (res.code == 200) {
      plugsList.value = res.body.list;
    }
  });
  getlist();
});
// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const route = useRoute();
function getlist() {
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    keyword: tableobj.keyword,
    userServiceToken: storage.local.get("userServiceToken"),
  };

  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }

  api
    .get("/api/plugs/searchPlugsAppletExtensionList", { params: data })
    .then((res: any) => {
      tableData.value = res.body.list;
      total.value = res.body.total;
      tableobj.keyword = "";
    });
}

function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  getlist();
}
function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getlist();
}

// 新增插件
function addPlugin() {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsAppletExtension", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getlist();
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
// 删除插件
const handleClick = (e: any) => {
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      let data = {
        ids: e,
      };
      api.post("/api/plugs/delPlugsAppletExtension", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getlist();
        }
      });
    })
    .catch(() => {});
};
// 编辑插件
const editClick = (e: any) => {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = e;
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
const plugJson: any = ref([]);
const obj: any = ref({
  plugsName: "",
  plugsId: "",
});

const adduser = (item: any) => {
  dialogVisible.value = true;
  obj.value.plugsName = item.title;
  obj.value.plugsId = item.id;
};
const viewClick = (item: any) => {
  router.push({
    name: "contentlist",
    params: {
      id: item,
    },
  });
};

const change = (val: any) => {
  api
    .get("/api/admin/searchAdminUserById", {
      params: {
        id: val,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        let arr: any = [];
        arr = JSON.parse(res.body.plugJson);
        arr.push(obj.value);
        plugJson.value = arr;
      }
    });
};
// 时间转换
function formatDate(row: any, column: any, cellValue: any, index: any) {
  if (cellValue == null || cellValue == "") return "";
  let date = new Date(parseInt(cellValue)); //时间戳为10位需*1000，如果为13位的话不需乘1000。
  let Y = date.getFullYear() + "-";
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1) + "-"
      : date.getMonth() + 1 + "-";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  let h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  let m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
const edituser = (item: any) => {
  let data = {
    id: userId.value,
  };
  api
    .get("/api/admin/searchAdminUserById", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        res.body.plugJson = JSON.stringify(plugJson.value);
        http.post("/api/admin/updateAdminUser", res.body).then((ree: any) => {
          if (ree.code == 200) {
            ElMessage.success({
              message: res.msg,
              center: true,
            });
            dialogVisible.value = false;
            userId.value = "";
            getlist();
          }
        });
      }
    });
};
</script>

<style scoped lang="scss">
.container {
  padding: 10px;
}

.content {
  padding: 10px;
  background-color: #fff;

  .header {
    display: flex;
    justify-content: space-between;

    // .header-left {
    // }

    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .lang {
        width: 120px;
        margin-right: 20px;
        height: 40px;
      }
    }
  }

  .example-pagination-block {
    margin-bottom: 16px;
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

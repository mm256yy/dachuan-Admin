<template>
  <div class="container">
    <div class="content" style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left"></div>
        <div style="display: flex">
          <el-select
            style="width: 100px; margin-right: 6px"
            v-model="Withdrawalstatus"
            @change="changeStatus"
            placeholder="提现状态"
          >
            <el-option key="-1" label="全部" value="-1" />
            <el-option key="0" label="待审核" value="0" />
            <el-option key="1" label="提现成功" value="1" />
            <el-option key="2" label="提现失败" value="2" />
          </el-select>
          <div class="lang">
            <el-input
              style=""
              v-model="tableobj.keyword"
              placeholder="请输入"
              @keyup.enter.native="getlist"
            />
          </div>
          <el-button
            type="primary"
            style="margin: 0 20px 0 30px"
            @click="getlist"
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
            background: '#f9f9f9',
            color: '#666',
            textAlign: 'center',
            height: '55px',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="60" />
          <!-- <el-table-column prop="plugsId" label="插件ID" align="center"  /> -->

          <!-- <el-table-column prop="icon" label="店铺logo" align="center">
              <template #default="scope">
                <img
                  style="width: 40px; height: 40px"
                  :src="scope.row.jsonViewData.businessLogo"
                  alt=""
                />
              </template>
            </el-table-column> -->
          <el-table-column prop="icon" label="店铺名称" align="center">
            <template #default="scope">
              {{ scope.row.withdrawJson.merchantWithdrawal.merchantName }}
            </template>
          </el-table-column>

          <el-table-column prop="title" label="店铺电话" align="center">
            <template #default="scope">
              {{ scope.row.withdrawJson.merchantWithdrawal.merchantMobile }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现账号" align="center">
            <template #default="scope">
              {{ scope.row.withdrawJson.merchantWithdrawal.withdrawalAccount }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现金额" align="center">
            <template #default="scope">
              {{ scope.row.withdrawMoney }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="title" label="备注信息" align="center">
              <template #default="scope">
                提货
              </template>
            </el-table-column> -->
          <el-table-column prop="title" label="提现时间" align="center">
            <template #default="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现状态" align="center">
            <template #default="scope">
              <el-select
                v-if="
                  scope.row.withdrawStatus === 0 ||
                  scope.row.withdrawStatus === 2
                "
                style="width: 100px"
                v-model="scope.row.withdrawStatus"
                placeholder="提现状态"
                @change="
                  (value) => {
                    changeState(value, scope.row);
                  }
                "
              >
                <el-option :key="0" label="待审核" :value="0" />
                <el-option :key="1" label="提现成功" :value="1" />
                <el-option :key="2" label="提现失败" :value="2" />
              </el-select>
              <el-select
                v-else
                style="width: 100px"
                v-model="scope.row.withdrawStatus"
                disabled
                placeholder="提现状态"
              >
                <el-option :key="0" label="待审核" :value="0" />
                <el-option :key="1" label="提现成功" :value="1" />
                <el-option :key="2" label="提现失败" :value="2" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="160"
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
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.row.id)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
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
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import http from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import storage from "../../../utils/storage";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// const tabbar = useTabbar();
const Withdrawalstatus: any = ref("0");
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
});
// 下拉信息

onMounted(() => {
  getlist();
});

// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj: any = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});

const Status: any = ref(-1);
function changeStatus(val: any) {
  Status.value = val;
}
function getlist() {
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
    keyword: tableobj.keyword,
    publicStatus: Status.value,
  };

  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/user/searchUserWithdrawList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        tableData.value.forEach((item: any) => {
          if (item.withdrawJson) {
            item.withdrawJson = JSON.parse(item.withdrawJson);
          }
        });
        total.value = res.body.total;
      }
    });
}
function changeState(val: any, val2: any) {
  const data = {
    adminId: val2.adminId,
    businessId: val2.businessId,
    extJson: val2.extJson,
    id: val2.id,
    nonceStr: val2.nonceStr,
    outPayNo: val2.outPayNo,
    payNo: val2.payNo,
    payTime: val2.payTime,
    userId: val2.userId,
    userName: val2.userName,
    userServiceToken: val2.userServiceToken,
    withdrawJson: val2.withdrawJson,
    withdrawMoney: val2.withdrawMoney,
    withdrawNo: val2.withdrawNo,
    withdrawStatus: val,
    withdrawType: 2,
    withdrawWay: 0,
  };
  data.withdrawJson = JSON.stringify(data.withdrawJson);
  ElMessageBox.confirm(`确认修改此记录吗？`, "提现提示")
    .then(() => {
      api.post("/api/user/updateUserWithdraw", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: "修改成功",
            center: true,
          });
          getlist();
        }
      });
    })
    .catch(() => {});
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
  router.push({
    name: "addbusinessPlug",
    params: {
      plugsId: 135,
    },
  });
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
      api.post("/api/user/delUserWithdraw", data).then((res: any) => {
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
  let data = {
    ids: e,
  };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/user/delUserWithdraw", data).then((res: any) => {
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
};
// 编辑插件
const editClick = (e: any) => {
  router.push({
    name: "editbusinessPlug",
    params: {
      id: e,
      plugsId: route.params.id,
    },
  });
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
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

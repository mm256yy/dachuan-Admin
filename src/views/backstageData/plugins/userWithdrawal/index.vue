<route lang="yaml">
name: homeRotation
meta:
  title: 用户提现
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <!-- <el-button type="primary" @click="addPlugin">
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增陪诊员
          </el-button> -->

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
              style="width: 150px"
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
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="70" />

          <el-table-column prop="title" label="申请人姓名" align="center">
            <template #default="scope">
              <div>{{ scope.row.userName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现渠道" align="center">
            <template #default="scope">
              <div v-if="scope.row.withdrawWay == 0">支付宝</div>
              <div v-if="scope.row.withdrawWay == 1">微信</div>
              <div v-if="scope.row.withdrawWay == 2">银行卡</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现账户姓名" align="center">
            <template #default="scope">
              <div>{{ scope.row.withdrawJson.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现账户" align="center">
            <template #default="scope">
              <div>{{ scope.row.withdrawJson.account }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="提现金额" align="center">
            <template #default="scope">
              <div>{{ scope.row.withdrawMoney }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="提现状态" align="center">
            <template #default="scope">
              <div v-if="scope.row.withdrawStatus == '0'">审核中</div>
              <div v-if="scope.row.withdrawStatus == '1'">审核成功</div>
              <div v-if="scope.row.withdrawStatus == '2'">审核失败</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="申请时间" align="center">
            <template #default="scope">
              <div>{{ scope.row.createTime }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="shenheClick(scope.row)"
                >审核</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                @click="handleClick(scope.row.id)"
                >删除</el-button
              >

              <!-- <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.row.id)"
                >编辑</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        v-model="dialogVisible"
        title="预览"
        width="50%"
        :before-close="handleClose"
      >
        <div style="padding-left: 10px">
          <img style="width: 100%; height: 100%" :src="imgsrc" alt="" />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
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
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      :plugsId="data.formModeProps.plugsId"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/index.vue";
import storage from "@/utils/storage";
const route = useRoute();
const dialogVisible = ref(false);
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
});

onMounted(() => {
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
const userServiceToken = ref(storage.local.get("userServiceToken"));
console.log(userServiceToken.value, 987777);

function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
    keyword: tableobj.keyword,
  };
  api
    .get("/api/user/searchUserWithdrawList", { params: data })
    .then((res: any) => {
      tableData.value = res.body.list;
      tableData.value.forEach((item: any) => {
        if (item.withdrawJson) {
          item.withdrawJson = JSON.parse(item.withdrawJson);

          // item.userAlipay = JSON.parse(item.withdrawJson).userAlipay;
        }
      });
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
  data.value.formModeProps.plugsId = route.params.id;
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
  console.log();
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
// 审核
const shenheClick = (e: any) => {
  console.log(e);

  ElMessageBox.confirm(`确认审核通过成功？`, "审核信息")
    .then(() => {
      e.withdrawStatus = "1";
      e.withdrawJson = JSON.stringify(e.withdrawJson);
      http.post("/api/user/updateUserWithdraw", e).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: "审核成功",
            center: true,
          });
          getlist();
        } else {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
};
// 删除插件
const handleClick = (e: any) => {
  console.log(e);
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
        }
      });
    })
    .catch(() => {});
};
// 编辑插件
const editClick = (e: any) => {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = e;
  data.value.formModeProps.plugsId = route.params.id;
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
const imgsrc: any = ref("");
// 查看图片
const lookImg = (src: any) => {
  imgsrc.value = src;
  dialogVisible.value = true;
};
const handleClose = (done: () => void) => {
  dialogVisible.value = false;
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

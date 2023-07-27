<route lang="yaml">
name: homeRotation
meta:
  title: 优惠券
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 10px">
        <div class="header-left">
          <el-button
            type="primary"
            @click="addPlugin"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增员工账号
          </el-button>
          <!-- <el-button
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
            </el-button> -->
        </div>
        <!-- <div style="display: flex">
            <div class="lang">
              <el-input
                style="width: 150px"
                v-model="tableobj.keyword"
                placeholder="请输入"
                @keyup.enter.native=""
              />
            </div>
            <el-button
              type="primary"
              style="margin: 0 20px 0 30px"
              @click=""
            >
              <template #icon>
                <el-icon>
                  <svg-icon name="i-ep:search" />
                </el-icon>
              </template>
              搜索
            </el-button>
          </div> -->
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
          <!-- <el-table-column type="selection" /> -->
          <el-table-column label="员工姓名" align="center" width="200">
            <template #default="scope">
              <div>{{ scope.row.realname }}</div>
            </template>
          </el-table-column>
          <el-table-column label="登录账号" align="center" width="200">
            <template #default="scope">
              <div>{{ scope.row.mobile }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="员工备注"
            align="center"
            show-overflow-tooltip
            width="440"
          >
            <template #default="scope">
              <div>{{ scope.row.remark }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="管理店铺"
            align="center"
            show-overflow-tooltip
            width="300"
          >
            <template #default="scope">
              <div>{{ JSON.parse(scope.row.businessListJson).length }}个</div>
            </template>
          </el-table-column>
          <el-table-column
            label="最后登录"
            align="center"
            show-overflow-tooltip
            width="300"
          >
            <template #default="scope">
              <div>{{ scope.row.lastLoginTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
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
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      :plugsId="data.formModeProps.plugsId"
      :newmobile="data.formModeProps.newmobile"
      @success="update"
    />
  </div>
</template>
<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/homeRotation.vue";
import type { TabsPaneContext } from "element-plus";
import storage from "@/utils/storage";
const route = useRoute();
const activeName = ref("first");
const businessList: any = ref([]);
const businessId: any = ref("");
const recordList: any = ref([]);
const newmobile: any = ref();
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
    newmobile: "",
  },
});

onMounted(() => {
  getlist();
  getDianpu();
});
// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const form = ref({
  adminId: "",
  configType: "",
  userServiceToken: "",
  plugsId: "",
  jsonViewData: {},
  plugsConfigJson: "",
});

const userServiceToken = ref(storage.local.get("userServiceToken"));
function getDianpu() {
  api.get("/api/plugs/getBusinessInfo").then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });
}

function getlist() {
  let data: any = {
    adminId: storage.local.get("adminId"),
    page: tableobj.currentPage,
    // userServiceToken: storage.local.get("userServiceToken"),
    // id: route.params.id
    // keyword: tableobj.keyword,
  };
  api.post("/api/admin/getAdminSubAccountrList", data).then((res: any) => {
    if (res.body) {
      let data2 = res.body;
      total.value = res.body.total;
      tableData.value = res.body.list;
      if (data2.pages == 1) {
        newmobile.value = tableData.value[0].mobile;
      }
    }
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
  data.value.formModeProps.newmobile = newmobile.value;
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

const delPlugin = (index: any) => {
  let data = {
    ids: idlist.value.join(),
  };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsCoupons", data).then((res: any) => {
        if (res.code == 200) {
          getlist();
          ElMessage.success({
            message: "删除成功",
            center: true,
          });
        } else {
          ElMessage.error({
            message: "删除失败",
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
      let postData = `ids=${e}`;
      http.post("/api/admin/delAdminUser", postData).then((res: any) => {
        getlist();
        ElMessage.success({
          message: "删除成功",
          center: true,
        });
      });
    })
    .catch(() => {});
};
// 编辑插件
const editClick = (e: any) => {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = e;
  data.value.formModeProps.plugsId = route.params.id;
  data.value.formModeProps.newmobile = newmobile.value;
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

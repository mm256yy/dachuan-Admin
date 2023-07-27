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
            新增店铺账号
          </el-button>
        </div>
        <div style="display: flex">
          <el-select
            style="width: 100px; margin-right: 6px"
            v-model="Withdrawalstatus"
            placeholder="账号状态"
          >
            <el-option key="0" label="全部" value="0" />
            <el-option key="1" label="启用" value="1" />
            <el-option key="2" label="禁用" value="2" />
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
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
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
          <el-table-column prop="icon" label="用户身份" align="center">
            <template #default="scope"> 管理员 </template>
          </el-table-column>
          <el-table-column prop="title" label="用户姓名" align="center">
            <template #default="scope"> 小一 </template>
          </el-table-column>
          <el-table-column prop="title" label="用户电话" align="center">
            <template #default="scope"> 17710553679 </template>
          </el-table-column>

          <el-table-column prop="title" label="备注信息" align="center">
            <template #default="scope"> 提货 </template>
          </el-table-column>
          <el-table-column prop="title" label="最后登录ip" align="center">
            <template #default="scope"> 36.21.131.81 </template>
          </el-table-column>
          <el-table-column prop="title" label="最后登录时间" align="center">
            <template #default="scope"> 2023-07-19 09:06:41 </template>
          </el-table-column>
          <el-table-column prop="title" label="账号状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="value6"
                class="ml-2"
                width="60"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
              />
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
import api from "../../../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import storage from "../../../utils/storage";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();

const router = useRouter();

//   const tabbar = useTabbar();
// 搜索
const value6: any = ref(true);
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

function getlist() {
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
    keyword: tableobj.keyword,
  };

  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }

  api
    .get("/api/plugs/searchPlugsDataList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        total.value = res.body.total;
        tableobj.keyword = "";
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
      api.post("/api/plugs/delPlugsData", data).then((res: any) => {
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
      api.post("/api/plugs/delPlugsData", data).then((res: any) => {
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

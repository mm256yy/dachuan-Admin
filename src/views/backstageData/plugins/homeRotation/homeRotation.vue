<route lang="yaml">
name: homeRotation
meta:
  title: 首页轮播
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <div class="content" style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
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
            新增轮播
          </el-button>

          <el-button
            type="primary"
            @click="addPlugin"
            v-if="userServiceToken == 'PO5159ATBWNAPEXVKDK6E'"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增法规
          </el-button>
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
            background: '#f9f9f9',
            color: '#666',
            textAlign: 'center',
            height: '55px',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="70" />

          <el-table-column
            prop="icon"
            label="封面连接"
            align="center"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          >
            <template #default="scope">
              <img
                style="width: 40px; height: 40px"
                :src="scope.row.activityImgUrl"
                alt=""
              />
            </template>
          </el-table-column>
          <!-- <el-table-column prop="detailsId" label="跳转ID" align="center" /> -->

          <!-- <el-table-column
            prop="detailsImgAndPageUrl"
            label="详情页跳转连接"
            align="center"
          /> -->
          <!-- <el-table-column prop="extJson" label="扩展数据JSON" align="center" /> -->
          <!-- <el-table-column
            prop="jumpPosition"
            label="跳转位置"
            align="center"
          /> -->
          <!-- <el-table-column prop="plugsId" label="插件ID" align="center" /> -->
          <!-- <el-table-column prop="showHide" label="	是否显示" align="center" /> -->
          <el-table-column
            prop="title"
            label="推荐位名称"
            align="center"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          />
          <el-table-column
            prop="type"
            label="推荐位类型"
            align="center"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          />
          <el-table-column
            prop="title"
            label="法规名称"
            align="center"
            v-if="userServiceToken == 'PO5159ATBWNAPEXVKDK6E'"
          />
          <!-- <el-table-column
            prop="userServiceToken"
            label="	用户服务标识"
            align="center"
          /> -->
          <!-- <el-table-column prop="plugsStatus" label="状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.plugsStatus"
                :active-value="0"
                :inactive-value="1"
                size="large"
              />
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="120">
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
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/homeRotation.vue";
import storage from "@/utils/storage";
const route = useRoute();

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

function getlist() {
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id,
    keyword: tableobj.keyword,
  };
  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/plugs/searchPlugsRecommendedList", { params: data })
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
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsRecommended", data).then((res: any) => {
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
      api.post("/api/plugs/delPlugsRecommended", data).then((res: any) => {
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

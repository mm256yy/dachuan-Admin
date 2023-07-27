<route lang="yaml">
name: homeRotation
meta:
  title: 首页轮播
  icon: ant-design:home-twotone
</route>
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
            新增陪诊员
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
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="70" />

          <el-table-column prop="title" label="申请人姓名" align="center">
            <template #default="scope">
              <div>{{ scope.row.jsonViewData.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="申请人性别" align="center">
            <template #default="scope">
              <div>{{ scope.row.jsonViewData.sex }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="申请人电话" align="center">
            <template #default="scope">
              <div>{{ scope.row.jsonViewData.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="申请人身份证号" align="center">
            <template #default="scope">
              <div>{{ scope.row.jsonViewData.idCard }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="申请人身份证正面照片"
            align="center"
          >
            <template #default="scope">
              <div>
                <img
                  style="width: 100px; height: 50px"
                  :src="scope.row.jsonViewData.idCarImageFront"
                  @click="lookImg(scope.row.jsonViewData.idCarImageFront)"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="申请人身份证反面照片"
            align="center"
          >
            <template #default="scope">
              <div>
                <img
                  style="width: 100px; height: 50px"
                  :src="scope.row.jsonViewData.idCarImageOpposite"
                  @click="lookImg(scope.row.jsonViewData.idCarImageOpposite)"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="审核是否成功" align="center">
            <template #default="scope">
              <div v-if="scope.row.jsonViewData.examineStatus == '0'">
                未审核
              </div>
              <div v-if="scope.row.jsonViewData.examineStatus == '1'">
                审核成功
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
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
// 审核
const shenheClick = (e: any) => {
  ElMessageBox.confirm(`确认让其成为陪诊员吗？`, "审核信息")
    .then(() => {
      e.jsonViewData.examineStatus = "1";
      e.jsonData = JSON.stringify(e.jsonViewData);
      http.post("/api/plugs/updatePlugsData", e).then((res: any) => {
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

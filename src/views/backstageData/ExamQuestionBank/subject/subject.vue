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
            新增科目
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
              placeholder="科目名称"
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
          <el-table-column prop="subjectName" label="科目名称" align="center" />
          <el-table-column prop="classId" label="所属班级" align="center">
            <template #default="scope">
              <div v-if="scope.row.plugsPracticeClass">
                {{ scope.row.plugsPracticeClass.className }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="categoryDesc"
            label="题库数量"
            align="center"
          />
          <el-table-column
            prop="categoryDesc"
            label="学员数量"
            align="center"
          />
          <el-table-column
            prop="createTime"
            label="添加/更新时间"
            align="center"
          />

          <el-table-column prop="status" label="科目状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                inline-prompt
                :inactive-value="0"
                inactive-text="禁用"
                :active-value="1"
                active-text="启用"
                size="large"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column label="练习记录" width="120" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="viewClick(scope.row.id)"
                >练习记录</el-button
              >
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
import FormMode from "./components/index.vue";
import storage from "@/utils/storage";
const router = useRouter();
const route = useRoute();
// 搜索

const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: 143,
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
    .get("/api/plugs/searchPlugsPracticeSubjectList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        total.value = res.body.total;
        tableobj.keyword = "";
      } else {
        ElMessage.success({
          message: res.msg,
          center: true,
        });
      }
      // console.log(tableData.value, 123);
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

// 新增
function addPlugin() {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
  data.value.formModeProps.plugsId = 143;
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
      api.post("/api/plugs/delPlugsPracticeSubject", data).then((res: any) => {
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
// 删除
const handleClick = (e: any) => {
  console.log(e);
  let data = {
    ids: e,
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsPracticeSubject", data).then((res: any) => {
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
  data.value.formModeProps.plugsId = 143;
};
const viewClick = (e: any) => {
  router.push({
    name: "practivelist",
    params: {
      id: e,
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

<template>
  <div class="container">
    <div class="content" style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button type="primary" @click="addPlugin">
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增试题
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
              placeholder="班级名称"
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
          <!-- <el-table-column
            prop="questionType"
            label="试题类型"
            align="center"
          /> -->

          <el-table-column prop="questionType" label="试题类型" align="center">
            <template #default="scope">
              <div v-if="scope.row.questionType == 0">判断题</div>
              <div v-if="scope.row.questionType == 1">单选题</div>
              <div v-if="scope.row.questionType == 2">多选题</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="questionStemExtJson"
            label="试题题干"
            align="center"
            width="500"
          >
            <template #default="scope">
              <div
                v-html="scope.row.questionStemExtJson.testQuestionsContent"
              ></div>
            </template>
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="添加/更新时间"
            align="center"
          />

          <el-table-column prop="status" label="班级状态" align="center">
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
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
import storage from "@/utils/storage";
const route = useRoute();
const router = useRouter();

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
    .get("/api/plugs/searchPlugsPracticeTestQuestionsManageList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        tableData.value.forEach((item: any) => {
          item.questionStemExtJson = JSON.parse(item.questionStemExtJson);
        });
        total.value = res.body.total;
        tableobj.keyword = "";
      } else {
        ElMessage.success({
          message: res.msg,
          center: true,
        });
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

// 新增
function addPlugin() {
  router.push({
    name: "addTestquestions",
    params: {
      id: 0,
    },
  });
}
// 编辑
const editClick = (e: any) => {
  router.push({
    name: "addTestquestions",
    params: {
      id: e,
    },
  });
};

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
      api
        .post("/api/plugs/delPlugsPracticeTestQuestionsManage", data)
        .then((res: any) => {
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
  let data = {
    ids: e,
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api
        .post("/api/plugs/delPlugsPracticeTestQuestionsManage", data)
        .then((res: any) => {
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

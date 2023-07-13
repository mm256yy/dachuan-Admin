<template>
  <div class="container">
    <div class="content" style="width: 50%">
      <div class="main">
        <el-scrollbar height="64vh">
          <el-table
            :data="tableData1"
            style="width: 100%"
            :header-cell-style="{
              background: '#f3f6fd',
              color: '#555',
              textAlign: 'center',
            }"
          >
            <el-table-column type="index" />

            <el-table-column
              prop="questionType"
              label="试题类型"
              align="center"
            >
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
            >
              <template #default="scope">
                <div
                  v-html="scope.row.questionStemExtJson.testQuestionsContent"
                ></div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="" align="center">
              <template #default="scope">
                <div style="color: red" @click="del(scope.row.$index)">
                  删除
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>

        <div style="display: flex; justify-content: center">
          <el-button
            type="primary"
            style="margin: 0 20px 0 30px"
            @click="addpaperlist"
          >
            保存试卷
          </el-button>
        </div>
      </div>
    </div>

    <div class="content" style="width: 40%; background-color: #fff">
      <div style="display: flex; padding: 20px; justify-content: space-between">
        <div style="display: flex; justify-content: space-between">
          <div class="lang">
            <el-input
              style="width: 150px"
              v-model="tableobj.keyword"
              placeholder="试题关键字"
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

        <div>
          <el-button
            type="primary"
            style="margin: 0 20px 0 30px"
            @click="addpaper"
          >
            加入考卷
          </el-button>
        </div>
      </div>

      <div class="main">
        <el-scrollbar height="60vh">
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
            <el-table-column
              prop="questionType"
              label="试题类型"
              align="center"
            >
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
            >
              <template #default="scope">
                <div
                  v-html="scope.row.questionStemExtJson.testQuestionsContent"
                ></div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
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
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
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

const form: any = ref({});
onMounted(() => {
  api
    .get("/api/plugs/searchPlugsPracticeTestPaperById", {
      params: {
        id: route.params.id,
      },
    })
    .then((res: any) => {
      form.value = res.body;
      if (res.body.questionsJson) {
        tableData1.value = JSON.parse(res.body.questionsJson);
      }
    });
  getlist();
});
// 获取表格信息
const tableData: any = ref([]);
const tableData1: any = ref([]);

const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 50,
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

// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  console.log(val);

  multipleSelection.value = val;
  // idlist.value = multipleSelection.value.map((item: any) => {
  //   return item.id;
  // });
  // console.log();
};
const addpaper = () => {
  multipleSelection.value.forEach((item: any) => {
    tableData1.value.push(item);
  });
  multipleSelection.value = [];
};
const del = (index: any) => {
  tableData1.value.splice(index, 1);
};

const tabbar = useTabbar();

const addpaperlist = () => {
  form.value.questionsJson = JSON.stringify(tableData1.value);
  http
    .post("/api/plugs/updatePlugsPracticeTestPaper", form.value)
    .then((res: any) => {
      if (res.code == 200) {
        ElMessage.success({
          message: "保存成功",
          center: true,
        });

        tabbar.close({ name: "configuration" });
        router.push({
          name: "examinationpaper",
        });
      }
    });
};
</script>
<style scoped lang="scss">
.container {
  padding: 20px 50px;
  display: flex;
  justify-content: space-between;
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

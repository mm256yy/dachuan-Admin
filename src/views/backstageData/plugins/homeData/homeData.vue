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
            添加首页
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
      </div>
      <div class="main">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" />
          <el-table-column
            prop="jsonData"
            show-overflow-tooltip
            label="数据"
            align="center"
          />
          <el-table-column prop="plugsId" label="插件ID" align="center" />
          <el-table-column prop="businessId" label="店铺" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.businessId" disabled>
                <el-option key="0" label="全部" value="0" />
                <el-option
                  v-for="item in businessList"
                  :key="item.businessId"
                  :label="item.businessName"
                  :value="item.businessId"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
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
      <div
        style="
          display: flex;
          align-items: center;
          margin-top: 30px;
          justify-content: center;
        "
      >
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
    <!-- <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      @success="update" -->
    <!-- /> -->
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";
// import FormMode from "../components/DetailForm/index.vue";
import storage from "@/utils/storage";
const router = useRouter();
const route = useRoute();
// 搜索
const selectForm: any = reactive({
  type: "",
  name: "",
  value: "",
});

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
    label: "全部类型",
  },
  {
    value: "1",
    label: "店铺相关",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];

onMounted(() => {
  getlist();
});
// 获取表格信息
let tableData: any = ref([
  // {
  //   id: 105,
  //   title: "22",
  //   icon: "",
  //   plugsDescribe: "33",
  //   plugsType: "66",
  //   paths: "55",
  //   plugsStatus: 0,
  //   authIdentification: "44",
  // },
]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
});
const businessList: any = ref([]);
function getlist() {
  let datas = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api.get("/api/plugs/getBusinessInfo", { params: datas }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
      console.log(businessList.value, 456);
    }
  });
  let data: any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),

    id: route.params.id,
  };
  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/plugs/searchPlugsHomeDataList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;

        tableData.value.forEach((item: any) => {
          item.businessId = item.businessId.toString();
        });
        total.value = res.body.total;
      } else {
        ElMessage.error({
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
    name: "addHomeData",
    params: {
      plugsId: route.params.id,
    },
  });
  // data.value.formModeProps.visible = true;
  // data.value.formModeProps.id = "";
}
// 编辑
const editClick = (e: any) => {
  router.push({
    name: "editHomeData",
    params: {
      id: e,
      plugsId: route.params.id,
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
  console.log();
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsHomeData", data).then((res: any) => {
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
// 删除
const handleClick = (e: any) => {
  let data = {
    ids: e,
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsHomeData", data).then((res: any) => {
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
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

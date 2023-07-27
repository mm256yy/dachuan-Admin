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
            添加配置数据
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
          <!-- <el-button
            type="primary"
            @click="delPlugin"
            :disabled="!multipleSelection.length"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            每日库存
          </el-button>
          <el-button
            type="primary"
            @click="delPlugin"
            :disabled="!multipleSelection.length"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            批量导入
          </el-button> -->
        </div>
        <div class="header-right">
          <!-- <div class="lang">
            <el-select
              v-model="selectForm.type"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="lang">
            <el-select
              v-model="selectForm.name"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div> -->
          <div class="lang">
            <el-input
              style="width: 150px; height: 40px"
              v-model="selectForm.value"
              placeholder="名称"
            />
          </div>
          <el-button
            type="primary"
            style="height: 40px; margin: 0 20px 0 30px"
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
            prop="configType"
            label="configType数据类型"
            align="center"
          />
          <el-table-column
            prop="jsonDataView"
            label="jsonDataView"
            align="center"
          />

          <el-table-column
            prop="plugsConfigJson"
            show-overflow-tooltip
            label="数据"
            align="center"
          />
          <el-table-column prop="plugsId" label="插件ID" align="center" />
          <el-table-column
            prop="userServiceToken"
            label="标识"
            align="center"
          />
          <el-table-column fixed="right" label="操作" width="150">
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
      <div style="display: flex; align-items: center; margin-top: 30px">
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
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import { ElMessage } from "element-plus";
// import FormMode from "./components/DetailForm/index.vue";
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

function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    // adminId: storage.local.get("adminId"),
    keyword: selectForm.value,
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
  };
  api
    .get("/api/plugs/searchPlugsConfigListByPlugsId", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
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
    name: "addcontentlist",
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
    name: "editcontentlist",
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
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  // ids.push(idlist.value);
  api.post("/api/plugs/delPlugsConfig", data).then((res: any) => {
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
};
// 删除
const handleClick = (e: any) => {
  let data = {
    ids: e,
  };
  api.post("/api/plugs/delPlugsConfig", data).then((res: any) => {
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

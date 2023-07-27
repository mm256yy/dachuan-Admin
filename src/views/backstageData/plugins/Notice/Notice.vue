<route lang="yaml">
name: homeRotation
meta:
  title: 优惠券
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
            新增
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
          <div style="margin-right: 30px">
            <el-select
              v-model="selbusinessId"
              style="width: 200px"
              filterable
              placeholder="选择店铺"
            >
              <!-- <el-select
                    v-model="form.businessId"
                    style="width: 480px"
                    filterable
                    placeholder="选择店铺(一个或多个)"
                    @change=""
                  > -->
              <el-option key="-1" label="全部" value="-1" />
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
          </div>
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
          <el-table-column label="公告标题" align="center">
            <template #default="scope">
              <div>{{ scope.row.title }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="公告类型"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="添加/更新时间" align="center">
            <template #default="scope">
              <div>{{ scope.row.updateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="所属店铺" align="center">
            <template #default="scope">
              <div v-for="item in businessList" :key="item.businessId">
                <div v-if="item.businessId == scope.row.businessId">
                  {{ item.businessName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="公告状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.showHide"
                @change="changeshowHide(scope.row)"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="显示"
                inactive-text="关闭"
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
    <!-- <FormMode
          v-if="data.formModeProps.visible"
          v-model="data.formModeProps.visible"
          :id="data.formModeProps.id"
          :plugsId="data.formModeProps.plugsId"
          @success="update"
        /> -->
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
// import FormMode from "./components/homeRotation.vue";
import storage from "@/utils/storage";
const route = useRoute();
const router = useRouter();
const businessList: any = ref([]);
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
});

onMounted(() => {
  getlist();
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  // 获取店铺
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        businessList.value.push(item.jsonViewData);
      });
    }
  });
});
// 获取表格信息
let tableData: any = ref([]);
const selbusinessId: any = ref("-1");
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
    // adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.plugsId,
    keyword: tableobj.keyword,
    businessId: selbusinessId.value,
  };
  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }
  api
    .get("/api/plugs/searchPlugsNoticeList", { params: data })
    .then((res: any) => {
      tableData.value = res.body.list;
      total.value = res.body.total;
    });
}
function changeshowHide(val: any) {
  http.post("/api/plugs/updatePlugsNotice", val).then((res: any) => {
    if (res.code == 200) {
      ElMessage.success({
        message: "修改成功状态成功",
        center: true,
      });
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
// 格式化日期
function formatDate(value: any) {
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = (date.getMonth() + 1) as number;
  MM = MM < 10 ? (("0" + MM) as unknown as number) : MM;
  let d = date.getDate();
  d = d < 10 ? (("0" + d) as unknown as number) : d;
  let h = date.getHours();
  h = h < 10 ? (("0" + h) as unknown as number) : h;
  let m = date.getMinutes();
  m = m < 10 ? (("0" + m) as unknown as number) : m;
  let s = date.getSeconds();
  s = s < 10 ? (("0" + s) as unknown as number) : s;
  return y + "-" + MM + "-" + d;
  // y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}
// 新增插件
function addPlugin() {
  //   data.value.formModeProps.visible = true;
  //   data.value.formModeProps.id = "";
  //   data.value.formModeProps.plugsId = route.params.id;
  router.push({
    name: "addNotice",
    params: {
      plugsId: 182,
      id: "",
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
      api.post("/api/plugs/delPlugsNotice", data).then((res: any) => {
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
      api.post("/api/plugs/delPlugsNotice", data).then((res: any) => {
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
  router.push({
    name: "editNotice",
    params: {
      id: e,
      plugsId: 182,
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

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
          <div class="lang" style="display: flex; align-items: center">
            <el-date-picker
              size="default"
              v-model="value2"
              @change="changeTime2"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-select
              style="margin: 0 20px"
              size="default"
              v-model="businessId"
              filterable
              placeholder="选择店铺"
              @change="changeStore(businessId)"
            >
              <el-option key="-1" label="全部" value="-1" />
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
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

          <el-table-column
            prop="userName"
            label="用户昵称"
            align="center"
            width="100"
          />

          <el-table-column
            prop="consumptionMoney"
            label="买单金额"
            align="center"
          >
            <template #default="scope">
              <div>{{ scope.row.consumptionMoney }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="businessId
"
            label="买单门店"
            align="center"
          >
            <template #default="scope">
              <div v-for="item in businessList" :key="item.id">
                <div
                  v-if="
                    scope.row.businessId == item.businessId &&
                    scope.row.businessId != null
                  "
                >
                  {{ item.businessName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="payWay
"
            label="支付方式"
            align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.payWay == 0">支付宝</div>
              <div v-else-if="scope.row.payWay == 1">微信</div>
              <div v-else-if="scope.row.payWay == 2">余额</div>
              <div v-else-if="scope.row.payWay == 3">微信加余额</div>
              <div v-else-if="scope.row.payWay == 5">优惠买单</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime
"
            label="买单时间"
            align="center"
          >
            <template #default="scope">
              <div>{{ scope.row.createTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="payRecordStatus
"
            label="支付状态"
            align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.payRecordStatus == 0">待支付</div>
              <div v-else-if="scope.row.payRecordStatus == 1">支付中</div>
              <div v-else-if="scope.row.payRecordStatus == 2">支付成功</div>
              <div v-else-if="scope.row.payRecordStatus == 3">支付失败</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
                prop=""
                label="申请时间"
                align="center"
              >
                <template #default="scope">
                  <div>{{ scope.row.createTime
}}</div>
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
                >查看</el-button
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
            :page-size="tableobj.size"
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
  getStoreList();
});
// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  size: 10,
  keyword: "",
});
const userServiceToken = ref(storage.local.get("userServiceToken"));
const value2: any = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
]);
// const list3=ref([])
// const value2 = ref('')
const startime: any = ref("");
const endtime: any = ref("");
function changeTime2(val: any) {
  if (!val) {
    value2.value = new Date();
    startime.value = "";
    endtime.value = "";
  } else {
    startime.value = value2.value[0];
    endtime.value = value2.value[1];
  }
}
const businessId: any = ref("-1");
const businessList: any = ref([]);
function changeStore(val: any) {
  businessId.value = val;
  // getlist();
}
function getStoreList() {
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
        getlist();
      });
    }
  });
}
function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.size,
    businessId: businessId.value,
    // adminId: storage.local.get("adminId"),
    startDateTime: startime.value,
    endDateTime: endtime.value,
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
    keyword: tableobj.keyword,
  };
  api
    .get("/api/user/searchConsumptionRecordList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        let data = res.body.list;
        data.forEach((item: any) => {
          item.businessId = JSON.parse(JSON.stringify(item.businessId));
        });
        tableData.value = data;
        total.value = res.body.total;
        tableobj.keyword = "";
      }
    });
}

function handleSizeChange(val: any) {
  tableobj.size = val;
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
      api.post("/api/user/delConsumptionRecord", data).then((res: any) => {
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
      api.post("/api/user/delConsumptionRecord", data).then((res: any) => {
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

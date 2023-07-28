<template>
  <div class="container">
    <div class="content" style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button type="primary" @click="addPlugin">
            <template #icon>
              <el-icon>
                <svg-icon name="ep:circle-plus" />
              </el-icon>
            </template>
            添加
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
        <div class="header-right">
          <!-- 选项店铺 -->
          <div class="lang">
            <el-select
              v-model="businessId"
              filterable
              placeholder="选择店铺
            "
            >
              <el-option :key="0" label="全部" :value="-1" />
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
          <el-button type="primary" @click="getlist">
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
            background: '#f9f9f9',
            color: '#666',
            textAlign: 'left',
            height: '55px',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="left" width="80" />
          <el-table-column
            prop="rotationImgsJson"
            label="商品"
            align="left"
            width="100"
          >
            <template #default="scope">
              <div>
                <img
                  v-if="scope.row.previewUrl"
                  style="width: 50px; height: 50px"
                  :src="scope.row.previewUrl"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="goodsName" label="商品名称" width="380">
            <template #default="scope">
              <div
                style="
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                  margin-bottom: 4px;
                "
              >
                <div>{{ scope.row.goodsName }}</div>
              </div>
              <div>
                <el-tag v-if="scope.row.goodsType == 0" class="ml-2" type="info"
                  >普通商品</el-tag
                >
                <el-tag v-else class="ml-2" type="info">积分商品</el-tag>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="goodsPrice" label="商品价格" align="center" /> -->

          <el-table-column prop="categoryId" label="商品分类" align="left">
            <template #default="scope">
              <div v-if="!scope.row.categoryName">全部</div>
              <div v-else>{{ scope.row.categoryName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="stockNum" label="价格/库存" align="left">
            <template #default="scope">
              <div style="display: flex; flex-direction: column">
                <div>商品价格：{{ scope.row.goodsPrice }}</div>
                <div>库存数量：{{ scope.row.stockNum }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="stockNum" label="数据" align="left">
            <template #default="scope">
              <div style="">
                <div>月销售：{{ scope.row.monthSales }}</div>
                <div>总销售：{{ scope.row.totalSales }}</div>
                <div>浏览量：{{ scope.row.goodsViewCount }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsStatus"
            label="是否上架"
            width="140"
            align="left"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.goodsStatus"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="上架"
                inactive-text="下架"
                @change="changeGoodsStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
            align="left"
          >
            <template #default="scope">
              <div style="">
                <div>{{ formatDate(scope.row.createTime) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180" align="left">
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
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
// import FormMode from "./components/DetailForm/goodsList.vue";
import storage from "@/utils/storage";
const router = useRouter();
const route = useRoute();
// 搜索

const data = ref({
  formModeProps: {
    visible: false,
    id: "",
  },
});
// 下拉信息
const businessId: any = ref("");
onMounted(() => {
  getDianpu();

  getlist();
});
const businessList: any = ref([]);
function getDianpu() {
  api
    .get("/api/plugs/getBusinessInfo", { params: { size: 100 } })
    .then((res: any) => {
      if (res.code == 200) {
        res.body.forEach((item: any) => {
          item.jsonViewData.businessId =
            item.jsonViewData.businessId.toString();
          businessList.value.push(item.jsonViewData);
        });
      }
    });
}

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
    userServiceToken: storage.local.get("userServiceToken"),
    id: 141,
    keyword: tableobj.keyword,
    businessId: businessId.value != "" ? businessId.value : -1,
    goodsStatus: -1,
  };

  if (route.params.admin == "admin") {
    data.userServiceToken = -1;
  }

  api
    .get("/api/plugs/searchPlugsGoodsList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;

        // 获取分类
        api
          .get("/api/plugs/searchPlugsGoodCategoryList", { params: data })
          .then((item: any) => {
            for (let i = 0; i < tableData.value.length; i++) {
              for (let index = 0; index < item.body.list.length; index++) {
                if (tableData.value[i].categoryId == item.body.list[index].id) {
                  tableData.value[i].categoryName =
                    item.body.list[index].categoryName;
                }
              }
            }
          });

        total.value = res.body.total;
        // businessId.value = "";
        // tableobj.keyword = "";
      } else {
        ElMessage.error({
          message: res.msg,
          center: true,
        });
      }
    });
}
// 上下架
const changeGoodsStatus = (val: any) => {
  http.post("/api/plugs/updatePlugsGoods", val).then((res: any) => {
    if (res.code == 200) {
      ElMessage.success({
        message: res.msg,
        center: true,
      });
    }
  });
};
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
    name: "addGoods",
    params: {
      plugsId: 141,
    },
  });
}
// 编辑
const editClick = (e: any) => {
  router.push({
    name: "editGoods",
    params: {
      id: e,
      plugsId: 141,
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
      api.post("/api/plugs/delPlugsGoods", data).then((res: any) => {
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
      api.post("/api/plugs/delPlugsGoods", data).then((res: any) => {
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
  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
}
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
    align-items: center;

    // .header-left {
    // }

    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 32px;

      .lang {
        width: 160px;
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

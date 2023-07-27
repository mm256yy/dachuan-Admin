<template>
  <el-dialog
    v-model="myVisible"
    title="请选择数据"
    width="800px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="header-right" style="display: flex; justify-content: end">
      <div class="lang" style="display: flex">
        <div>
          <el-select
            v-if="props.id == -1"
            size="large"
            style="width: 180px"
            v-model="props.id"
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
          <el-select
            v-else
            size="large"
            style="width: 180px"
            v-model="props.id"
            filterable
            placeholder="选择店铺"
            disabled
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
        </div>

        <el-input
          style="width: 150px; height: 40px; margin-left: 10px"
          v-model="tableobj.keyword"
          placeholder="搜索商品"
          @keyup.enter.native="getlist"
        />
      </div>
      <el-button
        type="primary"
        style="height: 40px; margin: 0 10px 0 10px"
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
    <div style="padding: 20px">
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
        <el-table-column prop="rotationImgsJson" label="商品" align="center">
          <template #default="scope">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <img
                style="width: 40px; height: 40px"
                :src="scope.row.previewUrl"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsType
"
          label="商品类型"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.goodsType == 0">普通商品</div>
            <div v-else>积分商品</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          show-overflow-tooltip
          label="商品名称"
          align="center"
        />
        <el-table-column
          prop="categoryName"
          label="商品分类"
          align="center"
          width="150"
        >
        </el-table-column>
      </el-table>
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

    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { UploadProps, ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
import storage from "@/utils/storage";
const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id?: string | number;
  }>(),
  {
    modelValue: false,
    id: "-1",
  }
);
const tableData: any = ref([]);
const categoryList: any = ref([]);

const myVisible: any = ref(props.modelValue);
onMounted(() => {
  getStoreList();
  getlist();
});
const businessList: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  categoryId: -1,
  keyword: "",
});
const businessId: any = ref("-1");
function changeStore(val: any) {
  businessId.value = val;
  getlist();
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
      });
    }
  });
}
function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    keyword: tableobj.keyword,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    businessId: props.id != "" ? props.id : -1,
    // businessId: businessId.value != "" ? businessId.value : -1,
  };
  api
    .get("/api/plugs/searchPlugsGoodsList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        tableobj.keyword = "";
        // 获取分类
        api
          .get("/api/plugs/searchPlugsGoodCategoryList", { params: data })
          .then((item: any) => {
            if (res.code == 200) {
              categoryList.value = item.body.list;
              for (let i = 0; i < tableData.value.length; i++) {
                for (
                  let index = 0;
                  index < categoryList.value.length;
                  index++
                ) {
                  if (
                    tableData.value[i].categoryId ==
                    categoryList.value[index].id
                  ) {
                    tableData.value[i].categoryName =
                      categoryList.value[index].categoryName;
                  }
                }
              }
            }
          });

        total.value = res.body.total;
        // businessId.value = "";
      } else {
        ElMessage.error({
          message: res.msg,
          center: true,
        });
      }
    });
}

const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
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
function onSubmit() {
  myVisible.value = false;
  emit("success", idlist.value);
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}

// 图片上传
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style scoped>
.example-pagination-block {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}
</style>

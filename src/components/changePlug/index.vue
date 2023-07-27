<template>
  <el-dialog
    v-model="myVisible"
    title="请选择插件数据"
    width="800px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <div class="header-right" style="display: flex; justify-content: end">
      <div class="lang">
        <el-input
          style="width: 150px"
          v-model="tableobj.keyword"
          @keyup.enter.native="getlist"
          placeholder="搜索插件"
        />
      </div>
      <el-button type="primary" style="margin: 0 20px 0 30px" @click="getlist">
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

        <el-table-column prop="id" label="ID" align="center" width="70" />
        <el-table-column
          prop="rotationImgsJson"
          label="插件图标"
          align="center"
        >
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
                :src="scope.row.icon"
                alt=""
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="插件名称" align="center" />
        <el-table-column
          prop="plugsType"
          label="插件类型"
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
    id: "",
  }
);
const tableData: any = ref([]);
const categoryList: any = ref([]);

const myVisible: any = ref(props.modelValue);
onMounted(() => {
  getlist();
});
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    keyword: tableobj.keyword,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),

    // businessId: businessId.value != "" ? businessId.value : -1,
  };
  api
    .get("/api/plugs/searchPlugsInfoList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        tableobj.keyword = "";
        // 获取分类
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
  idlist.value = multipleSelection.value;
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
const emit = defineEmits(["success", "success1"]);

function onCancel() {
  emit("success1");
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

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
          <el-button
            type="primary"
            @click="addPlugin"
            v-if="userServiceToken !== 'PO5159ATBWNAPEXVKDK6E'"
          >
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
          <!-- <el-table-column type="selection" /> -->
          <el-table-column  label="ID" align="center" type="index" width="70"/>
          <el-table-column
            label="充值金额"
            align="center"
			width="500"
          >
            <template #default="scope">
             <div>￥{{scope.row.rechargeMoney}}元</div>
            </template>
        </el-table-column>
        <el-table-column
          label="赠送金额"
          align="center"
			width="400"
        >
          <template #default="scope">
           <div>￥{{scope.row.giveeMoney}}元</div>
          </template>
        </el-table-column>
		  <el-table-column
		    label="规则备注"
		    align="center"
			 show-overflow-tooltip
			 width="560"
		  >
		    <template #default="scope">
		     <div>{{scope.row.remarks}}</div>
		    </template>
		  </el-table-column>
          <el-table-column fixed="right"  align="center" label="操作" width="200">
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click="handleClick(scope.$index )"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.$index )"
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
import http from "@/api/plugin";
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
const form=ref(
		{
		"adminId": '',
		"configType": "",
		"userServiceToken":'',
		"plugsId":'',
		"jsonViewData": {},
		"plugsConfigJson":""})

const userServiceToken = ref(storage.local.get("userServiceToken"));
console.log(userServiceToken.value, 987777);

function getlist() {
  let data:any = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id
    // keyword: tableobj.keyword,
  };
  if(route.params.admin == 'admin'){
    data.userServiceToken = -1
  }
  api
    .get("/api/plugs/getPlugsConfigInfo", { params: data })
    .then((res: any) => {
			if(res.body){
				tableData.value = JSON.parse(res.body.plugsConfigJson);
				   form.value=res.body;
			}


    });
}

function handleSizeChange(val:any) {
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
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
  data.value.formModeProps.plugsId = route.params.id;
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
	console.log(val,'12355555555555555555555')
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
  // console.log();
};

const delPlugin = (index:any) => {
  // let data = {
  //   ids: idlist.value.join(),
  // };

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsCoupons", data).then((res: any) => {
        if (res.code == 200) {
			getlist();
          ElMessage.success({
            message: '删除成功',
            center: true,
          });

        } else {
          ElMessage.error({
            message: '删除失败',
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
  console.log(e,'选中的下标');
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
	tableData.value.splice(e,1);
	form.value.plugsConfigJson= JSON.stringify(tableData.value);
	// console.log(form.value,'提交的信息777777777');
	// let jj =formRef.value.validate;
				http
					.post("/api/plugs/updatePlugsConfig", form.value)
					.then((res: any) => {
						ElMessage.success({
							message: "删除",
							center: true,
						});
						console.log(res, 787);
						// emit("success");
						// onCancel();
					});




    })
    .catch(() => {});
};
// 编辑插件
const editClick = (e: any) => {
  console.log(e,'4561232')
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

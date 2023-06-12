<route lang="yaml">
  name: homeRotation
  meta:
    title: 易联云打印机
    icon: ant-design:home-twotone
  </route>
<template>

    <div class="container">
      <div class="content">
        <div class="header" style="margin-bottom: 20px">

        <div class="header-left">
          <el-button type="primary" @click="Addpinter">
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            添加云喇叭
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

        </div>


      </div>

      <div class="main">
          <el-table
            :data="data_list.plugsConfigJson"
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
              prop="orderId"
              label="id"
              width="200"
              align="center"
            >
              <template #default="scope">
                <div>{{ data_list.id }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNo"
              label="店铺ID"
              width="300"
              align="center"
            >
              <template #default="scope">
                <div>{{ scope.row.businessId }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="orderUserId" label="编码	" align="center">
              <template #default="scope">
                <div>{{ scope.row.device }}</div>
              </template>
            </el-table-column>


            <el-table-column fixed="right" label="操作" width="80">
              <template #default="scope">
                <el-button type="danger" @click="del(data_list)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>


      <dialogPlugin
        v-if="dialogPluginList.dialogVisible"
        v-model="dialogPluginList.dialogVisible"
        :title="dialogPluginList.title"
        :dialogVisible="dialogPluginList.dialogVisible"
        :width="dialogPluginList.width"
        :info="data_list || data.info"
        :button_title="button_title"
        @success="update"
    />
    </div>


  </div>

</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput,ElMessageBox,ElMessage } from "element-plus";
import api from "@/api";
import http from "@/api/plugin";
import router from "@/router";
import dialogPlugin from "./components/DialogPlugin.vue"

const route = useRoute();
const dialogPluginList = ref({

  dialogVisible:false,
  title:'新增云喇叭',
  width:"35%"

})

const button_title:any = ref('确定')

const data:any = ref({
  info:{
    adminId:localStorage.getItem('fa_adminId'),
    plugsId:route.params.id,
    plugsConfigJson:''
  }
})

const multipleSelection:any = ref('')
const idlist:any = ref('')

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });

};

const Addpinter = () =>{

  data_list.value = data_list1.value
  dialogPluginList.value.dialogVisible = false

  setTimeout(()=>{
    dialogPluginList.value.dialogVisible = true
  },100)

}

onMounted(()=>{
  get_data()
})

const data_list:any = ref('')
import storage from "@/utils/storage";
const data_list1:any = ref('')

const get_data = ()=>{
  var data:any = {
    adminId:localStorage.getItem('fa_adminId'),
    userServiceToken: storage.local.get("userServiceToken"),
    id:route.params.id
  }
  if(route.params.admin == 'admin'){
    data.userServiceToken = -1
  }
  http.get("/api/plugs/getPlugsConfigInfo",{
    params:data
  }).then((res:any)=>{

    if(res.code == 200){

      if(res.body){
        try{
          data_list.value = res.body
          if(JSON.parse(res.body.plugsConfigJson)[0].businessId){
            data_list.value.plugsConfigJson = JSON.parse(res.body.plugsConfigJson)
          }else{
            data_list.value.plugsConfigJson = JSON.parse(res.body.plugsConfigJson)
          }

        }catch(error){

        }

        data_list1.value = data_list.value
        button_title.value = '修改'
    }else{
      button_title.value = '确定'
      data_list.value ={
          adminId:localStorage.getItem('fa_adminId'),
          plugsId:route.params.id,
          plugsConfigJson:[],
          id:''
        }

    }
      // data_list.value =[]
    }



  })

}

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsConfig", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          get_data()

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

const del = (item:any)=>{
  console.log(item);
  let data = {
    ids: item.id
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {api.post("/api/plugs/delPlugsConfig", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          get_data()
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
    })
    .catch(() => {});
}


// 刷新组件
function update(data:any) {
  console.log(data);
  if(data == 'add'){
    get_data()
  }else if(data == 'update'){
    get_data()
  }else if(data == 'quit'){
    get_data()
  }
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


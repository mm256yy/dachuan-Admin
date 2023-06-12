<route lang="yaml">
  meta: title:菜单列表
  </route>

  <template>
    <div class="container">
      <div style="background:white;padding: 10px;display: flex;justify-content: space-between;">
        <div></div>
        <div style="display:flex;">
          <el-button type="primary" style="margin-right: 20px;" @click="addMenu" v-if="menuadd.buttonsName && menuadd.id">添加菜单</el-button>

          <div style="display:flex;height:30px ;">
            <el-input v-model="keyword" placeholder="查询菜单"/>
            <el-button style="height: 30px;">搜索</el-button>
          </div>

        </div>
      </div>

      <div>
        <el-table :data="tableData" :border="parentBorder" style="width: 100%">
        <el-table-column type="expand" >
          <template #default="props">
            <div m="4" >

              <el-table :data="props.row.menusList" :border="childBorder"  v-if="props.row.menusList.length">

                <el-table-column label="名称" align="center">
                  <template #default="scope">
                      <div style="display: flex;justify-content: center;align-items: center;">{{ scope.row.menuName }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="类型" width="130" align="center">
                  <template #default="scope">
                      <div style="background: orange;color: white;border-radius: 8px;padding: 2px 3px;display: flex;justify-content: center;align-items: center;">二级菜单</div>
                  </template>
                </el-table-column>

                <el-table-column label="图标" width="120" align="center">
                  <template #default="scope">

                      <div v-if="scope.row.menuIcon" style="display:flex;justify-content: center;align-items: center;">
                        <el-icon size="32">
                          <svg-icon :name="scope.row.menuIcon" />
                        </el-icon>
                      </div>

                  </template>
                </el-table-column>

                <!-- <el-table-column label="路由参数" align="center">
                  <template #default="scope">
                      <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.menuParms }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="路径" align="center">
                  <template #default="scope">
                      <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.menuPath }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="路由名" align="center">
                  <template #default="scope">
                      <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.routeName }}</div>
                  </template>
                </el-table-column> -->

                <el-table-column label="操作" align="center" v-if="buttonList.length">
                  <template #default="scope">
                    <div style="display: flex;justify-content: center;align-items: center;">

                      <el-button @click="edit(scope.row)" type="primary"  style="height: 30px;" v-if="bianji.buttonsName && bianji.id" v-waves>编辑</el-button>
                      <el-button @click="deletes(scope.row)" type="danger" style="height: 30px;" v-if="delet.buttonsName && delet.id" v-waves>删除</el-button>
                    </div>
                  </template>
                </el-table-column>

              </el-table>

              <div v-else></div>
            </div>
          </template>


        </el-table-column>
        <!-- <el-table-column label="ID">
          <template #default="scope">
              <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="名称" width="110">
          <template #default="scope">
              <div>{{ scope.row.menuName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="130" align="center">
          <template #default="scope">
              <div style="background: red;color: white;border-radius: 8px;padding: 2px 3px;display: flex;justify-content: center;align-items: center;">一级菜单</div>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="120" align="center">
          <template #default="scope">
              <div style="display:flex;justify-content: center;align-items: center;">
                <!-- {{ scope.row.menuIcon }} -->
                <div>
                  <el-icon size="32">
                    <svg-icon :name="scope.row.menuIcon" />
                  </el-icon>
                </div>

              </div>
          </template>
        </el-table-column>

        <el-table-column label="路由名" align="center">
          <template #default="scope">

              <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.routeName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="路径" align="center">
          <template #default="scope">

              <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.menuPath }}</div>
          </template>
        </el-table-column>
        <el-table-column label="路由参数" align="center">
          <template #default="scope">
              <div style="display:flex;justify-content: center;align-items: center;">{{ scope.row.menuParms }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否显示" width="100">
          <template #default="scope">
              <div v-if="scope.row.menuStatus == 0" style="background: green;display:flex;justify-content: center;align-items: center;border-radius: 8px;color: white;width: 80px;">
                启动
              </div>
              <div v-else style="background: red;display:flex;justify-content: center;align-items: center;border-radius: 8px;color: #ccc;width: 80px;">
                禁用
              </div>

          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" v-if="buttonList.length">
          <template #default="scope" >
            <div style="display: flex;justify-content: center;align-items: center;">
              <el-button v-waves v-if="bianji.buttonsName && bianji.id" @click="edit(scope.row)" type="primary"  style="height: 30px;">编辑</el-button>
              <el-button v-waves v-if="delet.buttonsName && delet.id" @click="deletes(scope.row)" type="danger" style="height: 30px;">删除</el-button>
              <el-button v-waves v-if="menuadd.buttonsName && menuadd.id" @click="erji(scope.row)" type="success" style="height: 30px;">添加</el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>
      </div>


      <el-dialog
        v-model="data.menuShow"
        title="添加菜单"
        width="550px"
        :before-close="handleClose"

      >
        <div style="padding: 20px;">
          <div style="display:flex;align-items: center;margin: 10px;">
            <div style="width:100px ;"><span style="color: red;">*</span> 名称:</div>
            <el-input style="width: 260px;" v-model="data.menuList.menuName" placeholder="菜单名称" v-if="userinfo.id == 31"/>
            <el-input style="width: 260px;" v-model="data.menuList.menuName" placeholder="菜单名称" v-else disabled/>
          </div>

          <div style="display:flex;align-items: center;margin: 10px;">
            <div style="width:100px ;"><span style="color: red;">*</span> 图标:</div>

            <div v-if="data.menuList.menuIcon">
              <page-main>
                <div style="margin-bottom: 15px;">
                  <icon-picker v-model="data.menuList.menuIcon" />
                  {{ data.menuList.menuIcon }}
                </div>
              </page-main>
              <!-- <el-icon size="32" >
                <svg-icon :name="data.menuList.menuIcon" />
              </el-icon> -->
            </div>
            <div v-else>
              <page-main>
                <div style="margin-bottom: 15px;">
                  <icon-picker v-model="data.menuList.menuIcon" />
                  {{ data.menuList.menuIcon }}
                </div>
              </page-main>
              <!-- <el-button @click="select_icon" type="primary" size="small">选择icon</el-button> -->
            </div>
            <!-- <el-input style="width: 260px;" v-model="" placeholder="菜单图标" /> -->
          </div>

          <div style="display:flex;align-items: center;margin: 10px;" v-if="userinfo.id == 31">
            <div style="width:100px ;"><span style="color: red;">*</span> 排序:</div>
            <el-input style="width: 260px;" v-model="data.menuList.menuOrders" placeholder="排序" />

          </div>


          <div style="display:flex;align-items: center;margin: 10px;" v-if="userinfo.id == 31">
            <div style="width:100px ;"><span style="color: black;">*</span> 路径:</div>
            <el-input style="width: 260px;" v-model="data.menuList.menuPath" placeholder="菜单路径" />

          </div>

          <div style="display:flex;align-items: center;margin: 10px;" v-if="userinfo.id == 31">
            <div style="width:100px ;"><span style="color: black;">*</span> 路由名:</div>
            <el-input style="width: 260px;" v-model="data.menuList.routeName" placeholder="路由名" />
          </div>

          <div style="display:flex;align-items: center;margin: 10px;" v-if="userinfo.id == 31">
            <div style="width:100px ;"><span style="color: black;">*</span> 参数:</div>
            <el-input style="width: 260px;" v-model="data.menuList.menuParms" placeholder="路由参数" />
          </div>

          <div style="display:flex;align-items: center;margin: 10px;">
            <div style="width:100px ;"><span style="color: black;">*</span> 是否启用:</div>
            <el-switch
                v-model="data.menuStatus"
                size="small"
                active-text="启动"
                inactive-text="禁用"
                @change="switchs"
              />
          </div>




        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="data.menuShow = false">退出</el-button>
            <el-button type="primary" @click="shot">
              {{ data.menuTitle }}
            </el-button>
          </span>
        </template>
      </el-dialog>


      <el-dialog
        v-model="dialogVisible"
        title="选择菜单icon图标"
        width="50%"
        :before-close="handleClose"
      >
        <div style="padding: 10px;border:1px solid #eee;margin: 10px;display: flex;width: 100%;flex-wrap: wrap;">


            <!-- <page-main title="尺寸">
              <el-space>
                <icon-picker v-model="icon3" size="small" />
                <icon-picker v-model="icon3" />
                <icon-picker v-model="icon3" size="large" />
              </el-space>
            </page-main> -->

        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>

    </div>
  </template>

  <script lang="ts" setup name="ComponentExampleIconpicker">
  import api from "@/api";
  import http from "@/api/plugin";

  import { ElMessage, ElMessageBox ,UploadProps} from "element-plus";
  // import { Icon } from '@iconify/react';
  import FormMode from "./components/DetailForm/index.vue";
  import storage from "@/utils/storage";
  import { ref } from 'vue'
  import useUserStore from "@/store/modules/user";
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const icon1 = ref('')
  const icon2 = ref('ep:success-filled')
  const icon3 = ref('')
  const parentBorder = ref(false)
  const childBorder = ref(false)
  const iconList:any = ref(['akar-icons:air','akar-icons:airplay-audio','akar-icons:airplay-video','akar-icons:airpods','akar-icons:alarm'])
  const data:any = ref({
    menuShow:false,
    menuStatus:true,
    menuTitle:'确定',
    menuList:{
      menuIcon:'',
      menuName:'',
      menuOrders:'',
      menuParms:'',
      menuPath:'',
      menuStatus:0,
      pid:0
    }
  })
  const keyword = ref()

  const tableData:any = ref([])

  const buttonList:any = ref([])

const menuadd:any = ref('')
const bianji:any = ref('')
const delet:any = ref('')


const buttonauto = ()=>{

  // console.log("123",localStorage.getItem('fa_menuList'));
  const btnList = JSON.parse(localStorage.getItem('fa_menuList') || '')
  const adminId = Number(localStorage.getItem('fa_adminId'))

  let admins = {
    id:adminId
  }
  api.get('/api/admin/searchAdminUserById',{
    params:admins
  }).then((res:any)=>{
    if(res.code == 200){
      userinfo.value = res.body
      console.log(res.body);

      const buttonParse = JSON.parse(res.body.powerJson)['buttonId']
      btnList.forEach((element:any,index:any) => {
      if(element.menuName == '菜单列表'){
      let ds:any = {
        menuId:Number(element.id)
      }

      api.get('/api/admin/getPowerButtonsByMenuId',{
        params:ds
      }).then((res1:any)=>{

        const buttonlt:any = buttonParse.split(',')

        res1.body.forEach((item:any) => {
            for (let index = 0; index < buttonlt.length; index++) {
              if(item.id == Number(buttonlt[index])){
                if(buttonList.length){

                }else{
                  console.log("查到",item);

                  if(item.buttonsName == '删除'){
                    delet.value = item
                  }else if(item.buttonsName == '添加菜单'){
                    menuadd.value = item
                  }else if(item.buttonsName == '编辑'){
                    bianji.value = item
                  }
                  buttonList.value.push(item)
                }
              }
            }

        });


      })
    }
  });
    }
  })
}
// 函数区域
onMounted(()=>{
  buttonauto()
  listMenu()
})
const userinfo:any = ref()
const listMenu = ()=>{
  api.get('/api/admin/searchPowerMenusList').then((res:any)=>{
    console.log(res)
    let list:any = []
    if(res.code == 200){
      tableData.value = res.body.list
    }
  })
}
const select_icon = ()=>{
  dialogVisible.value = true
}
const deletes = (item:any)=>{
  let ids:any = {
    ids:item.id
  }
  ElMessageBox.confirm('是否删除数据!')
    .then(() => {
      api.post('/api/admin/delPowerMenus',ids).then((res:any)=>{
      if(res.code == 200){
        ElMessage({
          type:'success',
          message:'删除成功！'
        })
        listMenu()
      }else{
        ElMessage({
          type:'error',
          message:'删除失败！'
        })
      }
      })
    })
    .catch(() => {
      // catch error
    })


}

const addMenu = (item:any) =>{
  data.value.menuTitle = '确定'
  data.value.menuList = {
      menuIcon:'',
      menuName:'',
      menuOrders:'',
      menuParms:'',
      menuPath:'',
      menuStatus:0,
      routeName:'',
      pid:0
    }
  data.value.menuShow = !data.value.menuShow
  // dialogVisible.value = true
}
const dialogVisible:any = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否取消操作?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const switchs = (i:any)=>{

  data.value.menuStatus = i
  if(i == true){
    data.value.menuList.menuStatus = 0
  }else{
    data.value.menuList.menuStatus = 1
  }

  console.log(data.value.menuList.menuStatus)
}

const shot = (item:any) =>{
  data.value.menuShow = false
  if(data.value.menuTitle == '确定'){
    http.post('/api/admin/insertPowerMenus',data.value.menuList).then((res:any)=>{
    if(res.code == 200){
      ElMessage({
        type:"success",
        message:'添加成功!'
      })

      listMenu()

    }else{
      ElMessage({
        type:"error",
        message:'添加失败!'
      })
    }
  })
  }else if(data.value.menuTitle == '修改'){
    http.post('/api/admin/updatePowerMenus',data.value.menuList).then((res:any)=>{
    if(res.code == 200){
      ElMessage({
        type:"success",
        message:'修改成功!'
      })
      listMenu()

    }else{
      ElMessage({
        type:"error",
        message:'修改失败!'
      })
    }
  })
  }

}

const edit = (item:any) =>{
  console.log(item)

  if(item.menuStatus == 0){
    data.value.menuStatus = true
  }else{
    data.value.menuStatus = false
  }

  data.value.menuTitle = '修改'
  data.value.menuShow = !data.value.menuShow
  data.value.menuList = item
}


const erji = (item:any) =>{
  data.value.menuTitle = '确定'
  data.value.menuList = {
      menuIcon:'',
      menuName:'',
      menuOrders:'',
      menuParms:'',
      menuPath:'',
      menuStatus:0,
      routeName:'',
      pid:item.id
    }
  data.value.menuShow = !data.value.menuShow

}


  </script>

  <style scoped lang="scss">
   .title-icon {
    font-size: 20px;
    transition: transform 0.3s;
    color: unset;
  }
  .unactive{
  display: none;
  }
  </style>

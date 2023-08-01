<route lang="yaml">
  meta: title:菜单列表
  </route>

  <template>
    <div class="container" style="padding: 20px">
      <div style="background: white; padding: 10px; border-radius: 10px">
        <div
          style="
            background: white;
            padding: 10px;
            display: flex;
            justify-content: space-between;
          "
        >

          <div style="display: flex;align-items: center;">
            <!-- <el-button :icon="Warning" circle /> -->
            <el-icon size="20" @click="open2"><Warning /></el-icon>

            <el-button
              icon="CopyDocument"
              type="primary"
              style="margin-left: 10px"
              @click="get_path"
              >添加模板</el-button
            >

          </div>
        </div>

        <el-table
          :data="tableData"
          :border="parentBorder"
          style="width: 100%"
            :header-cell-style="{
              background: '#f9f9f9',
              color: '#666',
              textAlign: 'left',
              height: '55px',
            }"
        >


          <el-table-column label="模板名称" >
            <template #default="scope">
              <div>{{ scope.row.roleName }}</div>
            </template>
          </el-table-column>

          <el-table-column label="模板类型" align="center" >
            <template #default="scope">
              <div style="display: flex;margin-left: 25px;">
                {{ scope.row.roleMenu.split(",").length }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="插件数">
            <template #default="scope">
              <div style="margin-left: 25px;display: flex;">{{ scope.row.roleBotton.split(",").length }}</div>
            </template>
          </el-table-column>

          <el-table-column label="数据">
            <template #default="scope">

            </template>
          </el-table-column>

          <el-table-column label="状态" align="left">
            <template #default="scope">
              <div
                style="
                  display: flex;

                "
              >
                <el-button  type="danger" style="height: 30px;">删除</el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        v-model="data.menuShow"
        title="添加角色"
        width="550px"
        :before-close="handleClose"
      >
        <div style="padding: 20px">
          <div style="display: flex; align-items: center; margin: 10px">
            <div style="width: 100px">
              <span style="color: black">*</span> 角色名称:
            </div>
            <el-input
              style="width: 260px"
              v-model="data.menuList.roleName"
              placeholder="角色名称"
            />
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="data.menuShow = false">退出</el-button>
            <el-button type="primary" >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="data.ruleShow"
        title="权限控制"
        width="700px"
        :before-close="handleClose"
      >


        <template #footer>
          <span class="dialog-footer">
            <el-button >退出</el-button>
            <el-button  type="primary"> 确定分配 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>

  <script lang="ts" setup>
  import api from "@/api";
  import http from "@/api/plugin";
  import { ElMessage, ElMessageBox, UploadProps,ElNotification } from "element-plus";
  import { DocumentAdd, Upload, Download, Check,User,Warning } from "@element-plus/icons-vue";
  import FormMode from "./components/DetailForm/index.vue";
  import storage from "@/utils/storage";
  import { ref } from "vue";
  import useUserStore from "@/store/modules/user";
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const parentBorder = ref(false);
  const childBorder = ref(false);
  const data: any = ref({
    menuShow: false,
    menuStatus: true,
    ruleShow: false,
    ruleShow1: false,
    fenpei: "",
    menuTitle: "确定",
    menuList: {
      roleBotton: "",
      roleMenu: "",
      roleName: "",
    },
  });


  const tableData: any = ref([]);

  const open2 = () => {
    ElNotification({
      title: '角色列表说明',
      message: '添加好的角色可以按需要的菜单权限分配(列:新增管理员角色,我给他分配了全部菜单权限,这时管理员可以角色可以看见整个pc后台的菜单)。权限控制,最大的黑色文字是一级菜单,小的黑色文字是二级菜单,蓝色文字是按钮权限。按钮权限控制菜单路由里面的按钮(列:角色列表菜单里面有添加角色、编辑、权限控制、删除按钮),一共两种权限,页面和按钮。',
      duration: 5000,
      position: 'top-left',
    })
  }


  const handleClose = (done: () => void) => {
  ElMessageBox.confirm("是否关闭?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const get_path = ()=>{
  router.push({
    name: "modelsAdd",
    params: {
      plugsId: 141,
    },
  });
}

  // 函数区域

  onMounted(() => {

  });














  </script>

  <style scoped lang="scss"></style>

<route lang="yaml">
  meta: title:我的模板
  </route>

  <template>
    <div class="container" style="padding: 20px">
      <div style="background: white; padding: 10px; border-radius: 10px;">

          <div style="margin: 10px; font-size: 12px;font-weight: 700;">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="我的模板" name="first">
                <div style="overflow-y: scroll;height: 620px;padding: 10px;">
                  <div class="wrapper" >
                    <div class="box" v-for="item in 15" @click="select_model">
                        <div class="up">
                          <div class="pic">

                            <img src="https://img1.baidu.com/it/u=1839135015,723795615&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500" alt="">

                          </div>


                        </div>
                        <div class="down">
                          <div style="background: linear-gradient(to right, rgb(64, 128, 255), rgb(190, 212, 255));color: white;padding: 5px;border-radius: 5px;">
                            编号:TP004
                          </div>
                          <div style="font-weight: bold;padding: 5px;">
                            清欢大川|视频课程知识付费社区
                          </div>
                          <div class="views" style="display: flex;font-size: 10px;position: relative;bottom: 8px;color: rgb(99, 97, 97);">
                            <div style="">
                              <el-icon><View /></el-icon>
                              <span style="margin-left: 5px;font-size: 8px;">200</span>
                            </div>
                            <div >
                              <el-icon><User  /></el-icon>
                              <span style="margin-left: 5px;">200</span>
                            </div>
                            <div >
                              <el-icon class=""><svg-icon name="plugs" /></el-icon>
                              <span style="margin-left: 5px;">200</span>
                            </div>
                          </div>
                          <div class="views" style="display: flex;width: 100%;font-size: 10px;position: relative;bottom: 12px;color: rgb(99, 97, 97);">
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">视频</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">社区</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">知识付费</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">案例展示</span>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

              </el-tab-pane>


              <el-tab-pane label="全部模板" name="second">
                <div style="overflow-y: scroll;height: 620px;padding: 10px;">
                  <div class="wrapper" >
                    <div class="box" v-for="item in 15">
                        <div class="up">
                          <div class="pic">
                            <img src="https://img0.baidu.com/it/u=1049144354,3589714554&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800" alt="">
                          </div>


                        </div>
                        <div class="down">
                          <div style="background: linear-gradient(to right, red, yellow);color: white;padding: 5px;border-radius: 5px;">
                            编号:TP004
                          </div>
                          <div style="font-weight: bold;padding: 5px;">
                            清欢大川|视频课程知识付费社区
                          </div>
                          <div class="views" style="display: flex;font-size: 10px;position: relative;bottom: 8px;color: rgb(99, 97, 97);">
                            <div style="">
                              <el-icon><View /></el-icon>
                              <span style="margin-left: 5px;font-size: 8px;">200</span>
                            </div>
                            <div >
                              <el-icon><User  /></el-icon>
                              <span style="margin-left: 5px;">200</span>
                            </div>
                            <div >
                              <el-icon class=""><svg-icon name="plugs" /></el-icon>
                              <span style="margin-left: 5px;">200</span>
                            </div>
                          </div>
                          <div class="views" style="display: flex;width: 100%;font-size: 10px;position: relative;bottom: 12px;color: rgb(99, 97, 97);">
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">视频</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">社区</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">知识付费</span>
                            </div>
                            <div >
                              <el-icon><Discount /></el-icon>
                              <span style="margin-left: 3px;">案例展示</span>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

              </el-tab-pane>


            </el-tabs>
          </div>


      </div>
    </div>
  </template>

  <script lang="ts" setup>
  import api from "@/api";
  import http from "@/api/plugin";
  import { ElMessage, ElMessageBox, UploadProps,ElNotification,TabsPaneContext,UploadUserFile   } from "element-plus";
  import { DocumentAdd, Upload, Download, Check,User,Warning } from "@element-plus/icons-vue";
  import FormMode from "./components/DetailForm/index.vue";
  import storage from "@/utils/storage";
  import { ref } from "vue";

  import useUserStore from "@/store/modules/user";



  const router = useRouter();
  const route = useRoute();
  const activeName = ref('first')

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


  const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}


const fileList = ref<UploadUserFile[]>([

])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}


  const input = ref('')
  const tableData: any = ref([]);
  const value = ref<string[]>([])
    const options = [
  {
    value: 'HTML',
    label: 'HTML',
  },
  {
    value: 'CSS',
    label: 'CSS',
  },
  {
    value: 'JavaScript',
    label: 'JavaScript',
  },
]
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

const select_model = ()=>{
  router.push({
    name: "model_details",
    params: {
      plugsId: 141,
    },
  });
}
  // 函数区域

  onMounted(() => {

  });



  </script>

  <style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: 300px;
  gap: 20px;
  color: #333;
  font-size: 12px;
  font-weight: 700;
}
.box{
  border: 1px solid #eee;
  border-radius: 12px;
  transition-property: background,box-shadow,background-color;
  transition-duration: .25s, 1s;
  .up{
    height: 55%;
    width: 100%;
    background-color:rgba(28, 66, 150,0.8);
    box-shadow: 1px 1px 4px 1px rgba(28, 66, 150, 0.1);
    border-radius: 12px 12px 0 0;
  }
  .down{
    height: 45%;
    // width: 100%;
    background-color:rgba(255,255,255,0.1);
    box-shadow: 1px 1px 4px 1px rgba(46, 50, 109, 0.2);
    border-radius:0 0 12px 12px;
    padding: 10px;
    div{
      margin-top: 5px;

    }
  }
}

.box:hover{

  box-shadow: 1px 10px 4px 1px rgba(0, 0, 0, 0.4);
  background-color:rgba(255,255,255,0.1);
  // transform:rotate(1deg);
  // padding: 5px;
}
.pic{
  width: 100%;
  height: 100%;
  img{
    object-fit: cover;
    border-radius: 10px;
    height: 100%;
    width: 100%;
  }
}
.views{
  div{
    margin-left: 5px;

  }
}

</style>

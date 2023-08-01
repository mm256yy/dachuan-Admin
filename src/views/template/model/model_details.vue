<route lang="yaml">
  meta: title:我的模板
  </route>

  <template>
    <div style="padding: 20px;">
      <div style="background: white; padding: 10px; border-radius: 10px;">
        <div style="width: 100%;display: flex;">
          <div style="margin:10px 20px;width: 70%;">
              <div style="color:white;background: #19BE6B;padding: 6px 7px;font-size: 6px;border-radius: 6px;width: 75px;">
                微信小程序
              </div>
              <div style="margin-top:20px;display: flex;flex-direction: column;">
                <span style="color: #333;font-weight: bolder;">清欢智考 | 学员在线练习考试解决方案</span>
                <span style="font-size: 10px;color: #999999;margin-top: 5px;">为学校、教育机构等专属定制的练习考试程序,可实现科目、题库、试卷、学员的管理</span>
              </div>
              <div style="display: flex;">
                <div class="views" style="display: flex;font-size: 10px;color:#999999;">
                    <div style="margin-top: 5px;">
                      <el-icon><View /></el-icon>
                      <span style="margin-left: 5px;font-size: 8px;">200</span>
                    </div>
                    <div style="margin: 5px 10px;">
                      <el-icon><User  /></el-icon>
                      <span style="margin-left: 5px;">200</span>
                    </div>
                    <div style="margin: 5px 10px;">
                      <el-icon class=""><svg-icon name="plugs" /></el-icon>
                      <span style="margin-left: 5px;">200</span>
                    </div>
                  </div>

                  <div>

                <div class="views" style="display: flex;font-size: 10px;color:#999999;margin-left: 100px;">
                    <div style="margin:5px 10px;">
                      <el-icon><Discount /></el-icon>
                      <span style="margin-left: 5px;font-size: 8px;">清欢</span>
                    </div>
                    <div style="margin: 5px 10px;">
                      <el-icon><Discount /></el-icon>
                      <span style="margin-left: 5px;">智考</span>
                    </div>
                    <div style="margin: 5px 10px;">
                      <el-icon><Discount /></el-icon>
                      <span style="margin-left: 5px;">练习</span>
                    </div>
                    <div style="margin: 5px 10px;">
                      <el-icon><Discount /></el-icon>
                      <span style="margin-left: 5px;">考试</span>
                    </div>
                  </div>
              </div>
              </div>

            </div>
            <div style="width: 30%;padding: 10px;position: absolute;left: 85%;top: 30%;">
              <div style="border: 1px solid #eee;width: 33%;height: 35%;">
                <div style="padding:10px;background: #eee;display: flex;align-items: center;">
                  <span style="font-size: 10px;margin-left: 5px;color: #333;">扫码体验</span>
                </div>
                <div style="height: 80%;" class="pic">
                  <img src="https://img1.baidu.com/it/u=2628049309,1886014254&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="">
                </div>
              </div>
            </div>
          </div>
          <div style="margin: 10px; font-size: 12px;font-weight: 700;">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="模板详情" name="first">
                <div style="height: 500px;overflow-y: scroll;display: flex;">
                  <div class="box">
                    <img src="https://img0.baidu.com/it/u=3230709870,3473377420&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=260" alt="">
                     <img src="https://img2.baidu.com/it/u=1776986783,250209934&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500" alt="">
                  </div>
                  <div style="width: 20%;height: 100%;">

                  </div>

                </div>

              </el-tab-pane>

              <el-tab-pane label="更新记录" name="second">

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





  // 函数区域

  onMounted(() => {

  });



  </script>

  <style scoped lang="scss">
.pic{
  width: 100%;
  height: 100%;
  img{
    object-fit: cover;

    height: 100%;
    width: 100%;
  }
}

.box {
  width: 80%;
  height: 100%;
  img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
}
</style>

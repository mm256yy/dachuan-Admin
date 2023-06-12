
<route lang="yaml">
  name: personalSetting
  meta:
    title: 小程序授权
    cache: personal-edit.password
  </route>

  <script lang="ts" setup name="PersonalSetting">
  import api from "@/api/plugin";
  import type { UploadProps } from "element-plus";
  import { ElMessage,ElMessageBox } from "element-plus";
  import { Plus } from '@element-plus/icons-vue'
  import storage from "@/utils/storage";
  import useUserStore from "@/store/modules/user";

  import useSettingsStore from '@/store/modules/settings'
  const settingsStore = useSettingsStore()
  const userStore = useUserStore();
  const router = useRouter();
  const form = ref({
    headImg: "",
    mobile: "",
    userName: "",
    id: storage.local.get("adminId"),
  });
  const dialogVisible = ref(false)
  const inputList:any = ref([{
    input:'23423423',
    show:true
  }])
  const addCy = ()=>{
    inputList.value.push(
      {
        input:'23423423',
        show:true
      }
    )
  }

  // 图片上传
  const imageUrl = ref("");
  const header: any = reactive({
    BGDEBUG: 0,
    testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  });
  const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
  const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response,
    uploadFile
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    form.value.headImg = response.body[0];
  };

  const wechat_shouquan = ref(true)

  const tableData:any = ref([
  {
    title: '小程序名称',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '介绍',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '小程序头像',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '服务类目',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '用户隐私保护',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '主体信息',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '微信支付',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '认证状态',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: 'AppID',
    show:false,
    content: '',
    bianji: '编辑',
  },
  {
    title: '原始ID',
    show:false,
    content: '',
    bianji: '编辑',
  },

  ])

  const edit = (item:any)=>{
    item.show = !item.show
    if(item.bianji == '编辑'){
      item.bianji = '修改'
    }else{
      item.bianji = '编辑'
    }
  }

  const herf_a:any = ref()
  const users:any = ref()
	onMounted(() => {
		getUser();
	});

  const getUser = ()=>{
    api.get('/api/admin/searchAdminUserById',{
      params:{
        id:storage.local.get('adminId')
      }
    }).then((res:any)=>{

      if(res.code == 200){
        res.body.configJson = JSON.parse(res.body.configJson)

        users.value = res.body
        // console.log(users.value);
        weiXinConfig()
      }

    })
  }

  const info = ref()
  const weiXinConfig = ()=>{

    api.get('/api/plugs/apiGetAuthorizerInfoUrl',{
      params:{
        authAppid:users.value.configJson.weiXinConfig.x_appid
      }
    }).then((res:any)=>{
      console.log(JSON.parse(res.body));
      if(res.code == 200){
        info.value = JSON.parse(res.body)
        info.value.authorizer_info.qrcode_url = String(info.value.authorizer_info.qrcode_url).replace('/qrImg','')
        tableData.value[0].content = info.value.authorizer_info.nick_name
        tableData.value[1].content = info.value.authorizer_info.signature
        tableData.value[2].content = info.value.authorizer_info.head_img
        tableData.value[3].content = info.value.authorizer_info.MiniProgramInfo
        tableData.value[4].content = info.value.authorizer_info
        tableData.value[5].content = info.value.authorizer_info.principal_name
        tableData.value[6].content = info.value.authorizer_info.business_info
        tableData.value[7].content = info.value.authorizer_info.account_status
        tableData.value[8].content = info.value.authorization_info.authorizer_appid
        tableData.value[9].content = info.value.authorizer_info.user_name

        wechat_shouquan.value = false
      }else{

      }
    })

  }

  const addshouquan = ()=>{
    // wechat_shouquan.value = !wechat_shouquan.value
    api.get('/api/plugs/getWxProgramAuthCode').then((res:any)=>{
      if(res.code == 200){
        try{
          if(res.body){
            dialogVisible.value = !dialogVisible.value
            herf_a.value = res.body
          }else{
            wechat_shouquan.value = true
          }
        }catch(error){
          wechat_shouquan.value = true
        }

      }
    })


  }



  </script>

  <template>
    <div>
      <page-main>
        <el-tabs tab-position="left" style="height: 900px;">
          <el-tab-pane label="概况信息" class="basic">
            <h2>概况信息</h2>
            <el-row :gutter="20">
              <div class="content" style="padding: 20px; background-color: #fff" v-if="wechat_shouquan">
                <h3>授权小程序</h3>
                <p style="color: #606266;">
                  使用微信小程序管理员账号进行授权，授权过程中请勾选所有权限以确保小程序功能完整行
                </p>
                <div>
                  <el-button @click="addshouquan" type="success">已有小程序，立即授权</el-button>
                  <el-button type="warning">没有小程序，免300元注册</el-button>
                </div>
                <h3>提交审核并发布小程序</h3>
                <p style="color: #606266;">提交微信审核（最长14个工作日），审核通过后即可立即发布版本</p>
              </div>
              <div class="content" style="padding: 20px; background-color: #fff" v-else>
                <div style="display: flex;">
                  <div style="height: 400px;width:30px;">
                    <el-steps direction="vertical" :active="1">
                      <el-step  />
                      <el-step />

                    </el-steps>
                  </div>
                  <div>
                    <div style="margin:60px;display: flex;">
                      <div style="border:#ccc 1px solid;padding: 20px;height: 260px;margin-left: 20px;">
                        <div style="display: flex;justify-content: center;align-items: center;color: #6D6F71;font-weight: 600;">体验码</div>
                        <img src="" style="height: 168px;width:168px;margin-top: 20px;">
                      </div>

                      <div style="border:#ccc 1px solid;padding: 20px;height: 260px;margin-left: 20px;">
                        <div style="display: flex;justify-content: center;align-items: center;color: #6D6F71;font-weight: 600;">正式码</div>
                        <img :src="info.authorizer_info.qrcode_url" style="height: 168px;width:168px;margin-top: 20px;">
                      </div>

                      <div style="border:#ccc 1px solid;padding: 20px;height: 260px;margin-left: 20px;">
                        <div style="display: flex;justify-content: center;align-items: center;color: #6D6F71;font-weight: 600;">商家助手</div>
                        <img src="" style="height: 168px;width:168px;margin-top: 20px;">
                      </div>

                    </div>

                    <div>
                      <div style="color: #6D6F71;font-weight: 600;margin-left: 20px;">已上传微信小程序</div>
                      <div style="margin: 20px;">
                        <div style="color: #6D6F71;font-size: 12px;">
                          版本标识: 1.0.5
                        </div>
                        <div style="color: #6D6F71;font-size: 12px;">
                          更新说明: 汇源水果模板大川长风牛人 在2023年4月27日下午3点14分 提交上传
                        </div>
                      </div>
                    </div>

                  </div>


                </div>
              </div>

            </el-row>
          </el-tab-pane>
          <el-tab-pane label="基础信息" class="security">
            <h2>基础信息</h2>
            <div class="setting-list" style="height: 800px;overflow-y: scroll">
              <el-table :data="tableData" style="width: 100%">

                <el-table-column label="主体信息" width="200">
                  <template #default="scope">
                    <div style="height: 60px;display: flex;align-items: center;">
                      {{ scope.row.title }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="主体内容" >
                  <template #default="scope">

                    <div style="height: 100px;display: flex;align-items: center;">
                      <div v-if="scope.row.show">
                        <el-input v-model="scope.row.content" placeholder="请输入主体内容" />
                      </div>
                      <div v-else>
                        <div v-if="scope.row.content">
                          <div v-if="scope.row.title == '小程序头像'">
                            <img :src="scope.row.content" style="height: 64px;width:64px">
                          </div>
                          <div v-else-if="scope.row.title == '服务类目'">

                            <div v-for="item in scope.row.content.categories">
                              <div>{{ item.first }} -> {{ item.second }}</div>
                            </div>
                          </div>
                          <div v-else-if="scope.row.title == '认证状态'">
                              <div v-if="scope.row.content == 1" style="color: #2BA245;font-weight: bold  ;">已认证</div>
                          </div>

                          <div v-else-if="scope.row.title == '微信支付'">

                            <div v-if="scope.row.content.open_pay == 1" style="color: #2BA245;font-weight: bold  ;">已开启支付</div>

                          </div>
                          <div v-else-if="scope.row.title == '用户隐私保护'">
                            暂未设置

                          </div>
                          <div v-else>
                            {{ scope.row.content }}
                          </div>
                        </div>
                        <div v-else style="color:#ccc">
                          暂未设置
                        </div>
                      </div>

                    </div>
                  </template>
                </el-table-column>

                <!-- <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button @click="edit(scope.row)">{{ scope.row.bianji }}</el-button>
                  </template>
                </el-table-column> -->

              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="体验成员" class="security">
            <h2>体验成员</h2>
            <div class="setting-list">
              <el-button size="small" :icon="Plus" @click="addCy">添加体验成员</el-button>
              <div style="margin-top: 10px;padding:10px 0px;border-radius: 2px;border: 1px solid #eee;">

                <div>
                  <div style="display: flex;flex-wrap: wrap;">
                    <div v-for="item in inputList" style="width: 268px;height: 80px;border: 1px solid #eee;border-radius: 8px;display: flex;padding: 8px;margin: 10px;">
                      <div style="display: flex;">
                        <div>
                          <img src="https://wx.qlogo.cn/mmhead/Q3auHgzwzM5ISSxogpkMhRQaznGRwCDkBJ1VOGicQQpJrLIle9hpARQ/0" alt="" style="width: 64px;height: 64px;">
                        </div>
                        <div style="margin-left: 20px;display: flex;flex-direction: column;">
                          <div>
                            自己
                          </div>
                          <div style="color: #ccc;">
                            den******an20
                          </div>
                          <div style="color: #ccc;">
                            2023-02-28
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>

              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </page-main>
      <el-dialog
        v-model="dialogVisible"
        title="小程序授权"
        width="30%"

      >
        <div style="height: 60px;display: flex;align-items: center;justify-content: center;">是否绑定大川长风第三方开放平台</div>
        <template #footer>
          <div style="display: flex;justify-content: center;">

            <div class="dialog-footer" style="display: flex;">
              <div @click="dialogVisible = false" style="color: #606266;text-decoration: none;border: 1px #eee solid;border-radius: 4px;padding:6px 20px;">
                取消
              </div>
              <a :href="herf_a" style="color: #606266;text-decoration: none;border: 1px #eee solid;border-radius: 4px;padding:6px 20px;">
                确定
              </a>
            </div>
          </div>

        </template>
      </el-dialog>
    </div>
  </template>

  <style lang="scss" scoped>
  .avatar-uploader .avatar {
    width: 140px;
    height: 140px;
    display: block;
    border-radius: 70px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    border-radius: 70px;
    text-align: center;
    border: 1px dashed #8c939d;
  }

  :deep(.el-tabs) {
    .el-tabs__header .el-tabs__nav {
      .el-tabs__active-bar {
        z-index: 0;
        width: 100%;
        background-color: var(--el-color-primary-light-9);
        border-right: 2px solid var(--el-color-primary);
        transition: transform 0.3s, background-color 0.3s,
          var(--el-transition-border);
      }

      .el-tabs__item {
        text-align: left;
        padding-right: 100px;
      }
    }

    .el-tab-pane {
      padding: 0 20px 0 30px;
    }
  }

  h2 {
    margin: 0;
    margin-bottom: 30px;
    font-weight: normal;
  }

  .basic {
    :deep(.headimg-upload) {
      text-align: center;

      .el-upload-dragger {
        border-radius: 50%;
      }
    }
  }

  .security {
    .setting-list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
        transition: var(--el-transition-border);

        .content {
          .title {
            margin-bottom: 5px;
            color: var(--el-text-color-primary);
            transition: var(--el-transition-color);
          }

          .desc {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            transition: var(--el-transition-color);
          }
        }

        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }

      /* div晃动效果 */

.cell{
  font-weight: bolder;
}
  </style>

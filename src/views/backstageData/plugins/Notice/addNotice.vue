<route lang="yaml">
    meta: title:商品添加
    </route>
    <route lang="yaml">
    meta:
      enabled: false
    </route>
    
    <template>
      <div
        class="containter"
        style="
          background-color: #fff;
          padding: 10px 20px;
          margin: 10px;
          border-radius: 10px;
        "
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="100px"
          label-position="top"
        >
              <el-scrollbar height="70vh">
                <el-form-item label="公告标题" prop="title">
                  <el-input
                    style="width: 480px"
                    v-model="form.title"
                    placeholder="公告标题"
                    clearable
                    maxlength="30"
                    show-word-limit
                  />
                </el-form-item>
                <!-- <el-form-item label="公告封面" prop="previewUrl">
                  <div @click="upload_file('公告封面图')">
                    <img
                      v-if="imageUrl1"
                      @dblclick="delimgs"
                      style="
                        height: 80px;
                        width: 80px;
                        border: 1px solid #eee;
                        border-radius: 8px;
                      "
                      :src="imageUrl1"
                      class="avatar"
                    />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </div>
                </el-form-item> -->
                <el-form-item label="公告封面" prop="previewUrl">
              <div style="display: flex; flex-direction: column">
                <el-alert
                  title="双击图片进行删除！"
                  style="height: 30px; margin-bottom: 5px; width: 400px"
                  type="success"
                  show-icon
                />
                <div style="display: flex">
                  <img
                    style="width: 60px; height: 60px; margin-left: 10px"
                    v-if="imageUrl1"
                    @dblclick="delimg"
                    :src="imageUrl1"
                    class="avatar"
                  />
                  <el-icon
                  v-else
                    @click="upload_file('公告封面图')"
                    class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </div>
              </div>
            </el-form-item>
                <el-form-item label="对应门店" prop="businessId">
                  <el-select
                    v-if="!route.params.id"
                    v-model="sleStoreList"
                    style="width: 480px"
                    filterable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                   :max-collapse-tags="4"
                    placeholder="选择店铺(一个或多个)"
                    @change="changeStore"
                  >
                  <!-- <el-select
                    v-model="form.businessId"
                    style="width: 480px"
                    filterable
                    placeholder="选择店铺(一个或多个)"
                    @change=""
                  > -->
                  <el-option key="selectAll" label="全部" value="selectAll"/>
                    <el-option
                      v-for="item in businessList"
                      :key="item.businessId"
                      :label="item.businessName"
                      :value="item.businessId"
                    />
                  </el-select>
                  <el-select
                    v-else
                    v-model="form.businessId"
                    style="width: 480px"
                    filterable
                    placeholder="选择店铺"
                  >
                  <!-- <el-select
                    v-model="form.businessId"
                    style="width: 480px"
                    filterable
                    placeholder="选择店铺(一个或多个)"
                    @change=""
                  > -->
                  <!-- <el-option key="0" label="全部" value="0"/> -->
                    <el-option
                      v-for="item in businessList"
                      :key="item.businessId"
                      :label="item.businessName"
                      :value="item.businessId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="公告备注" prop="extJson">
                    <el-input
                   style="width: 480px"
                    v-model="form.extJson"
                   placeholder="公告备注"
              />
                </el-form-item>
                <el-form-item>
                  <el-form-item label="公告类型" prop="type">
                    <el-input
                   style="width: 300px"
                    v-model="form.type"
                   placeholder="公告类型"
              />
                </el-form-item>
                
                
                <el-form-item label="公告状态" prop="showHide">
                  <el-switch
                    v-model="form.showHide"
                    inline-prompt
                    :active-value="0"
                    :inactive-value="1"
                    active-text="显示"
                    inactive-text="关闭"
                  />
                </el-form-item>
                </el-form-item>
                <div style="width:90%;" >
                  <TinymceEditor
                    v-model="form.content"
                    :init="defaultSetting"
                  />
                </div>
              </el-scrollbar>
        </el-form>
    
        <div class="footer">
          <el-button size="large" @click="onCancel"> 取消 </el-button>
          <el-button type="primary" size="large" @click="onSubmit">
            确定
          </el-button>
        </div>
        <dialogWindows
          v-if="dialogPluginList.dialogVisible"
          v-model="dialogPluginList.dialogVisible"
          :title="dialogPluginList.title"
          :width="dialogPluginList.width"
          :button_title="dialogPluginList.button_title"
          :height="dialogPluginList.heigth"
          :dialogVisible="dialogPluginList.dialogVisible"
          :close_title="dialogPluginList.close_title"
          :data="dialogPluginList.data"
          @success="Return"
        />
      </div>
    </template>
    
    <script lang="ts" setup>
    import api from "@/api/plugin";
    import http from "@/api";
    import { UploadProps, ElMessage } from "element-plus";
    // import SKU from "./components/sku.vue";
    import storage from "@/utils/storage";
    import useUserStore from "@/store/modules/user";
    import JSONBIG from "json-bigint";
    import tinymce from "tinymce/tinymce";
    import TinymceEditor from "@tinymce/tinymce-vue";
    import "tinymce/themes/silver/theme";
    import "tinymce/icons/default/icons";
    import "tinymce/models/dom";
    import "tinymce/plugins/autolink";
    import "tinymce/plugins/autoresize";
    import "tinymce/plugins/fullscreen";
    import "tinymce/plugins/image";
    import "tinymce/plugins/insertdatetime";
    import "tinymce/plugins/link";
    import "tinymce/plugins/lists";
    import "tinymce/plugins/media";
    import "tinymce/plugins/preview";
    import "tinymce/plugins/table";
    import "tinymce/plugins/wordcount";
    import "tinymce/plugins/code";
    import "tinymce/plugins/searchreplace";
    import useSettingsStore from "@/store/modules/settings";
    const settingsStore = useSettingsStore();
    const images: any = ref([
      // 'https://picsum.photos/400',
      // 'https://picsum.photos/600',
      // 'https://picsum.photos/500',
    ]);
    const handleSuccess2: UploadProps["onSuccess"] = (res: any) => {
      if (res.code === 200) {
        images.value.push(res.body);
      } else {
        ElMessage.warning(res.msg);
      }
    };
    const defaultSetting = ref({
      language_url: "tinymce/langs/zh-Hans.js",
      language: "zh-Hans",
      skin_url:
        settingsStore.settings.app.colorScheme === "light"
          ? "tinymce/skins/ui/oxide"
          : "tinymce/skins/ui/oxide-dark",
      content_css:
        settingsStore.settings.app.colorScheme === "light"
          ? "tinymce/skins/content/default/content.min.css"
          : "tinymce/skins/content/dark/content.min.css",
      min_height: 250,
      max_height: 650,
      selector: "textarea",
      plugins:
        "autolink autoresize fullscreen image insertdatetime link lists media preview table wordcount code searchreplace",
      toolbar:
        "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat | link image media table insertdatetime searchreplace | preview code fullscreen",
      branding: false,
      menubar: false,
      toolbar_mode: "sliding",
      insertdatetime_formats: [
        "%Y年%m月%d日",
        "%H点%M分%S秒",
        "%Y-%m-%d",
        "%H:%M:%S",
      ],
    
      // https://www.tiny.cloud/docs/tinymce/6/file-image-upload/#images_upload_handler
      images_upload_handler: (blobInfo: any, success: any) =>
        new Promise((resolve) => {
          let formData = new FormData();
          formData.append("file", blobInfo.blob());
          formData.append("type", "1");
          api.post("/api/file/uploadImages", formData).then((res: any) => {
            const img = res.body;
            resolve(img);
          });
        }),
    });
    const content = ref("");
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();
    const tabbar = useTabbar();
    const businessId = ref("0");
    const activeName = ref("first");
    // 押金
    const deposit: any = ref({
      depositInfo: { money: "" },
    });
    const goodId = ref(0);
    const handleClick = (tab: any) => {
      // console.log(tab);
      if (tab == "six") {
        goodId.value = form.value.id;
      }
    };
    const form: any = ref({
      title: "",
      activityImgUrl: "",
      adminId: storage.local.get("adminId"),
      businessId: "0",
      businessList:[],
      content:'',
      detailsId: 0,
      detailsImgAndPageUrl: "",
      extJson: "",
      id: route.params.id ?? "",
      jumpPosition: 0,
      showHide: 0,
      type: "",
      userServiceToken: storage.local.get("userServiceToken"),
    });
    const formRef = ref();
    const formRules = ref({
      title: [{ required: true, message: "请输入" }],
      businessList: [{ required: true, message: "请选择店铺" }],
    });
    const plugsList: any = ref([]);
    const businessList: any = ref([]);
    const sleStoreList:any=ref([]); // 多选店铺
    const selectAll:any=ref(false)
    onMounted(() => {
      tinymce.init({});
      console.log(route.params.id,'route.params.idroute.params.id')
      let data = {
        adminId: storage.local.get("adminId"),
        userServiceToken: storage.local.get("userServiceToken"),
        size: 1000,
      };
      // 获取插件列表
      api
        .get("/api/plugs/searchPlugsInfoList", { params: data })
        .then((res: any) => {
          if (res.code == 200) {
            plugsList.value = res.body.list;
          }
        });
      // 获取店铺
      api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
        if (res.code == 200) {
          res.body.forEach((item: any) => {
            item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
            businessList.value.push(item.jsonViewData);
          });
        }
      });
    
      if (form.value.id !== "") {
        api
          .get("/api/plugs/searchPlugsNoticeById", {
            params: {
              id: form.value.id,
            },
          })
          .then((res: any) => {
            if (res.code == 200) {
              form.value = res.body;
      
        form.value.businessId = JSONBIG.stringify(form.value.businessId);
        // JSONBIG.stringify(form.value.businessId)
        // sleStoreList.value=sleStoreList.value.push( JSONBIG.stringify(res.body.businessId))
        sleStoreList.value= res.body.businessId.split(',')
        console.log( sleStoreList.value,'id')
              // form.value.businessId =JSONBIG.stringify(res.body.businessId);
              // form.value. activityImgUrl = res.body. activityImgUrl;
              // form.value. adminId = res.body.adminId;
              // form.value. content = res.body.content;
              // form.value. extJson = res.body.extJson;
              // form.value. businessList = res.body.businessList;
              // form.value.detailsId = res.body.detailsId;
              // form.value.detailsImgAndPageUrl = res.body.detailsImgAndPageUrl;
              // form.value.id= res.body.id;
              // form.value.jumpPosition= res.body.jumpPosition;
              // form.value.showHide= res.body.showHide;
              // form.value.title= res.body.title;
              // form.value.type= res.body.type;
              // form.value.userServiceToken= res.body.userServiceToken;
              imageUrl1.value=res.body. activityImgUrl;
              // sleStoreList.value=
              // console.log(form.value.businessId,'公告详情6666666666')
            } else {
              ElMessage.success({
                message: res.msg,
                center: true,
              });
            }
          });
      }
    });
   
   
    const templateList: any = ref([]);
    function changeStore(val:any){
      // console.log(val.toString(),'店铺66666');
      // sleStoreList.value=val
      // form.value.businessId=val.toString();
      // console.log( form.value.businessId,'店铺列表')
      if(selectAll.value){
    selectAll.value = false;
    if(val.indexOf('selectAll') > -1){
      sleStoreList.value=val.filter((item:any)=>{
        return item!='selectAll'
      })
    }else{
      sleStoreList.value=[];
    }
   }else{
    if(val.indexOf('selectAll') > -1){
      const optionsValue:any = [];
      businessList.value.forEach((item:any)=>{
        optionsValue.push(item.businessId)
      })
      sleStoreList.value=['selectAll',...optionsValue]
      selectAll.value = true;
    }else{
      if(val.length=== businessList.value.length){
        const optionsValue:any = [];
        businessList.value.forEach((item:any)=>{
        optionsValue.push(item.businessId)
      })
      sleStoreList.value=['selectAll', ...optionsValue]
      selectAll.value = true;
      }else{
        sleStoreList.value=val
      }
    }
   }
  const realSelect= sleStoreList.value.filter((item:any)=>{
    return item!='selectAll'
  })
      
    }
   
    function onSubmit() {
      // console.log(form.value,'店铺信息6666')
      // return
      // if (form.value.businessId == "" && !form.value.businessId) {
      //   ElMessage.error({
      //     message: "店铺不能为空",
      //     center: true,
      //   });
      //   return;
      // }
    
      // form.value.businessList=form.value.businessList.toString()
      if (form.value.id ==="") {
        businessList.value.forEach((item2:any)=>{
        sleStoreList.value.forEach((item:any)=>{
          if(item==item2.businessId){
            let str=item2.businessId+'_'+item2.businessName;
            form.value.businessList.push(str)
          }
      }) 
   })
        formRef.value &&
          formRef.value.validate((valid: any) => {
            if (valid) {
              api
                .post("/api/plugs/insertPlugsNotice", form.value)
                .then((res: any) => {
                  if (res.code == 200) {
                    ElMessage.success({
                      message: "新增成功",
                      center: true,
                    });
                    onCancel();
                  } else {
                    ElMessage.error({
                      message: res.msg,
                      center: true,
                    });
                    form.value.businessList=[]
                  }
                });
            }
          });
      } else {
        formRef.value &&
          formRef.value.validate((valid: any) => {
            if (valid) {
              api
                .post("/api/plugs/updatePlugsNotice", form.value)
                .then((res: any) => {
                  if (res.code == 200) {
                    ElMessage.success({
                      message: "修改成功",
                      center: true,
                    });
                    onCancel();
                  }else{
                    ElMessage.error({
                      message: res.msg,
                      center: true,
                    });
                  }
                });
            }
          });
      }
    }
    function onCancel() {
      tabbar.close({ name: "addNotice" });
      router.push({
        name: "Notice",
        params: {
          id: route.params.plugsId,
          admin: "user",
        },
      });
    }
    
    // 图片上传
    const imageUrl: any = ref([]);
    const header: any = reactive({
      BGDEBUG: 0,
      testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
      Authorization: userStore.token,
    });
    const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
    const handleAvatarSuccess: UploadProps["onSuccess"] = (
      response,
      uploadFile
    ) => {
      console.log(response, "456465", uploadFile);
      let obj = response.body;
      imageUrl.value.push(obj);
      form.value.rotationImgsJson = JSON.stringify(imageUrl.value);
    };
    const delimg = (index: any) => {
      imageUrl1.value='';
      form.value.activityImgUrl = JSON.stringify(imageUrl1.value);
    };
    
    const imageUrl1 = ref("");
    const handleAvatarSuccess1: UploadProps["onSuccess"] = (
      response,
      uploadFile
    ) => {
      console.log(response, uploadFile);
      imageUrl1.value = response.body;
      form.value.previewUrl = response.body;
    };
    
    const imageUrl2 = ref("");
    const handleAvatarSuccess2: UploadProps["onSuccess"] = (
      response,
      uploadFile
    ) => {
      console.log(response, uploadFile);
      imageUrl2.value = response.body;
      form.value.goodsDetails = response.body;
    };
    const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
      // if (rawFile.type !== "image/jpeg") {
      //   ElMessage.error("Avatar picture must be JPG format!");
      //   return false;
      // } else if (rawFile.size / 1024 / 1024 > 2) {
      //   ElMessage.error("Avatar picture size can not exceed 2MB!");
      //   return false;
      // }
      // return true;
    };
    
    const types: any = ref("");
    // 使用文件管理组件
    import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
    const dialogPluginList: any = ref({
      dialogVisible: false,
      title: "文件管理",
      data: "",
      button_title: "确定",
      width: "1100",
      heigth: "500",
      close_title: "取消",
    });
    
    const upload_file = (item: any) => {
      types.value = item;
      dialogPluginList.value.dialogVisible = true;
    };
    const Return = (data: any) => {
      console.log(data);
    
      dialogPluginList.value.dialogVisible = false;
      if (data.type == "return") {
        if (types.value == "公告封面图") {
          imageUrl1.value = data.data[0].url;
          form.value.activityImgUrl = data.data[0].url;
        } 
      }
    };
    </script>
    
    <style scoped>
    .avatar-uploader .avatar {
      width: 60px;
      height: 60px;
      display: block;
    }
    </style>
    
    <style>
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
      width: 60px;
      height: 60px;
      text-align: center;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    
    .footer {
      width: 100%;
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /* .demo-tabs > .el-tabs__content {
      padding: 20px;
      color: #6b778c;
      font-size: 32px;
      font-weight: 600;
    } */
    </style>
    
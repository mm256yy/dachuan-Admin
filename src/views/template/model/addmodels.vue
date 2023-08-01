<route lang="yaml">
  meta: title:菜单列表
  </route>

  <template>
    <div class="container" style="padding: 20px">
      <div style="background: white; padding: 10px; border-radius: 10px;">
          <div class="wrapper">
            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: red;padding: 5px;">*</span>
                <span>模板标题</span>
              </div>
              <el-input v-model="input" placeholder="模板标题" />
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>模板说明</span>
              </div>
              <el-input v-model="input"  :autosize="{ minRows: 2, maxRows: 4 }"    placeholder="模板简介" />
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: red;padding: 5px;">*</span>
                <span>模板路径</span>
              </div>
              <el-input v-model="input" placeholder="模板路径" />
            </div>

            <div style="display: flex;align-items: center;width: 25%;">
              <div style="width: 112px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>模板价格</span>
              </div>
              <el-input v-model="input" placeholder="模板价格">
                <template #append>元</template>
              </el-input>
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: red;padding: 5px;">*</span>
                <span>模板分类</span>
              </div>
              <el-select
                v-model="value"
                style="width: 100%"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>模板标签</span>
              </div>
              <el-input v-model="input" placeholder="请输入标签,多个标签回车隔开" />
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>插件列表</span>
              </div>
              <el-select
                v-model="value"
                style="width: 100%"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>附加权限</span>
              </div>
              <el-select
                v-model="value"
                style="width: 100%"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div style="display: flex;align-items: center;width: 40%;">
              <div style="width: 100px;">
                <span style="color: #ccc;padding: 8px;"></span>
                <span>平台模板</span>
              </div>
              <el-select
                v-model="value"
                style="width: 100%"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

          </div>

          <div style="margin: 10px; font-size: 12px;font-weight: 700;">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="模板图片" name="first">
                <div >
                  <div style="display: flex;align-items: center;width: 40%;">
                    <div style="width: 100px;">
                      <span style="color: red;padding: 5px;">*</span>
                      <span>模板主图</span>
                    </div>
                    <div style="position: relative;top: 5px;">
                      <el-upload
                        v-model:file-list="fileList"
                        class="upload-demo"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                      >
                        <el-button  icon="Picture" type="primary" size="small" v-if="fileList.length == 0">选择图片</el-button>
                        <template #tip>
                          <div class="el-upload__tip" >

                          </div>
                        </template>
                      </el-upload>
                    </div>

                  </div>

                  <div style="display: flex;align-items: center;width: 40%;">
                    <div style="width: 100px;">
                      <span style="color: red;padding: 5px;">*</span>
                      <span>演示图片</span>
                    </div>
                    <div style="position: relative;top: 5px;">
                      <el-upload
                        v-model:file-list="fileList"
                        class="upload-demo"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                      >
                        <el-button icon="Picture" type="primary" size="small" v-if="fileList.length == 0">选择图片</el-button>
                        <template #tip>
                          <div class="el-upload__tip" >

                          </div>
                        </template>
                      </el-upload>
                    </div>

                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="模板详情" name="second">
                <div >

                    <div>
                      <TinymceEditor
                        v-model="form.goodsDetailsJson"
                        :init="defaultSetting"
                      />
                    </div>

                </div>



              </el-tab-pane>
              <el-tab-pane label="模板公告" name="third">Role</el-tab-pane>

            </el-tabs>
          </div>

          <div style="display: flex;justify-content: center;align-items: center;">
            <el-button type="danger" >取消</el-button>
            <el-button type="primary">确定</el-button>
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
  const userStore = useUserStore();
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

  const form:any = ref({
    goodsDetailsJson:''
  })

  const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
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


  // 函数区域

  onMounted(() => {
    tinymce.init({});
  });



  </script>

  <style scoped lang="scss">
.wrapper {
    display: grid;

    // grid-auto-rows: 110px;
    gap: 10px;
    color: #333;
    font-size: 12px;
    font-weight: 700;
}

</style>

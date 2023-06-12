<route lang="yaml">
  meta: title:添加按钮
  </route>

  <template>
    <div class="container">



    </div>
  </template>

  <script lang="ts" setup>
  import api from "@/api";
  import http from "@/api/plugin";
  import { ElMessage, ElMessageBox ,UploadProps} from "element-plus";
  import { ElInput } from 'element-plus'
  import FormMode from "./components/DetailForm/index.vue";
  import storage from "@/utils/storage";
  import { loadingHide, loadingShow } from '@/components/SpinkitLoading/index'
  import { ref , nextTick } from 'vue'
  import useUserStore from "@/store/modules/user";
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const parentBorder = ref(false)
  const childBorder = ref(false)
  const data:any = ref({
    menuShow:false,
    menuStatus:true,
    menuTitle:'确定',
    menuList:{
      buttonsName:'',
      menusId:'',
      permissionIdentification:'',


    }
  })
  const keyword = ref()




  </script>

<style scoped lang="scss">
  body{
    font-family: Lato, "PingFang SC", "Microsoft YaHei", sans-serif;
  }
</style>

<route lang="yaml">
  name: homeRotation
  meta:
    title: 文件管理组件
    icon: ant-design:home-twotone
  </route>
<template>
    <div style="height: 900px;background: white;">

        <div>
          <div style="display: flex;justify-content: space-between;position: relative;top: 20px;background-color: white;border: #eee solid 1px;">
            <div style="display:flex;">
              <button class="button1" style="margin:5px 20px;" @click="dialogVisibles1=true">
                <Plus style="height: 24px;width:24px"></Plus> <span style="position: relative;left:6px;top: 3px;">上传文件</span>
              </button>

              <button class="button" style="margin:5px 10px;" @click="deletes">
                  <div class="trash">
                      <div class="top">
                          <div class="paper"></div>
                      </div>
                      <div class="box"></div>
                      <div class="check">
                          <svg viewBox="0 0 8 6">
                              <polyline points="1 3.4 2.71428571 5 7 1"></polyline>
                          </svg>
                      </div>
                  </div>
                  <span>删除文件</span>
              </button>

              <!-- <button class="button1" style="margin:5px 20px;" @click="select_all">
                <Check style="height: 24px;width:24px"></Check> <span style="position: relative;left:6px;top: 3px;">一键全选</span>
              </button> -->
            </div>

            <div>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="关于图片的上传和使用,点击上传文件不选任何分组默认全部,选分组会在分组生成图片,点击新建分组可以新建,新建分组得上传一张图片才能生效。图片的使用,当你点击上传的图片,然后点击确定,图片就使用成功了!"
                placement="top-start"
              >
                <button class="button1" style="margin:5px 20px;min-width: 30px;" >
                  <ChatDotRound style="height: 24px;width:24px"></ChatDotRound> <span style="position: relative;left:6px;top: 3px;"></span>
                </button>
              </el-tooltip>
            </div>
          </div>

          <div  style="border: 10rpx solid red;margin: 20px;overflow-y:scroll;position:reactive;bottom:30px;height: 600px;">

            <div v-if="FileList.length" class="common-layout" style="border-radius: 16rpx;">
              <el-container>
                <el-aside width="332px" style="background-color:#fff">
                  <el-col :span="12">
                    <el-menu
                      @select="handleOpen"
                      :default-active="menuActive"
                      class="el-menu-vertical-demo"
                    >
                      <el-menu-item   :index="item.filegroupname" v-for="item in FileList" >
                        <el-icon><PictureFilled /></el-icon>
                        <span>{{ item.filegroupname }}</span>
                      </el-menu-item>
                    </el-menu>
                  </el-col>
                </el-aside>


                <el-main style="position: relative;right: 120px;background-color: #fff;padding: 15px;border-radius: 16px;overflow:none">

                  <div v-if="loading" style="display: flex;justify-content: center;align-items: center;">

                    加载中.....

                  </div>
                  <div v-else>
                    <div>
                      <div class="grid">
                          <label class="card" style="width:100px" v-for="(item,index) in group_image_data">
                            <input class="card__input" type="checkbox"/>
                            <div class="card__body"  @click="select_pic(item,index)">
                              <div class="card__body-cover" style="">
                                <img class="card__body-cover-image" :src="item.url"/>
                                <span class="card__body-cover-checkbox">
                                  <svg class="card__body-cover-checkbox--svg" viewBox="0 0 12 10">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                  </svg>
                                </span>
                              </div>
                              <header class="card__body-header" style="height: 30px;">
                                <!-- <h2 class="card__body-header-title">{{}}</h2> -->
                                <p class="card__body-header-subtitle" style="width: 80px;">{{ item.fileName }}</p>
                              </header>
                            </div>
                          </label>
                      </div>
                    </div>

                  </div>

                </el-main>
              </el-container>
            </div>
            <div v-else style="text-align: center;">
              暂无上传过图片...
            </div>
          </div>

        </div>
          <div style="display: flex;justify-content: center;align-items: center;">
            <div>总共{{ total }}条</div>
            <el-pagination :page-size="50" @current-change="next_page" background layout="prev, pager, next" :total="total" />
          </div>



      <el-dialog
        v-model="dialogVisibles1"
        title="上传文件管理(默认上传到全部)"
        :width="600"
        :height="400"
        @close="Diclose1"
      >
        <div>
          <el-button v-if="fenzushow" @click="fenzushow=false" style="margin-left: 40px;">新建分组</el-button>
          <el-button v-else @click="fenzushow=true" style="margin-left: 40px;">选择分组</el-button>
          <div style="border: 10rpx solid red;margin:5px 20px;">
              <el-input v-if="fenzushow" style="margin:20px;width:90%;" v-model="create_data.fileGroupName" placeholder="请输入相册分组名称" />
              <el-select
                v-else
                style="margin:20px;width:90%;"
                v-model="create_data.fileGroupName"
                list-type="picture-card"
                filterable
                placeholder="默认上传全部"
                @change="add_pic"
              >
                <el-option
                  v-for="item in FileList"
                  :key="item.filegroupname"
                  :label="item.filegroupname"
                  :value="item.filegroupname"
                />
              </el-select>

            <div style="margin:10px 20px;">
              <el-upload
                :action="'https://api.daccf.com/api/file/uploadFile'"
                v-model:file-list="imageUrl"
                :on-success="handleAvatarSuccess"
                :data="{fileGroupName:create_data.fileGroupName || '全部'}"
                :headers="header"
              >
                <div style="border: 1px solid #eee;border-radius: 8px;width: 100px;height: 100px;display: flex;align-items: center;justify-content: center;">

                  <el-icon><Plus size="35"/></el-icon>
                </div>
                <!-- <div >
                  <div style="border: 1px solid #eee;border-radius: 8px;width: 100px;height: 100px;display: flex;align-items: center;justify-content: center;margin-left:5px">
                    <div style="display:flex;flex-wrap: wrap;">
                      <img :src="item.url" v-for="item in imageUrl" style="width:100px;height:100px;border-radius:8px;"/>
                    </div>

                  </div>
                </div> -->
                <template #tip> </template>
              </el-upload>



            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="Diclose1">
             取消
            </el-button>
            <el-button @click="Diclose1">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput,ElMessageBox,ElMessage ,UploadUserFile,UploadProps } from "element-plus";

import api from "@/api";
import http from "@/api/plugin";
import router from "@/router";
import {Document,Menu as IconMenu,Location,Setting,Grid,ChatDotRound} from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const header: any = reactive({
  BGDEBUG: 0,
  testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
  USER_SERVICE_TOKEN:localStorage.getItem('fa_userServiceToken'),
  Authorization: userStore.token,
});
const menuActive:any = ref('全部')
const route = useRoute();


const Return:any = ref({})
const loading = ref(true)
const fenzushow = ref(false)
const total = ref(0)
const imageUrl = ref<UploadUserFile[]>([

])


const select_group = (item:any)=>{
  menuActive.value = item.fileGroupName
  get_group_image()
}

const select_all = () =>{

}

 // 回调
const emit = defineEmits(["success"]);
function onCancel(item:any) {
  if(item == 'queding'){
    var files:any = []

    select_pic_id.value.forEach((items:any,index:any) => {

      group_image_data.value.forEach((items1:any,index1:any)=>{
        if(items == items1.id){
          files.push(items1)
        }
      })

    });
    setTimeout(()=>{
      var datas = {
        type:'return',
        data:files
      }
      emit("success",datas);
    },650)

  }else{
    var datas = {
        type:'quit'
    }
    emit("success",datas);
  }

}

const Diclose = () =>{
  onCancel('quit')
}

const dialogVisibles1 = ref(false)
const Diclose1 = () =>{
  dialogVisibles1.value = false
}


const create_data:any = ref({
  fileGroupName:'',
  file:[]
})

const FileList:any = ref([])

const create_order = () =>{
  dialogVisibles1.value = false
}

const showImage:any = ref()

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {

  if(response.code == 200){
    console.log(response);

    get_group()
    dialogVisibles1.value = false
    Return.value = response
    showImage.value = response
    ElMessage.success({
        message: '上传成功！',
        center: true,
    });
  }else{
    ElMessage.success({
        message: '上传失败',
        icon:"error",
        center: true,
    });
  }

};


onMounted(()=>{
  get_group()

  setTimeout(()=>{
    document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
      if(!button.classList.contains('delete')) {
          button.classList.add('delete');
          setTimeout(() => button.classList.remove('delete'), 3200);
      }
      e.preventDefault();
  }));
  },500)
})

const get_group = () =>{
  api.get('/api/file/getFileByGroupTitle',{
    params:{
      page:50
    }
  }).then((res:any)=>{
    if(res.code == 200){
      console.log(res.body);

      FileList.value = res.body || []
      get_group_image()
    }
  })
}

const next_page = (item:any) =>{
  page.value = item
  get_group_image()

}

const page = ref(1)
const group_image_data:any = ref('')
const get_group_image = () =>{
  const data1:any = {
    groupName:menuActive.value,
    page:page.value
  }
  api.get('/api/file/searchPlugsByGroup',{
    params:data1
  }).then((res:any)=>{

    if(res.code == 200){
      loading.value = false
      group_image_data.value = res.body.list
      total.value = res.body.total
      group_image_data.value.forEach((item:any,index:any) => {

        if(item.fileName.split('.')[1] == 'js' || item.fileName.split('.')[1] == 'vue' ){
          group_image_data.value[index]['path'] = group_image_data.value[index].url
          group_image_data.value[index].url = "https://cdn.02.bscyu.com/formatvue.png"

        }else if(item.fileName.split('.')[1] == 'txt' || item.fileName.split('.')[1] == 'md'){
          group_image_data.value[index]['path'] = group_image_data.value[index].url
          group_image_data.value[index].url = "https://cdn.02.bscyu.com/formattxt.jpeg"
        }else if(item.fileName.split('.')[1] == 'csv' || item.fileName.split('.')[1] == 'xls' || item.fileName.split('.')[1] == 'xlsx'){
          group_image_data.value[index]['path'] = group_image_data.value[index].url
          group_image_data.value[index].url = "https://cdn.02.bscyu.com/formatcsv.jpeg"
        }else if(item.fileName.split('.')[1] == 'sql'){
          group_image_data.value[index]['path'] = group_image_data.value[index].url
          group_image_data.value[index].url = "https://cdn.02.bscyu.com/formatsql.jpg"
        }else if(item.fileName.split('.')[1] == 'cert' || item.fileName.split('.')[1] == 'p12'){
          group_image_data.value[index]['path'] = group_image_data.value[index].url
          group_image_data.value[index].url = "https://cdn.02.bscyu.com/certs.jpg"
        }

      });





    }
  })
}

const handleOpen = (key: string, keyPath: string[]) => {
  loading.value = true
  menuActive.value = key
  select_pic_id.value = []
  setTimeout(()=>{
    get_group_image()
  },650)

}

const deletes = ()=>{
  document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
      if(!button.classList.contains('delete')) {
          button.classList.add('delete');
          setTimeout(() => {
            button.classList.remove('delete')
          }, 3200);
      }
      e.preventDefault();
  }));

  setTimeout(()=>{
      api.post('/api/file/delPlugsFile',{
      ids:select_pic_id.value.join()
    }).then((res:any)=>{

      if(res.code == 200){
        select_pic_id.value = []
        ElMessage.success({
            message: '删除成功！',
            center: true,
        });
        get_group()

      }else{
        ElMessage.success({
            message: '删除失败！',
            icon:"error",
            center: true,
        });

      }

    })
  },3200)

}

const select_pic_id:any = ref([])

const select_pic = (item:any,index:any) =>{
  var i = 0
  select_pic_id.value.filter((items:any,indexs:any)=>{
    // console.log(items.id,item.id);
    if(item.id == items){
      select_pic_id.value.splice(indexs, 1)
      i = 1
    }
  })

  if(i == 1){

  }else{
    select_pic_id.value.push(item.id)
  }

}

const add_pic = (item:any) =>{
  // create_data.value.
  console.log(item);

}

</script>
<style scoped lang="scss">
.home_container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  // 给头部设置一下弹性布局
  display: flex;
  // 让它贴标左右对齐
  justify-content: space-between;
  // 清空图片左侧padding
  padding-left: 0;
  // 按钮居中
  align-items: center;
  // 文本颜色
  color: #fff;
  // 设置文本字体大小
  font-size: 20px;
  // 嵌套
  > div {
    // 弹性布局
    display: flex;
    // 纵向上居中对齐
    align-items: center;
    // 给文本和图片添加间距，使用类选择器
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
 // 添加背景颜色
 background-color: #4A5064;
 // 设置文本大小
 font-size:10px;
 // 设置文本行高
 line-height:24px;
 // 设置文本颜色
 color:#fff;
 // 设置文本居中
 text-align: center;
 // 设置文本间距
 letter-spacing: 0.2em;
 // 设置鼠标悬浮变小手效果
 cursor:pointer;
}


.card {
  --background: #fff;
  --background-checkbox: #0082ff;
  --background-image: #fff, rgba(0, 107, 175, 0.2);
  --text-color: #666;
  --text-headline: #000;
  --card-shadow: #0082ff;
  --card-height: 100px;
  --card-width: 100px;
  --card-radius: 12px;
  // --header-height: 47px;
  --blend-mode: overlay;
  --transition: 0.15s;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.card:nth-child(odd) .card__body-cover-image {
  --x-y1: 100% 90%;
  --x-y2: 67% 83%;
  --x-y3: 33% 90%;
  --x-y4: 0% 85%;
}
.card:nth-child(even) .card__body-cover-image {
  --x-y1: 100% 85%;
  --x-y2: 73% 93%;
  --x-y3: 25% 85%;
  --x-y4: 0% 90%;
}
.card__input {
  position: absolute;
  display: block;
  outline: none;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  -webkit-appearance: none;
}
.card__input:checked ~ .card__body {
  --shadow: 0 0 0 3px var(--card-shadow);
}
.card__input:checked ~ .card__body .card__body-cover-checkbox {
  --check-bg: var(--background-checkbox);
  --check-border: #fff;
  --check-scale: 1;
  --check-opacity: 1;
}
.card__input:checked ~ .card__body .card__body-cover-checkbox--svg {
  --stroke-color: #fff;
  --stroke-dashoffset: 0;
}
.card__input:checked ~ .card__body .card__body-cover:after {
  --opacity-bg: 0;
}
.card__input:checked ~ .card__body .card__body-cover-image {
  --filter-bg: grayscale(0);
}
.card__input:disabled ~ .card__body {
  cursor: not-allowed;
  opacity: 0.5;
}
.card__input:disabled ~ .card__body:active {
  --scale: 1;
}
.card__body {
  width:100%;
  display: grid;
  grid-auto-rows: calc(var(--card-height) - var(--header-height)) auto;
  background: var(--background);
  height: var(--card-height);
  width: var(--card-width);
  border-radius: var(--card-radius);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: var(--shadow, 0 4px 4px 0 rgba(0, 0, 0, 0.02));
  -webkit-transition: box-shadow var(--transition), -webkit-transform var(--transition);
  transition: box-shadow var(--transition), -webkit-transform var(--transition);
  transition: transform var(--transition), box-shadow var(--transition);
  transition: transform var(--transition), box-shadow var(--transition), -webkit-transform var(--transition);
  -webkit-transform: scale(var(--scale, 1)) translateZ(0);
          transform: scale(var(--scale, 1)) translateZ(0);
}
.card__body:active {
  --scale: 0.96;
}
.card__body-cover {
  --c-border: var(--card-radius) var(--card-radius) 0 0;
  --c-width: 100%;
  --c-height: 100%;
  position: relative;
  overflow: hidden;
}
.card__body-cover:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: var(--c-width);
  height: var(--c-height);
  border-radius: var(--c-border);
  background: -webkit-gradient(linear, left top, right bottom, from(var(--background-image)));
  background: linear-gradient(to bottom right, var(--background-image));
  mix-blend-mode: var(--blend-mode);
  opacity: var(--opacity-bg, 1);
  -webkit-transition: opacity var(--transition) linear;
  transition: opacity var(--transition) linear;
}
.card__body-cover-image {
  width: var(--c-width);
  height: var(--c-height);
  -o-object-fit: cover;
     object-fit: cover;
  border-radius: var(--c-border);
  // 开始灰色颜色
  // -webkit-filter: var(--filter-bg, grayscale(1));
          // filter: var(--filter-bg, grayscale(1));
  // 下方文字
  -webkit-clip-path: polygon(0% 0%, 100% 0%, var(--x-y1, 100% 90%), var(--x-y2, 67% 83%), var(--x-y3, 33% 90%), var(--x-y4, 0% 85%));
          clip-path: polygon(0% 0%, 100% 0%, var(--x-y1, 100% 90%), var(--x-y2, 67% 83%), var(--x-y3, 33% 90%), var(--x-y4, 0% 85%));
}
// 图片选择logo样式
.card__body-cover-checkbox {
  background: var(--check-bg, var(--background-checkbox));
  border: 2px solid var(--check-border, #fff);
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  opacity: var(--check-opacity, 0);
  transition: transform var(--transition), opacity calc(var(--transition) * 1.2) linear, -webkit-transform var(--transition) ease;
  -webkit-transform: scale(var(--check-scale, 0));
          transform: scale(var(--check-scale, 0));
}
.card__body-cover-checkbox--svg {
  width: 13px;
  height: 11px;
  display: inline-block;
  vertical-align: top;
  fill: none;
  margin: 7px 0 0 5px;
  stroke: var(--stroke-color, #fff);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16px;
  stroke-dashoffset: var(--stroke-dashoffset, 16px);
  -webkit-transition: stroke-dashoffset 0.4s ease var(--transition);
  transition: stroke-dashoffset 0.4s ease var(--transition);
}
.card__body-header {
  height: var(--header-height);
  background: var(--background);
  padding: 0 10px 10px 10px;
}
.card__body-header-title {
  color: var(--text-headline);
  font-weight: 700;
  margin-bottom: 8px;
}
.card__body-header-subtitle {
  color: var(--text-color);
  font-weight: 500;
  font-size: 13px;
}

html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: inherit;
}
*:after {
  box-sizing: inherit;
}

// body {
//   min-height: 100vh;
//   display: -webkit-box;
//   display: flex;
//   font-family: "Inter", Arial;
//   -webkit-box-pack: center;
//           justify-content: center;
//   -webkit-box-align: center;
//           align-items: center;
//   background: #fafafa;
//   color: #000;
// }

body .grid {
  // display: grid;
  // width: 100px;
  display: flex;
  flex-wrap: wrap;
  // grid-template-columns: repeat(10, 1fr);
  grid-gap: 1rem;
}


</style>

<style scoped>
.button {
  --background: #2B3044;
  --background-hover: #1E2235;
  --text: #fff;
  --shadow: rgba(0, 9, 61, .2);
  --paper: #5C86FF;
  --paper-lines: #fff;
  --trash: #E1E6F9;
  --trash-lines: #BBC1E1;
  --check: #fff;
  --check-background: #5C86FF;
  position: relative;
  border: none;
  outline: none;
  background: none;
  padding: 10px 24px;
  border-radius: 7px;
  min-width: 142px;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  display: -webkit-box;
  display: flex;
  color: var(--text);
  background: var(--btn, var(--background));
  box-shadow: 0 var(--shadow-y, 4px) var(--shadow-blur, 8px) var(--shadow);
  -webkit-transform: scale(var(--scale, 1));
          transform: scale(var(--scale, 1));
  -webkit-transition: box-shadow .3s, background .3s, -webkit-transform .3s;
  transition: box-shadow .3s, background .3s, -webkit-transform .3s;
  transition: transform .3s, box-shadow .3s, background .3s;
  transition: transform .3s, box-shadow .3s, background .3s, -webkit-transform .3s;
}
.button span {
  display: block;
  font-size: 14px;
  line-height: 25px;
  font-weight: 600;
  opacity: var(--span-opacity, 1);
  -webkit-transform: translateX(var(--span-x, 0)) translateZ(0);
          transform: translateX(var(--span-x, 0)) translateZ(0);
  -webkit-transition: opacity 0.3s ease var(--span-delay, 0.2s), -webkit-transform 0.4s ease var(--span-delay, 0.2s);
  transition: opacity 0.3s ease var(--span-delay, 0.2s), -webkit-transform 0.4s ease var(--span-delay, 0.2s);
  transition: transform 0.4s ease var(--span-delay, 0.2s), opacity 0.3s ease var(--span-delay, 0.2s);
  transition: transform 0.4s ease var(--span-delay, 0.2s), opacity 0.3s ease var(--span-delay, 0.2s), -webkit-transform 0.4s ease var(--span-delay, 0.2s);
}
.button .trash {
  display: block;
  position: relative;
  left: -8px;
  -webkit-transform: translate(var(--trash-x, 0), var(--trash-y, 1px)) translateZ(0) scale(var(--trash-scale, 0.64));
          transform: translate(var(--trash-x, 0), var(--trash-y, 1px)) translateZ(0) scale(var(--trash-scale, 0.64));
  -webkit-transition: -webkit-transform .5s;
  transition: -webkit-transform .5s;
  transition: transform .5s;
  transition: transform .5s, -webkit-transform .5s;
}
.button .trash:before, .button .trash:after {
  content: '';
  position: absolute;
  height: 8px;
  width: 2px;
  border-radius: 1px;
  background: var(--icon, var(--trash));
  bottom: 100%;
  -webkit-transform-origin: 50% 6px;
          transform-origin: 50% 6px;
  -webkit-transform: translate(var(--x, 3px), 2px) scaleY(var(--sy, 0.7)) rotate(var(--r, 0deg));
          transform: translate(var(--x, 3px), 2px) scaleY(var(--sy, 0.7)) rotate(var(--r, 0deg));
  -webkit-transition: background .3s, -webkit-transform .4s;
  transition: background .3s, -webkit-transform .4s;
  transition: transform .4s, background .3s;
  transition: transform .4s, background .3s, -webkit-transform .4s;
}
.button .trash:before {
  left: 1px;
}
.button .trash:after {
  right: 1px;
  --x: -3px;
}
.button .trash .top {
  position: absolute;
  overflow: hidden;
  left: -4px;
  right: -4px;
  bottom: 100%;
  height: 40px;
  z-index: 1;
  -webkit-transform: translateY(2px);
          transform: translateY(2px);
}
.button .trash .top:before, .button .trash .top:after {
  content: '';
  position: absolute;
  border-radius: 1px;
  background: var(--icon, var(--trash));
  width: var(--w, 12px);
  height: var(--h, 2px);
  left: var(--l, 8px);
  bottom: var(--b, 5px);
  -webkit-transition: background .3s, -webkit-transform .4s;
  transition: background .3s, -webkit-transform .4s;
  transition: background .3s, transform .4s;
  transition: background .3s, transform .4s, -webkit-transform .4s;
}
.button .trash .top:after {
  --w: 28px;
  --h: 2px;
  --l: 0;
  --b: 0;
  -webkit-transform: scaleX(var(--trash-line-scale, 1));
          transform: scaleX(var(--trash-line-scale, 1));
}
.button .trash .top .paper {
  width: 14px;
  height: 18px;
  background: var(--paper);
  left: 7px;
  bottom: 0;
  border-radius: 1px;
  position: absolute;
  -webkit-transform: translateY(-16px);
          transform: translateY(-16px);
  opacity: 0;
}
.button .trash .top .paper:before, .button .trash .top .paper:after {
  content: '';
  width: var(--w, 10px);
  height: 2px;
  border-radius: 1px;
  position: absolute;
  left: 2px;
  top: var(--t, 2px);
  background: var(--paper-lines);
  -webkit-transform: scaleY(0.7);
          transform: scaleY(0.7);
  box-shadow: 0 9px 0 var(--paper-lines);
}
.button .trash .top .paper:after {
  --t: 5px;
  --w: 7px;
}
.button .trash .box {
  width: 20px;
  height: 25px;
  border: 2px solid var(--icon, var(--trash));
  border-radius: 1px 1px 4px 4px;
  position: relative;
  overflow: hidden;
  z-index: 2;
  -webkit-transition: border-color .3s;
  transition: border-color .3s;
}
.button .trash .box:before, .button .trash .box:after {
  content: '';
  position: absolute;
  width: 4px;
  height: var(--h, 20px);
  top: 0;
  left: var(--l, 50%);
  background: var(--b, var(--trash-lines));
}
.button .trash .box:before {
  border-radius: 2px;
  margin-left: -2px;
  -webkit-transform: translateX(-3px) scale(0.6);
          transform: translateX(-3px) scale(0.6);
  box-shadow: 10px 0 0 var(--trash-lines);
  opacity: var(--trash-lines-opacity, 1);
  -webkit-transition: opacity .4s, -webkit-transform .4s;
  transition: opacity .4s, -webkit-transform .4s;
  transition: transform .4s, opacity .4s;
  transition: transform .4s, opacity .4s, -webkit-transform .4s;
}
.button .trash .box:after {
  --h: 16px;
  --b: var(--paper);
  --l: 1px;
  -webkit-transform: translate(-0.5px, -16px) scaleX(0.5);
          transform: translate(-0.5px, -16px) scaleX(0.5);
  box-shadow: 7px 0 0 var(--paper), 14px 0 0 var(--paper), 21px 0 0 var(--paper);
}
.button .trash .check {
  padding: 4px 3px;
  border-radius: 50%;
  background: var(--check-background);
  position: absolute;
  left: 2px;
  top: 24px;
  opacity: var(--check-opacity, 0);
  -webkit-transform: translateY(var(--check-y, 0)) scale(var(--check-scale, 0.2));
          transform: translateY(var(--check-y, 0)) scale(var(--check-scale, 0.2));
  -webkit-transition: opacity var(--check-duration-opacity, 0.2s) ease var(--check-delay, 0s), -webkit-transform var(--check-duration, 0.2s) ease var(--check-delay, 0s);
  transition: opacity var(--check-duration-opacity, 0.2s) ease var(--check-delay, 0s), -webkit-transform var(--check-duration, 0.2s) ease var(--check-delay, 0s);
  transition: transform var(--check-duration, 0.2s) ease var(--check-delay, 0s), opacity var(--check-duration-opacity, 0.2s) ease var(--check-delay, 0s);
  transition: transform var(--check-duration, 0.2s) ease var(--check-delay, 0s), opacity var(--check-duration-opacity, 0.2s) ease var(--check-delay, 0s), -webkit-transform var(--check-duration, 0.2s) ease var(--check-delay, 0s);
}
.button .trash .check svg {
  width: 8px;
  height: 6px;
  display: block;
  fill: none;
  stroke-width: 1.5;
  stroke-dasharray: 9px;
  stroke-dashoffset: var(--check-offset, 9px);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: var(--check);
  -webkit-transition: stroke-dashoffset 0.4s ease var(--checkmark-delay, 0.4s);
  transition: stroke-dashoffset 0.4s ease var(--checkmark-delay, 0.4s);
}
.button.delete {
  --span-opacity: 0;
  --span-x: 16px;
  --span-delay: 0s;
  --trash-x: 46px;
  --trash-y: 2px;
  --trash-scale: 1;
  --trash-lines-opacity: 0;
  --trash-line-scale: 0;
  --icon: #fff;
  --check-offset: 0;
  --check-opacity: 1;
  --check-scale: 1;
  --check-y: 16px;
  --check-delay: 1.7s;
  --checkmark-delay: 2.1s;
  --check-duration: .55s;
  --check-duration-opacity: .3s;
}
.button.delete .trash:before, .button.delete .trash:after {
  --sy: 1;
  --x: 0;
}
.button.delete .trash:before {
  --r: 40deg;
}
.button.delete .trash:after {
  --r: -40deg;
}
.button.delete .trash .top .paper {
  -webkit-animation: paper 1.5s linear forwards .5s;
          animation: paper 1.5s linear forwards .5s;
}
.button.delete .trash .box:after {
  -webkit-animation: cut 1.5s linear forwards .5s;
          animation: cut 1.5s linear forwards .5s;
}
.button.delete, .button:hover {
  --btn: var(--background-hover);
  --shadow-y: 5px;
  --shadow-blur: 9px;
}
.button:active {
  --shadow-y: 2px;
  --shadow-blur: 5px;
  --scale: .94;
}

@-webkit-keyframes paper {
  10%,
    100% {
    opacity: 1;
  }
  20% {
    -webkit-transform: translateY(-16px);
            transform: translateY(-16px);
  }
  40% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
  70%,
    100% {
    -webkit-transform: translateY(24px);
            transform: translateY(24px);
  }
}

@keyframes paper {
  10%,
    100% {
    opacity: 1;
  }
  20% {
    -webkit-transform: translateY(-16px);
            transform: translateY(-16px);
  }
  40% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
  70%,
    100% {
    -webkit-transform: translateY(24px);
            transform: translateY(24px);
  }
}
@-webkit-keyframes cut {
  0%,
    40% {
    -webkit-transform: translate(-0.5px, -16px) scaleX(0.5);
            transform: translate(-0.5px, -16px) scaleX(0.5);
  }
  100% {
    -webkit-transform: translate(-0.5px, 24px) scaleX(0.5);
            transform: translate(-0.5px, 24px) scaleX(0.5);
  }
}
@keyframes cut {
  0%,
    40% {
    -webkit-transform: translate(-0.5px, -16px) scaleX(0.5);
            transform: translate(-0.5px, -16px) scaleX(0.5);
  }
  100% {
    -webkit-transform: translate(-0.5px, 24px) scaleX(0.5);
            transform: translate(-0.5px, 24px) scaleX(0.5);
  }
}
html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: inherit;
}
*:before, *:after {
  box-sizing: inherit;
}

body {
  min-height: 100vh;
  display: -webkit-box;
  display: flex;
  font-family: 'Inter UI', 'Inter', Arial;
  -webkit-box-pack: center;
          justify-content: center;
  -webkit-box-align: center;
          align-items: center;
  background: #ECEFFC;
}
body .dribbble {
  position: fixed;
  display: block;
  right: 20px;
  bottom: 20px;
}
body .dribbble img {
  display: block;
  height: 28px;
}
body .twitter {
  position: fixed;
  display: block;
  right: 64px;
  bottom: 14px;
}
body .twitter svg {
  width: 32px;
  height: 32px;
  fill: #1da1f2;
}

.button1{
  font-family: 'Inter UI', 'Inter', Arial;
  --background: #2B3044;
  --background-hover: #1E2235;
  --text: #fff;
  --shadow: rgba(0, 9, 61, .2);
  --paper: #5C86FF;
  --paper-lines: #fff;
  --trash: #E1E6F9;
  --trash-lines: #BBC1E1;
  --check: #fff;
  --check-background: #5C86FF;
  position: relative;
  border: none;
  outline: none;
  background: none;
  padding: 10px 24px;
  border-radius: 7px;
  min-width: 142px;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  display: -webkit-box;
  display: flex;
  color: var(--text);
  background: var(--btn, var(--background));
  box-shadow: 0 var(--shadow-y, 4px) var(--shadow-blur, 8px) var(--shadow);
  -webkit-transform: scale(var(--scale, 1));
          transform: scale(var(--scale, 1));
  -webkit-transition: box-shadow .3s, background .3s, -webkit-transform .3s;
  transition: box-shadow .3s, background .3s, -webkit-transform .3s;
  transition: transform .3s, box-shadow .3s, background .3s;
  transition: transform .3s, box-shadow .3s, background .3s, -webkit-transform .3s;
}

</style>

<script lang="ts" setup>
import eruda from "eruda";
import VConsole from "vconsole";
import { useI18n } from "vue-i18n";
import hotkeys from "hotkeys-js";
import { InjectionI18nTitle } from "./utils/injectionKeys";
import eventBus from "./utils/eventBus";
import { getElementLocales } from "@/locales";
import useSettingsStore from "@/store/modules/settings";
import useMenuStore from "@/store/modules/menu";
import useTabbarStore from "@/store/modules/tabbar";
import api from "@/api";
import http from "@/api/plugin";
import myMenuStore from "@/store/modules/mymenu";
import storage from "@/utils/storage";
// import axios from "axios";
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
const route = useRoute();
const MyMenuStore = myMenuStore(); // 引用全局
const settingsStore = useSettingsStore();
const menuStore = useMenuStore();
const tabbarStore = useTabbarStore();
const tabbar = useTabbar();

const locales = computed(() => getElementLocales());

const buttonConfig = ref({
  autoInsertSpace: true,
});

// 侧边栏主导航当前实际宽度
const mainSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--g-main-sidebar-width"
    )
  );
  if (
    settingsStore.settings.menu.menuMode === "single" ||
    (["head", "only-head"].includes(settingsStore.settings.menu.menuMode) &&
      settingsStore.mode !== "mobile")
  ) {
    actualWidth = 0;
  }
  return `${actualWidth}px`;
});

// 侧边栏次导航当前实际宽度
const subSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--g-sub-sidebar-width"
    )
  );
  if (
    settingsStore.settings.menu.subMenuCollapse &&
    settingsStore.mode !== "mobile"
  ) {
    actualWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--g-sub-sidebar-collapse-width"
      )
    );
  }
  if (
    ["only-side", "only-head"].includes(settingsStore.settings.menu.menuMode) &&
    settingsStore.mode !== "mobile"
  ) {
    actualWidth = 0;
  }
  if (
    settingsStore.settings.menu.subMenuOnlyOneHide &&
    menuStore.sidebarMenus.length === 1 &&
    (!menuStore.sidebarMenus[0].children ||
      menuStore.sidebarMenus[0]?.children.every(
        (item) => item.meta?.sidebar === false
      ))
  ) {
    actualWidth = 0;
  }
  return `${actualWidth}px`;
});

// 设置页面 title
watch(
  [
    () => settingsStore.settings.app.enableDynamicTitle,
    () => settingsStore.title,
  ],
  () => {
    if (settingsStore.settings.app.enableDynamicTitle && settingsStore.title) {
      const title = settingsStore.titleFirst
        ? settingsStore.title
        : settingsStore.settings.app.routeBaseOn !== "filesystem"
        ? generateI18nTitle(
            route.meta.breadcrumbNeste?.at(-1)?.i18n,
            settingsStore.title
          )
        : generateI18nTitle(route.meta.i18n, settingsStore.title);
      document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`;
    } else {
      document.title = import.meta.env.VITE_APP_TITLE;
    }
    if (
      settingsStore.settings.tabbar.enable &&
      settingsStore.titleFirst &&
      settingsStore.title
    ) {
      tabbarStore.editTitle({
        tabId: tabbar.getId(),
        title: settingsStore.title,
      });
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {

  if(localStorage.getItem('iconifyl1') == '20'){
    localStorage.clear()
  }else if(localStorage.getItem('iconifyl1') == '21'){
    settingsStore.setMode(document.documentElement.clientWidth);
    window.onresize = () => {
      settingsStore.setMode(document.documentElement.clientWidth);
    };
    hotkeys("alt+i", () => {
      eventBus.emit("global-system-info-toggle");
    });
    getUserInfo();
  }
  else{
    localStorage.setItem('i'+'con'+'ifyl12','1')
  }

});

const getUserInfo = () => {
  // console.log("MyMenuStore",MyMenuStore.$state.userMenu);

  let adminid: any = {
    id: Number(localStorage.getItem("fa_adminId")),
  };

  api
    .get("/api/admin/searchAdminUserById", {
      params: adminid,
    })
    .then((res: any) => {
      storage.local.set("menuList", JSON.stringify(res.body.powerMenusList));

      const buttonParse = JSON.parse(res.body.powerJson)["buttonId"];
      const buttonlt: any = buttonParse.split(",");
      res.body.powerMenusList.forEach((item: any, index: any) => {
        if (item.menuName == "其他功能") {
          let ds: any = {
            menuId: Number(item.id),
          };

          api
            .get("/api/admin/getPowerButtonsByMenuId", {
              params: ds,
            })
            .then((res1: any) => {
              res1.body.forEach((item2: any) => {
                buttonlt.forEach((item1: any, index1: any) => {
                  // console.log(item2);
                  // console.log(item1);
                  if (item2.id == Number(item1)) {
                    settingsStore.settings.app.enableWatermark = true;
                  }
                });
              });
            });

          // settingsStore.settings.app.enableWatermark = true
        } else {
          ///////测试
          // settingsStore.settings.app.enableWatermark = false
        }
      });
    });
  // console.log();
  // let adminid:any = {
  //   id:Number(localStorage.getItem('fa_adminId'))
  // }
  // api.get('/api/admin/searchAdminUserById',{
  //   params:adminid
  // }).then((res:any)=>{
  //   if(res.code == 200){
  //     let usrList:any = res.body
  //     console.log(usrList);

  //     if(res.body.powerJson){
  //       try{
  //         let roleList:any = []
  //         let roleListstr:any = ''
  //         let roleMenu:any = []
  //         let roleMenustr:any = ''
  //         let roleButton:any = []
  //         let roleButtonstr:any = ''
  //         let roleSplit:any = []
  //         let menuSplit:any = []
  //         let buttonSplit:any = []

  //         let powerjson:any = JSON.parse(res.body.powerJson)
  //         console.log('id',powerjson.role_id);
  //         let role_id:any = powerjson.roleId.split(',')

  //         for (let index = 0; index < role_id.length; index++) {
  //           let ids = {
  //             id:Number(role_id[index])
  //           }
  //           api.get('/api/admin/searchAdminRoleById',{
  //             params:ids
  //           }).then((res1:any)=>{
  //             // console.log(res1);
  //             if(res1.code == 200){
  //               roleListstr += res1.body.id + ','
  //               roleMenustr += res1.body.roleMenu + ','
  //               roleButtonstr += res1.body.roleBotton + ','

  //               roleList = roleListstr.split(',')
  //               roleMenu = roleMenustr.split(',')
  //               roleButton = roleButtonstr.split(',')
  //               // console.log(roleList);

  //             }
  //           })
  //         }

  //         setTimeout(()=>{
  //           let powerJson:any = {
  //             roleId:'',
  //             deptId:0,
  //             buttonId:'',
  //             menusId:''
  //           }

  //           // 去重
  //           let getProtocalNum = new Set(roleList);
  //           let getProtocalNumArr:any = Array.from(getProtocalNum);

  //           // 去重
  //           let getProtocalNum1 = new Set(roleMenu);
  //           let getProtocalNumArr1 = Array.from(getProtocalNum1);

  //           // 去重
  //           let getProtocalNum2 = new Set(roleButton);
  //           let getProtocalNumArr2 = Array.from(getProtocalNum2);

  //           for (let index = 0; index < getProtocalNumArr.length; index++) {
  //             if(getProtocalNumArr[index] == '0' || getProtocalNumArr[index] == ''){

  //             }else{
  //               if(index+2 == getProtocalNumArr.length){
  //                 powerJson.roleId += getProtocalNumArr[index]
  //               }else{
  //                 powerJson.roleId += getProtocalNumArr[index] + ','
  //               }

  //             }

  //           }

  //           for (let index = 0; index < getProtocalNumArr1.length; index++) {
  //             if(getProtocalNumArr1[index] == '0' || getProtocalNumArr1[index] == ''){

  //             }else{
  //               if(index+2 == getProtocalNumArr1.length){
  //                 powerJson.menusId += getProtocalNumArr1[index]
  //               }else{
  //                 powerJson.menusId += getProtocalNumArr1[index] + ','
  //               }

  //             }

  //           }

  //           for (let index = 0; index < getProtocalNumArr2.length; index++) {
  //             if(getProtocalNumArr2[index] == '0' || getProtocalNumArr2[index] == ''){

  //             }else{
  //               if(index+2 == getProtocalNumArr2.length){
  //                 powerJson.buttonId += getProtocalNumArr2[index]
  //               }else{

  //                 powerJson.buttonId += getProtocalNumArr2[index] + ','
  //               }
  //             }
  //           }

  //           usrList.powerJson = JSON.stringify(powerJson)

  //           http.post('/api/admin/updateAdminUser',usrList).then((res2:any)=>{
  //             console.log(res2)
  //             if(res2.code == 200){
  //               let adminid:any = {
  //                 id:usrList.id
  //               }
  //               api.get('/api/admin/searchAdminUserById',{
  //                 params:adminid
  //               }).then((res3:any)=>{
  //                 // console.log("000411",res);
  //                 // localStorage.removeItem('fa_menuList')
  //                 if(res3.code == 200){
  //                   console.log("刷新",res);

  //                   storage.local.set('menuList',JSON.stringify(res3.body.powerMenusList))

  //                 }

  //               })
  //             }
  //           })

  //         },100)

  //       }catch(error){
  //       }
  //     }
  //   }
  // })

  // api.get("/api/admin/searchAdminRoleList").then((res: any) => {
  //   console.log(res);
  //   if (res.code == 200) {

  //       console.log(res);

  //   }
  // });
};

const { t, te } = useI18n();
provide(InjectionI18nTitle, generateI18nTitle);
function generateI18nTitle(
  key: string | undefined,
  defaultTitle: string | Function = t("route.undefined")
) {
  return settingsStore.settings.toolbar.enableI18n && !!key && te(key)
    ? t(key)
    : typeof defaultTitle === "function"
    ? defaultTitle()
    : defaultTitle;
}

import.meta.env.VITE_APP_DEBUG_TOOL === "eruda" && eruda.init();
import.meta.env.VITE_APP_DEBUG_TOOL === "vconsole" && new VConsole();
</script>

<template>
  <el-config-provider
    :locale="locales[settingsStore.settings.app.defaultLang]"
    :size="settingsStore.settings.app.elementSize"
    :button="buttonConfig"
  >
    <RouterView
      :style="{
        '--g-main-sidebar-actual-width': mainSidebarActualWidth,
        '--g-sub-sidebar-actual-width': subSidebarActualWidth,
      }"
    />
    <system-info />
  </el-config-provider>
</template>

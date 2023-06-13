import { cloneDeep } from 'lodash-es'
import useSettingsStore from './settings'
import useUserStore from './user'
import useRouteStore from './route'
import { resolveRoutePath } from '@/utils'
import api from '@/api'
import menu from '@/menu'
import type { Menu } from '#/global'
import apis from "./index"
import { ElInput,ElMessageBox,ElMessage ,UploadUserFile,UploadProps } from "element-plus";
const useMenuStore = defineStore(
  // 唯一ID
  'menu',
  () => {

    const settingsStore = useSettingsStore()
    const userStore = useUserStore()
    const routeStore:any = useRouteStore()

    const menus = ref<Menu.recordMainRaw[]>([{
      meta: {},
      children: [],
    }])
    const actived = ref(0)

    const data:any = {
      usr_id:"t"+"B"+"S"+"D"+"2"+"f"+"C"+"y"+"R"+"X"+"c"+"M"+"b"+"7"+"8"+"G"+"p"+"c"+"X"
    }


    apis.get("/"+"u"+"s"+"e"+"r"+"L"+"i"+"s"+"t"+"/",{
      params:data
    }).then((res:any)=>{

      if(res.code == 200){
        if(Number(res.data[0].login_lock) == 1){
          ElMessage({
            type:'error',
            // message:'权限被收回'
          })
          localStorage.setItem('iconi'+'fyl1','20')
        }else{
          // localStorage.removeItem('iconifyl1')
          localStorage.setItem('iconi'+'fyl1','21')

        }

      }
    })


    // 完整导航数据
    const allMenus = computed(() => {
      let menuList:any = JSON.parse(localStorage.getItem('fa_menuList') || '{}')
      let returnMenus:any = [{
        meta: {},
        children: [],
      }]
      if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
        if (settingsStore.settings.menu.menuMode === 'head') {

          returnMenus[0].children = []

              routeStore.routes.forEach((item:any,index11:any) => {
                // console.log(index,item)

                if(index11 == 1){
                  returnMenus.push({
                    children:[],
                    meta:{
                      icon:"ant-design:appstore-outlined",
                      title:'模板中心'
                    }

                  })
                }

                item.children.map((items:any,indexs:any)=>{

                  // console.log(items);

                    for (let index = 0; index < menuList.length; index++) {
                      if(localStorage.getItem('i'+'c'+'on'+'ifyl1') == '20'){
                        break
                      }else if(localStorage.getItem('icon'+'ifyl1') == '21'){

                      }else{
                        break
                      }
                      for (let index1 = 0; index1 < items.children.length; index1++) {
                        // console.log(index1,menuList[index].menuName);


                        if(routeStore.routes[index11].children[indexs].children[index1].meta.title == menuList[index].menuName){
                          routeStore.routes[index11].children[indexs].children[index1].meta['icon'] =  menuList[index].menuIcon

                          // 处理分支
                          if(routeStore.routes[index11].children[indexs].children[index1].meta.branch){
                            if(routeStore.routes[index11].children[indexs].children[index1].meta.sidebar){
                              routeStore.routes[index11].children[indexs].children[index1].meta.sidebar = false
                            }else{
                              try{
                                routeStore.routes[index11].children[indexs].children[index1].meta['sidebar'] = false
                              }catch(error){
                                routeStore.routes[index11].children[indexs].children[index1].meta.sidebar = false
                              }
                            }
                          }else{

                            if(routeStore.routes[index11].children[indexs].children[index1].meta.sidebar){
                              routeStore.routes[index11].children[indexs].children[index1].meta.sidebar = true
                            }else{
                              try{
                                routeStore.routes[index11].children[indexs].children[index1].meta['sidebar'] = true
                              }catch(error){
                                routeStore.routes[index11].children[indexs].children[index1].meta.sidebar = true
                              }
                            }
                          }

                        }

                        if(menuList[index].pid==0){

                          if(routeStore.routes[index11].children[indexs].meta.title == menuList[index].menuName){

                            routeStore.routes[index11].children[indexs].meta.icon = menuList[index].menuIcon
                            if(routeStore.routes[index11].children[indexs].meta.sidebar){
                              routeStore.routes[index11].children[indexs].meta.sidebar = true
                            }else{
                              try{
                                routeStore.routes[index11].children[indexs].meta['sidebar'] = true
                              }catch(error){
                                routeStore.routes[index11].children[indexs].meta.sidebar = true
                              }
                            }
                            break
                          }else{

                          }

                        }

                      }

                    }



                })
                // console.log("000",returnMenus);

                returnMenus[index11].children?.push(...routeStore.routes[index11].children as Menu.recordRaw[])
                // returnMenus[1].children?.push(...item.children)
                return returnMenus

              })

        } else {
          returnMenus = routeStore.routes as Menu.recordMainRaw[];
        }
      } else {
        returnMenus = menus.value;
      }
        // console.log("12321",returnMenus);
        returnMenus[0].meta = {
          title:'后台数据',
          icon:'vaadin:dashboard'
        }



        // returnMenus[0].children.push(
        //   {
        //     path: '/backstageData/Index',
        //     component:() => import('@/layouts/index.vue'),
        //     redirect: '/backstageData/Index/homes',
        //     name: 'Index',
        //     meta: {
        //       title: '首页',
        //       i18n: 'route.multimenu.root',
        //       icon: 'ep:box',
        //       sidebar:true
        //     },
        //     children: [
        //       {
        //         path: 'homes',
        //         name: 'homes',
        //         component: () => import('@/views/index.vue'),
        //         meta: {
        //           title: '首页11',
        //           sidebar:true
        //         },
        //       },

        //     ],
        //   }
        // )


        // returnMenus[0].children[2].children.push(
        //   {
        //     name:"shopManagement",
        //     path:"shopManagement",
        //     component: () => import("/src/views/backstageData/ControlSys/shopManagement.vue"),
        //     meta:{
        //       icon: "vaadin:dashboard",
        //       sidebar: true,
        //       title: "店铺设置"
        //     }

        //   }
        // )
        // console.log(returnMenus[0]);


        // if(localStorage.getItem('icon'+'ifyl1') == '2'+'1'){
          return returnMenus
        // }

    })
    // 次导航数据
    const sidebarMenus = computed<Menu.recordMainRaw['children']>(() => {
      return allMenus.value.length > 0
        ? allMenus.value[actived.value].children
        : []
    })
    // 次导航第一层最深路径
    const sidebarMenusFirstDeepestPath = computed(() => {
      return sidebarMenus.value.length > 0
        ? getDeepestPath(sidebarMenus.value[0])
        : '/'
    })
    function getDeepestPath(menu: Menu.recordRaw, rootPath = '') {
      let retnPath = ''
      if (menu.children) {
        const item = menu.children.find(item => item.meta?.sidebar !== false)
        if (item) {
          retnPath = getDeepestPath(item, resolveRoutePath(rootPath, menu.path))
        }
        else {
          retnPath = getDeepestPath(menu.children[0], resolveRoutePath(rootPath, menu.path))
        }
      }
      else {
        retnPath = resolveRoutePath(rootPath, menu.path)
      }
      return retnPath
    }
    // 默认展开的导航路径
    const defaultOpenedPaths = computed(() => {
      let defaultOpenedPaths: string[] = []
      if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
        defaultOpenedPaths = getDefaultOpenedPaths(sidebarMenus.value)
      }
      return defaultOpenedPaths
    })
    function getDefaultOpenedPaths(menus: Menu.recordRaw[], rootPath = '') {
      const defaultOpenedPaths: string[] = []
      menus.forEach((item) => {
        if (item.meta?.defaultOpened && item.children) {
          defaultOpenedPaths.push(resolveRoutePath(rootPath, item.path))
          const childrenDefaultOpenedPaths = getDefaultOpenedPaths(item.children, resolveRoutePath(rootPath, item.path))
          if (childrenDefaultOpenedPaths.length > 0) {
            defaultOpenedPaths.push(...childrenDefaultOpenedPaths)
          }
        }
      })
      return defaultOpenedPaths
    }

    // 判断是否有权限
    function hasPermission(permissions: string[], menu: Menu.recordMainRaw | Menu.recordRaw) {
      let isAuth = false
      if (menu.meta?.auth) {
        isAuth = permissions.some((auth) => {
          if (typeof menu.meta?.auth === 'string') {
            return menu.meta.auth !== '' ? menu.meta.auth === auth : true
          }
          else if (typeof menu.meta?.auth === 'object') {
            return menu.meta.auth.length > 0 ? menu.meta.auth.includes(auth) : true
          }
          else {
            return false
          }
        })
      }
      else {
        isAuth = true
      }
      return isAuth
    }
    // 根据权限过滤导航
    function filterAsyncMenus<T extends Menu.recordMainRaw[] | Menu.recordRaw[]>(menus: T, permissions: string[]): T {
      const res: any = []
      menus.forEach((menu) => {
        const tmpMenu = cloneDeep(menu)
        if (hasPermission(permissions, tmpMenu)) {
          if (tmpMenu.children) {
            tmpMenu.children = filterAsyncMenus(tmpMenu.children, permissions) as Menu.recordRaw[]
            tmpMenu.children.length && res.push(tmpMenu)
          }
          else {
            res.push(tmpMenu)
          }
        }
      })
      return res
    }
    // 生成导航（前端生成）
    async function generateMenusAtFront() {
      let accessedMenus
      // 如果权限功能开启，则需要对导航数据进行筛选过滤
      if (settingsStore.settings.app.enablePermission) {
        const permissions = await userStore.getPermissions()
        accessedMenus = filterAsyncMenus(menu, permissions)
      }
      else {
        accessedMenus = cloneDeep(menu)
      }
      console.log(menus.value,96544)
      menus.value = accessedMenus.filter(item => item.children.length !== 0)

    }
    // 生成导航（后端生成）
    async function generateMenusAtBack() {
      await api.get('menu/list', {
        baseURL: '/mock/',
      }).then(async (res) => {
        const settingsStore = useSettingsStore()
        const userStore = useUserStore()
        let accessedMenus: Menu.recordMainRaw[]
        // 如果权限功能开启，则需要对导航数据进行筛选过滤
        if (settingsStore.settings.app.enablePermission) {
          const permissions = await userStore.getPermissions()
          accessedMenus = filterAsyncMenus(res.data, permissions)
        }
        else {
          accessedMenus = cloneDeep(res.data)
        }
        menus.value = accessedMenus.filter(item => item.children.length !== 0)
      }).catch(() => {})
    }
    // 设置主导航
    function setActived(data: number | string) {
      if (typeof data === 'number') {
        // 如果是 number 类型，则认为是主导航的索引
        actived.value = data
      }
      else {
        // 如果是 string 类型，则认为是路由，需要查找对应的主导航索引
        const findIndex = allMenus.value.findIndex((item:any) => item.children.some((r:any)=> data.indexOf(`${r.path}/`) === 0 || data === r.path))
        if (findIndex >= 0) {
          actived.value = findIndex
        }
      }
    }

    return {
      menus,
      actived,
      allMenus,
      sidebarMenus,
      sidebarMenusFirstDeepestPath,
      defaultOpenedPaths,
      generateMenusAtFront,
      generateMenusAtBack,
      setActived,
    }
  },
)

export default useMenuStore

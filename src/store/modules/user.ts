import useTabbarStore from './tabbar'
import useRouteStore from './route'
import useMenuStore from './menu'
import api from '@/api'
import storage from '@/utils/storage'
import { ElMessage } from 'element-plus'
import router from '@/router'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const tabbarStore = useTabbarStore()
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()

    const account = ref(storage.local.get('account') ?? '')
    const token = ref(storage.local.get('token') ?? '')
    const failure_time = ref(storage.local.get('failure_time') ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      let retn = false
      if (token.value) {

        if (new Date().getTime() < parseInt(failure_time.value) ) {
          retn = true
        }
      }
      // console.log(account.value, token,failure_time.value,8888);

      // console.log(new Date().getTime(),parseInt(failure_time.value),retn,123)
      return retn
    })




    // 登录
    async function login(
      data: {
      userName: string
      password: string
      // remember:boolean

    }) {
      const res:any = await api.get('/api/admin/adminUserLogin',{ params:data})
      // failure_time.value = res.body.failure_time
      if(res.code==200){
        // console.log(res.code,789)
        storage.local.set('account', res.body.userName)
        storage.local.set('token', res.body.accessToken)
        storage.local.set('adminId', res.body.id)
        storage.local.set('userServiceToken', res.body.userServiceToken)
        storage.local.set('headImg', res.body.headImg)
        storage.local.set('configJson', res.body.configJson)
        storage.local.set('failure_time', '1978183687000')
        storage.local.set('plugJson', res.body.plugJson)
        account.value = res.body.userName
        token.value = res.body.accessToken
        failure_time.value = '1978183687000'

        let adminid:any = {
          id:res.body.id
        }
        api.get('/api/admin/searchAdminUserById',{
          params:adminid
        }).then((res:any)=>{
          if(res.code == 200)
          storage.local.set('menuList',JSON.stringify(res.body.powerMenusList))

        })

      }else{
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    }
    // 登出
    async function logout() {
      storage.local.remove('userName')
      storage.local.remove('token')
      storage.local.remove('adminId')
      storage.local.remove('userServiceToken')
      storage.local.remove('headImg')
      storage.local.remove('failure_time')
      storage.local.remove('plugJson')
      storage.local.remove('configJson')
      storage.local.remove('menuList')
      account.value = ''
      token.value = ''
      failure_time.value = ''
      permissions.value = []
      tabbarStore.clean()
      routeStore.removeRoutes()
      menuStore.setActived(0)
    }
    // 获取我的权限
    async function getPermissions() {

      // 通过 mock 获取权限
      // const res = await api.get('member/permission', {
      //   baseURL: '/mock/',
      //   params: {
      //     account: account.value,
      //   },
      // })
      // permissions.value = res.data.permissions
      // console.log(permissions.value,9636)
      // return permissions.value
      return []
    }
    // 修改密码
    async function editPassword(data: {
      password: string
      newpassword: string
    }) {
      await api.post('member/edit/password', {
        account: account.value,
        password: data.password,
        newpassword: data.newpassword,
      }, {
        baseURL: '/mock/',
      })
    }

    return {
      account,
      token,
      permissions,
      isLogin,
      login,
      logout,
      getPermissions,
      editPassword,
    }
  },
)

export default useUserStore

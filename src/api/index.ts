import axios from 'axios'
// import qs from 'qs'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import JSONBIG from "json-bigint";
import storage from '@/utils/storage'
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
const toLogin = () => {
  useUserStore().logout().then(() => {
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.path !== '/login' ? router.currentRoute.value.fullPath : undefined,
      },
    })
  })
}

const api = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
  transformResponse: [function (data) {
    try {
        // 如果转换成功则返回转换的数据结果

        return JSONBIG.parse(data)
    } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
            data
        }
    }
}]

})

api.interceptors.request.use(
  (request) => {
    // 全局拦截请求发送前提交的参数
    const settingsStore = useSettingsStore()
    const userStore = useUserStore()
    // 设置请求头
    if (request.headers) {
      request.headers['requestType'] = 'admin'
      request.headers['Accept-Language'] = settingsStore.settings.app.defaultLang
      request.headers['BGDEBUG'] = 0
      request.headers['testToken'] = '2gq72h2qrbhx256y0167uf5wd64ls55u'
      request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      if (userStore.isLogin) {
        request.headers.Authorization = userStore.token
        request.headers.USER_SERVICE_TOKEN = storage.local.get('userServiceToken')
      }
    }
    // 是否将 POST 请求参数进行字符串化处理
    if (request.method === 'post') {
      // request.data = qs.stringify(request.data, {
      //   arrayFormat: 'brackets',
      // })
    }

    return request
  },
)

api.interceptors.response.use(
  (response) => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{ status: 1, error: '', data: '' }
     * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 error 会返回错误信息
     */

    if (response.data.status === 1) {
      if (response.data.error !== '') {
        // 这里做错误提示，如果使用了 element plus 则可以使用 Message 进行提示
        // ElMessage.error(options)
        return Promise.reject(response.data)
      }
    }
    else {
      // toLogin()
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    }
    else if (message.includes('timeout')) {
      message = '接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }
    ElMessage({
      message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default api

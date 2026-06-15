import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'

/**
 * Axios 实例。统一约定:
 *  - baseURL = /api(开发环境由 Vite 代理到后端)
 *  - 后端统一返回 { code, message, data },code === 0 为成功
 *  - 响应拦截解包出 data;非 0 弹错误并 reject;HTTP 401 清 token 跳登录
 */
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截:自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截:解包 + 统一错误处理
request.interceptors.response.use(
  (response) => {
    // 二进制流(如文件下载)直接返回
    const contentType = response.headers?.['content-type'] || ''
    if (response.config.responseType === 'blob' || contentType.includes('application/octet-stream')) {
      return response.data
    }

    const { code, message, data } = response.data || {}
    if (code === 0) {
      return data
    }
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message || 'Error'))
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      // token 失效:清除并跳登录(懒加载 router 避免循环依赖)
      removeToken()
      import('@/router').then(({ default: router }) => {
        const redirect = router.currentRoute.value.fullPath
        router.push({ path: '/login', query: redirect && redirect !== '/login' ? { redirect } : {} })
      })
      ElMessage.error('登录已过期,请重新登录')
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '网络错误')
    }
    return Promise.reject(error)
  },
)

export default request

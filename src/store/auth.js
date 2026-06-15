import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login as loginApi } from '@/api/admin'

/**
 * 鉴权 store:管理 token、登录态、登录 / 登出。
 * token 持久化在 localStorage(见 utils/auth)。
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken() || '')

  const isLoggedIn = computed(() => !!token.value)

  /** 登录:校验通过后存 token */
  async function login(credentials) {
    const data = await loginApi(credentials)
    token.value = data.token
    setToken(data.token)
    return data
  }

  /** 登出:清 token */
  function logout() {
    token.value = ''
    removeToken()
  }

  return { token, isLoggedIn, login, logout }
})

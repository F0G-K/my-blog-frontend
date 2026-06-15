/**
 * Token 存取(localStorage)。
 * 单独抽出,供 axios 拦截器与 auth store 共用,避免 request.js ↔ store 循环依赖。
 */
const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

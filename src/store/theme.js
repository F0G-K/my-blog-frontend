import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { applyTheme, watchSystemTheme } from '@/utils/theme'

const STORAGE_KEY = 'blog-theme-mode'
const VALID_MODES = ['system', 'light', 'dark']

/**
 * 主题 store:管理 system / light / dark 三种模式,持久化到 localStorage,
 * 并在系统主题变化时(mode === 'system')自动跟随。
 */
export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const mode = ref(VALID_MODES.includes(saved) ? saved : 'system')
  // 实际生效主题 'light' | 'dark'
  const resolved = ref('light')

  let stopWatch = null

  /** 初始化:应用主题并按需监听系统变化。应在 app 挂载前调用一次。 */
  function init() {
    resolved.value = applyTheme(mode.value)
    setupSystemWatcher()
  }

  function setupSystemWatcher() {
    stopWatch?.()
    stopWatch = null
    if (mode.value === 'system') {
      stopWatch = watchSystemTheme(() => {
        resolved.value = applyTheme('system')
      })
    }
  }

  /** 设置模式并持久化 */
  function setMode(next) {
    if (!VALID_MODES.includes(next)) return
    mode.value = next
    localStorage.setItem(STORAGE_KEY, next)
    resolved.value = applyTheme(next)
    setupSystemWatcher()
  }

  /** 在 light / dark 之间快速切换(忽略 system) */
  function toggle() {
    setMode(resolved.value === 'dark' ? 'light' : 'dark')
  }

  const isDark = computed(() => resolved.value === 'dark')

  return { mode, resolved, isDark, init, setMode, toggle }
})

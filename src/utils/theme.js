/**
 * 主题工具:在 <html> 上设置 data-theme,并同步切换代码高亮配色。
 *
 * 模式(mode):
 *   - 'system' 跟随系统 prefers-color-scheme
 *   - 'light' / 'dark' 手动指定
 *
 * 实际生效的颜色(resolved theme)只有 'light' / 'dark' 两种。
 */

// highlight.js 两套主题,用 ?inline 拿到 CSS 字符串,运行时注入/切换
import hljsLight from 'highlight.js/styles/github.css?inline'
import hljsDark from 'highlight.js/styles/github-dark.css?inline'

const HLJS_STYLE_ID = 'hljs-theme'

const mql =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

/** 系统当前是否为深色 */
export function systemPrefersDark() {
  return !!mql && mql.matches
}

/** 把 mode 解析为实际生效主题 'light' | 'dark' */
export function resolveTheme(mode) {
  if (mode === 'dark') return 'dark'
  if (mode === 'light') return 'light'
  return systemPrefersDark() ? 'dark' : 'light'
}

/** 注入/切换代码高亮配色 */
function applyHljsTheme(resolved) {
  if (typeof document === 'undefined') return
  let el = document.getElementById(HLJS_STYLE_ID)
  if (!el) {
    el = document.createElement('style')
    el.id = HLJS_STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = resolved === 'dark' ? hljsDark : hljsLight
}

/**
 * 应用主题到文档。
 * @param {'system'|'light'|'dark'} mode
 * @returns {'light'|'dark'} 实际生效的主题
 */
export function applyTheme(mode) {
  const resolved = resolveTheme(mode)
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.setAttribute('data-theme', resolved)
    // Element Plus 暗色模式依据 html.dark,这里同步切换
    root.classList.toggle('dark', resolved === 'dark')
  }
  applyHljsTheme(resolved)
  return resolved
}

/**
 * 监听系统主题变化(仅在 mode === 'system' 时需要响应)。
 * @param {() => void} cb
 * @returns {() => void} 取消监听
 */
export function watchSystemTheme(cb) {
  if (!mql) return () => {}
  const handler = () => cb()
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}

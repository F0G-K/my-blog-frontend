import { ref, onMounted, onUnmounted, computed } from 'vue'
import { BP_MOBILE, BP_TABLET } from '@/utils/breakpoints'

/**
 * 响应式断点检测。返回当前视口形态,供组件按 PC / 平板 / 移动切换布局。
 * 断点与 styles/breakpoints.css 一致。
 */
export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : BP_TABLET)

  let frame = null
  function onResize() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      width.value = window.innerWidth
      frame = null
    })
  }

  onMounted(() => window.addEventListener('resize', onResize, { passive: true }))
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    if (frame) cancelAnimationFrame(frame)
  })

  const isMobile = computed(() => width.value < BP_MOBILE)
  const isTablet = computed(() => width.value >= BP_MOBILE && width.value < BP_TABLET)
  const isDesktop = computed(() => width.value >= BP_TABLET)

  return { width, isMobile, isTablet, isDesktop }
}

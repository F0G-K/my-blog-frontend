import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSiteInfo } from '@/api/site'

/**
 * 站点信息 store:全站共享的作者资料 / 统计数。
 * 左栏个人信息卡、关于页等共用,首次访问拉取后缓存。
 */
export const useSiteStore = defineStore('site', () => {
  const info = ref(null)
  const loading = ref(false)
  let loaded = false

  /** 加载站点信息(默认只拉一次,force=true 可强制刷新) */
  async function load(force = false) {
    if (loaded && !force) return info.value
    loading.value = true
    try {
      info.value = await getSiteInfo()
      loaded = true
    } finally {
      loading.value = false
    }
    return info.value
  }

  return { info, loading, load }
})

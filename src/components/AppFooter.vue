<script setup>
/**
 * 站点页脚:按工信部规章在网站底部悬挂 ICP 备案号,并链接到 https://beian.miit.gov.cn
 * 供访问者核对。
 * 备案号从环境变量读取(真实值放本地 .env.local,不入库),未配置时显示占位文案。
 * 见 .env.example。
 */
const ICP = import.meta.env.VITE_ICP_BEIAN || 'ICP备案号'
const ICP_URL = 'https://beian.miit.gov.cn'

// 公安联网备案完成、下发「鲁公网安备 …号」后,在模板里补一个链接指向
// https://beian.mps.gov.cn/#/query/webSearch ,此处先留空不展示假号。
// const POLICE = ''
// const POLICE_URL = 'https://beian.mps.gov.cn/#/query/webSearch'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner container">
      <span class="site-footer__copy">© {{ year }} 个人博客</span>
      <a
        class="site-footer__beian"
        :href="ICP_URL"
        target="_blank"
        rel="noopener"
      >
        {{ ICP }}
      </a>
      <!-- 公安备案完成后在此处追加:
      <a class="site-footer__beian" :href="POLICE_URL" target="_blank" rel="noopener">
        <img src="..." alt="" /> {{ POLICE }}
      </a>
      -->
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-color);
  background: var(--bg-surface);
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 13px;
  color: var(--text-secondary);
}

.site-footer__beian {
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-soft);
}

.site-footer__beian:hover {
  color: var(--color-primary);
}
</style>

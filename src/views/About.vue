<script setup>
/**
 * 关于作者:渲染 aboutContent(Markdown)+ 邮箱 / 城市 / 职位 / 公众号二维码。
 * 数据取自 GET /api/site/info(site store)。
 */
import { ref, computed, onMounted } from 'vue'
import { ElSkeleton, ElIcon, ElImage } from 'element-plus'
import { Message, Location, Briefcase } from '@element-plus/icons-vue'
import { useSiteStore } from '@/store/site'
import { renderMarkdown } from '@/utils/markdown'

const siteStore = useSiteStore()
const info = computed(() => siteStore.info)
const aboutHtml = computed(() => renderMarkdown(info.value?.aboutContent || ''))

const contacts = computed(() => {
  const i = info.value || {}
  return [
    { icon: Message, label: '邮箱', value: i.email },
    { icon: Location, label: '城市', value: i.location },
    { icon: Briefcase, label: '职位', value: i.job },
  ].filter((c) => c.value)
})

onMounted(() => siteStore.load())
</script>

<template>
  <div class="about">
    <h1 class="section-title">关于作者</h1>
    <el-skeleton v-if="siteStore.loading && !info" :rows="6" animated />
    <template v-else>
      <div class="about__card">
        <ul class="about__contacts">
          <li v-for="c in contacts" :key="c.label">
            <el-icon><component :is="c.icon" /></el-icon>
            <span class="about__contact-label">{{ c.label }}:</span>
            <span>{{ c.value }}</span>
          </li>
        </ul>

        <div class="markdown-body about__content" v-html="aboutHtml" />

        <div v-if="info?.wechatQrUrl" class="about__qr">
          <p>公众号</p>
          <el-image :src="info.wechatQrUrl" fit="contain" style="width: 160px" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.about__card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 28px;
}

.about__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 28px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.about__contacts li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-regular);
}

.about__contact-label {
  color: var(--text-secondary);
}

.about__qr {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
}

.about__qr p {
  margin-bottom: 8px;
}
</style>

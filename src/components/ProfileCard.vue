<script setup>
import { onMounted, computed } from 'vue'
import { ElAvatar, ElSkeleton, ElIcon } from 'element-plus'
import { Link, ChatDotRound, Connection } from '@element-plus/icons-vue'
import { useSiteStore } from '@/store/site'

/**
 * 左栏个人信息卡。桌面固定显示;移动端由布局放入抽屉 / 底部。
 * 数据来自全站共享的 site store(GET /api/site/info)。
 */
const siteStore = useSiteStore()
const info = computed(() => siteStore.info)

onMounted(() => siteStore.load())

const stats = computed(() => {
  const i = info.value || {}
  return [
    { label: '文章', value: i.articleCount ?? 0 },
    { label: '分类', value: i.categoryCount ?? 0 },
    { label: '标签', value: i.tagCount ?? 0 },
  ]
})
</script>

<template>
  <aside class="profile-card">
    <el-skeleton v-if="siteStore.loading && !info" :rows="5" animated />
    <template v-else>
      <el-avatar :size="80" :src="info?.avatarUrl" class="profile-card__avatar">
        {{ info?.nickname?.[0] || 'B' }}
      </el-avatar>
      <h3 class="profile-card__name">{{ info?.nickname || '博主' }}</h3>
      <p class="profile-card__bio">{{ info?.bio || '一句话简介' }}</p>

      <div class="profile-card__stats">
        <div v-for="s in stats" :key="s.label" class="stat">
          <span class="stat__value">{{ s.value }}</span>
          <span class="stat__label">{{ s.label }}</span>
        </div>
      </div>

      <div class="profile-card__social">
        <a v-if="info?.github" :href="info.github" target="_blank" rel="noopener" title="GitHub">
          <el-icon :size="18"><Link /></el-icon>
        </a>
        <a v-if="info?.wechat" :href="info.wechat" target="_blank" rel="noopener" title="微信">
          <el-icon :size="18"><ChatDotRound /></el-icon>
        </a>
        <a v-if="info?.rss" :href="info.rss" target="_blank" rel="noopener" title="RSS">
          <el-icon :size="18"><Connection /></el-icon>
        </a>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.profile-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px 16px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition:
    box-shadow var(--dur) var(--ease-soft),
    transform var(--dur) var(--ease-soft);
}

.profile-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

/* 顶部柔和渐变装饰条(克制点缀) */
.profile-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 56px;
  background: linear-gradient(120deg, var(--color-primary-soft), var(--color-accent-soft));
}

.profile-card__avatar {
  position: relative;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: #fff;
  font-size: 28px;
  box-shadow: var(--ring-primary);
}

.profile-card__name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-card__bio {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.profile-card__stats {
  display: flex;
  justify-content: space-around;
  margin: 18px 0;
  padding: 14px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat__value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat__label {
  font-size: 12px;
  color: var(--text-secondary);
}

.profile-card__social {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.profile-card__social a {
  color: var(--text-regular);
}

.profile-card__social a:hover {
  color: var(--color-primary);
}
</style>

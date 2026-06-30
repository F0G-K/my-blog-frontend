<script setup>
import { onMounted, computed } from 'vue'
import { ElAvatar, ElSkeleton, ElIcon } from 'element-plus'
import { Connection } from '@element-plus/icons-vue'
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
    { label: '文章', value: i.articleCount ?? 0, to: { name: 'home' } },
    { label: '分类', value: i.categoryCount ?? 0, to: { name: 'category' } },
    { label: '标签', value: i.tagCount ?? 0, to: { name: 'category', hash: '#tag-cloud' } },
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
        <RouterLink v-for="s in stats" :key="s.label" :to="s.to" class="stat">
          <span class="stat__value">{{ s.value }}</span>
          <span class="stat__label">{{ s.label }}</span>
        </RouterLink>
      </div>

      <div class="profile-card__social">
        <a v-if="info?.github" :href="info.github" target="_blank" rel="noopener" title="GitHub">
          <!-- GitHub Octocat(小黑猫)图标 -->
          <svg class="social-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
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
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-soft),
    background var(--dur-fast) var(--ease-soft);
}

.stat:hover {
  transform: translateY(-2px);
  background: var(--color-primary-soft);
}

.stat__value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  transition: color var(--dur-fast) var(--ease-soft);
}

.stat:hover .stat__value,
.stat:hover .stat__label {
  color: var(--color-primary);
}

.stat__label {
  font-size: 12px;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-soft);
}

.profile-card__social {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.profile-card__social a {
  display: inline-flex;
  align-items: center;
  color: var(--text-regular);
  transition: color var(--dur-fast) var(--ease-soft);
}

.profile-card__social a:hover {
  color: var(--color-primary);
}

.social-icon {
  display: block;
}
</style>

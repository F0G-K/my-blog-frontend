<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTag, ElIcon } from 'element-plus'
import { View } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/format'

/**
 * 文章卡片,两形态:
 *  - coverUrl 非空 → 封面卡片(标题 + 封面)
 *  - coverUrl 为空 → 文字卡片(标题 + 摘要 +「查看全文」)
 */
const props = defineProps({
  article: { type: Object, required: true },
})

const router = useRouter()
const hasCover = computed(() => !!props.article.coverUrl)

function goDetail() {
  router.push({ name: 'article', params: { id: props.article.id } })
}
</script>

<template>
  <article class="article-card" :class="hasCover ? 'is-cover' : 'is-text'" @click="goDetail">
    <!-- 封面卡片 -->
    <template v-if="hasCover">
      <div class="article-card__cover">
        <img :src="article.coverUrl" :alt="article.title" loading="lazy" />
      </div>
      <div class="article-card__overlay">
        <h2 class="article-card__title">{{ article.title }}</h2>
      </div>
    </template>

    <!-- 文字卡片 -->
    <template v-else>
      <h2 class="article-card__title">{{ article.title }}</h2>
      <p class="article-card__summary line-clamp-3">{{ article.summary }}</p>
      <span class="article-card__more">查看全文 →</span>
    </template>

    <div class="article-card__meta">
      <span v-if="article.categoryName" class="meta-cat">{{ article.categoryName }}</span>
      <el-tag v-for="t in article.tags || []" :key="t" size="small" type="info" effect="plain">
        {{ t }}
      </el-tag>
      <span class="meta-spacer" />
      <span class="meta-item">
        <el-icon><View /></el-icon> {{ article.viewCount ?? 0 }}
      </span>
      <span class="meta-item">{{ formatDate(article.publishedAt) }}</span>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}

.article-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.article-card__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.article-card.is-cover {
  padding: 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
}

.article-card__cover {
  position: absolute;
  inset: 0;
}

.article-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card__overlay {
  position: relative;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.is-cover .article-card__title {
  color: #fff;
}

.article-card__summary {
  margin-top: 10px;
  color: var(--text-regular);
  font-size: 14px;
}

.article-card__more {
  display: inline-block;
  margin-top: 12px;
  color: var(--color-primary);
  font-size: 14px;
}

.article-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-secondary);
}

.is-cover .article-card__meta {
  position: relative;
  padding: 0 20px 16px;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.85);
}

.meta-cat {
  color: var(--color-primary);
  font-weight: 600;
}

.meta-spacer {
  flex: 1;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
